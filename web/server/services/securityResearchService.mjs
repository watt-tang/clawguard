import fs from "node:fs/promises";
import http from "node:http";
import https from "node:https";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { formatDateTime } from "../lib/date.mjs";
import { prisma } from "../lib/prisma.mjs";

const CROSSREF_API_BASE = "https://api.crossref.org/works";
const ARXIV_API_BASE = "http://export.arxiv.org/api/query";
const MEMORY_CACHE_TTL_MS = Math.max(10000, Number(process.env.SECURITY_RESEARCH_CACHE_TTL_MS || 5 * 60 * 1000));
const WEEKLY_REFRESH_MS = Math.max(60000, Number(process.env.SECURITY_RESEARCH_REFRESH_INTERVAL_MS || 7 * 24 * 60 * 60 * 1000));
const REFRESH_CHECK_MS = Math.max(60000, Number(process.env.SECURITY_RESEARCH_REFRESH_CHECK_MS || 6 * 60 * 60 * 1000));
const CONFERENCE_SINCE_DATE = process.env.SECURITY_RESEARCH_CONFERENCE_SINCE_DATE || "2023-01-01";
const ARXIV_MAX_RESULTS = Math.max(3, Math.min(20, Number(process.env.SECURITY_RESEARCH_ARXIV_MAX_RESULTS || 8)));
const CROSSREF_ROWS_PER_QUERY = Math.max(4, Math.min(20, Number(process.env.SECURITY_RESEARCH_CROSSREF_ROWS || 8)));
const CROSSREF_CONCURRENCY = Math.max(1, Math.min(4, Number(process.env.SECURITY_RESEARCH_CONCURRENCY || 3)));
const DEFAULT_KEYWORDS = [
  "OpenClaw security",
  "OpenClaw skill security",
  "OpenClaw plugin security",
  "agent security sandbox",
  "LLM agent security",
  "plugin sandbox security",
  "prompt injection agent tools",
  "autonomous agent security",
];
const SEARCH_KEYWORDS = (process.env.SECURITY_RESEARCH_KEYWORDS || DEFAULT_KEYWORDS.join("|"))
  .split("|")
  .map((item) => item.trim())
  .filter(Boolean);

