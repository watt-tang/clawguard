import "dotenv/config";
import crypto from "node:crypto";
import fs from "node:fs";
import fsp from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { prisma } from "../lib/prisma.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const WEB_ROOT = path.resolve(__dirname, "..", "..");
const REPO_ROOT = path.resolve(WEB_ROOT, "..");
const CACHE_ROOT = process.env.SKILL_SCAN_CACHE_DIR || path.resolve(REPO_ROOT, "..", "clawguard-cache", "skill-static-scan");
const MAX_CACHE_REPOS = Number(process.env.SKILL_SCAN_CACHE_MAX_REPOS || 100);
const DEFAULT_CONCURRENCY = Number(process.env.SKILL_SCAN_CONCURRENCY || 4);
const REPO_VENV_PYTHON_WINDOWS = path.resolve(REPO_ROOT, ".venv-skill-scan", "Scripts", "python.exe");
const REPO_VENV_PYTHON_POSIX = path.resolve(REPO_ROOT, ".venv-skill-scan", "bin", "python");
const SCANNER1_SCRIPT = path.resolve(REPO_ROOT, "scanners", "scanner1", "scripts", "scan_skill.py");
const SCANNER2_SCRIPT = path.resolve(REPO_ROOT, "scanners", "scanner2", "unified_cli.py");
const PYTHON_CANDIDATES = [
  [REPO_VENV_PYTHON_WINDOWS, []],
  [REPO_VENV_PYTHON_POSIX, []],
  ["py", ["-3"]],
  ["python3", []],
  ["python", []],
];
const HIGH_SEVERITIES = new Set(["HIGH", "CRITICAL"]);
const RETRYABLE_ERROR_PATTERNS = [
  /timed out/i,
  /connection was reset/i,
  /empty reply from server/i,
  /recv failure/i,
  /failed to connect/i,
  /http\/2 stream/i,
  /early eof/i,
  /connection.*closed/i,
];
const INVALID_REPO_OWNERS = new Set([
  "api",
  "orgs",
  "users",
  "settings",
  "marketplace",
  "explore",
  "features",
  "topics",
  "collections",
  "search",
]);

function parseArgs(argv) {
  const options = {
    batchId: null,
    createBatch: false,
    concurrency: DEFAULT_CONCURRENCY,
    cacheMaxRepos: MAX_CACHE_REPOS,
    limitRepos: null,
  };

  for (let index = 2; index < argv.length; index += 1) {
    const current = argv[index];
    const next = argv[index + 1];

    if (current === "--batch-id") {
      options.batchId = Number(next);
      index += 1;
      continue;
    }
    if (current === "--create-batch") {
      options.createBatch = true;
      continue;
    }
    if (current === "--concurrency") {
      options.concurrency = Number(next) || DEFAULT_CONCURRENCY;
      index += 1;
      continue;
    }
    if (current === "--cache-max-repos") {
      options.cacheMaxRepos = Number(next) || MAX_CACHE_REPOS;
      index += 1;
      continue;
    }
    if (current === "--limit-repos") {
      options.limitRepos = Number(next) || null;
      index += 1;
      continue;
    }
    throw new Error(`Unknown argument: ${current}`);
  }

  options.concurrency = Math.max(1, options.concurrency);
  options.cacheMaxRepos = Math.max(10, options.cacheMaxRepos);
  return options;
}

