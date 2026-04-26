import "dotenv/config";
import { PrismaClient } from "../../generated/prisma/index.js";

const prisma = new PrismaClient();

async function hasColumn(columnName) {
  const rows = await prisma.$queryRawUnsafe(`SHOW COLUMNS FROM ExposureRecord LIKE '${columnName}'`);
  return Array.isArray(rows) && rows.length > 0;
}

async function main() {
  const hasOperator = await hasColumn("operator");
  const hasVendor = await hasColumn("vendor");

  if (hasOperator) {
    console.log("[migrate] operator column already exists. Skip rename.");
    return;
  }

  if (!hasVendor) {
    throw new Error("Neither vendor nor operator column exists on ExposureRecord.");
  }

  await prisma.$executeRawUnsafe(
    "ALTER TABLE ExposureRecord CHANGE COLUMN vendor operator VARCHAR(64) NOT NULL DEFAULT 'Unknown Operator'"
  );

  console.log("[migrate] Renamed ExposureRecord.vendor -> ExposureRecord.operator");
}

main()
  .catch((error) => {
    console.error(`[migrate] Failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