const VENUE_CONFIGS = [
  {
    venue: "USENIX",
    label: "USENIX Security",
    queries: ["USENIX Security Symposium", "USENIX Security"],
    matchers: [/usenix security symposium/i, /\busenix security\b/i],
  },
  {
    venue: "S&P",
    label: "IEEE S&P",
    queries: ["IEEE Symposium on Security and Privacy", "IEEE SP"],
    matchers: [/ieee symposium on security and privacy/i, /\bsecurity and privacy \(sp\)\b/i],
  },
  {
    venue: "CCS",
    label: "ACM CCS",
    queries: ["ACM SIGSAC Conference on Computer and Communications Security", "ACM CCS"],
    matchers: [/acm sigsac conference on computer and communications security/i, /\bccs '?[0-9]{2,4}\b/i, /\bacm ccs\b/i],
  },
  {
    venue: "NDSS",
    label: "NDSS",
    queries: ["Network and Distributed System Security Symposium", "NDSS"],
    matchers: [/network and distributed system security symposium/i, /\bndss\b/i],
  },
  {
    venue: "Euro S&P",
    label: "Euro S&P",
    queries: ["IEEE European Symposium on Security and Privacy", "EuroS&P", "Euro S&P"],
    matchers: [/ieee european symposium on security and privacy/i, /\beuros&p\b/i, /\beuro s&p\b/i],
  },
];

const PROJECT_SCOPE_RULES = [
  { scope: "openclaw", patterns: [/\bopenclaw\b/i] },
  { scope: "claw", patterns: [/\bclaw\b/i, /\bclawdbot\b/i, /\bmoltbot\b/i] },
  { scope: "skill", patterns: [/\bskill\b/i, /\bskills\b/i] },
  { scope: "plugin", patterns: [/\bplugin\b/i, /\bplugins\b/i, /\btool plugin\b/i] },
  {
    scope: "agent",
    patterns: [/\bagent\b/i, /\bagents\b/i, /\bautonomous\b/i, /\btool use\b/i, /\btool-using\b/i, /\bllm\b/i],
  },
];

const SECURITY_TERMS = [
  "security",
  "sandbox",
  "prompt injection",
  "jailbreak",
  "tool",
  "tools",
  "plugin",
  "agent",
  "autonomous",
  "defense",
  "attack",
];

const EXCLUDED_TITLE_PATTERNS = [
  /\bworkshop\b/i,
  /\bpreface\b/i,
  /\bproceedings\b/i,
  /\bauthor index\b/i,
  /\bsession details\b/i,
];

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../../..");
const cacheRoot =
  process.env.SECURITY_RESEARCH_CACHE_DIR ||
  path.resolve(repoRoot, "..", "clawguard-cache", "security-research");

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

function clearMemoryCache(prefix = "security-research:") {
  for (const key of [...memoryCache.keys()]) {
    if (key.startsWith(prefix)) memoryCache.delete(key);
  }
}

function uniqueStrings(values = []) {
  return [...new Set(values.map((value) => String(value || "").trim()).filter(Boolean))];
}

function normalizeWhitespace(value = "") {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function stripHtmlTags(value = "") {
  return normalizeWhitespace(String(value || "").replace(/<[^>]+>/g, " "));
}

function decodeXmlEntities(value = "") {
  return String(value || "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'");
}

function decodeHtmlEntities(value = "") {
  return decodeXmlEntities(
    String(value || "")
      .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
      .replace(/&#(\d+);/g, (_, num) => String.fromCodePoint(Number(num))),
  );
}

function normalizeTitle(value = "") {
  return normalizeWhitespace(
    decodeHtmlEntities(String(value || ""))
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, " "),
  );
}

function toIsoDate(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

function extractDatePart(item = {}) {
  const candidates = [
    item.published?.["date-parts"]?.[0],
    item.published_print?.["date-parts"]?.[0],
    item.published_online?.["date-parts"]?.[0],
    item.issued?.["date-parts"]?.[0],
    item.created?.["date-parts"]?.[0],
  ].filter(Boolean);
  if (!candidates.length) return "";
  const [year = 1, month = 1, day = 1] = candidates[0];
  return new Date(Date.UTC(year, Math.max(month - 1, 0), day || 1)).toISOString();
}

function normalizeAuthors(authors = []) {
  return uniqueStrings(
    authors.map((author) => {
      const fullName = [author?.given, author?.family].filter(Boolean).join(" ").trim();
      return fullName || author?.name || "";
    }),
  );
}

function normalizeVenueLabel(value = "") {
  const haystack = String(value || "");
  for (const config of VENUE_CONFIGS) {
    if (config.matchers.some((matcher) => matcher.test(haystack))) {
      return config.venue;
    }
  }
  return "";
}

function inferProjectScope(text = "") {
  for (const rule of PROJECT_SCOPE_RULES) {
    if (rule.patterns.some((pattern) => pattern.test(text))) {
      return rule.scope;
    }
  }
  return "agent";
}

function hasSecuritySignal(text = "") {
  const haystack = String(text || "").toLowerCase();
  return SECURITY_TERMS.some((term) => haystack.includes(term));
}

function hasScopeSignal(text = "") {
  const haystack = String(text || "");
  if (PROJECT_SCOPE_RULES.some((rule) => rule.patterns.some((pattern) => pattern.test(haystack)))) {
    return true;
  }
  return /\bprompt\b/i.test(haystack) || /\bllm\b/i.test(haystack) || /\bmodel\b/i.test(haystack) || /\btool\b/i.test(haystack);
}

function isExcludedTitle(title = "") {
  return EXCLUDED_TITLE_PATTERNS.some((pattern) => pattern.test(title));
}

function isResearchRelevant(text = "") {
  return hasSecuritySignal(text) && hasScopeSignal(text);
}

function scoreKeywordMatches(text = "") {
  const haystack = String(text || "").toLowerCase();
  let score = 0;
  for (const keyword of SEARCH_KEYWORDS) {
    const lowered = keyword.toLowerCase();
    if (haystack.includes(lowered)) {
      score += 18;
      continue;
    }

    const parts = lowered.split(/\s+/).filter((part) => part.length >= 4);
    const partHits = parts.filter((part) => haystack.includes(part)).length;
    score += partHits * 4;
  }
  for (const term of SECURITY_TERMS) {
    if (haystack.includes(term)) score += 3;
  }
  return score;
}

function scorePaper({
  title = "",
  summary = "",
  venue = "",
  sourceType = "conference_paper",
  projectScope = "agent",
}) {
  let score = 0;
  const titleScore = scoreKeywordMatches(title);
  const summaryScore = Math.min(30, scoreKeywordMatches(summary));
  score += titleScore * 1.4 + summaryScore;
  if (sourceType === "conference_paper") score += 16;
  if (venue) score += 10;
  if (projectScope === "openclaw") score += 18;
  else if (projectScope === "claw") score += 12;
  else if (projectScope === "skill" || projectScope === "plugin") score += 10;
  else if (projectScope === "agent") score += 8;
  return Math.min(100, Math.round(score));
}

function buildTags(title = "", summary = "", venue = "", projectScope = "agent", sourceType = "conference_paper") {
  const text = `${title}\n${summary}`.toLowerCase();
  const tags = [projectScope, sourceType];
  if (venue) tags.push(venue);
  if (text.includes("prompt injection")) tags.push("prompt-injection");
  if (text.includes("sandbox")) tags.push("sandbox");
  if (text.includes("tool")) tags.push("tool-security");
  if (text.includes("plugin")) tags.push("plugin-security");
  if (text.includes("autonomous")) tags.push("autonomous-agent");
  if (text.includes("llm")) tags.push("llm-security");
  return uniqueStrings(tags);
}

function buildConferenceSummary(title, keyword, venue, abstract = "") {
  const cleanedAbstract = stripHtmlTags(decodeHtmlEntities(abstract));
  if (cleanedAbstract) return cleanedAbstract;
  return `${title} is indexed as a ${venue} paper. This summary is inferred from title and venue metadata because the source record does not expose an abstract.`;
}

function buildArxivSummary(summary = "") {
  return normalizeWhitespace(decodeXmlEntities(summary));
}

function buildCanonicalId(paper) {
  const externalIds = paper.externalIds || {};
  return externalIds.doi || externalIds.arxivId || `${paper.sourceType}:${normalizeTitle(paper.title).slice(0, 180)}`;
}

function serializePaperForDb(paper) {
  return {
    canonicalId: paper.canonicalId,
    title: paper.title.slice(0, 500),
    normalizedTitle: paper.normalizedTitle.slice(0, 500),
    sourceType: paper.sourceType,
    projectScope: paper.projectScope,
    venue: paper.venue,
    sourcePrimary: paper.sourcePrimary,
    sourceSearch: uniqueStrings([paper.sourcePrimary, paper.sourceType, paper.venue, paper.projectScope, ...(paper.tags || [])]).join(",").slice(0, 128),
    abstractOrSummary: paper.abstractOrSummary,
    tags: paper.tags || [],
    sourceUrl: paper.sourceUrl || null,
    authors: paper.authors || [],
    externalIds: paper.externalIds || {},
    relevanceScore: Number(paper.relevanceScore || 0),
    isTopVenue: Boolean(paper.isTopVenue),
    publishedAt: paper.publishedAt ? new Date(paper.publishedAt) : null,
    status: paper.status || "active",
    rawData: paper.rawData || {},
  };
}

function toPublicPaper(row) {
  return {
    id: row.canonicalId,
    title: row.title,
    sourceType: row.sourceType,
    projectScope: row.projectScope,
    venue: row.venue,
    publishedAt: row.publishedAt?.toISOString() || "",
    abstractOrSummary: row.abstractOrSummary,
    tags: row.tags,
    sourceUrl: row.sourceUrl,
    authors: row.authors,
    relevanceScore: row.relevanceScore,
    sourcePrimary: row.sourcePrimary,
    isTopVenue: row.isTopVenue,
    externalIds: row.externalIds,
  };
}

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
  return dirPath;
}

async function writeJsonFile(filePath, payload) {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, JSON.stringify(payload, null, 2), "utf8");
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function requestTextOnce(url, headers = {}, timeoutMs = 45000) {
  return new Promise((resolve, reject) => {
    const requestUrl = new URL(url);
    const client = requestUrl.protocol === "http:" ? http : https;
    const req = client.request(
      requestUrl,
      {
        method: "GET",
        headers: {
          "User-Agent": "clawguard-security-research/1.0 (mailto:devnull@example.com)",
          Accept: "*/*",
          "Accept-Encoding": "identity",
          ...headers,
        },
      },
      (res) => {
        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => {
          const body = Buffer.concat(chunks).toString("utf8");
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            resolve(requestText(new URL(res.headers.location, requestUrl).toString(), headers, timeoutMs));
            return;
          }
          if (res.statusCode < 200 || res.statusCode >= 300) {
            reject(new Error(`Request failed (${res.statusCode}): ${body.slice(0, 300)}`));
            return;
          }
          resolve(body);
        });
      },
    );

    req.setTimeout(timeoutMs, () => {
      req.destroy(new Error(`Request timed out after ${timeoutMs}ms: ${url}`));
    });
    req.on("error", reject);
    req.end();
  });
}

