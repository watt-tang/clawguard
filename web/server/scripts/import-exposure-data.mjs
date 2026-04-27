import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import maxmind from "maxmind";
import * as geolite2 from "geolite2-redist";
import { PrismaClient } from "../../generated/prisma/index.js";
import { parseDateKey } from "../lib/date.mjs";
import { buildAsnProfile } from "../lib/operator.mjs";

const prisma = new PrismaClient();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "../..");

const snapshotPattern = /^server_clawdbot_(\d{8})_ip_18789_alive\.txt$/;
const batchSize = Number(process.env.EXPOSURE_IMPORT_BATCH_SIZE || 1000);

const defaults = {
  productKey: "openclaw",
  host: "-",
  service: "18789 / OpenClaw",
  serviceDesc: "OpenClaw service",
  status: "\u5728\u7ebf\u76d1\u6d4b",
  version: "unknown",
  risk: "\u5f85\u8865\u5145",
};

function dateToKey(dateValue) {
  const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function readFirstExistingPath(candidates) {
  for (const candidate of candidates) {
    if (!candidate) continue;
    const resolved = path.resolve(candidate);
    if (fs.existsSync(resolved) && fs.statSync(resolved).isFile()) {
      return resolved;
    }
  }
  return null;
}

function pickLocalizedName(node, locale = "en") {
  if (!node?.names) return "";
  return node.names[locale] || node.names.en || Object.values(node.names)[0] || "";
}

function normalizeProvinceZh(name) {
  if (!name) return "\u672a\u77e5";
  const map = {
    "\u5185\u8499\u53e4\u81ea\u6cbb\u533a": "\u5185\u8499\u53e4",
    "\u5e7f\u897f\u58ee\u65cf\u81ea\u6cbb\u533a": "\u5e7f\u897f",
    "\u5b81\u590f\u56de\u65cf\u81ea\u6cbb\u533a": "\u5b81\u590f",
    "\u65b0\u7586\u7ef4\u543e\u5c14\u81ea\u6cbb\u533a": "\u65b0\u7586",
    "\u897f\u85cf\u81ea\u6cbb\u533a": "\u897f\u85cf",
    "\u9999\u6e2f\u7279\u522b\u884c\u653f\u533a": "\u9999\u6e2f",
    "\u6fb3\u95e8\u7279\u522b\u884c\u653f\u533a": "\u6fb3\u95e8",
  };
  if (map[name]) return map[name];

  return name
    .replace(/\u7701$/u, "")
    .replace(/\u5e02$/u, "")
    .replace(/\u81ea\u6cbb\u533a$/u, "")
    .replace(/\u7279\u522b\u884c\u653f\u533a$/u, "")
    .trim() || "\u672a\u77e5";
}

function inferScope(countryEn, countryZh) {
  if (countryEn === "China" || String(countryZh).includes("\u4e2d\u56fd")) {
    return "\u5883\u5185\u66b4\u9732";
  }
  return "\u5883\u5916\u66b4\u9732";
}

function resolveGeo(ip, cityReader) {
  const geo = cityReader?.get(ip);
  const countryEn = pickLocalizedName(geo?.country, "en") || "Unknown";
  const countryZh = pickLocalizedName(geo?.country, "zh-CN") || countryEn;
  const provinceZhRaw = pickLocalizedName(geo?.subdivisions?.[0], "zh-CN");
  const provinceZh = normalizeProvinceZh(provinceZhRaw || "\u672a\u77e5");
  const provinceEn = pickLocalizedName(geo?.subdivisions?.[0], "en");
  const city = pickLocalizedName(geo?.city, "en") || pickLocalizedName(geo?.city, "zh-CN") || "Unknown";

  const regionParts = [countryEn];
  if (provinceEn) regionParts.push(provinceEn);

  return {
    country: countryEn,
    countryZh,
    province: provinceZh,
    region: regionParts.join(" / "),
    city,
    scope: inferScope(countryEn, countryZh),
  };
}

function resolveAsn(ip, asnReader) {
  const asnGeo = asnReader?.get(ip);
  return buildAsnProfile(asnGeo?.autonomous_system_number, asnGeo?.autonomous_system_organization);
}

function chunk(array, size) {
  const batches = [];
  for (let i = 0; i < array.length; i += size) {
    batches.push(array.slice(i, i + size));
  }
  return batches;
}

async function openReader(name, candidates, dbName) {
  const dbPath = readFirstExistingPath(candidates);

  if (dbPath) {
    const reader = await maxmind.open(dbPath);
    console.log(`[import] Loaded ${name}: ${path.relative(projectRoot, dbPath)}`);
    return { reader, dbPath };
  }

  try {
    const reader = await geolite2.open(dbName, (resolvedPath) => maxmind.open(resolvedPath));
    console.log(`[import] Loaded ${name} via geolite2-redist mirror.`);
    return { reader, dbPath: "geolite2-redist" };
  } catch (error) {
    console.warn(`[import] ${name} not found, fallback default values will be used. (${error.message})`);
    return { reader: null, dbPath: null };
  }
}

async function main() {
  const snapshotsDir = process.env.EXPOSURE_DATA_DIR
    ? path.resolve(process.env.EXPOSURE_DATA_DIR)
    : path.join(projectRoot, "clawdbot_alive");

  if (!fs.existsSync(snapshotsDir)) {
    throw new Error(`Snapshots directory not found: ${snapshotsDir}`);
  }

  const cityDbCandidates = [
    process.env.GEOLITE2_CITY_DB,
    path.join(projectRoot, "geoip", "GeoLite2-City.mmdb"),
    path.join(projectRoot, "data", "GeoLite2-City.mmdb"),
    path.join(projectRoot, "GeoLite2-City.mmdb"),
    path.join(projectRoot, "server", "data", "GeoLite2-City.mmdb"),
  ];

  const asnDbCandidates = [
    process.env.GEOLITE2_ASN_DB,
    path.join(projectRoot, "geoip", "GeoLite2-ASN.mmdb"),
    path.join(projectRoot, "data", "GeoLite2-ASN.mmdb"),
    path.join(projectRoot, "GeoLite2-ASN.mmdb"),
    path.join(projectRoot, "server", "data", "GeoLite2-ASN.mmdb"),
  ];

  const { reader: cityReader } = await openReader("GeoLite2-City", cityDbCandidates, "GeoLite2-City");
  const { reader: asnReader } = await openReader("GeoLite2-ASN", asnDbCandidates, "GeoLite2-ASN");

  const files = fs
    .readdirSync(snapshotsDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && snapshotPattern.test(entry.name))
    .map((entry) => {
      const match = entry.name.match(snapshotPattern);
      return {
        path: path.join(snapshotsDir, entry.name),
        name: entry.name,
        dateKey: match[1],
      };
    })
    .sort((a, b) => a.dateKey.localeCompare(b.dateKey));

  if (!files.length) {
    throw new Error(`No snapshot files matched in ${snapshotsDir}`);
  }

  await prisma.exposureVersionDailyAgg.deleteMany({ where: { productKey: defaults.productKey } });
  await prisma.exposureDailyAgg.deleteMany({ where: { productKey: defaults.productKey } });

  const seenIps = new Set();
  let totalInserted = 0;

  for (const file of files) {
    const snapshotDate = parseDateKey(file.dateKey);

    const snapshot = await prisma.exposureSnapshot.upsert({
      where: {
        productKey_dateKey: {
          productKey: defaults.productKey,
          dateKey: file.dateKey,
        },
      },
      update: {
        productKey: defaults.productKey,
        snapshotDate,
        sourceFile: file.name,
      },
      create: {
        productKey: defaults.productKey,
        dateKey: file.dateKey,
        snapshotDate,
        sourceFile: file.name,
      },
    });

    await prisma.exposureRecord.deleteMany({ where: { snapshotId: snapshot.id } });

    const ips = Array.from(
      new Set(
        fs
          .readFileSync(file.path, "utf8")
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter((line) => /^\d{1,3}(?:\.\d{1,3}){3}$/.test(line))
      )
    );

    const rows = ips.map((ip) => {
      const geo = resolveGeo(ip, cityReader);
      const asn = resolveAsn(ip, asnReader);

      return {
        snapshotId: snapshot.id,
        productKey: defaults.productKey,
        snapshotDate,
        ip,
        country: geo.country,
        countryZh: geo.countryZh,
        province: geo.province,
        region: geo.region,
        city: geo.city,
        asn: asn.asn,
        isp: asn.isp,
        operator: asn.operator,
        host: defaults.host,
        service: defaults.service,
        serviceDesc: defaults.serviceDesc,
        status: defaults.status,
        scope: geo.scope,
        version: defaults.version,
        risk: defaults.risk,
        lastSeen: snapshotDate,
      };
    });

    let domesticCount = 0;
    let newDistinctIpCount = 0;
    const versionCounter = new Map();

    for (const row of rows) {
      if (String(row.scope || "").includes("\u5883\u5185")) {
        domesticCount += 1;
      }

      if (!seenIps.has(row.ip)) {
        seenIps.add(row.ip);
        newDistinctIpCount += 1;
      }

      const version = row.version || "unknown";
      versionCounter.set(version, (versionCounter.get(version) ?? 0) + 1);
    }

    const exposedCount = rows.length;
    const overseasCount = exposedCount - domesticCount;
    const cumulativeDistinctIpCount = seenIps.size;

    for (const batch of chunk(rows, batchSize)) {
      await prisma.exposureRecord.createMany({ data: batch, skipDuplicates: true });
    }

    await prisma.exposureDailyAgg.upsert({
      where: {
        productKey_snapshotDate: {
          productKey: defaults.productKey,
          snapshotDate,
        },
      },
      update: {
        productKey: defaults.productKey,
        snapshotId: snapshot.id,
        exposedCount,
        domesticCount,
        overseasCount,
        newDistinctIpCount,
        cumulativeDistinctIpCount,
      },
      create: {
        productKey: defaults.productKey,
        snapshotDate,
        snapshotId: snapshot.id,
        exposedCount,
        domesticCount,
        overseasCount,
        newDistinctIpCount,
        cumulativeDistinctIpCount,
      },
    });

    const versionRows = Array.from(versionCounter.entries()).map(([version, count]) => ({
      productKey: defaults.productKey,
      snapshotDate,
      version,
      count,
    }));

    for (const batch of chunk(versionRows, batchSize)) {
      await prisma.exposureVersionDailyAgg.createMany({ data: batch, skipDuplicates: true });
    }

    totalInserted += rows.length;
    console.log(
      `[import] ${file.name}: rows=${rows.length}, new=${newDistinctIpCount}, cumulative=${cumulativeDistinctIpCount}, date=${dateToKey(snapshotDate)}`
    );
  }

  cityReader?.close?.();
  asnReader?.close?.();

  console.log(`[import] Done. snapshots=${files.length}, rows=${totalInserted}`);
}

main()
  .catch((error) => {
    console.error(`[import] Failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

