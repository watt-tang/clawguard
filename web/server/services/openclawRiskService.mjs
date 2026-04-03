import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { formatDateTime } from "../lib/date.mjs";
import { prisma } from "../lib/prisma.mjs";

const GITHUB_API_BASE = "https://api.github.com";
const NVD_API_BASE = "https://services.nvd.nist.gov/rest/json/cves/2.0";
const DEFAULT_REPO = process.env.OPENCLAW_RISK_GITHUB_REPO || "openclaw/openclaw";
const DEFAULT_PACKAGE = process.env.OPENCLAW_RISK_PACKAGE || "openclaw";
const SEARCH_KEYWORDS = (process.env.OPENCLAW_RISK_KEYWORDS || "OpenClaw,clawdbot,Moltbot").split(",").map((item) => item.trim()).filter(Boolean);
const MEMORY_CACHE_TTL_MS = Math.max(10000, Number(process.env.OPENCLAW_RISK_CACHE_TTL_MS || 5 * 60 * 1000));
const WEEKLY_REFRESH_MS = Math.max(60000, Number(process.env.OPENCLAW_RISK_REFRESH_INTERVAL_MS || 7 * 24 * 60 * 60 * 1000));
const REFRESH_CHECK_MS = Math.max(60000, Number(process.env.OPENCLAW_RISK_REFRESH_CHECK_MS || 6 * 60 * 60 * 1000));
const SOURCE_LABELS = { github: "GitHub Security Advisory", nvd: "NVD CVE" };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../../..");
const cacheRoot = process.env.OPENCLAW_RISK_CACHE_DIR || path.resolve(repoRoot, "..", "clawguard-cache", "openclaw-risk");

const memoryCache = new Map();
let schedulerStarted = false;
let activeRefreshPromise = null;
let latestRefreshState = { status: "idle", lastAttemptAt: "", lastCompletedAt: "", lastError: "" };

function nowIso() {
  return new Date().toISOString();
}

function readMemoryCache(key) {
  const cached = memoryCache.get(key);
  if (!cached) return null;
  if (cached.expiresAt <= Date.now()) {
    memoryCache.delete(key);
    return null;
  }
  return cached.data;
}

function writeMemoryCache(key, data, ttlMs = MEMORY_CACHE_TTL_MS) {
  memoryCache.set(key, { data, expiresAt: Date.now() + ttlMs });
  return data;
}

function clearRiskMemoryCache() {
  for (const key of [...memoryCache.keys()]) {
    if (key.startsWith("risk-db:") || key.startsWith("risk-http:")) memoryCache.delete(key);
  }
}

function uniqueStrings(values = []) {
  return [...new Set(values.filter(Boolean).map((value) => String(value).trim()).filter(Boolean))];
}

function pickEnglishDescription(descriptions = []) {
  return descriptions.find((item) => item?.lang === "en")?.value || descriptions[0]?.value || "";
}

function parseReferenceTagVersion(url = "") {
  const match = String(url).match(/\/releases\/tag\/v?([0-9][0-9A-Za-z.\-]*)$/i);
  return match?.[1] || "";
}

function normalizeVersion(value) {
  return String(value || "").trim().replace(/^v/i, "").replace(/^=/, "").trim();
}

function parseVersion(value) {
  const normalized = normalizeVersion(value);
  if (!normalized) return null;
  const [main, prerelease = ""] = normalized.split("-", 2);
  return {
    raw: normalized,
    segments: main.split(".").map((part) => {
      const parsed = Number(part);
      return Number.isFinite(parsed) ? parsed : 0;
    }),
    prereleaseParts: prerelease
      ? prerelease.split(".").map((part) => {
          const parsed = Number(part);
          return Number.isFinite(parsed) ? parsed : String(part).toLowerCase();
        })
      : [],
  };
}

function compareVersionTokens(a, b) {
  if (typeof a === "number" && typeof b === "number") return a - b;
  if (typeof a === "number") return -1;
  if (typeof b === "number") return 1;
  return String(a).localeCompare(String(b));
}

function compareVersions(left, right) {
  const a = parseVersion(left);
  const b = parseVersion(right);
  if (!a && !b) return 0;
  if (!a) return -1;
  if (!b) return 1;

  const segmentCount = Math.max(a.segments.length, b.segments.length);
  for (let index = 0; index < segmentCount; index += 1) {
    const diff = (a.segments[index] || 0) - (b.segments[index] || 0);
    if (diff !== 0) return diff;
  }

  if (!a.prereleaseParts.length && !b.prereleaseParts.length) return 0;
  if (!a.prereleaseParts.length) return 1;
  if (!b.prereleaseParts.length) return -1;

  const prereleaseCount = Math.max(a.prereleaseParts.length, b.prereleaseParts.length);
  for (let index = 0; index < prereleaseCount; index += 1) {
    const partA = a.prereleaseParts[index];
    const partB = b.prereleaseParts[index];
    if (partA === undefined) return -1;
    if (partB === undefined) return 1;
    const diff = compareVersionTokens(partA, partB);
    if (diff !== 0) return diff;
  }

  return 0;
}

function maxVersion(...values) {
  return values.filter(Boolean).map((value) => normalizeVersion(value)).reduce((best, current) => (compareVersions(current, best) > 0 ? current : best), "");
}

function severityRank(value) {
  const normalized = String(value || "").toLowerCase();
  if (normalized === "critical") return 4;
  if (normalized === "high") return 3;
  if (normalized === "medium" || normalized === "moderate") return 2;
  if (normalized === "low") return 1;
  return 0;
}

function pickPreferredSeverity(a, b) {
  return severityRank(a) >= severityRank(b) ? a : b;
}

function classifySeverityFromScore(score) {
  if (!Number.isFinite(score)) return "unknown";
  if (score >= 9) return "critical";
  if (score >= 7) return "high";
  if (score >= 4) return "medium";
  if (score > 0) return "low";
  return "unknown";
}

function isHighRiskIssue(issue) {
  return severityRank(issue.severity) >= 3 || Number(issue.score || 0) >= 7;
}

function buildGithubHeaders() {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "clawguard-openclaw-risk-tracker",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return headers;
}

function buildNvdHeaders() {
  const headers = {
    Accept: "application/json",
    "User-Agent": "clawguard-openclaw-risk-tracker",
  };
  if (process.env.NVD_API_KEY) headers.apiKey = process.env.NVD_API_KEY;
  return headers;
}

async function fetchJson(url, init = {}, sourceName = "remote") {
  const response = await fetch(url, init);
  if (!response.ok) {
    const snippet = (await response.text()).slice(0, 400);
    throw new Error(`${sourceName} request failed (${response.status}): ${snippet || url}`);
  }
  return response.json();
}