function log(message) {
  console.log(`[skill-static-scan] ${new Date().toISOString()} ${message}`);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function ensureDir(dirPath) {
  await fsp.mkdir(dirPath, { recursive: true });
}

function repoSlugFromUrl(repositoryUrl) {
  try {
    const url = new URL(repositoryUrl);
    const base = path.basename(url.pathname).replace(/\.git$/i, "") || "repo";
    return base.replace(/[^a-zA-Z0-9._-]+/g, "-");
  } catch {
    return "repo";
  }
}

function repoHash(repositoryUrl) {
  return crypto.createHash("sha1").update(repositoryUrl).digest("hex").slice(0, 12);
}

function getRepoCachePath(repositoryUrl) {
  return path.join(CACHE_ROOT, `${repoHash(repositoryUrl)}-${repoSlugFromUrl(repositoryUrl)}`);
}

function parseGitHubRepositoryUrl(repositoryUrl) {
  try {
    const url = new URL(repositoryUrl);
    if (!/github\.com$/i.test(url.hostname)) {
      return { valid: false, reason: `unsupported host: ${url.hostname}` };
    }
    const parts = url.pathname.split("/").filter(Boolean);
    if (parts.length < 2) {
      return { valid: false, reason: "repository path is incomplete" };
    }
    const [owner, repo] = parts;
    if (INVALID_REPO_OWNERS.has(String(owner).toLowerCase())) {
      return { valid: false, reason: `invalid repository owner segment: ${owner}` };
    }
    if (!repo || repo.endsWith(".html")) {
      return { valid: false, reason: `invalid repository segment: ${repo || "missing repo"}` };
    }
    return { valid: true, owner, repo: repo.replace(/\.git$/i, "") };
  } catch {
    return { valid: false, reason: "repositoryUrl is not a valid URL" };
  }
}

function isRetryableErrorMessage(message) {
  return RETRYABLE_ERROR_PATTERNS.some((pattern) => pattern.test(message));
}

async function retryOperation(run, options = {}) {
  const {
    attempts = 3,
    baseDelayMs = 1500,
    shouldRetry = (error) => isRetryableErrorMessage(error.message || ""),
  } = options;

  let lastError = null;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await run(attempt);
    } catch (error) {
      lastError = error;
      if (attempt >= attempts || !shouldRetry(error)) {
        throw error;
      }
      await sleep(baseDelayMs * attempt);
    }
  }
  throw lastError;
}

async function runProcess(command, args, options = {}) {
  const { cwd = REPO_ROOT, env = process.env, timeoutMs = 300000 } = options;

  return await new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      env,
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true,
    });

    let stdout = "";
    let stderr = "";
    let timedOut = false;

    const timeout = setTimeout(() => {
      timedOut = true;
      child.kill("SIGKILL");
    }, timeoutMs);

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", (error) => {
      clearTimeout(timeout);
      reject(error);
    });

    child.on("close", (code) => {
      clearTimeout(timeout);
      if (timedOut) {
        reject(new Error(`Process timed out after ${timeoutMs}ms`));
        return;
      }
      if (code !== 0) {
        reject(new Error(stderr.trim() || stdout.trim() || `Process exited with code ${code}`));
        return;
      }
      resolve({ stdout, stderr });
    });
  });
}

