import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import maxmind from "maxmind";
import * as geolite2 from "geolite2-redist";
import { PrismaClient } from "@prisma/client";
import { parseDateKey } from "../lib/date.mjs";

const prisma = new PrismaClient();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "../..");

const snapshotPattern = /^server_clawdbot_(\d{8})_ip_18789_alive\.txt$/;
const batchSize = Number(process.env.EXPOSURE_IMPORT_BATCH_SIZE || 1000);

const defaults = {
  host: "-",
  service: "18789 / OpenClaw",
  serviceDesc: "OpenClaw service",
  vendor: "OpenClaw",
  status: "在线监测",
  version: "unknown",
  risk: "待补充",
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
  if (!name) return "未知";
  const map = {
    "内蒙古自治区": "内蒙古",
    "广西壮族自治区": "广西",
    "宁夏回族自治区": "宁夏",
    "新疆维吾尔自治区": "新疆",
    "西藏自治区": "西藏",
    "香港特别行政区": "香港",
    "澳门特别行政区": "澳门",
  };
  if (map[name]) return map[name];

  return name
    .replace(/省$/u, "")
    .replace(/市$/u, "")
    .replace(/自治区$/u, "")
    .replace(/特别行政区$/u, "")
    .trim() || "未知";
}

function inferScope(countryEn, countryZh) {
  if (countryEn === "China" || String(countryZh).includes("中国")) {
    return "境内暴露";
  }
  return "境外暴露";
}

function resolveGeo(ip, cityReader) {
  const geo = cityReader?.get(ip);
  const countryEn = pickLocalizedName(geo?.country, "en") || "Unknown";
  const countryZh = pickLocalizedName(geo?.country, "zh-CN") || countryEn;
  const provinceZhRaw = pickLocalizedName(geo?.subdivisions?.[0], "zh-CN");
  const provinceZh = normalizeProvinceZh(provinceZhRaw || "未知");
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
  const asnNumber = asnGeo?.autonomous_system_number;
  const org = asnGeo?.autonomous_system_organization;

  return {
    asn: typeof asnNumber === "number" && Number.isFinite(asnNumber) ? `AS${asnNumber}` : "AS0",
    isp: org || "Unknown ISP",
  };
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

  await prisma.exposureVersionDailyAgg.deleteMany();
  await prisma.exposureDailyAgg.deleteMany();

  const seenIps = new Set();
  let totalInserted = 0;

  for (const file of files) {
    const snapshotDate = parseDateKey(file.dateKey);

    const snapshot = await prisma.exposureSnapshot.upsert({
      where: { dateKey: file.dateKey },
      update: {
        snapshotDate,
        sourceFile: file.name,
      },
      create: {
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
        snapshotDate,
        ip,
        country: geo.country,
        countryZh: geo.countryZh,
        province: geo.province,
        region: geo.region,
        city: geo.city,
        asn: asn.asn,
        isp: asn.isp,
        host: defaults.host,
        service: defaults.service,
        serviceDesc: defaults.serviceDesc,
        vendor: defaults.vendor,
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
      if (String(row.scope || "").includes("境内")) {
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
      where: { snapshotDate },
      update: {
        snapshotId: snapshot.id,
        exposedCount,
        domesticCount,
        overseasCount,
        newDistinctIpCount,
        cumulativeDistinctIpCount,
      },
      create: {
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