function advisoryMatchesOpenClaw(advisory) {
  const haystacks = [
    advisory.summary,
    advisory.description,
    advisory.source_code_location,
    advisory.repository_advisory_url,
    advisory.html_url,
    ...(advisory.references || []),
    ...(advisory.vulnerabilities || []).map((item) => item?.package?.name),
  ].filter(Boolean).join("\n").toLowerCase();
  const repoNeedle = DEFAULT_REPO.toLowerCase();
  return haystacks.includes(repoNeedle) || SEARCH_KEYWORDS.some((keyword) => haystacks.includes(keyword.toLowerCase())) || haystacks.includes(DEFAULT_PACKAGE.toLowerCase());
}

function cveMatchesOpenClaw(cve) {
  const description = pickEnglishDescription(cve.descriptions);
  const configCriteria = (cve.configurations || []).flatMap((configuration) => configuration.nodes || []).flatMap((node) => node.cpeMatch || []).map((match) => match.criteria).join("\n");
  const referenceUrls = (cve.references || []).map((item) => item.url).join("\n");
  const haystacks = [description, configCriteria, referenceUrls].join("\n").toLowerCase();
  const repoNeedle = DEFAULT_REPO.toLowerCase();
  return haystacks.includes(repoNeedle) || haystacks.includes("openclaw:openclaw") || SEARCH_KEYWORDS.some((keyword) => haystacks.includes(keyword.toLowerCase()));
}

function pickCvss(metrics = {}) {
  const candidates = [...(metrics.cvssMetricV40 || []), ...(metrics.cvssMetricV31 || []), ...(metrics.cvssMetricV30 || []), ...(metrics.cvssMetricV2 || [])];
  const match = candidates[0];
  const cvssData = match?.cvssData || {};
  const score = Number(cvssData.baseScore);
  const severity = cvssData.baseSeverity || classifySeverityFromScore(score);
  return { score: Number.isFinite(score) ? score : null, severity: severity ? String(severity).toLowerCase() : "unknown", vector: cvssData.vectorString || "" };
}

function extractGhsaIds(values = []) {
  const ids = new Set();
  for (const value of values.filter(Boolean)) {
    const matches = String(value).match(/GHSA(?:-|%2D)[0-9a-z]{4}(?:-|%2D)[0-9a-z]{4}(?:-|%2D)[0-9a-z]{4}/gi) || [];
    for (const match of matches) ids.add(match.replace(/%2D/gi, "-").toUpperCase());
  }
  return [...ids];
}

function inferFixedVersionFromNvd(cve) {
  const matches = (cve.configurations || []).flatMap((configuration) => configuration.nodes || []).flatMap((node) => node.cpeMatch || []).filter((match) => match.vulnerable);
  const endExcluding = matches.map((match) => normalizeVersion(match.versionEndExcluding)).filter(Boolean);
  if (endExcluding.length) return endExcluding.sort(compareVersions).at(0) || "";

  const description = pickEnglishDescription(cve.descriptions);
  const fixedInMatch = description.match(/\b(?:fixed|patched)\s+(?:in|by)\s+v?([0-9][0-9A-Za-z.\-]*)/i);
  if (fixedInMatch?.[1]) return normalizeVersion(fixedInMatch[1]);

  const beforeMatch = description.match(/\b(?:before|prior to)\s+v?([0-9][0-9A-Za-z.\-]*)/i);
  if (beforeMatch?.[1]) return normalizeVersion(beforeMatch[1]);

  return normalizeVersion((cve.references || []).map((reference) => parseReferenceTagVersion(reference.url)).find(Boolean));
}

function buildAffectedRangeFromGithub(vulnerabilities = []) {
  const ranges = vulnerabilities.map((item) => `${item?.package?.name || "package"} ${item?.vulnerable_version_range || ""}`.trim()).filter(Boolean);
  return uniqueStrings(ranges).join("; ");
}

function buildAffectedRangeFromNvd(cve) {
  const fragments = [];
  for (const configuration of cve.configurations || []) {
    for (const node of configuration.nodes || []) {
      for (const match of node.cpeMatch || []) {
        if (!match.vulnerable) continue;
        const parts = [];
        if (match.versionStartIncluding) parts.push(`>= ${match.versionStartIncluding}`);
        if (match.versionStartExcluding) parts.push(`> ${match.versionStartExcluding}`);
        if (match.versionEndIncluding) parts.push(`<= ${match.versionEndIncluding}`);
        if (match.versionEndExcluding) parts.push(`< ${match.versionEndExcluding}`);
        const criteria = String(match.criteria || "").split(":").slice(0, 5).join(":");
        fragments.push(`${criteria} ${parts.join(" ")}`.trim());
      }
    }
  }
  return uniqueStrings(fragments).join("; ");
}

function buildFixState(fixedVersion, latestStableVersion) {
  const normalizedFixed = normalizeVersion(fixedVersion);
  const normalizedLatest = normalizeVersion(latestStableVersion);
  if (!normalizedFixed) return { status: "unknown", label: "待确认", reason: "未能从官方数据中提取明确修复版本" };
  if (!normalizedLatest) return { status: "unknown", label: "待确认", reason: `已识别修复版本 ${normalizedFixed}，但当前最新稳定版本未知` };
  if (compareVersions(normalizedLatest, normalizedFixed) >= 0) {
    return { status: "fixed", label: "已修复", reason: `最新稳定版 ${normalizedLatest} 已达到修复版本 ${normalizedFixed}` };
  }
  return { status: "unfixed", label: "未修复", reason: `当前最新稳定版 ${normalizedLatest} 仍低于修复版本 ${normalizedFixed}` };
}

function createSnapshotKey(date = new Date()) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
  return dirPath;
}

async function writeJsonFile(filePath, payload) {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, JSON.stringify(payload, null, 2), "utf8");
}

