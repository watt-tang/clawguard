import { prisma } from "../lib/prisma.mjs";

function toNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

function cleanText(value, maxLength = 220) {
  const text = String(value || "").trim();
  if (!text) return "";
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
}

export async function searchSkills(query, options = {}) {
  const q = String(query || "").trim();
  const limit = Math.min(Math.max(Number(options.limit) || 12, 1), 24);

  if (!q) {
    return {
      query: "",
      total: 0,
      items: [],
    };
  }

  const likeAny = `%${q}%`;
  const likePrefix = `${q}%`;

  const rows = await prisma.$queryRawUnsafe(
    `
      SELECT
        s.id,
        s.name,
        s.author,
        s.repositoryUrl,
        s.description,
        s.stars,
        s.language,
        s.license,
        s.homepageUrl,
        s.updatedAtSrc,
        r.status AS latestScanStatus,
        r.maxSeverity AS latestMaxSeverity,
        r.riskLabel AS latestRiskLabel,
        r.findingCount AS latestFindingCount,
        r.scannedAt AS latestScannedAt,
        r.errorMessage AS latestErrorMessage,
        (
          CASE WHEN LOWER(s.name) = LOWER(?) THEN 100 ELSE 0 END +
          CASE WHEN LOWER(s.name) LIKE LOWER(?) THEN 40 ELSE 0 END +
          CASE WHEN LOWER(COALESCE(s.author, '')) LIKE LOWER(?) THEN 20 ELSE 0 END +
          CASE WHEN LOWER(s.repositoryUrl) LIKE LOWER(?) THEN 30 ELSE 0 END +
          CASE WHEN LOWER(COALESCE(s.description, '')) LIKE LOWER(?) THEN 10 ELSE 0 END
        ) AS matchScore
      FROM skillrecord s
      LEFT JOIN skillstaticscanresult r
        ON r.id = (
          SELECT r2.id
          FROM skillstaticscanresult r2
          WHERE r2.skillId = s.id
          ORDER BY r2.batchId DESC, r2.id DESC
          LIMIT 1
        )
      WHERE
        LOWER(s.name) LIKE LOWER(?)
        OR LOWER(COALESCE(s.author, '')) LIKE LOWER(?)
        OR LOWER(s.repositoryUrl) LIKE LOWER(?)
        OR LOWER(COALESCE(s.description, '')) LIKE LOWER(?)
      ORDER BY matchScore DESC, s.stars DESC, s.updatedAtSrc DESC, s.id DESC
      LIMIT ?
    `,
    q,
    likePrefix,
    likeAny,
    likeAny,
    likeAny,
    likeAny,
    likeAny,
    likeAny,
    likeAny,
    limit,
  );

  return {
    query: q,
    total: rows.length,
    items: rows.map((row) => ({
      id: String(row.id),
      name: cleanText(row.name, 160),
      author: cleanText(row.author, 80),
      repositoryUrl: String(row.repositoryUrl || ""),
      description: cleanText(row.description, 220),
      stars: toNumber(row.stars),
      language: cleanText(row.language, 32),
      license: cleanText(row.license, 64),
      homepageUrl: String(row.homepageUrl || ""),
      updatedAtSrc: row.updatedAtSrc ? new Date(row.updatedAtSrc).toISOString() : null,
      latestScanStatus: cleanText(row.latestScanStatus, 32),
      latestMaxSeverity: cleanText(row.latestMaxSeverity, 32),
      latestRiskLabel: cleanText(row.latestRiskLabel, 32),
      latestFindingCount: toNumber(row.latestFindingCount),
      latestScannedAt: row.latestScannedAt ? new Date(row.latestScannedAt).toISOString() : null,
      latestErrorMessage: cleanText(row.latestErrorMessage, 220),
      matchScore: toNumber(row.matchScore),
    })),
  };
}