async function runPythonScript(scriptPath, scriptArgs, options = {}) {
  let lastError = null;
  const env = {
    ...process.env,
    PYTHONIOENCODING: "utf-8",
    PYTHONUTF8: "1",
    ...(options.env || {}),
  };
  for (const [pythonPath, prefixArgs] of PYTHON_CANDIDATES) {
    try {
      if (path.isAbsolute(pythonPath)) {
        await fsp.access(pythonPath);
      }
      return await runProcess(pythonPath, [...prefixArgs, scriptPath, ...scriptArgs], {
        ...options,
        env,
      });
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error(`Unable to run Python script: ${scriptPath}`);
}

function normalizeScanner1Report(report) {
  const findings = Array.isArray(report?.findings) ? report.findings : [];
  const severityCounts = report?.summary?.by_severity || {};
  const maxSeverity = ["CRITICAL", "HIGH", "MEDIUM", "LOW"].find((severity) => Number(severityCounts[severity] || 0) > 0) || "SAFE";
  const findingCount = Number(report?.summary?.total_findings || findings.length || 0);
  const highFindings = findings.filter((item) => HIGH_SEVERITIES.has(String(item?.severity || "").toUpperCase()));
  const danger = highFindings.length > 0;

  return {
    scanner: "scanner1",
    danger,
    maxSeverity,
    findingCount,
    rawFindingCount: findingCount,
    conclusion: danger
      ? "manual_review_required"
      : maxSeverity === "MEDIUM"
        ? "review_recommended"
        : maxSeverity === "LOW"
          ? "allow_with_caution"
          : "clear",
    riskSourceText: danger
      ? highFindings
          .slice(0, 3)
          .map((item) => `scanner1: ${item.message} @ ${item.file || "unknown file"}`)
          .join(" | ")
      : maxSeverity === "SAFE"
        ? "no high-risk findings detected by static scanners"
        : `no high-risk findings; maxSeverity=${maxSeverity}; findings=${findingCount}`,
    compactReport: {
      scanner: "scanner1",
      summary: report?.summary || {},
      topFindings: findings.slice(0, 8),
    },
  };
}

function normalizeScanner2Report(report, fallback) {
  const findings = Array.isArray(report?.findings) ? report.findings : [];
  const summary = report?.summary || {};
  const maxSeverity = String(summary.max_severity || fallback.maxSeverity || "UNKNOWN").toUpperCase();
  const conclusion = String(summary.overall_conclusion || fallback.conclusion || "manual_review_required");
  const highFindings = findings.filter((item) => HIGH_SEVERITIES.has(String(item?.severity || "").toUpperCase()));
  const danger = highFindings.length > 0 || HIGH_SEVERITIES.has(maxSeverity);
  const findingCount = Number(summary.deduplicated_finding_count || findings.length || 0);
  const rawFindingCount = Number(summary.raw_finding_count || findingCount);

  return {
    scanner: "scanner1,scanner2",
    danger,
    maxSeverity,
    findingCount,
    rawFindingCount,
    conclusion,
    riskSourceText: danger
      ? highFindings
          .slice(0, 3)
          .map((item) => `scanner2: ${item.title || item.description || item.category || "high-risk finding"} @ ${item.file_path || "unknown file"}`)
          .join(" | ") || fallback.riskSourceText
      : fallback.riskSourceText,
    compactReport: {
      scanner: "scanner2",
      summary,
      topFindings: findings.slice(0, 8),
    },
  };
}

async function scanRepository(repoPath) {
  const scanner1Run = await retryOperation(
    async () => runPythonScript(SCANNER1_SCRIPT, [repoPath], {
      cwd: REPO_ROOT,
      timeoutMs: 420000,
    }),
    { attempts: 2 },
  );
  const scanner1Report = JSON.parse(scanner1Run.stdout);
  const scanner1Result = normalizeScanner1Report(scanner1Report);

  if (!scanner1Result.danger) {
    return scanner1Result;
  }

  try {
    const scanner2Run = await runPythonScript(
      SCANNER2_SCRIPT,
      [repoPath, "--auth-state", "guest", "--enable-scanner", "scanner2"],
      {
        cwd: REPO_ROOT,
        timeoutMs: 420000,
      },
    );
    const scanner2Report = JSON.parse(scanner2Run.stdout);
    return normalizeScanner2Report(scanner2Report, scanner1Result);
  } catch (error) {
    return {
      ...scanner1Result,
      scanner: "scanner1",
      riskSourceText: `${scanner1Result.riskSourceText} | scanner2 upgrade failed: ${error.message}`,
      compactReport: {
        ...scanner1Result.compactReport,
        scanner2Error: error.message,
      },
    };
  }
}

async function touchDirectory(dirPath) {
  const now = new Date();
  try {
    await fsp.utimes(dirPath, now, now);
  } catch {
    // ignore
  }
}

async function resolveSkillTargetPath(repoCachePath) {
  const rootSkillPath = path.join(repoCachePath, "SKILL.md");
  if (fs.existsSync(rootSkillPath)) {
    return repoCachePath;
  }

  const matches = [];
  async function walk(currentPath) {
    const entries = await fsp.readdir(currentPath, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === ".git" || entry.name === "node_modules") continue;
        await walk(fullPath);
        if (matches.length) return;
        continue;
      }
      if (entry.isFile() && entry.name === "SKILL.md") {
        matches.push(currentPath);
        return;
      }
    }
  }

  await walk(repoCachePath);
  return matches[0] || null;
}

async function pruneCacheDirs(maxRepos, activePaths) {
  await ensureDir(CACHE_ROOT);
  const entries = await fsp.readdir(CACHE_ROOT, { withFileTypes: true });
  const directories = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const fullPath = path.join(CACHE_ROOT, entry.name);
    if (activePaths.has(fullPath)) continue;
    try {
      const stats = await fsp.stat(fullPath);
      directories.push({ fullPath, mtimeMs: stats.mtimeMs });
    } catch {
      // ignore vanished dirs
    }
  }

  const currentEntries = entries.filter((entry) => entry.isDirectory()).length;
  const allowedInactive = Math.max(0, maxRepos - activePaths.size);
  if (currentEntries <= maxRepos && directories.length <= allowedInactive) {
    return;
  }

  directories.sort((left, right) => left.mtimeMs - right.mtimeMs);
  while (directories.length > allowedInactive) {
    const candidate = directories.shift();
    if (!candidate) break;
    await fsp.rm(candidate.fullPath, { recursive: true, force: true });
  }
}