async function ensureOpenclawRiskTables() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS OpenclawRiskSnapshot (
      id INT NOT NULL AUTO_INCREMENT,
      snapshotKey VARCHAR(32) NOT NULL,
      triggerSource VARCHAR(32) NOT NULL DEFAULT 'scheduled',
      status VARCHAR(32) NOT NULL DEFAULT 'completed',
      latestStableTag VARCHAR(64) NULL,
      latestStableVersion VARCHAR(64) NULL,
      latestStableUrl VARCHAR(255) NULL,
      latestStablePublishedAt DATETIME(3) NULL,
      totalIssues INT NOT NULL DEFAULT 0,
      githubAdvisories INT NOT NULL DEFAULT 0,
      nvdCves INT NOT NULL DEFAULT 0,
      officialAdvisoryCount INT NOT NULL DEFAULT 0,
      cveRecordCount INT NOT NULL DEFAULT 0,
      conferencePaperCount INT NOT NULL DEFAULT 0,
      preprintCount INT NOT NULL DEFAULT 0,
      researchCount INT NOT NULL DEFAULT 0,
      newsCount INT NOT NULL DEFAULT 0,
      criticalCount INT NOT NULL DEFAULT 0,
      highRiskCount INT NOT NULL DEFAULT 0,
      fixedCount INT NOT NULL DEFAULT 0,
      unfixedCount INT NOT NULL DEFAULT 0,
      unknownCount INT NOT NULL DEFAULT 0,
      fixProgressPercent INT NOT NULL DEFAULT 0,
      sourceMeta JSON NOT NULL,
      cacheDir VARCHAR(255) NULL,
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      PRIMARY KEY (id),
      UNIQUE KEY OpenclawRiskSnapshot_snapshotKey_key (snapshotKey),
      KEY OpenclawRiskSnapshot_createdAt_idx (createdAt),
      KEY OpenclawRiskSnapshot_status_createdAt_idx (status, createdAt)
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  `);

  const existingSnapshotColumns = await prisma.$queryRawUnsafe(`
    SELECT COLUMN_NAME
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'OpenclawRiskSnapshot'
  `);
  const snapshotColumnNames = new Set(existingSnapshotColumns.map((row) => row.COLUMN_NAME));
  const snapshotAlterStatements = [];
  if (!snapshotColumnNames.has("officialAdvisoryCount")) snapshotAlterStatements.push("ADD COLUMN officialAdvisoryCount INT NOT NULL DEFAULT 0");
  if (!snapshotColumnNames.has("cveRecordCount")) snapshotAlterStatements.push("ADD COLUMN cveRecordCount INT NOT NULL DEFAULT 0");
  if (!snapshotColumnNames.has("conferencePaperCount")) snapshotAlterStatements.push("ADD COLUMN conferencePaperCount INT NOT NULL DEFAULT 0");
  if (!snapshotColumnNames.has("preprintCount")) snapshotAlterStatements.push("ADD COLUMN preprintCount INT NOT NULL DEFAULT 0");
  if (!snapshotColumnNames.has("researchCount")) snapshotAlterStatements.push("ADD COLUMN researchCount INT NOT NULL DEFAULT 0");
  if (!snapshotColumnNames.has("newsCount")) snapshotAlterStatements.push("ADD COLUMN newsCount INT NOT NULL DEFAULT 0");
  if (snapshotAlterStatements.length) {
    await prisma.$executeRawUnsafe(`ALTER TABLE OpenclawRiskSnapshot ${snapshotAlterStatements.join(", ")}`);
  }

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS OpenclawRiskIssue (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      snapshotId INT NOT NULL,
      canonicalId VARCHAR(128) NOT NULL,
      issueId VARCHAR(128) NOT NULL,
      title VARCHAR(255) NOT NULL,
      summary TEXT NOT NULL,
      description LONGTEXT NOT NULL,
      sourcePrimary VARCHAR(32) NOT NULL,
      sourceType VARCHAR(32) NOT NULL DEFAULT 'official_advisory',
      sourceSearch VARCHAR(64) NOT NULL,
      sourceLabels JSON NOT NULL,
      sources JSON NOT NULL,
      githubIds JSON NOT NULL,
      cveIds JSON NOT NULL,
      projectScope VARCHAR(32) NOT NULL DEFAULT 'agent',
      venue VARCHAR(128) NULL,
      authors JSON NOT NULL,
      severity VARCHAR(32) NOT NULL,
      score DOUBLE NULL,
      cvssVector VARCHAR(255) NULL,
      cwes JSON NOT NULL,
      affectedRange TEXT NULL,
      fixedVersion VARCHAR(64) NULL,
      latestStableVersion VARCHAR(64) NULL,
      fixStatus VARCHAR(32) NOT NULL,
      fixLabel VARCHAR(32) NOT NULL,
      fixReason TEXT NOT NULL,
      issueUrl VARCHAR(255) NULL,
      repoUrl VARCHAR(255) NULL,
      referenceUrls JSON NOT NULL,
      tags JSON NOT NULL,
      status VARCHAR(32) NOT NULL DEFAULT 'new',
      relevanceScore DOUBLE NULL,
      publishedAt DATETIME(3) NULL,
      sourceUpdatedAt DATETIME(3) NULL,
      rawData JSON NOT NULL,
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      PRIMARY KEY (id),
      UNIQUE KEY OpenclawRiskIssue_snapshotId_canonicalId_key (snapshotId, canonicalId),
      KEY OpenclawRiskIssue_snapshotId_idx (snapshotId),
      KEY OpenclawRiskIssue_canonicalId_idx (canonicalId),
      KEY OpenclawRiskIssue_issueId_idx (issueId),
      KEY OpenclawRiskIssue_severity_idx (severity),
      KEY OpenclawRiskIssue_fixStatus_idx (fixStatus),
      KEY OpenclawRiskIssue_sourcePrimary_idx (sourcePrimary),
      KEY OpenclawRiskIssue_sourceType_idx (sourceType),
      KEY OpenclawRiskIssue_projectScope_idx (projectScope),
      KEY OpenclawRiskIssue_venue_idx (venue),
      KEY OpenclawRiskIssue_status_idx (status),
      KEY OpenclawRiskIssue_publishedAt_idx (publishedAt),
      CONSTRAINT OpenclawRiskIssue_snapshotId_fkey
        FOREIGN KEY (snapshotId) REFERENCES OpenclawRiskSnapshot(id) ON DELETE CASCADE ON UPDATE CASCADE
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  `);

  const existingIssueColumns = await prisma.$queryRawUnsafe(`
    SELECT COLUMN_NAME
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'OpenclawRiskIssue'
  `);
  const issueColumnNames = new Set(existingIssueColumns.map((row) => row.COLUMN_NAME));
  const issueAlterStatements = [];
  if (!issueColumnNames.has("sourceType")) issueAlterStatements.push("ADD COLUMN sourceType VARCHAR(32) NOT NULL DEFAULT 'official_advisory' AFTER sourcePrimary");
  if (!issueColumnNames.has("projectScope")) issueAlterStatements.push("ADD COLUMN projectScope VARCHAR(32) NOT NULL DEFAULT 'agent' AFTER cveIds");
  if (!issueColumnNames.has("venue")) issueAlterStatements.push("ADD COLUMN venue VARCHAR(128) NULL AFTER projectScope");
  if (!issueColumnNames.has("authors")) issueAlterStatements.push("ADD COLUMN authors JSON NULL AFTER venue");
  if (!issueColumnNames.has("status")) issueAlterStatements.push("ADD COLUMN status VARCHAR(32) NOT NULL DEFAULT 'new' AFTER tags");
  if (!issueColumnNames.has("relevanceScore")) issueAlterStatements.push("ADD COLUMN relevanceScore DOUBLE NULL AFTER status");
  if (issueAlterStatements.length) {
    await prisma.$executeRawUnsafe(`ALTER TABLE OpenclawRiskIssue ${issueAlterStatements.join(", ")}`);
  }

  if (!issueColumnNames.has("authors")) {
    await prisma.$executeRawUnsafe(`UPDATE OpenclawRiskIssue SET authors = JSON_ARRAY() WHERE authors IS NULL`);
    await prisma.$executeRawUnsafe(`ALTER TABLE OpenclawRiskIssue MODIFY COLUMN authors JSON NOT NULL`);
  }
}

