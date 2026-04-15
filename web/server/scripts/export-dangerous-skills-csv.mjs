import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { prisma } from "../lib/prisma.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const WEB_ROOT = path.resolve(__dirname, "..", "..");
const DEFAULT_OUTPUT = path.resolve(WEB_ROOT, "logs", "dangerous-skills-latest.csv");

function parseArgs(argv) {
  const options = {
    batchId: null,
    output: DEFAULT_OUTPUT,
  };

  for (let i = 2; i < argv.length; i += 1) {
    const current = argv[i];
    const next = argv[i + 1];
    if (current === "--batch-id") {
      options.batchId = Number(next) || null;
      i += 1;
      continue;
    }
    if (current === "--output") {
      options.output = path.resolve(process.cwd(), next || DEFAULT_OUTPUT);
      i += 1;
      continue;
    }
    throw new Error(`Unknown argument: ${current}`);
  }

  return options;
}

function csvEscape(value) {
  const text = String(value ?? "");
  const escaped = text.replace(/"/g, "\"\"");
  return `"${escaped}"`;
}

async function getLatestBatchId() {
  const rows = await prisma.$queryRawUnsafe(
    "SELECT id FROM skillstaticscanbatch ORDER BY id DESC LIMIT 1",
  );
  return Number(rows[0]?.id || 0) || null;
}

async function main() {
  const options = parseArgs(process.argv);
  const batchId = options.batchId || (await getLatestBatchId());
  if (!batchId) {
    throw new Error("No available batch found");
  }

  const rows = await prisma.$queryRawUnsafe(
    `
      SELECT
        s.id,
        s.name,
        s.author,
        s.repositoryUrl,
        r.maxSeverity,
        r.findingCount,
        r.scannerRunsText,
        r.riskSourceText,
        r.scannedAt
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
    `,
    batchId,
  );

  const header = [
    "batch_id",
    "skill_id",
    "skill_name",
    "author",
    "source_link",
    "max_severity",
    "finding_count",
    "scanner_runs",
    "hit_reason",
    "scanned_at",
  ];

  const lines = [header.map(csvEscape).join(",")];
  for (const row of rows) {
    lines.push(
      [
        batchId,
        row.id,
        row.name,
        row.author,
        row.repositoryUrl,
        row.maxSeverity,
        Number(row.findingCount || 0),
        row.scannerRunsText,
        row.riskSourceText,
        row.scannedAt ? new Date(row.scannedAt).toISOString() : "",
      ].map(csvEscape).join(","),
    );
  }

  await fs.mkdir(path.dirname(options.output), { recursive: true });
  await fs.writeFile(options.output, `${lines.join("\n")}\n`, "utf-8");
  console.log(`[export-dangerous-skills-csv] batch=${batchId} rows=${rows.length} output=${options.output}`);
}

main()
  .catch((error) => {
    console.error(`[export-dangerous-skills-csv] ${error.stack || error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