async function ensureRepoClone(repositoryUrl, activePaths, maxRepos) {
  await ensureDir(CACHE_ROOT);
  const cachePath = getRepoCachePath(repositoryUrl);
  activePaths.add(cachePath);
  await pruneCacheDirs(maxRepos, activePaths);

  if (fs.existsSync(path.join(cachePath, ".git"))) {
    await touchDirectory(cachePath);
    return cachePath;
  }

  await fsp.rm(cachePath, { recursive: true, force: true });
  const env = {
    ...process.env,
    GIT_TERMINAL_PROMPT: "0",
  };

  await retryOperation(
    async () => runProcess(
      "git",
      [
        "-c",
        "core.longpaths=true",
        "clone",
        "--depth",
        "1",
        "--single-branch",
        repositoryUrl,
        cachePath,
      ],
      {
        cwd: CACHE_ROOT,
        env,
        timeoutMs: 420000,
      },
    ),
    { attempts: 3 },
  );

  await touchDirectory(cachePath);
  return cachePath;
}

async function getOrCreateBatch(options) {
  if (options.batchId) {
    const rows = await prisma.$queryRawUnsafe(
      "SELECT id, importBatchId, totalSkills, completedSkills, failedSkills, skippedSkills, completedAt FROM skillstaticscanbatch WHERE id = ? LIMIT 1",
      options.batchId,
    );
    if (!rows.length) {
      throw new Error(`Batch ${options.batchId} not found`);
    }
    return rows[0];
  }

  if (!options.createBatch) {
    const rows = await prisma.$queryRawUnsafe(
      "SELECT id, importBatchId, totalSkills, completedSkills, failedSkills, skippedSkills, completedAt FROM skillstaticscanbatch WHERE completedAt IS NULL ORDER BY id DESC LIMIT 1",
    );
    if (rows.length) {
      return rows[0];
    }
  }

  const importBatchRows = await prisma.$queryRawUnsafe(
    "SELECT id FROM skillimportbatch ORDER BY id DESC LIMIT 1",
  );
  const totalRows = await prisma.$queryRawUnsafe("SELECT COUNT(*) AS totalSkills FROM skillrecord");
  const totalSkills = Number(totalRows[0]?.totalSkills || 0);

  await prisma.$executeRawUnsafe(
    "INSERT INTO skillstaticscanbatch (importBatchId, mode, authState, scannerIdsText, totalSkills, completedSkills, failedSkills, skippedSkills, startedAt, createdAt, updatedAt) VALUES (?, 'static', 'guest', 'scanner1,scanner2', ?, 0, 0, 0, NOW(3), NOW(3), NOW(3))",
    importBatchRows[0]?.id || null,
    totalSkills,
  );
  const insertedRows = await prisma.$queryRawUnsafe("SELECT LAST_INSERT_ID() AS id");
  const insertedId = Number(insertedRows[0]?.id || 0);
  return {
    id: insertedId,
    importBatchId: importBatchRows[0]?.id || null,
    totalSkills,
    completedSkills: 0,
    failedSkills: 0,
    skippedSkills: 0,
    completedAt: null,
  };
}

async function getPendingGroups(batchId, limitRepos = null) {
  const rows = await prisma.$queryRawUnsafe(
    `
      SELECT s.id, s.repositoryUrl, s.name
      FROM skillrecord s
      LEFT JOIN skillstaticscanresult r
        ON r.batchId = ? AND r.skillId = s.id
      WHERE r.id IS NULL
        AND s.repositoryUrl IS NOT NULL
        AND s.repositoryUrl <> ''
      ORDER BY s.repositoryUrl, s.id
    `,
    batchId,
  );

  const groups = [];
  let current = null;
  for (const row of rows) {
    if (!current || current.repositoryUrl !== row.repositoryUrl) {
      if (!limitRepos || groups.length < limitRepos) {
        current = {
          repositoryUrl: row.repositoryUrl,
          skillIds: [],
          skillNames: [],
        };
        groups.push(current);
      } else {
        current = null;
      }
    }
    if (!current || current.repositoryUrl !== row.repositoryUrl) {
      continue;
    }
    current.skillIds.push(Number(row.id));
    current.skillNames.push(row.name);
  }

  return groups;
}