function normalizeGithubAdvisory(advisory, latestStableVersion) {
  const score = Number(advisory?.cvss?.score);
  const fixedVersion = maxVersion(...(advisory.vulnerabilities || []).map((item) => item.first_patched_version));
  return {
    canonicalId: advisory.cve_id || advisory.ghsa_id,
    id: advisory.cve_id || advisory.ghsa_id,
    title: advisory.summary || advisory.ghsa_id,
    summary: advisory.summary || "",
    description: advisory.description || "",
    sourcePrimary: "github",
    sources: ["github"],
    sourceLabels: [SOURCE_LABELS.github],
    githubIds: advisory.ghsa_id ? [advisory.ghsa_id] : [],
    cveIds: advisory.cve_id ? [advisory.cve_id] : [],
    severity: advisory.severity || classifySeverityFromScore(score),
    score: Number.isFinite(score) ? score : null,
    cvssVector: advisory?.cvss?.vector_string || "",
    cwes: uniqueStrings((advisory.cwes || []).map((item) => item.cwe_id || item.name)),
    affectedRange: buildAffectedRangeFromGithub(advisory.vulnerabilities),
    fixedVersion,
    latestStableVersion: normalizeVersion(latestStableVersion),
    fixState: buildFixState(fixedVersion, latestStableVersion),
    publishedAt: advisory.published_at || "",
    updatedAt: advisory.updated_at || advisory.published_at || "",
    url: advisory.html_url || advisory.repository_advisory_url || advisory.url || "",
    references: uniqueStrings([
      advisory.html_url,
      advisory.url,
      advisory.repository_advisory_url,
      ...(advisory.references || []),
    ]).map((url) => ({ url })),
    repo: advisory.source_code_location || `https://github.com/${DEFAULT_REPO}`,
    tags: uniqueStrings(["github-advisory", ...(advisory.type ? [advisory.type] : []), ...(advisory.withdrawn_at ? ["withdrawn"] : [])]),
    rawData: advisory,
  };
}

function normalizeNvdCve(cve, latestStableVersion) {
  const cvss = pickCvss(cve.metrics || {});
  const fixedVersion = inferFixedVersionFromNvd(cve);
  return {
    canonicalId: cve.id,
    id: cve.id,
    title: cve.id,
    summary: pickEnglishDescription(cve.descriptions),
    description: pickEnglishDescription(cve.descriptions),
    sourcePrimary: "nvd",
    sources: ["nvd"],
    sourceLabels: [SOURCE_LABELS.nvd],
    githubIds: extractGhsaIds((cve.references || []).map((item) => item.url)),
    cveIds: [cve.id],
    severity: cvss.severity,
    score: cvss.score,
    cvssVector: cvss.vector,
    cwes: uniqueStrings((cve.weaknesses || []).flatMap((item) => item.description || []).map((item) => item.value)),
    affectedRange: buildAffectedRangeFromNvd(cve),
    fixedVersion,
    latestStableVersion: normalizeVersion(latestStableVersion),
    fixState: buildFixState(fixedVersion, latestStableVersion),
    publishedAt: cve.published || "",
    updatedAt: cve.lastModified || cve.published || "",
    url: `https://nvd.nist.gov/vuln/detail/${cve.id}`,
    references: uniqueStrings((cve.references || []).map((item) => item.url)).map((url) => ({ url })),
    repo: `https://github.com/${DEFAULT_REPO}`,
    tags: uniqueStrings(["nvd-cve", cve.vulnStatus, ...(extractGhsaIds((cve.references || []).map((item) => item.url)).length ? ["has-ghsa-reference"] : [])]),
    rawData: cve,
  };
}

function mergeIssueFields(base, incoming) {
  const preferredByFreshness =
    new Date(incoming.updatedAt || incoming.publishedAt || 0).getTime() >
    new Date(base.updatedAt || base.publishedAt || 0).getTime()
      ? incoming
      : base;

  return {
    ...base,
    ...preferredByFreshness,
    id: base.id,
    canonicalId: base.canonicalId,
    sourcePrimary: base.sourcePrimary,
    sources: uniqueStrings([...(base.sources || []), ...(incoming.sources || [])]),
    sourceLabels: uniqueStrings([...(base.sourceLabels || []), ...(incoming.sourceLabels || [])]),
    githubIds: uniqueStrings([...(base.githubIds || []), ...(incoming.githubIds || [])]),
    cveIds: uniqueStrings([...(base.cveIds || []), ...(incoming.cveIds || [])]),
    severity: pickPreferredSeverity(base.severity, incoming.severity),
    score: Math.max(Number(base.score || 0), Number(incoming.score || 0)) || null,
    cvssVector: base.cvssVector || incoming.cvssVector || "",
    cwes: uniqueStrings([...(base.cwes || []), ...(incoming.cwes || [])]),
    affectedRange: base.affectedRange || incoming.affectedRange || "",
    fixedVersion: maxVersion(base.fixedVersion, incoming.fixedVersion),
    latestStableVersion: maxVersion(base.latestStableVersion, incoming.latestStableVersion),
    references: uniqueStrings([...(base.references || []), ...(incoming.references || [])].map((item) => item.url)).map((url) => ({ url })),
    tags: uniqueStrings([...(base.tags || []), ...(incoming.tags || [])]),
    summary: base.summary?.length >= incoming.summary?.length ? base.summary : incoming.summary,
    description: base.description?.length >= incoming.description?.length ? base.description : incoming.description,
    title: base.title && base.title !== base.id ? base.title : incoming.title || base.title,
    repo: base.repo || incoming.repo || "",
    publishedAt: [base.publishedAt, incoming.publishedAt].filter(Boolean).sort()[0] || "",
    updatedAt: [base.updatedAt, incoming.updatedAt].filter(Boolean).sort().at(-1) || "",
    rawData: {
      github: base.sourcePrimary === "github" ? base.rawData : incoming.sourcePrimary === "github" ? incoming.rawData : undefined,
      nvd: base.sourcePrimary === "nvd" ? base.rawData : incoming.sourcePrimary === "nvd" ? incoming.rawData : undefined,
    },
  };
}

