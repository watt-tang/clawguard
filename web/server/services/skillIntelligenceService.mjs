import { prisma } from "../lib/prisma.mjs";

const CACHE_TTL_MS = 60 * 1000;

const overviewCache = new Map();
const inflightRequests = new Map();

function toNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

function formatBatchRow(row = {}) {
  return {
    id: toNumber(row.id),
    startedAt: row.startedAt ? new Date(row.startedAt).toISOString() : null,
    completedAt: row.completedAt ? new Date(row.completedAt).toISOString() : null,
    updatedAt: row.updatedAt ? new Date(row.updatedAt).toISOString() : null,
    completedSkills: toNumber(row.completedSkills),
    failedSkills: toNumber(row.failedSkills),
    skippedSkills: toNumber(row.skippedSkills),
  };
}

function percent(part, total) {
  if (!total) return 0;
  return Math.round((part / total) * 1000) / 10;
}

function normalizePositiveInt(value, fallback, { min = 1, max = Number.MAX_SAFE_INTEGER } = {}) {
  const num = Number(value);
  if (!Number.isFinite(num)) return fallback;
  return Math.min(max, Math.max(min, Math.floor(num)));
}

function buildCacheKey(query = {}) {
  const page = normalizePositiveInt(query.page, 1);
  const pageSize = normalizePositiveInt(query.page_size ?? query.pageSize, 20, { min: 1, max: 100 });
  return `${page}:${pageSize}`;
}

function buildFailureReason(errorMessage) {
  const message = String(errorMessage || "").toLowerCase();
  if (!message) return "unknown";
  if (message.includes("timed out")) return "timeout";
  if (message.includes("failed to connect") || message.includes("connection")) return "network";
  if (message.includes("repositoryurl") || message.includes("invalid repo")) return "invalid-url";
  if (message.includes("skill.md")) return "missing-skill-md";
  if (message.includes("path") || message.includes("filename too long")) return "windows-path";
  return "other";
}

function buildUnknownReason(riskSourceText) {
  const message = String(riskSourceText || "").toLowerCase();
  if (!message) return "other";
  if (message.includes("without skill.md")) return "missing-skill-md";
  if (message.includes("invalid repositoryurl")) return "invalid-repository";
  if (message.includes("unsupported host")) return "unsupported-host";
  return "other";
}