async function requestText(url, headers = {}, timeoutMs = 45000) {
  try {
    return await requestTextOnce(url, headers, timeoutMs);
  } catch (error) {
    const message = String(error?.message || "");
    if (!/timed out|429|rate/i.test(message)) throw error;
    await sleep(1200);
    return requestTextOnce(url, headers, timeoutMs);
  }
}

async function fetchJson(url, headers = {}) {
  return JSON.parse(await requestText(url, headers));
}

async function mapLimit(items, limit, iteratee) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      results[currentIndex] = await iteratee(items[currentIndex], currentIndex);
    }
  }

  const workers = Array.from({ length: Math.min(limit, items.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

async function ensureResearchTables() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS SecurityResearchSnapshot (
      id INT NOT NULL AUTO_INCREMENT,
      snapshotKey VARCHAR(32) NOT NULL,
      triggerSource VARCHAR(32) NOT NULL DEFAULT 'scheduled',
      status VARCHAR(32) NOT NULL DEFAULT 'completed',
      totalPapers INT NOT NULL DEFAULT 0,
      conferencePaperCount INT NOT NULL DEFAULT 0,
      preprintCount INT NOT NULL DEFAULT 0,
      openclawCount INT NOT NULL DEFAULT 0,
      clawCount INT NOT NULL DEFAULT 0,
      skillCount INT NOT NULL DEFAULT 0,
      agentCount INT NOT NULL DEFAULT 0,
      pluginCount INT NOT NULL DEFAULT 0,
      sourceMeta JSON NOT NULL,
      cacheDir VARCHAR(255) NULL,
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      PRIMARY KEY (id),
      UNIQUE KEY SecurityResearchSnapshot_snapshotKey_key (snapshotKey),
      KEY SecurityResearchSnapshot_createdAt_idx (createdAt),
      KEY SecurityResearchSnapshot_status_createdAt_idx (status, createdAt)
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS SecurityResearchPaper (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      snapshotId INT NOT NULL,
      canonicalId VARCHAR(191) NOT NULL,
      title VARCHAR(500) NOT NULL,
      normalizedTitle VARCHAR(500) NOT NULL,
      sourceType VARCHAR(32) NOT NULL,
      projectScope VARCHAR(32) NOT NULL,
      venue VARCHAR(128) NOT NULL,
      sourcePrimary VARCHAR(32) NOT NULL,
      sourceSearch VARCHAR(128) NOT NULL,
      abstractOrSummary LONGTEXT NOT NULL,
      tags JSON NOT NULL,
      sourceUrl VARCHAR(255) NULL,
      authors JSON NOT NULL,
      externalIds JSON NOT NULL,
      relevanceScore DOUBLE NOT NULL DEFAULT 0,
      isTopVenue BOOLEAN NOT NULL DEFAULT TRUE,
      publishedAt DATETIME(3) NULL,
      status VARCHAR(32) NOT NULL DEFAULT 'active',
      rawData JSON NOT NULL,
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      PRIMARY KEY (id),
      UNIQUE KEY SecurityResearchPaper_snapshotId_canonicalId_key (snapshotId, canonicalId),
      KEY SecurityResearchPaper_snapshotId_idx (snapshotId),
      KEY SecurityResearchPaper_canonicalId_idx (canonicalId),
      KEY SecurityResearchPaper_normalizedTitle_idx (normalizedTitle(191)),
      KEY SecurityResearchPaper_sourceType_idx (sourceType),
      KEY SecurityResearchPaper_projectScope_idx (projectScope),
      KEY SecurityResearchPaper_venue_idx (venue),
      KEY SecurityResearchPaper_sourcePrimary_idx (sourcePrimary),
      KEY SecurityResearchPaper_isTopVenue_idx (isTopVenue),
      KEY SecurityResearchPaper_publishedAt_idx (publishedAt),
      KEY SecurityResearchPaper_relevanceScore_idx (relevanceScore),
      CONSTRAINT SecurityResearchPaper_snapshotId_fkey
        FOREIGN KEY (snapshotId) REFERENCES SecurityResearchSnapshot(id) ON DELETE CASCADE ON UPDATE CASCADE
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  `);
}

function createSnapshotKey(date = new Date()) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function extractXmlTag(block, tagName) {
  const match = block.match(new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i"));
  return match ? decodeXmlEntities(match[1]) : "";
}

function extractXmlLinks(block) {
  const links = [...block.matchAll(/<link\s+([^>]+?)\/>/gi)];
  const parsed = {};
  for (const [, attrs] of links) {
    const href = /href="([^"]+)"/i.exec(attrs)?.[1] || "";
    const rel = /rel="([^"]+)"/i.exec(attrs)?.[1] || "";
    const type = /type="([^"]+)"/i.exec(attrs)?.[1] || "";
    if (rel === "alternate" && type === "text/html") parsed.html = href;
    if (rel === "related" && /pdf/i.test(type)) parsed.pdf = href;
  }
  return parsed;
}

function parseArxivFeed(xml) {
  const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/gi)].map((match) => match[1]);
  return entries.map((entryBlock) => {
    const links = extractXmlLinks(entryBlock);
    const authors = [...entryBlock.matchAll(/<author>\s*<name>([\s\S]*?)<\/name>\s*<\/author>/gi)].map((match) => normalizeWhitespace(decodeXmlEntities(match[1])));
    const idUrl = extractXmlTag(entryBlock, "id");
    const arxivId = idUrl.split("/abs/")[1]?.replace(/v\d+$/i, "") || "";
    return {
      id: arxivId,
      idUrl,
      title: normalizeWhitespace(extractXmlTag(entryBlock, "title")),
      summary: buildArxivSummary(extractXmlTag(entryBlock, "summary")),
      publishedAt: toIsoDate(extractXmlTag(entryBlock, "published")),
      updatedAt: toIsoDate(extractXmlTag(entryBlock, "updated")),
      authors,
      url: links.html || idUrl,
      pdfUrl: links.pdf || "",
    };
  });
}

async function fetchCrossrefPapers(forceRefresh = false) {
  const cacheKey = "security-research:http:crossref";
  if (!forceRefresh) {
    const cached = readMemoryCache(cacheKey);
    if (cached) return cached;
  }

  const tasks = [];
  for (const venueConfig of VENUE_CONFIGS) {
    for (const keyword of SEARCH_KEYWORDS) {
      tasks.push({ venueConfig, keyword });
    }
  }

  const results = await mapLimit(tasks, CROSSREF_CONCURRENCY, async ({ venueConfig, keyword }) => {
    const searchPhrase = `${keyword} ${venueConfig.queries[0]}`;
    const url = new URL(CROSSREF_API_BASE);
    url.searchParams.set("rows", String(CROSSREF_ROWS_PER_QUERY));
    url.searchParams.set("query.bibliographic", searchPhrase);
    url.searchParams.set("filter", `from-pub-date:${CONFERENCE_SINCE_DATE},type:proceedings-article`);
    const payload = await fetchJson(url);
    const items = Array.isArray(payload?.message?.items) ? payload.message.items : [];
    return items.map((item) => ({ item, keyword, venueConfig }));
  });

  const papers = [];
  for (const group of results.flat()) {
    const item = group.item;
    const venueText = `${(item["container-title"] || []).join(" ")} ${item.event?.name || ""}`;
    const venue = normalizeVenueLabel(venueText);
    if (!venue) continue;

    const title = normalizeWhitespace(decodeHtmlEntities((item.title || [])[0] || ""));
    if (!title) continue;
    if (isExcludedTitle(title)) continue;
    const abstractOrSummary = buildConferenceSummary(title, group.keyword, venue, item.abstract || "");
    const combinedText = `${title}\n${abstractOrSummary}`;
    if (!isResearchRelevant(combinedText)) continue;
    const projectScope = inferProjectScope(combinedText);
    const relevanceScore = scorePaper({
      title,
      summary: abstractOrSummary,
      venue,
      sourceType: "conference_paper",
      projectScope,
    });
    if (relevanceScore < 26) continue;

    const sourceUrl = item.resource?.primary?.URL || item.URL || (item.DOI ? `https://doi.org/${item.DOI}` : "");
    const paper = {
      title,
      normalizedTitle: normalizeTitle(title),
      sourceType: "conference_paper",
      projectScope,
      venue,
      sourcePrimary: "crossref",
      abstractOrSummary,
      tags: buildTags(title, abstractOrSummary, venue, projectScope, "conference_paper"),
      sourceUrl,
      authors: normalizeAuthors(item.author || []),
      externalIds: {
        doi: item.DOI || "",
        crossrefUrl: item.URL || "",
      },
      relevanceScore,
      isTopVenue: true,
      publishedAt: extractDatePart(item),
      status: "active",
      rawData: {
        keyword: group.keyword,
        venueQuery: group.venueConfig.label,
        source: item,
      },
    };
    paper.canonicalId = buildCanonicalId(paper);
    papers.push(paper);
  }

  return writeMemoryCache(cacheKey, papers);
}

async function fetchArxivPapers(forceRefresh = false) {
  const cacheKey = "security-research:http:arxiv";
  if (!forceRefresh) {
    const cached = readMemoryCache(cacheKey);
    if (cached) return cached;
  }

  const query = SEARCH_KEYWORDS.map((keyword) => `all:"${keyword}"`).join(" OR ");
  const url = new URL(ARXIV_API_BASE);
  url.searchParams.set("search_query", query);
  url.searchParams.set("start", "0");
  url.searchParams.set("max_results", String(Math.max(ARXIV_MAX_RESULTS, 12)));
  url.searchParams.set("sortBy", "submittedDate");
  url.searchParams.set("sortOrder", "descending");
  const xml = await requestText(url);
  const results = parseArxivFeed(xml).map((item) => ({ item, keyword: "combined-query" }));

  const papers = [];
  for (const group of results) {
    const item = group.item;
    if (!item.title) continue;
    const combinedText = `${item.title}\n${item.summary}`;
    if (isExcludedTitle(item.title) || !isResearchRelevant(combinedText)) continue;
    const projectScope = inferProjectScope(combinedText);
    const relevanceScore = scorePaper({
      title: item.title,
      summary: item.summary,
      venue: "arXiv",
      sourceType: "preprint",
      projectScope,
    });
    if (relevanceScore < 24) continue;

    const paper = {
      title: item.title,
      normalizedTitle: normalizeTitle(item.title),
      sourceType: "preprint",
      projectScope,
      venue: "arXiv",
      sourcePrimary: "arxiv",
      abstractOrSummary: item.summary,
      tags: buildTags(item.title, item.summary, "arXiv", projectScope, "preprint"),
      sourceUrl: item.url || item.idUrl,
      authors: item.authors,
      externalIds: {
        arxivId: item.id,
        arxivUrl: item.url || item.idUrl,
        pdfUrl: item.pdfUrl || "",
      },
      relevanceScore,
      isTopVenue: false,
      publishedAt: item.publishedAt || item.updatedAt,
      status: "active",
      rawData: {
        keyword: group.keyword,
        source: item,
      },
    };
    paper.canonicalId = buildCanonicalId(paper);
    papers.push(paper);
  }

  return writeMemoryCache(cacheKey, papers);
}

async function fetchReservedProviders() {
  return {
    dblp: {
      enabled: false,
      status: "reserved",
      note: "Reserved interface for future metadata enrichment.",
    },
    googleScholar: {
      enabled: false,
      status: "reserved",
      note: "Reserved interface for future metadata enrichment.",
    },
  };
}

function mergePapers(base, incoming) {
  const preferred = incoming.sourceType === "conference_paper" && base.sourceType !== "conference_paper" ? incoming : base;
  const alternate = preferred === base ? incoming : base;
  const mergedSummary =
    preferred.abstractOrSummary && !preferred.abstractOrSummary.includes("This summary is inferred")
      ? preferred.abstractOrSummary
      : alternate.abstractOrSummary || preferred.abstractOrSummary;
  const merged = {
    ...preferred,
    abstractOrSummary: mergedSummary,
    authors: uniqueStrings([...(base.authors || []), ...(incoming.authors || [])]),
    tags: uniqueStrings([...(base.tags || []), ...(incoming.tags || [])]),
    sourceUrl: preferred.sourceUrl || alternate.sourceUrl || "",
    publishedAt: [base.publishedAt, incoming.publishedAt].filter(Boolean).sort()[0] || "",
    relevanceScore: Math.max(Number(base.relevanceScore || 0), Number(incoming.relevanceScore || 0)),
    rawData: {
      primary: preferred.rawData,
      merged: [base.rawData, incoming.rawData],
    },
    externalIds: {
      ...(base.externalIds || {}),
      ...(incoming.externalIds || {}),
    },
  };
  merged.canonicalId = buildCanonicalId(merged);
  return merged;
}

function dedupePapers(papers) {
  const byKey = new Map();

  for (const paper of papers) {
    const keys = uniqueStrings([
      paper.externalIds?.doi,
      paper.externalIds?.arxivId,
      paper.normalizedTitle,
      paper.canonicalId,
    ]);
    const existingKey = keys.find((key) => byKey.has(key));
    if (!existingKey) {
      for (const key of keys) byKey.set(key, paper);
      continue;
    }
    const merged = mergePapers(byKey.get(existingKey), paper);
    for (const key of uniqueStrings([...keys, merged.externalIds?.doi, merged.externalIds?.arxivId, merged.normalizedTitle, merged.canonicalId])) {
      byKey.set(key, merged);
    }
  }

  const unique = new Map();
  for (const paper of byKey.values()) {
    unique.set(paper.canonicalId, paper);
  }

  return [...unique.values()].sort((left, right) => {
    const dateDiff = new Date(right.publishedAt || 0).getTime() - new Date(left.publishedAt || 0).getTime();
    if (dateDiff !== 0) return dateDiff;
    return Number(right.relevanceScore || 0) - Number(left.relevanceScore || 0);
  });
}

function buildOverview(papers, sourceMeta) {
  const conferencePapers = papers.filter((paper) => paper.sourceType === "conference_paper");
  const preprints = papers.filter((paper) => paper.sourceType === "preprint");
  const latest = [...papers].sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0)).slice(0, 8);
  const featured = [...papers]
    .sort((a, b) => {
      if (a.sourceType !== b.sourceType) return a.sourceType === "conference_paper" ? -1 : 1;
      return Number(b.relevanceScore || 0) - Number(a.relevanceScore || 0);
    })
    .slice(0, 6);

  const scopeCounts = {
    openclaw: papers.filter((paper) => paper.projectScope === "openclaw").length,
    claw: papers.filter((paper) => paper.projectScope === "claw").length,
    skill: papers.filter((paper) => paper.projectScope === "skill").length,
    agent: papers.filter((paper) => paper.projectScope === "agent").length,
    plugin: papers.filter((paper) => paper.projectScope === "plugin").length,
  };

  const venueCounts = VENUE_CONFIGS.map((config) => ({
    venue: config.venue,
    count: papers.filter((paper) => paper.venue === config.venue).length,
  })).concat([{ venue: "arXiv", count: preprints.length }]);

  return {
    totals: {
      totalPapers: papers.length,
      conferencePaperCount: conferencePapers.length,
      preprintCount: preprints.length,
      ...scopeCounts,
    },
    latest,
    featured,
    venues: venueCounts,
    sourceMeta,
  };
}

async function collectSecurityResearch({ forceRefresh = false } = {}) {
  const collectedAt = nowIso();
  const [conferenceResult, arxivResult, reservedProviders] = await Promise.all([
    fetchCrossrefPapers(forceRefresh).then((value) => ({ ok: true, value })).catch((error) => ({ ok: false, error })),
    fetchArxivPapers(forceRefresh).then((value) => ({ ok: true, value })).catch((error) => ({ ok: false, error })),
    fetchReservedProviders(),
  ]);

  const papers = dedupePapers([
    ...(conferenceResult.ok ? conferenceResult.value : []),
    ...(arxivResult.ok ? arxivResult.value : []),
  ]);

  const sourceMeta = {
    collectedAt,
    lastSyncedAt: formatDateTime(collectedAt),
    keywords: SEARCH_KEYWORDS,
    conferenceWhitelist: VENUE_CONFIGS.map((item) => item.venue),
    providers: {
      crossref: {
        ok: conferenceResult.ok,
        error: conferenceResult.ok ? "" : conferenceResult.error?.message || "Crossref fetch failed",
        count: conferenceResult.ok ? conferenceResult.value.length : 0,
      },
      arxiv: {
        ok: arxivResult.ok,
        error: arxivResult.ok ? "" : arxivResult.error?.message || "arXiv fetch failed",
        count: arxivResult.ok ? arxivResult.value.length : 0,
      },
      ...reservedProviders,
    },
  };

  return {
    papers,
    overview: buildOverview(papers, sourceMeta),
    sourceMeta,
    raw: {
      conferencePapers: conferenceResult.ok ? conferenceResult.value : [],
      preprints: arxivResult.ok ? arxivResult.value : [],
    },
  };
}

async function persistSnapshot(aggregate, triggerSource = "manual") {
  await ensureResearchTables();
  const snapshotTime = new Date();
  const snapshotKey = createSnapshotKey(snapshotTime);
  const snapshotCacheDir = path.join(cacheRoot, "snapshots", snapshotKey);
  await ensureDir(snapshotCacheDir);

  await Promise.all([
    writeJsonFile(path.join(snapshotCacheDir, "overview.json"), aggregate.overview),
    writeJsonFile(path.join(snapshotCacheDir, "papers.json"), aggregate.papers),
    writeJsonFile(path.join(snapshotCacheDir, "source-meta.json"), aggregate.sourceMeta),
  ]);

  const snapshot = await prisma.securityResearchSnapshot.create({
    data: {
      snapshotKey,
      triggerSource,
      status: "completed",
      totalPapers: aggregate.overview.totals.totalPapers,
      conferencePaperCount: aggregate.overview.totals.conferencePaperCount,
      preprintCount: aggregate.overview.totals.preprintCount,
      openclawCount: aggregate.overview.totals.openclaw,
      clawCount: aggregate.overview.totals.claw,
      skillCount: aggregate.overview.totals.skill,
      agentCount: aggregate.overview.totals.agent,
      pluginCount: aggregate.overview.totals.plugin,
      sourceMeta: aggregate.sourceMeta,
      cacheDir: snapshotCacheDir,
    },
  });

  if (aggregate.papers.length) {
    await prisma.securityResearchPaper.createMany({
      data: aggregate.papers.map((paper) => ({ snapshotId: snapshot.id, ...serializePaperForDb(paper) })),
    });
  }

  return snapshot;
}

async function getLatestCompletedSnapshotBase() {
  return prisma.securityResearchSnapshot.findFirst({
    where: { status: "completed" },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
  });
}

async function refreshSecurityResearchData({ triggerSource = "manual", force = false } = {}) {
  if (activeRefreshPromise) return activeRefreshPromise;

  activeRefreshPromise = (async () => {
    latestRefreshState = { ...latestRefreshState, status: "running", lastAttemptAt: nowIso(), lastError: "" };
    try {
      const aggregate = await collectSecurityResearch({ forceRefresh: force || triggerSource !== "scheduled" });
      if (!aggregate.papers.length) {
        throw new Error("No research papers were collected; refusing to persist an empty snapshot.");
      }
      const snapshot = await persistSnapshot(aggregate, triggerSource);
      clearMemoryCache();
      latestRefreshState = {
        status: "ok",
        lastAttemptAt: latestRefreshState.lastAttemptAt,
        lastCompletedAt: snapshot.createdAt.toISOString(),
        lastError: "",
      };
      return snapshot;
    } catch (error) {
      latestRefreshState = {
        status: "error",
        lastAttemptAt: latestRefreshState.lastAttemptAt,
        lastCompletedAt: latestRefreshState.lastCompletedAt,
        lastError: error.message || "refresh failed",
      };
      throw error;
    } finally {
      activeRefreshPromise = null;
    }
  })();

  return activeRefreshPromise;
}

async function ensureLatestSnapshotAvailable({ allowRefresh = true } = {}) {
  const cacheKey = "security-research:db:latest-snapshot";
  const cached = readMemoryCache(cacheKey);
  if (cached) return cached;

  let latest = await getLatestCompletedSnapshotBase();
  if (!latest && allowRefresh) {
    await refreshSecurityResearchData({ triggerSource: "bootstrap", force: true });
    latest = await getLatestCompletedSnapshotBase();
  }

  return latest ? writeMemoryCache(cacheKey, latest) : null;
}

async function getStoredOverview() {
  const cacheKey = "security-research:db:overview";
  const cached = readMemoryCache(cacheKey);
  if (cached) return cached;

  const snapshot = await ensureLatestSnapshotAvailable({ allowRefresh: true });
  if (!snapshot) {
    return {
      totals: {
        totalPapers: 0,
        conferencePaperCount: 0,
        preprintCount: 0,
        openclaw: 0,
        claw: 0,
        skill: 0,
        agent: 0,
        plugin: 0,
      },
      latest: [],
      featured: [],
      venues: VENUE_CONFIGS.map((item) => ({ venue: item.venue, count: 0 })).concat([{ venue: "arXiv", count: 0 }]),
      sourceMeta: {
        collectedAt: "",
        lastSyncedAt: "",
        keywords: SEARCH_KEYWORDS,
        conferenceWhitelist: VENUE_CONFIGS.map((item) => item.venue),
        providers: {},
        scheduler: {
          intervalMs: WEEKLY_REFRESH_MS,
          intervalDays: Number((WEEKLY_REFRESH_MS / 86400000).toFixed(2)),
          ...latestRefreshState,
        },
        storage: { cacheRoot, snapshotId: null, snapshotKey: "" },
      },
    };
  }

  const [latestRows, featuredRows, allVenues] = await Promise.all([
    prisma.securityResearchPaper.findMany({
      where: { snapshotId: snapshot.id },
      orderBy: [{ publishedAt: "desc" }, { relevanceScore: "desc" }],
      take: 8,
    }),
    prisma.securityResearchPaper.findMany({
      where: { snapshotId: snapshot.id },
      orderBy: [{ isTopVenue: "desc" }, { relevanceScore: "desc" }, { publishedAt: "desc" }],
      take: 6,
    }),
    prisma.securityResearchPaper.groupBy({
      by: ["venue"],
      where: { snapshotId: snapshot.id },
      _count: { venue: true },
    }),
  ]);

  const payload = {
    totals: {
      totalPapers: snapshot.totalPapers,
      conferencePaperCount: snapshot.conferencePaperCount,
      preprintCount: snapshot.preprintCount,
      openclaw: snapshot.openclawCount,
      claw: snapshot.clawCount,
      skill: snapshot.skillCount,
      agent: snapshot.agentCount,
      plugin: snapshot.pluginCount,
    },
    latest: latestRows.map(toPublicPaper),
    featured: featuredRows.map(toPublicPaper),
    venues: allVenues
      .map((item) => ({ venue: item.venue, count: item._count.venue }))
      .sort((left, right) => right.count - left.count),
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
      storage: {
        cacheRoot,
        snapshotId: snapshot.id,
        snapshotKey: snapshot.snapshotKey,
        cacheDir: snapshot.cacheDir || "",
      },
    },
  };

  return writeMemoryCache(cacheKey, payload);
}