function dedupeIssues(issues, latestStableVersion) {
  const byKey = new Map();

  for (const issue of issues) {
    const possibleKeys = uniqueStrings([...(issue.cveIds || []), ...(issue.githubIds || []), issue.canonicalId, issue.id]);
    const existingKey = possibleKeys.find((candidate) => byKey.has(candidate));
    if (!existingKey) {
      const fresh = { ...issue, canonicalId: issue.canonicalId || possibleKeys[0] || issue.id, latestStableVersion: normalizeVersion(latestStableVersion) };
      for (const key of possibleKeys) byKey.set(key, fresh);
      continue;
    }
    const merged = mergeIssueFields(byKey.get(existingKey), issue);
    merged.fixState = buildFixState(merged.fixedVersion, latestStableVersion);
    merged.latestStableVersion = normalizeVersion(latestStableVersion);
    for (const key of possibleKeys) byKey.set(key, merged);
  }

  const uniqueIssues = new Map();
  for (const issue of byKey.values()) {
    const canonicalKey = issue.canonicalId || uniqueStrings([...(issue.cveIds || []), ...(issue.githubIds || []), issue.id])[0] || issue.id;
    if (!uniqueIssues.has(canonicalKey)) {
      uniqueIssues.set(canonicalKey, issue);
      continue;
    }
    const merged = mergeIssueFields(uniqueIssues.get(canonicalKey), issue);
    merged.fixState = buildFixState(merged.fixedVersion, latestStableVersion);
    merged.latestStableVersion = normalizeVersion(latestStableVersion);
    uniqueIssues.set(canonicalKey, merged);
  }

  return [...uniqueIssues.values()];
}

function sortIssues(issues) {
  return [...issues].sort((left, right) => {
    const severityDiff = severityRank(right.severity) - severityRank(left.severity);
    if (severityDiff !== 0) return severityDiff;
    const scoreDiff = Number(right.score || 0) - Number(left.score || 0);
    if (scoreDiff !== 0) return scoreDiff;
    return new Date(right.publishedAt || 0).getTime() - new Date(left.publishedAt || 0).getTime();
  });
}

function buildOverview(issues, latestRelease, sourceMeta) {
  const latest = [...issues].sort((a, b) => new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime()).slice(0, 6);
  const highRisk = sortIssues(issues.filter(isHighRiskIssue)).slice(0, 6);
  const fixedCount = issues.filter((item) => item.fixState.status === "fixed").length;
  const unfixedCount = issues.filter((item) => item.fixState.status === "unfixed").length;
  const unknownCount = issues.filter((item) => item.fixState.status === "unknown").length;
  const percentFixed = issues.length ? Math.round((fixedCount / issues.length) * 100) : 0;
  const criticalCount = issues.filter((item) => item.severity === "critical").length;
  const highCount = issues.filter((item) => item.severity === "high").length;
  const mediumCount = issues.filter((item) => item.severity === "medium" || item.severity === "moderate").length;
  const lowCount = issues.filter((item) => item.severity === "low").length;
  const unknownSeverityCount = issues.length - criticalCount - highCount - mediumCount - lowCount;
  const githubCount = issues.filter((item) => item.sources.includes("github")).length;
  const nvdCount = issues.filter((item) => item.sources.includes("nvd")).length;

  return {
    latestStable: latestRelease,
    totals: {
      totalIssues: issues.length,
      githubAdvisories: githubCount,
      nvdCves: nvdCount,
      criticalCount,
      highCount,
      mediumCount,
      lowCount,
      unknownSeverityCount,
      highRiskCount: issues.filter(isHighRiskIssue).length,
      fixedCount,
      unfixedCount,
      unknownCount,
      fixProgressPercent: percentFixed,
    },
    breakdowns: {
      severity: {
        critical: criticalCount,
        high: highCount,
        medium: mediumCount,
        low: lowCount,
        unknown: unknownSeverityCount,
      },
      sources: {
        github: githubCount,
        nvd: nvdCount,
      },
      fixStatus: {
        fixed: fixedCount,
        unfixed: unfixedCount,
        unknown: unknownCount,
      },
    },
    latest,
    highRisk,
    fixProgress: { fixed: fixedCount, unfixed: unfixedCount, unknown: unknownCount, percentFixed: percentFixed },
    sourceMeta,
  };
}

function serializeIssueForDb(issue) {
  return {
    canonicalId: issue.canonicalId || issue.id,
    issueId: issue.id,
    title: String(issue.title || issue.id).slice(0, 255),
    summary: issue.summary || issue.description || "",
    description: issue.description || issue.summary || "",
    sourcePrimary: issue.sourcePrimary || "github",
    sourceSearch: uniqueStrings(issue.sources || [issue.sourcePrimary]).join(","),
    sourceLabels: issue.sourceLabels || [],
    sources: issue.sources || [],
    githubIds: issue.githubIds || [],
    cveIds: issue.cveIds || [],
    severity: issue.severity || "unknown",
    score: Number.isFinite(Number(issue.score)) ? Number(issue.score) : null,
    cvssVector: issue.cvssVector || null,
    cwes: issue.cwes || [],
    affectedRange: issue.affectedRange || null,
    fixedVersion: issue.fixedVersion || null,
    latestStableVersion: issue.latestStableVersion || null,
    fixStatus: issue.fixState?.status || "unknown",
    fixLabel: issue.fixState?.label || "待确认",
    fixReason: issue.fixState?.reason || "",
    issueUrl: issue.url || null,
    repoUrl: issue.repo || null,
    referenceUrls: issue.references || [],
    tags: issue.tags || [],
    publishedAt: issue.publishedAt ? new Date(issue.publishedAt) : null,
    sourceUpdatedAt: issue.updatedAt ? new Date(issue.updatedAt) : null,
    rawData: issue.rawData || {},
  };
}

