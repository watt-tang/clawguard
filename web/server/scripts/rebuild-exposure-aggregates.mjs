import "dotenv/config";
import { PrismaClient } from "../../generated/prisma/index.js";
import { formatDate } from "../lib/date.mjs";

const prisma = new PrismaClient();
const batchSize = Number(process.env.EXPOSURE_IMPORT_BATCH_SIZE || 1000);
const DOMESTIC_SCOPE_LIKE = `%${"\u5883\u5185"}%`;

function toInt(value) {
  if (typeof value === "bigint") return Number(value);
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value);
  if (value && typeof value === "object") {
    if (typeof value.toNumber === "function") return value.toNumber();
    if (typeof value.valueOf === "function") return Number(value.valueOf());
    if (typeof value.toString === "function") return Number(value.toString());
  }
  return 0;
}

function chunk(array, size) {
  const output = [];
  for (let i = 0; i < array.length; i += size) {
    output.push(array.slice(i, i + size));
  }
  return output;
}

async function main() {
  const snapshots = await prisma.exposureSnapshot.findMany({
    orderBy: { snapshotDate: "asc" },
    select: { id: true, snapshotDate: true, dateKey: true },
  });

  if (!snapshots.length) {
    console.log("[agg] No snapshots found. Skip.");
    return;
  }

  const [dailyRows, firstSeenRows, versionRows] = await Promise.all([
    prisma.$queryRaw`
      SELECT
        snapshotDate,
        COUNT(*) AS exposedCount,
        SUM(CASE WHEN scope LIKE ${DOMESTIC_SCOPE_LIKE} THEN 1 ELSE 0 END) AS domesticCount
      FROM ExposureRecord
      GROUP BY snapshotDate
      ORDER BY snapshotDate ASC
    `,
    prisma.$queryRaw`
      SELECT first_seen AS snapshotDate, COUNT(*) AS count
      FROM (
        SELECT MIN(snapshotDate) AS first_seen
        FROM ExposureRecord
        GROUP BY ip
      ) t
      GROUP BY first_seen
      ORDER BY first_seen ASC
    `,
    prisma.$queryRaw`
      SELECT snapshotDate, version, COUNT(*) AS count
      FROM ExposureRecord
      GROUP BY snapshotDate, version
      ORDER BY snapshotDate ASC, version ASC
    `,
  ]);

  const dailyMap = new Map(
    dailyRows.map((row) => [
      formatDate(row.snapshotDate),
      {
        exposedCount: toInt(row.exposedCount),
        domesticCount: toInt(row.domesticCount),
      },
    ])
  );

  const firstSeenMap = new Map(firstSeenRows.map((row) => [formatDate(row.snapshotDate), toInt(row.count)]));

  const dailyAggRows = [];
  let runningDistinct = 0;

  for (const snapshot of snapshots) {
    const date = formatDate(snapshot.snapshotDate);
    const daily = dailyMap.get(date) || { exposedCount: 0, domesticCount: 0 };
    const newDistinct = firstSeenMap.get(date) || 0;
    runningDistinct += newDistinct;

    dailyAggRows.push({
      snapshotDate: snapshot.snapshotDate,
      snapshotId: snapshot.id,
      exposedCount: daily.exposedCount,
      domesticCount: daily.domesticCount,
      overseasCount: daily.exposedCount - daily.domesticCount,
      newDistinctIpCount: newDistinct,
      cumulativeDistinctIpCount: runningDistinct,
    });
  }

  const versionAggRows = versionRows.map((row) => ({
    snapshotDate: row.snapshotDate,
    version: row.version || "unknown",
    count: toInt(row.count),
  }));

  await prisma.exposureVersionDailyAgg.deleteMany();
  await prisma.exposureDailyAgg.deleteMany();

  for (const batch of chunk(dailyAggRows, batchSize)) {
    await prisma.exposureDailyAgg.createMany({ data: batch, skipDuplicates: true });
  }

  for (const batch of chunk(versionAggRows, batchSize)) {
    await prisma.exposureVersionDailyAgg.createMany({ data: batch, skipDuplicates: true });
  }

  console.log(
    `[agg] Rebuild finished. daily_rows=${dailyAggRows.length}, version_rows=${versionAggRows.length}, latest_snapshot=${snapshots.at(-1)?.dateKey}`
  );
}

main()
  .catch((error) => {
    console.error(`[agg] Failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