async function getStoredPapers(query = {}) {
  const snapshot = await ensureLatestSnapshotAvailable({ allowRefresh: true });
  if (!snapshot) {
    return { total: 0, page: 1, page_size: 20, rows: [], sourceMeta: { scheduler: latestRefreshState } };
  }

  const page = Math.max(1, Number(query.page || 1));
  const pageSize = Math.max(1, Math.min(100, Number(query.page_size || query.pageSize || 20)));
  const sourceType = String(query.source_type || query.sourceType || "").trim().toLowerCase();
  const venue = String(query.venue || "").trim();
  const projectScope = String(query.project_scope || query.projectScope || "").trim().toLowerCase();
  const keyword = String(query.keyword || "").trim();
  const sort = String(query.sort || "published_desc").trim().toLowerCase();
  const where = { snapshotId: snapshot.id };

  if (sourceType) where.sourceType = sourceType;
  if (venue) where.venue = venue;
  if (projectScope) where.projectScope = projectScope;
  if (keyword) {
    where.OR = [
      { title: { contains: keyword } },
      { abstractOrSummary: { contains: keyword } },
      { sourceSearch: { contains: keyword.toLowerCase() } },
    ];
  }

  let orderBy = [{ publishedAt: "desc" }, { relevanceScore: "desc" }];
  if (sort === "published_asc") orderBy = [{ publishedAt: "asc" }, { relevanceScore: "desc" }];
  if (sort === "relevance_desc") orderBy = [{ isTopVenue: "desc" }, { relevanceScore: "desc" }, { publishedAt: "desc" }];

  const [total, rows, venues, scopes] = await Promise.all([
    prisma.securityResearchPaper.count({ where }),
    prisma.securityResearchPaper.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.securityResearchPaper.findMany({
      where: { snapshotId: snapshot.id },
      distinct: ["venue"],
      select: { venue: true },
      orderBy: { venue: "asc" },
    }),
    prisma.securityResearchPaper.findMany({
      where: { snapshotId: snapshot.id },
      distinct: ["projectScope"],
      select: { projectScope: true },
      orderBy: { projectScope: "asc" },
    }),
  ]);

  return {
    total,
    page,
    page_size: pageSize,
    rows: rows.map(toPublicPaper),
    filterOptions: {
      venues: venues.map((item) => item.venue).filter(Boolean),
      projectScopes: scopes.map((item) => item.projectScope).filter(Boolean),
      sourceTypes: ["conference_paper", "preprint"],
      sortOptions: ["published_desc", "published_asc", "relevance_desc"],
    },
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
      storage: {
        cacheRoot,
        snapshotId: snapshot.id,
        snapshotKey: snapshot.snapshotKey,
        cacheDir: snapshot.cacheDir || "",
      },
    },
  };
}