function toPublicIssue(issue) {
  return {
    canonicalId: issue.canonicalId,
    id: issue.issueId,
    title: issue.title,
    summary: issue.summary,
    description: issue.description,
    sourcePrimary: issue.sourcePrimary,
    sources: issue.sources,
    sourceLabels: issue.sourceLabels,
    githubIds: issue.githubIds,
    cveIds: issue.cveIds,
    severity: issue.severity,
    score: issue.score,
    cvssVector: issue.cvssVector,
    cwes: issue.cwes,
    affectedRange: issue.affectedRange,
    fixedVersion: issue.fixedVersion,
    latestStableVersion: issue.latestStableVersion,
    fixState: { status: issue.fixStatus, label: issue.fixLabel, reason: issue.fixReason },
    publishedAt: issue.publishedAt?.toISOString() || "",
    updatedAt: issue.sourceUpdatedAt?.toISOString() || "",
    url: issue.issueUrl,
    references: issue.referenceUrls,
    repo: issue.repoUrl,
    tags: issue.tags,
  };
}

async function fetchGithubAdvisories(forceRefresh = false) {
  const cacheKey = "risk-http:github-advisories";
  if (!forceRefresh) {
    const cached = readMemoryCache(cacheKey);
    if (cached) return cached;
  }

  const advisories = [];
  const perPage = 100;
  for (let page = 1; page <= 5; page += 1) {
    const url = new URL(`${GITHUB_API_BASE}/advisories`);
    url.searchParams.set("affects", DEFAULT_PACKAGE);
    url.searchParams.set("type", "reviewed");
    url.searchParams.set("sort", "published");
    url.searchParams.set("direction", "desc");
    url.searchParams.set("per_page", String(perPage));
    url.searchParams.set("page", String(page));
    const pageData = await fetchJson(url, { headers: buildGithubHeaders() }, "GitHub advisories");
    if (!Array.isArray(pageData) || !pageData.length) break;
    advisories.push(...pageData.filter(advisoryMatchesOpenClaw));
    if (pageData.length < perPage) break;
  }

  return writeMemoryCache(cacheKey, advisories);
}

async function fetchNvdForKeyword(keyword, forceRefresh = false) {
  const cacheKey = `risk-http:nvd:${keyword.toLowerCase()}`;
  if (!forceRefresh) {
    const cached = readMemoryCache(cacheKey);
    if (cached) return cached;
  }

  const collected = [];
  const perPage = 2000;
  let startIndex = 0;
  let totalResults = Infinity;

  while (startIndex < totalResults) {
    const url = new URL(NVD_API_BASE);
    url.searchParams.set("keywordSearch", keyword);
    url.searchParams.append("keywordExactMatch", "");
    url.searchParams.append("noRejected", "");
    url.searchParams.set("resultsPerPage", String(perPage));
    url.searchParams.set("startIndex", String(startIndex));

    const payload = await fetchJson(url, { headers: buildNvdHeaders() }, "NVD CVE");
    totalResults = Number(payload?.totalResults || 0);
    const vulnerabilities = Array.isArray(payload?.vulnerabilities) ? payload.vulnerabilities : [];
    collected.push(...vulnerabilities.map((item) => item.cve).filter(Boolean).filter(cveMatchesOpenClaw));
    if (!vulnerabilities.length || vulnerabilities.length < perPage) break;
    startIndex += vulnerabilities.length;
  }

  return writeMemoryCache(cacheKey, collected);
}

async function fetchNvdCves(forceRefresh = false) {
  const results = await Promise.all(SEARCH_KEYWORDS.map((keyword) => fetchNvdForKeyword(keyword, forceRefresh)));
  const byId = new Map();
  for (const cves of results) {
    for (const cve of cves) byId.set(cve.id, cve);
  }
  return [...byId.values()];
}

async function fetchLatestStableRelease(forceRefresh = false) {
  const cacheKey = "risk-http:github-latest-release";
  if (!forceRefresh) {
    const cached = readMemoryCache(cacheKey);
    if (cached) return cached;
  }

  const releases = await fetchJson(`${GITHUB_API_BASE}/repos/${DEFAULT_REPO}/releases?per_page=20`, { headers: buildGithubHeaders() }, "GitHub releases");
  const release = Array.isArray(releases) ? releases.find((item) => !item.draft && !item.prerelease) : null;
  const latest = release
    ? { tagName: release.tag_name || "", version: normalizeVersion(release.tag_name), publishedAt: release.published_at || release.created_at || "", url: release.html_url || "" }
    : { tagName: "", version: "", publishedAt: "", url: "" };

  return writeMemoryCache(cacheKey, latest);
}

async function collectOpenclawRiskData({ forceRefresh = false } = {}) {
  const collectedAt = nowIso();
  const latestRelease = await fetchLatestStableRelease(forceRefresh);
  const results = await Promise.allSettled([fetchGithubAdvisories(forceRefresh), fetchNvdCves(forceRefresh)]);
  const [githubResult, nvdResult] = results;
  const githubItems = githubResult.status === "fulfilled" ? githubResult.value : [];
  const nvdItems = nvdResult.status === "fulfilled" ? nvdResult.value : [];
  const issues = sortIssues(
    dedupeIssues(
      [
        ...githubItems.map((item) => normalizeGithubAdvisory(item, latestRelease.version)),
        ...nvdItems.map((item) => normalizeNvdCve(item, latestRelease.version)),
      ],
      latestRelease.version,
    ),
  );

  const sourceMeta = {
    collectedAt,
    lastSyncedAt: formatDateTime(collectedAt),
    repo: DEFAULT_REPO,
    keywords: SEARCH_KEYWORDS,
    github: {
      ok: githubResult.status === "fulfilled",
      error: githubResult.status === "rejected" ? githubResult.reason?.message || "GitHub fetch failed" : "",
      rawCount: githubItems.length,
    },
    nvd: {
      ok: nvdResult.status === "fulfilled",
      error: nvdResult.status === "rejected" ? nvdResult.reason?.message || "NVD fetch failed" : "",
      rawCount: nvdItems.length,
    },
  };

  return {
    overview: buildOverview(issues, latestRelease, sourceMeta),
    issues,
    sourceMeta,
    raw: { githubAdvisories: githubItems, nvdCves: nvdItems, latestRelease },
  };
}

