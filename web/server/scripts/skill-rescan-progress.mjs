import "dotenv/config";
import { prisma } from "../lib/prisma.mjs";

function parseArgs(argv) {
  const options = { batchId: null };
  for (let i = 2; i < argv.length; i += 1) {
    const current = argv[i];
    const next = argv[i + 1];
    if (current === "--batch-id") {
      options.batchId = Number(next) || null;
      i += 1;
      continue;
    }
    throw new Error(`Unknown argument: ${current}`);
  }
  return options;
}

async function getBatchId(explicitBatchId) {
  if (explicitBatchId) return explicitBatchId;
  const rows = await prisma.$queryRawUnsafe("SELECT id FROM skillstaticscanbatch ORDER BY id DESC LIMIT 1");
  return Number(rows[0]?.id || 0) || null;
}

function pct(numerator, denominator) {
  if (!denominator) return 0;
  return Math.round((numerator / denominator) * 10000) / 100;
}

async function main() {
  const options = parseArgs(process.argv);
  const batchId = await getBatchId(options.batchId);
  if (!batchId) {
    throw new Error("No available batch found");
  }

  const [batch] = await prisma.$queryRawUnsafe(
    "SELECT id, totalSkills, completedSkills, failedSkills, skippedSkills, updatedAt, completedAt FROM skillstaticscanbatch WHERE id = ? LIMIT 1",
    batchId,
  );

  if (!batch) {
    throw new Error(`Batch not found: ${batchId}`);
  }

  const [remainingRow] = await prisma.$queryRawUnsafe(
    `
      SELECT CAST(COUNT(*) AS SIGNED) AS remaining
      FROM skillrecord s
      LEFT JOIN skillstaticscanresult r ON r.batchId = ? AND r.skillId = s.id
      WHERE r.id IS NULL
    `,
    batchId,
  );

  const [riskRow] = await prisma.$queryRawUnsafe(
    `
      SELECT
        CAST(SUM(CASE WHEN riskLabel='dangerous' THEN 1 ELSE 0 END) AS SIGNED) AS dangerous,
        CAST(SUM(CASE WHEN COALESCE(NULLIF(riskLabel,''),'unknown') IN ('unknown','uncertain') THEN 1 ELSE 0 END) AS SIGNED) AS uncertain
      FROM skillstaticscanresult
      WHERE batchId = ?
    `,
    batchId,
  );

  const completedSkills = Number(batch.completedSkills || 0);
  const failedSkills = Number(batch.failedSkills || 0);
  const skippedSkills = Number(batch.skippedSkills || 0);
  const processed = completedSkills + failedSkills + skippedSkills;
  const remaining = Number(remainingRow?.remaining || 0);
  const total = processed + remaining;

  const output = {
    batchId,
    total,
    processed,
    remaining,
    progressPct: pct(processed, total),
    completedSkills,
    failedSkills,
    skippedSkills,
    dangerous: Number(riskRow?.dangerous || 0),
    uncertain: Number(riskRow?.uncertain || 0),
    updatedAt: batch.updatedAt ? new Date(batch.updatedAt).toISOString() : null,
    completedAt: batch.completedAt ? new Date(batch.completedAt).toISOString() : null,
  };

  console.log(JSON.stringify(output, null, 2));
}

main()
  .catch((error) => {
    console.error(`[skill-rescan-progress] ${error.stack || error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