async function refreshIfDue(triggerSource = "scheduled-check") {
  const latest = await getLatestCompletedSnapshotBase();
  if (!latest) {
    await refreshSecurityResearchData({ triggerSource, force: true });
    return;
  }
  if (Date.now() - new Date(latest.createdAt).getTime() >= WEEKLY_REFRESH_MS) {
    await refreshSecurityResearchData({ triggerSource });
  }
}

export function initializeSecurityResearchScheduler() {
  if (schedulerStarted) return;
  schedulerStarted = true;

  void ensureDir(cacheRoot)
    .then(() => refreshIfDue("startup"))
    .catch((error) => {
      latestRefreshState = { ...latestRefreshState, status: "error", lastAttemptAt: nowIso(), lastError: error.message || "startup refresh failed" };
      console.error(`[security-research] startup initialization failed: ${error.message}`);
    });

  const timer = setInterval(() => {
    void refreshIfDue("scheduled").catch((error) => {
      latestRefreshState = { ...latestRefreshState, status: "error", lastAttemptAt: nowIso(), lastError: error.message || "scheduled refresh failed" };
      console.error(`[security-research] scheduled refresh failed: ${error.message}`);
    });
  }, REFRESH_CHECK_MS);

  if (typeof timer.unref === "function") timer.unref();
}

export async function getSecurityResearchOverview(query = {}) {
  const forceRefresh = query.refresh === "1" || query.refresh === "true";
  if (forceRefresh) await refreshSecurityResearchData({ triggerSource: "manual", force: true });
  return getStoredOverview();
}

export async function getSecurityResearchPapers(query = {}) {
  const forceRefresh = query.refresh === "1" || query.refresh === "true";
  if (forceRefresh) await refreshSecurityResearchData({ triggerSource: "manual", force: true });
  return getStoredPapers(query);
}

export async function triggerSecurityResearchRefresh(triggerSource = "manual") {
  const snapshot = await refreshSecurityResearchData({ triggerSource, force: true });
  return {
    ok: true,
    snapshotId: snapshot.id,
    snapshotKey: snapshot.snapshotKey,
    createdAt: snapshot.createdAt.toISOString(),
  };
}