async function persistSnapshot(aggregate, triggerSource = "manual") {
  await ensureOpenclawRiskTables();
  const snapshotTime = new Date();
  const snapshotKey = createSnapshotKey(snapshotTime);
  const snapshotCacheDir = path.join(cacheRoot, "snapshots", snapshotKey);
  await ensureDir(snapshotCacheDir);

  await Promise.all([
    writeJsonFile(path.join(snapshotCacheDir, "overview.json"), aggregate.overview),
    writeJsonFile(path.join(snapshotCacheDir, "issues.json"), aggregate.issues),
    writeJsonFile(path.join(snapshotCacheDir, "source-meta.json"), aggregate.sourceMeta),
    writeJsonFile(path.join(snapshotCacheDir, "raw-github-advisories.json"), aggregate.raw.githubAdvisories),
    writeJsonFile(path.join(snapshotCacheDir, "raw-nvd-cves.json"), aggregate.raw.nvdCves),
    writeJsonFile(path.join(snapshotCacheDir, "latest-release.json"), aggregate.raw.latestRelease),
  ]);

  const snapshot = await prisma.openclawRiskSnapshot.create({
    data: {
      snapshotKey,
      triggerSource,
      status: "completed",
      latestStableTag: aggregate.overview.latestStable?.tagName || null,
      latestStableVersion: aggregate.overview.latestStable?.version || null,
      latestStableUrl: aggregate.overview.latestStable?.url || null,
      latestStablePublishedAt: aggregate.overview.latestStable?.publishedAt ? new Date(aggregate.overview.latestStable.publishedAt) : null,
      totalIssues: aggregate.overview.totals.totalIssues,
      githubAdvisories: aggregate.overview.totals.githubAdvisories,
      nvdCves: aggregate.overview.totals.nvdCves,
      criticalCount: aggregate.overview.totals.criticalCount,
      highRiskCount: aggregate.overview.totals.highRiskCount,
      fixedCount: aggregate.overview.totals.fixedCount,
      unfixedCount: aggregate.overview.totals.unfixedCount,
      unknownCount: aggregate.overview.totals.unknownCount,
      fixProgressPercent: aggregate.overview.totals.fixProgressPercent,
      sourceMeta: aggregate.sourceMeta,
      cacheDir: snapshotCacheDir,
    },
  });

  if (aggregate.issues.length) {
    await prisma.openclawRiskIssue.createMany({
      data: aggregate.issues.map((issue) => ({ snapshotId: snapshot.id, ...serializeIssueForDb(issue) })),
    });
  }

  return snapshot;
}

async function getLatestCompletedSnapshotBase() {
  await ensureOpenclawRiskTables();
  return prisma.openclawRiskSnapshot.findFirst({
    where: { status: "completed" },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
  });
}

async function refreshOpenclawRiskData(options = {}) {
  const { triggerSource = "manual", force = false } = options;
  if (activeRefreshPromise) return activeRefreshPromise;

  activeRefreshPromise = (async () => {
    latestRefreshState = { ...latestRefreshState, status: "running", lastAttemptAt: nowIso(), lastError: "" };
    try {
      const aggregate = await collectOpenclawRiskData({ forceRefresh: force || triggerSource !== "scheduled" });
      const snapshot = await persistSnapshot(aggregate, triggerSource);
      clearRiskMemoryCache();
      latestRefreshState = { status: "ok", lastAttemptAt: latestRefreshState.lastAttemptAt, lastCompletedAt: snapshot.createdAt.toISOString(), lastError: "" };
      return snapshot;
    } catch (error) {
      latestRefreshState = { status: "error", lastAttemptAt: latestRefreshState.lastAttemptAt, lastCompletedAt: latestRefreshState.lastCompletedAt, lastError: error.message || "refresh failed" };
      throw error;
    } finally {
      activeRefreshPromise = null;
    }
  })();

  return activeRefreshPromise;
}

async function ensureLatestSnapshotAvailable({ allowRefresh = true } = {}) {
  const cacheKey = "risk-db:latest-snapshot-base";
  const cached = readMemoryCache(cacheKey);
  if (cached) return cached;

  let latest = await getLatestCompletedSnapshotBase();
  if (!latest && allowRefresh) {
    await refreshOpenclawRiskData({ triggerSource: "bootstrap", force: true });
    latest = await getLatestCompletedSnapshotBase();
  }

  return latest ? writeMemoryCache(cacheKey, latest) : null;
}

async function getStoredOverview() {
  const cacheKey = "risk-db:overview";
  const cached = readMemoryCache(cacheKey);
  if (cached) return cached;

  const snapshot = await ensureLatestSnapshotAvailable({ allowRefresh: true });
  if (!snapshot) {
    return {
      latestStable: { tagName: "", version: "", publishedAt: "", url: "" },
      totals: {
        totalIssues: 0,
        githubAdvisories: 0,
        nvdCves: 0,
        criticalCount: 0,
        highCount: 0,
        mediumCount: 0,
        lowCount: 0,
        unknownSeverityCount: 0,
        highRiskCount: 0,
        fixedCount: 0,
        unfixedCount: 0,
        unknownCount: 0,
        fixProgressPercent: 0,
      },
      breakdowns: {
        severity: { critical: 0, high: 0, medium: 0, low: 0, unknown: 0 },
        sources: { github: 0, nvd: 0 },
        fixStatus: { fixed: 0, unfixed: 0, unknown: 0 },
      },
      latest: [],
      highRisk: [],
      fixProgress: { fixed: 0, unfixed: 0, unknown: 0, percentFixed: 0 },
      sourceMeta: {
        collectedAt: "",
        lastSyncedAt: "",
        repo: DEFAULT_REPO,
        keywords: SEARCH_KEYWORDS,
        github: { ok: false, error: "", rawCount: 0 },
        nvd: { ok: false, error: "", rawCount: 0 },
        scheduler: { intervalMs: WEEKLY_REFRESH_MS, intervalDays: Number((WEEKLY_REFRESH_MS / 86400000).toFixed(2)), ...latestRefreshState },
        storage: { cacheRoot, snapshotId: null, snapshotKey: "" },
      },
    };
  }

  const [latestRows, highRiskRows] = await Promise.all([
    prisma.openclawRiskIssue.findMany({ where: { snapshotId: snapshot.id }, orderBy: [{ publishedAt: "desc" }, { score: "desc" }], take: 6 }),
    prisma.openclawRiskIssue.findMany({
      where: { snapshotId: snapshot.id, OR: [{ severity: { in: ["critical", "high"] } }, { score: { gte: 7 } }] },
      orderBy: [{ severity: "desc" }, { score: "desc" }, { publishedAt: "desc" }],
      take: 6,
    }),
  ]);

  const payload = {
    latestStable: {
      tagName: snapshot.latestStableTag || "",
      version: snapshot.latestStableVersion || "",
      publishedAt: snapshot.latestStablePublishedAt?.toISOString() || "",
      url: snapshot.latestStableUrl || "",
    },
    totals: {
      totalIssues: snapshot.totalIssues,
      githubAdvisories: snapshot.githubAdvisories,
      nvdCves: snapshot.nvdCves,
      criticalCount: snapshot.criticalCount,
      highCount: Math.max(snapshot.highRiskCount - snapshot.criticalCount, 0),
      mediumCount: Math.max(snapshot.totalIssues - snapshot.highRiskCount - snapshot.unknownCount, 0),
      lowCount: 0,
      unknownSeverityCount: snapshot.unknownCount,
      highRiskCount: snapshot.highRiskCount,
      fixedCount: snapshot.fixedCount,
      unfixedCount: snapshot.unfixedCount,
      unknownCount: snapshot.unknownCount,
      fixProgressPercent: snapshot.fixProgressPercent,
    },
    breakdowns: {
      severity: {
        critical: snapshot.criticalCount,
        high: Math.max(snapshot.highRiskCount - snapshot.criticalCount, 0),
        medium: Math.max(snapshot.totalIssues - snapshot.highRiskCount - snapshot.unknownCount, 0),
        low: 0,
        unknown: snapshot.unknownCount,
      },
      sources: {
        github: snapshot.githubAdvisories,
        nvd: snapshot.nvdCves,
      },
      fixStatus: {
        fixed: snapshot.fixedCount,
        unfixed: snapshot.unfixedCount,
        unknown: snapshot.unknownCount,
      },
    },
    latest: latestRows.map(toPublicIssue),
    highRisk: highRiskRows.map(toPublicIssue),
    fixProgress: { fixed: snapshot.fixedCount, unfixed: snapshot.unfixedCount, unknown: snapshot.unknownCount, percentFixed: snapshot.fixProgressPercent },
    sourceMeta: {
      ...(snapshot.sourceMeta || {}),
      scheduler: {
        intervalMs: WEEKLY_REFRESH_MS,
        intervalDays: Number((WEEKLY_REFRESH_MS / 86400000).toFixed(2)),
        status: latestRefreshState.status,
        lastAttemptAt: latestRefreshState.lastAttemptAt,
        lastCompletedAt: latestRefreshState.lastCompletedAt || snapshot.createdAt.toISOString(),
        lastError: latestRefreshState.lastError,
      },
      storage: { cacheRoot, snapshotId: snapshot.id, snapshotKey: snapshot.snapshotKey, cacheDir: snapshot.cacheDir || "" },
    },
  };

  return writeMemoryCache(cacheKey, payload);
}