async function getExistingRepoResultMap(batchId) {
  const rows = await prisma.$queryRawUnsafe(
    `
      SELECT r.repositoryUrl, r.scannedTargetPath, r.repoCachePath, r.matchedStrategy, r.status, r.maxSeverity,
             r.conclusion, r.findingCount, r.rawFindingCount, r.scannerRunsText, r.rawReportJson,
             r.errorMessage, r.riskLabel, r.riskSourceText
      FROM skillstaticscanresult r
      INNER JOIN (
        SELECT repositoryUrl, MIN(id) AS minId
        FROM skillstaticscanresult
        WHERE batchId = ?
        GROUP BY repositoryUrl
      ) t ON t.minId = r.id
    `,
    batchId,
  );

  const map = new Map();
  for (const row of rows) {
    map.set(row.repositoryUrl, {
      scannedTargetPath: row.scannedTargetPath,
      repoCachePath: row.repoCachePath,
      matchedStrategy: row.matchedStrategy,
      status: row.status,
      maxSeverity: row.maxSeverity,
      conclusion: row.conclusion,
      findingCount: Number(row.findingCount || 0),
      rawFindingCount: Number(row.rawFindingCount || 0),
      scannerRunsText: row.scannerRunsText,
      rawReportJson: row.rawReportJson,
      errorMessage: row.errorMessage,
      riskLabel: row.riskLabel,
      riskSourceText: row.riskSourceText,
    });
  }
  return map;
}

async function insertBatchResults(batchId, repositoryUrl, skillIds, result) {
  if (!skillIds.length) return;

  const now = new Date();
  const placeholders = [];
  const values = [];
  for (const skillId of skillIds) {
    placeholders.push("(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    values.push(
      batchId,
      skillId,
      repositoryUrl,
      result.scannedTargetPath || null,
      result.repoCachePath || null,
      result.matchedStrategy || "repositoryUrl",
      result.status,
      result.maxSeverity || null,
      result.conclusion || null,
      result.findingCount || 0,
      result.rawFindingCount || 0,
      result.scannerRunsText || null,
      result.rawReportJson ? JSON.stringify(result.rawReportJson) : null,
      result.errorMessage || null,
      result.riskLabel || null,
      result.riskSourceText || null,
      now,
      now,
    );
  }

  const query = `
    INSERT INTO skillstaticscanresult (
      batchId, skillId, repositoryUrl, scannedTargetPath, repoCachePath, matchedStrategy,
      status, maxSeverity, conclusion, findingCount, rawFindingCount, scannerRunsText,
      rawReportJson, errorMessage, riskLabel, riskSourceText, scannedAt, updatedAt
    )
    VALUES ${placeholders.join(", ")}
    ON DUPLICATE KEY UPDATE
      scannedTargetPath = VALUES(scannedTargetPath),
      repoCachePath = VALUES(repoCachePath),
      matchedStrategy = VALUES(matchedStrategy),
      status = VALUES(status),
      maxSeverity = VALUES(maxSeverity),
      conclusion = VALUES(conclusion),
      findingCount = VALUES(findingCount),
      rawFindingCount = VALUES(rawFindingCount),
      scannerRunsText = VALUES(scannerRunsText),
      rawReportJson = VALUES(rawReportJson),
      errorMessage = VALUES(errorMessage),
      riskLabel = VALUES(riskLabel),
      riskSourceText = VALUES(riskSourceText),
      scannedAt = VALUES(scannedAt),
      updatedAt = VALUES(updatedAt)
  `;

  await prisma.$executeRawUnsafe(query, ...values);
}

async function updateBatchProgress(batchId, completedSkills, failedSkills, skippedSkills) {
  await prisma.$executeRawUnsafe(
    "UPDATE skillstaticscanbatch SET completedSkills = ?, failedSkills = ?, skippedSkills = ?, updatedAt = NOW(3) WHERE id = ?",
    completedSkills,
    failedSkills,
    skippedSkills,
    batchId,
  );
}