async function queryOverview(query = {}) {
  const requestedPage = normalizePositiveInt(query.page, 1);
  const pageSize = normalizePositiveInt(query.page_size ?? query.pageSize, 20, { min: 1, max: 100 });

  const [corpusRows, latestBatchRows] = await Promise.all([
    prisma.$queryRawUnsafe(`
      SELECT
        CAST(COUNT(*) AS SIGNED) AS totalSkills,
        CAST(COUNT(DISTINCT repositoryUrl) AS SIGNED) AS totalRepos
      FROM skillrecord
    `),
    prisma.$queryRawUnsafe(`
      SELECT
        id,
        startedAt,
        completedAt,
        completedSkills,
        failedSkills,
        skippedSkills,
        updatedAt
      FROM skillstaticscanbatch
      ORDER BY id DESC
      LIMIT 6
    `),
  ]);

  const corpusRow = corpusRows[0] || {};
  const recentBatches = latestBatchRows.map((row) => formatBatchRow(row));
  const latestBatch = recentBatches[0] || null;

  if (!latestBatch) {
    return {
      summary: {
        totalSkills: toNumber(corpusRow.totalSkills),
        totalRepos: toNumber(corpusRow.totalRepos),
        latestBatchId: null,
        scannedSkills: 0,
        scannedRepos: 0,
        corpusCoverageRate: 0,
        repoCoverageRate: 0,
        successRate: 0,
        failureRate: 0,
        skipRate: 0,
      },
      latestBatch: null,
      riskDistribution: [],
      recentBatches: [],
      unknownClusters: [],
      reviewRows: [],
      reviewPagination: {
        page: 1,
        page_size: pageSize,
        total: 0,
        total_pages: 1,
      },
      generatedAt: new Date().toISOString(),
    };
  }

  const [riskRows, failureRows, unknownRows, repoRows, reviewTotalRows] = await Promise.all([
    prisma.$queryRawUnsafe(
      `
        SELECT
          COALESCE(NULLIF(riskLabel, ''), 'unknown') AS riskLabel,
          CAST(COUNT(*) AS SIGNED) AS total
        FROM skillstaticscanresult
        WHERE batchId = ?
        GROUP BY COALESCE(NULLIF(riskLabel, ''), 'unknown')
        ORDER BY total DESC
      `,
      latestBatch.id,
    ),
    prisma.$queryRawUnsafe(
      `
        SELECT errorMessage
        FROM skillstaticscanresult
        WHERE batchId = ? AND status = 'failed'
      `,
      latestBatch.id,
    ),
    prisma.$queryRawUnsafe(
      `
        SELECT riskSourceText
        FROM skillstaticscanresult
        WHERE batchId = ?
          AND COALESCE(NULLIF(riskLabel, ''), 'unknown') = 'unknown'
      `,
      latestBatch.id,
    ),
    prisma.$queryRawUnsafe(
      `
        SELECT CAST(COUNT(DISTINCT repositoryUrl) AS SIGNED) AS scannedRepos
        FROM skillstaticscanresult
        WHERE batchId = ?
      `,
      latestBatch.id,
    ),
    prisma.$queryRawUnsafe(
      `
        SELECT CAST(COUNT(*) AS SIGNED) AS total
        FROM skillstaticscanresult r
        WHERE r.batchId = ?
          AND r.riskLabel = 'dangerous'
      `,
      latestBatch.id,
    ),
  ]);

  const scannedSkills = latestBatch.completedSkills + latestBatch.failedSkills + latestBatch.skippedSkills;
  const totalSkills = toNumber(corpusRow.totalSkills);
  const totalRepos = toNumber(corpusRow.totalRepos);
  const scannedRepos = toNumber(repoRows[0]?.scannedRepos);

  const failureReasonMap = new Map();
  for (const row of failureRows) {
    const reason = buildFailureReason(row.errorMessage);
    failureReasonMap.set(reason, (failureReasonMap.get(reason) || 0) + 1);
  }

  const failureClusters = Array.from(failureReasonMap.entries())
    .map(([reason, total]) => ({
      reason,
      total,
      percent: percent(total, latestBatch.failedSkills),
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 4);

  const unknownReasonMap = new Map();
  for (const row of unknownRows) {
    const reason = buildUnknownReason(row.riskSourceText);
    unknownReasonMap.set(reason, (unknownReasonMap.get(reason) || 0) + 1);
  }

  const unknownTotal = riskRows
    .filter((row) => String(row.riskLabel || "") === "unknown")
    .reduce((sum, row) => sum + toNumber(row.total), 0);

  const unknownClusters = Array.from(unknownReasonMap.entries())
    .map(([reason, total]) => ({
      reason,
      total,
      percent: percent(total, unknownTotal),
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 4);

  const reviewTotal = toNumber(reviewTotalRows[0]?.total);
  const reviewTotalPages = Math.max(1, Math.ceil(reviewTotal / pageSize));
  const reviewPage = Math.min(requestedPage, reviewTotalPages);
  const reviewOffset = (reviewPage - 1) * pageSize;

  const reviewRows = await prisma.$queryRawUnsafe(
    `
      SELECT
        s.id,
        s.name,
        s.author,
        s.repositoryUrl,
        r.maxSeverity,
        r.findingCount,
        r.scannedAt,
        r.riskSourceText
      FROM skillstaticscanresult r
      INNER JOIN skillrecord s ON s.id = r.skillId
      WHERE r.batchId = ?
        AND r.riskLabel = 'dangerous'
      ORDER BY
        CASE
          WHEN r.maxSeverity = 'CRITICAL' THEN 0
          WHEN r.maxSeverity = 'HIGH' THEN 1
          WHEN r.maxSeverity = 'MEDIUM' THEN 2
          WHEN r.maxSeverity = 'LOW' THEN 3
          ELSE 4
        END,
        r.findingCount DESC,
        r.scannedAt DESC
      LIMIT ?, ?
    `,
    latestBatch.id,
    reviewOffset,
    pageSize,
  );

  return {
    summary: {
      totalSkills,
      totalRepos,
      latestBatchId: latestBatch.id,
      scannedSkills,
      scannedRepos,
      corpusCoverageRate: percent(scannedSkills, totalSkills),
      repoCoverageRate: percent(scannedRepos, totalRepos),
      successRate: percent(latestBatch.completedSkills, scannedSkills),
      failureRate: percent(latestBatch.failedSkills, scannedSkills),
      skipRate: percent(latestBatch.skippedSkills, scannedSkills),
    },
    latestBatch,
    riskDistribution: riskRows.map((row) => ({
      riskLabel: String(row.riskLabel || "unknown"),
      total: toNumber(row.total),
      percent: percent(toNumber(row.total), scannedSkills),
    })),
    recentBatches,
    failureClusters,
    unknownClusters,
    reviewRows: reviewRows.map((row) => ({
      id: String(row.id),
      name: String(row.name || ""),
      author: String(row.author || ""),
      repositoryUrl: String(row.repositoryUrl || ""),
      maxSeverity: String(row.maxSeverity || "UNKNOWN"),
      findingCount: toNumber(row.findingCount),
      scannedAt: row.scannedAt ? new Date(row.scannedAt).toISOString() : null,
      riskSourceText: String(row.riskSourceText || ""),
    })),
    reviewPagination: {
      page: reviewPage,
      page_size: pageSize,
      total: reviewTotal,
      total_pages: reviewTotalPages,
    },
    generatedAt: new Date().toISOString(),
  };
}

export async function getSkillIntelligenceOverview(query = {}) {
  const cacheKey = buildCacheKey(query);
  const now = Date.now();
  const cached = overviewCache.get(cacheKey);

  if (cached && now - cached.cachedAt < CACHE_TTL_MS) {
    return cached.data;
  }

  if (inflightRequests.has(cacheKey)) {
    return inflightRequests.get(cacheKey);
  }

  const inflightPromise = queryOverview(query)
    .then((data) => {
      overviewCache.set(cacheKey, { data, cachedAt: Date.now() });
      return data;
    })
    .finally(() => {
      inflightRequests.delete(cacheKey);
    });

  inflightRequests.set(cacheKey, inflightPromise);
  return inflightPromise;
}