async function getStoredIssues(query = {}) {
  const snapshot = await ensureLatestSnapshotAvailable({ allowRefresh: true });
  if (!snapshot) {
    return { total: 0, page: 1, page_size: 20, rows: [], sourceMeta: { scheduler: latestRefreshState, storage: { cacheRoot } } };
  }

  const page = Math.max(1, Number(query.page || 1));
  const pageSize = Math.max(1, Math.min(100, Number(query.page_size || query.pageSize || 20)));
  const source = String(query.source || "").trim().toLowerCase();
  const severity = String(query.severity || "").trim().toLowerCase();
  const fixStatus = String(query.fix_status || query.fixStatus || "").trim().toLowerCase();
  const keyword = String(query.keyword || "").trim();
  const where = { snapshotId: snapshot.id };

  if (source) where.sourceSearch = { contains: source };
  if (severity) where.severity = severity;
  if (fixStatus) where.fixStatus = fixStatus;
  if (keyword) {
    where.OR = [
      { canonicalId: { contains: keyword } },
      { issueId: { contains: keyword } },
      { title: { contains: keyword } },
      { summary: { contains: keyword } },
      { description: { contains: keyword } },
    ];
  }

  const [total, rows] = await Promise.all([
    prisma.openclawRiskIssue.count({ where }),
    prisma.openclawRiskIssue.findMany({ where, orderBy: [{ severity: "desc" }, { score: "desc" }, { publishedAt: "desc" }], skip: (page - 1) * pageSize, take: pageSize }),
  ]);

  return {
    total,
    page,
    page_size: pageSize,
    rows: rows.map(toPublicIssue),
    sourceMeta: {
      ...(snapshot.sourceMeta || {}),
      scheduler: {
        intervalMs: WEEKLY_REFRESH_MS,
        intervalDays: Number((WEEKLY_REFRESH_MS / 86400000).toFixed(2)),
        status: latestRefreshState.status,
        lastAttemptAt: latestRefreshState.lastAttemptAt,
        lastCompletedAt: latestRefreshState.lastCompletedAt || snapshot.createdAt.toISOString(),
        lastError: latestRefreshState.lastError,
      },
      storage: { cacheRoot, snapshotId: snapshot.id, snapshotKey: snapshot.snapshotKey, cacheDir: snapshot.cacheDir || "" },
    },
  };
}

async function refreshIfDue(triggerSource = "scheduled-check") {
  const latest = await getLatestCompletedSnapshotBase();
  if (!latest) {
    await refreshOpenclawRiskData({ triggerSource, force: true });
    return;
  }
  if (Date.now() - new Date(latest.createdAt).getTime() >= WEEKLY_REFRESH_MS) {
    await refreshOpenclawRiskData({ triggerSource });
  }
}

export function initializeOpenclawRiskScheduler() {
  if (schedulerStarted) return;
  schedulerStarted = true;

  void ensureDir(cacheRoot)
    .then(() => refreshIfDue("startup"))
    .catch((error) => {
      latestRefreshState = { ...latestRefreshState, status: "error", lastAttemptAt: nowIso(), lastError: error.message || "startup refresh failed" };
      console.error(`[openclaw-risk] startup initialization failed: ${error.message}`);
    });

  const timer = setInterval(() => {
    void refreshIfDue("scheduled").catch((error) => {
      latestRefreshState = { ...latestRefreshState, status: "error", lastAttemptAt: nowIso(), lastError: error.message || "scheduled refresh failed" };
      console.error(`[openclaw-risk] scheduled refresh failed: ${error.message}`);
    });
  }, REFRESH_CHECK_MS);

  if (typeof timer.unref === "function") timer.unref();
}

export async function getOpenclawRiskOverview(query = {}) {
  const forceRefresh = query.refresh === "1" || query.refresh === "true";
  if (forceRefresh) await refreshOpenclawRiskData({ triggerSource: "manual", force: true });
  return getStoredOverview();
}

export async function getOpenclawRiskIssues(query = {}) {
  const forceRefresh = query.refresh === "1" || query.refresh === "true";
  if (forceRefresh) await refreshOpenclawRiskData({ triggerSource: "manual", force: true });
  return getStoredIssues(query);
}

export async function triggerOpenclawRiskRefresh(triggerSource = "manual") {
  const snapshot = await refreshOpenclawRiskData({ triggerSource, force: true });
  return { ok: true, snapshotId: snapshot.id, snapshotKey: snapshot.snapshotKey, createdAt: snapshot.createdAt.toISOString() };
}