async function finalizeBatch(batchId) {
  await prisma.$executeRawUnsafe(
    "UPDATE skillstaticscanbatch SET completedAt = NOW(3), updatedAt = NOW(3) WHERE id = ?",
    batchId,
  );
}

function buildStoredResult(scanResult, repositoryUrl, repoCachePath) {
  return {
    scannedTargetPath: repoCachePath,
    repoCachePath,
    matchedStrategy: "repositoryUrl",
    status: "completed",
    maxSeverity: scanResult.maxSeverity,
    conclusion: scanResult.conclusion,
    findingCount: scanResult.findingCount,
    rawFindingCount: scanResult.rawFindingCount,
    scannerRunsText: scanResult.scanner,
    rawReportJson: scanResult.compactReport,
    errorMessage: null,
    riskLabel: scanResult.danger ? "dangerous" : "safe",
    riskSourceText: scanResult.riskSourceText,
    repositoryUrl,
  };
}

function buildFailedResult(repositoryUrl, repoCachePath, error) {
  return {
    scannedTargetPath: repoCachePath || null,
    repoCachePath: repoCachePath || null,
    matchedStrategy: "repositoryUrl",
    status: "failed",
    maxSeverity: "UNKNOWN",
    conclusion: "manual_review_required",
    findingCount: 0,
    rawFindingCount: 0,
    scannerRunsText: "scanner1",
    rawReportJson: {
      scanner: "scanner1",
      error: error.message,
    },
    errorMessage: error.message,
    riskLabel: "dangerous",
    riskSourceText: `scan failed: ${error.message}`,
    repositoryUrl,
  };
}

function buildSkippedResult(repositoryUrl, repoCachePath, reason) {
  return {
    scannedTargetPath: repoCachePath || null,
    repoCachePath: repoCachePath || null,
    matchedStrategy: "repositoryUrl",
    status: "skipped",
    maxSeverity: null,
    conclusion: "skipped",
    findingCount: 0,
    rawFindingCount: 0,
    scannerRunsText: null,
    rawReportJson: {
      skipped: true,
      reason,
    },
    errorMessage: null,
    riskLabel: null,
    riskSourceText: reason,
    repositoryUrl,
  };
}

async function main() {
  const options = parseArgs(process.argv);
  await ensureDir(CACHE_ROOT);

  const batch = await getOrCreateBatch(options);
  const batchId = Number(batch.id);
  const pendingGroups = await getPendingGroups(batchId, options.limitRepos);
  const existingRepoResults = await getExistingRepoResultMap(batchId);

  let completedSkills = Number(batch.completedSkills || 0);
  let failedSkills = Number(batch.failedSkills || 0);
  let skippedSkills = Number(batch.skippedSkills || 0);
  const totalPendingSkills = pendingGroups.reduce((sum, group) => sum + group.skillIds.length, 0);
  let processedRepos = 0;
  let processedSkills = 0;
  const activePaths = new Set();

  log(
    `resuming batch=${batchId} pendingRepos=${pendingGroups.length} pendingSkills=${totalPendingSkills} ` +
    `concurrency=${options.concurrency} cacheRoot=${CACHE_ROOT}`,
  );

  const queue = [...pendingGroups];
  const workers = Array.from({ length: Math.min(options.concurrency, queue.length || 1) }, async (_, workerIndex) => {
    while (queue.length) {
      const group = queue.shift();
      if (!group) return;

      if (existingRepoResults.has(group.repositoryUrl)) {
        const existing = existingRepoResults.get(group.repositoryUrl);
        await insertBatchResults(batchId, group.repositoryUrl, group.skillIds, existing);
        if (existing.status === "completed") {
          completedSkills += group.skillIds.length;
        } else if (existing.status === "skipped") {
          skippedSkills += group.skillIds.length;
        } else {
          failedSkills += group.skillIds.length;
        }
        processedRepos += 1;
        processedSkills += group.skillIds.length;
        await updateBatchProgress(batchId, completedSkills, failedSkills, skippedSkills);
        log(
          `worker=${workerIndex + 1} repo=${processedRepos}/${pendingGroups.length} ` +
          `skills=${processedSkills}/${totalPendingSkills} reused previous repo result ${group.repositoryUrl}`,
        );
        continue;
      }

      let repoCachePath = null;
      try {
        const parsedRepo = parseGitHubRepositoryUrl(group.repositoryUrl);
        if (!parsedRepo.valid) {
          const skippedResult = buildSkippedResult(group.repositoryUrl, null, `skipped invalid repositoryUrl: ${parsedRepo.reason}`);
          await insertBatchResults(batchId, group.repositoryUrl, group.skillIds, skippedResult);
          existingRepoResults.set(group.repositoryUrl, skippedResult);
          skippedSkills += group.skillIds.length;
          processedRepos += 1;
          processedSkills += group.skillIds.length;
          await updateBatchProgress(batchId, completedSkills, failedSkills, skippedSkills);
          log(
            `worker=${workerIndex + 1} repo=${processedRepos}/${pendingGroups.length} ` +
            `skills=${processedSkills}/${totalPendingSkills} skipped ${group.repositoryUrl}: ${parsedRepo.reason}`,
          );
          continue;
        }

        repoCachePath = await ensureRepoClone(group.repositoryUrl, activePaths, options.cacheMaxRepos);
        const skillTargetPath = await resolveSkillTargetPath(repoCachePath);
        if (!skillTargetPath) {
          const skippedResult = buildSkippedResult(group.repositoryUrl, repoCachePath, "skipped repository without SKILL.md");
          await insertBatchResults(batchId, group.repositoryUrl, group.skillIds, skippedResult);
          existingRepoResults.set(group.repositoryUrl, skippedResult);
          skippedSkills += group.skillIds.length;
          processedRepos += 1;
          processedSkills += group.skillIds.length;
          await updateBatchProgress(batchId, completedSkills, failedSkills, skippedSkills);
          log(
            `worker=${workerIndex + 1} repo=${processedRepos}/${pendingGroups.length} ` +
            `skills=${processedSkills}/${totalPendingSkills} skipped ${group.repositoryUrl}: no SKILL.md`,
          );
          continue;
        }

        const scanResult = await scanRepository(skillTargetPath);
        const storedResult = buildStoredResult(scanResult, group.repositoryUrl, repoCachePath);
        storedResult.scannedTargetPath = skillTargetPath;
        await insertBatchResults(batchId, group.repositoryUrl, group.skillIds, storedResult);
        existingRepoResults.set(group.repositoryUrl, storedResult);
        completedSkills += group.skillIds.length;
        processedRepos += 1;
        processedSkills += group.skillIds.length;
        await updateBatchProgress(batchId, completedSkills, failedSkills, skippedSkills);
        log(
          `worker=${workerIndex + 1} repo=${processedRepos}/${pendingGroups.length} ` +
          `skills=${processedSkills}/${totalPendingSkills} scanned ${group.repositoryUrl} ` +
          `risk=${storedResult.riskLabel} severity=${storedResult.maxSeverity} findings=${storedResult.findingCount}`,
        );
      } catch (error) {
        const failedResult = buildFailedResult(group.repositoryUrl, repoCachePath, error);
        await insertBatchResults(batchId, group.repositoryUrl, group.skillIds, failedResult);
        existingRepoResults.set(group.repositoryUrl, failedResult);
        failedSkills += group.skillIds.length;
        processedRepos += 1;
        processedSkills += group.skillIds.length;
        await updateBatchProgress(batchId, completedSkills, failedSkills, skippedSkills);
        log(
          `worker=${workerIndex + 1} repo=${processedRepos}/${pendingGroups.length} ` +
          `skills=${processedSkills}/${totalPendingSkills} failed ${group.repositoryUrl}: ${error.message}`,
        );
      } finally {
        if (repoCachePath) {
          activePaths.delete(repoCachePath);
        }
        await sleep(10);
      }
    }
  });

  await Promise.all(workers);

  const remainingRows = await prisma.$queryRawUnsafe(
    `
      SELECT COUNT(*) AS remaining
      FROM skillrecord s
      LEFT JOIN skillstaticscanresult r
        ON r.batchId = ? AND r.skillId = s.id
      WHERE r.id IS NULL
    `,
    batchId,
  );

  const remaining = Number(remainingRows[0]?.remaining || 0);
  if (remaining === 0) {
    await finalizeBatch(batchId);
    log(`batch=${batchId} completed`);
  } else {
    log(`batch=${batchId} paused with remaining=${remaining}`);
  }
}

main()
  .catch((error) => {
    console.error(`[skill-static-scan] fatal: ${error.stack || error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
