import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import maxmind from "maxmind";
import * as geolite2 from "geolite2-redist";
import { PrismaClient } from "../../generated/prisma/index.js";
import { buildAsnProfile } from "../lib/operator.mjs";
import {
  DEFAULT_CLAW_EXPOSURE_PRODUCT_KEY,
  getClawExposureProduct,
} from "../../shared/clawExposureProducts.mjs";

const prisma = new PrismaClient();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "../..");
const batchSize = Number(process.env.EXPOSURE_IMPORT_BATCH_SIZE || 1000);
const PRODUCT_IP_LINE_PATTERN = /^\d{1,3}(?:\.\d{1,3}){3}$/;
const UNKNOWN_PROVINCE_ZH = "未知";
const DOMESTIC_IP_PREFIXES = new Set([
  10, 36, 39, 42, 43, 47, 49, 58, 59, 60, 61, 101, 106, 111, 112, 113, 114,
  115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 139, 140, 150, 152,
  153, 157, 159, 161, 163, 171, 175, 180, 182, 183, 202, 203, 210, 211, 218,
  219, 220, 221, 222,
]);

function dateToCompactKey(dateValue) {
  const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

function parseArgs(argv) {
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const next = argv[index + 1];
    if (next && !next.startsWith("--")) {
      options[key] = next;
      index += 1;
    } else {
      options[key] = "true";
    }
  }
  return options;
}

function parseInputDate(value) {
  if (!value) return null;
  const trimmed = String(value).trim();
  if (/^\d{8}$/.test(trimmed)) {
    const year = Number(trimmed.slice(0, 4));
    const month = Number(trimmed.slice(4, 6));
    const day = Number(trimmed.slice(6, 8));
    return new Date(Date.UTC(year, month - 1, day));
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return new Date(`${trimmed}T00:00:00.000Z`);
  }
  throw new Error(`Unsupported date format: ${value}`);
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

function pickLocalizedName(node, locales = ["zh-CN", "en"]) {
  if (!node?.names) return "";
  for (const locale of locales) {
    if (node.names[locale]) return node.names[locale];
  }
  return Object.values(node.names)[0] || "";
}

function normalizeChinaDivisionName(name) {
  const raw = String(name || "").trim();
  if (!raw) return "";

  const specialCases = {
    内蒙古自治区: "内蒙古",
    广西壮族自治区: "广西",
    宁夏回族自治区: "宁夏",
    新疆维吾尔自治区: "新疆",
    西藏自治区: "西藏",
    香港特别行政区: "香港",
    澳门特别行政区: "澳门",
  };

  if (specialCases[raw]) return specialCases[raw];

  return raw
    .replace(/特别行政区$/u, "")
    .replace(/自治区$/u, "")
    .replace(/省$/u, "")
    .replace(/市$/u, "")
    .trim();
}

function inferFallbackGeo(ip) {
  const firstOctet = Number(String(ip || "").split(".")[0]);
  const isDomestic = DOMESTIC_IP_PREFIXES.has(firstOctet);
  return {
    country: isDomestic ? "China" : "Unknown",
    countryZh: isDomestic ? "中国" : "未知",
    province: isDomestic ? UNKNOWN_PROVINCE_ZH : "",
    region: isDomestic ? "中国" : "Unknown",
    city: "Unknown",
    scope: isDomestic ? "境内暴露" : "境外暴露",
  };
}

async function openReader(name, candidates, dbName) {
  const dbPath = readFirstExistingPath(candidates);
  if (dbPath) {
    return maxmind.open(dbPath);
  }
  try {
    return await geolite2.open(dbName, (resolvedPath) => maxmind.open(resolvedPath));
  } catch (error) {
    console.warn(`[import-product] ${name} unavailable: ${error.message}`);
    return null;
  }
}

async function resolveProductGeo(ip, cityReader) {
  const fallback = inferFallbackGeo(ip);
  const geo = cityReader?.get(ip);
  if (!geo) return fallback;

  const country = pickLocalizedName(geo.country, ["en", "zh-CN"]) || fallback.country;
  const countryZh = pickLocalizedName(geo.country, ["zh-CN", "en"]) || fallback.countryZh;
  const isChina = country === "China" || String(countryZh).includes("中国");
  const province = isChina
    ? normalizeChinaDivisionName(pickLocalizedName(geo.subdivisions?.[0], ["zh-CN", "en"])) || UNKNOWN_PROVINCE_ZH
    : "";
  const city = pickLocalizedName(geo.city, ["zh-CN", "en"]) || "Unknown";
  const regionParts = [countryZh || country];
  if (province && province !== countryZh) regionParts.push(province);

  return {
    country,
    countryZh,
    province: province || UNKNOWN_PROVINCE_ZH,
    region: regionParts.filter(Boolean).join(" / ") || fallback.region,
    city,
    scope: isChina ? "境内暴露" : "境外暴露",
  };
}

function chunk(array, size) {
  const batches = [];
  for (let index = 0; index < array.length; index += size) {
    batches.push(array.slice(index, index + size));
  }
  return batches;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const productKey = String(args.product || "").trim().toLowerCase();
  if (!productKey || productKey === DEFAULT_CLAW_EXPOSURE_PRODUCT_KEY) {
    throw new Error("Please pass --product with a non-openclaw product key.");
  }

  const product = getClawExposureProduct(productKey);
  if (product.key !== productKey) {
    throw new Error(`Unknown product: ${productKey}`);
  }

  const sourceFile = args.file
    ? path.resolve(args.file)
    : readFirstExistingPath([
        process.env.CLAW_PRODUCT_DATA_DIR ? path.join(process.env.CLAW_PRODUCT_DATA_DIR, product.sourceFile) : "",
        path.join(projectRoot, "public", "data", "claw-products", product.sourceFile),
        path.join(projectRoot, "data", product.sourceFile),
        path.join(projectRoot, "..", "data", product.sourceFile),
        path.join(projectRoot, "..", "..", "data", product.sourceFile),
      ]);

  if (!sourceFile || !fs.existsSync(sourceFile)) {
    throw new Error(`Source file not found for ${productKey}.`);
  }

  const sourceStat = fs.statSync(sourceFile);
  const snapshotDate = parseInputDate(args.date) || new Date(sourceStat.mtime);
  snapshotDate.setUTCHours(0, 0, 0, 0);
  const dateKey = dateToCompactKey(snapshotDate);

  const cityReader = await openReader(
    "GeoLite2-City",
    [
      process.env.GEOLITE2_CITY_DB,
      path.join(projectRoot, "geoip", "GeoLite2-City.mmdb"),
      path.join(projectRoot, "data", "GeoLite2-City.mmdb"),
    ],
    "GeoLite2-City"
  );
  const asnReader = await openReader(
    "GeoLite2-ASN",
    [
      process.env.GEOLITE2_ASN_DB,
      path.join(projectRoot, "geoip", "GeoLite2-ASN.mmdb"),
      path.join(projectRoot, "data", "GeoLite2-ASN.mmdb"),
    ],
    "GeoLite2-ASN"
  );

  const ips = Array.from(
    new Set(
      fs
        .readFileSync(sourceFile, "utf8")
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => PRODUCT_IP_LINE_PATTERN.test(line))
    )
  ).sort((left, right) => left.localeCompare(right));

  const snapshot = await prisma.exposureSnapshot.upsert({
    where: {
      productKey_dateKey: {
        productKey,
        dateKey,
      },
    },
    update: {
      snapshotDate,
      sourceFile: path.basename(sourceFile),
    },
    create: {
      productKey,
      dateKey,
      snapshotDate,
      sourceFile: path.basename(sourceFile),
    },
  });

  await prisma.exposureVersionDailyAgg.deleteMany({
    where: {
      productKey,
      snapshotDate,
    },
  });
  await prisma.exposureDailyAgg.deleteMany({
    where: {
      productKey,
      snapshotDate,
    },
  });
  await prisma.exposureRecord.deleteMany({ where: { snapshotId: snapshot.id } });

  const rows = [];
  const versionCounter = new Map();
  const existingDistinctRows = await prisma.exposureRecord.findMany({
    where: { productKey },
    distinct: ["ip"],
    select: { ip: true },
  });
  const existingDistinctIps = new Set(existingDistinctRows.map((row) => row.ip));

  for (const ip of ips) {
    const geo = await resolveProductGeo(ip, cityReader);
    const asnGeo = asnReader?.get(ip);
    const asn = buildAsnProfile(asnGeo?.autonomous_system_number, asnGeo?.autonomous_system_organization);
    const version = "unknown";

    rows.push({
      snapshotId: snapshot.id,
      productKey,
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
      host: "-",
      service: product.service,
      serviceDesc: product.serviceDesc,
      status: "当前发现",
      scope: geo.scope,
      version,
      risk: product.riskLabel,
      lastSeen: snapshotDate,
    });

    versionCounter.set(version, (versionCounter.get(version) ?? 0) + 1);
  }

  for (const batch of chunk(rows, batchSize)) {
    await prisma.exposureRecord.createMany({ data: batch, skipDuplicates: true });
  }

  const domesticCount = rows.filter((row) => String(row.scope).includes("境内")).length;
  const exposedCount = rows.length;
  const overseasCount = exposedCount - domesticCount;
  const newDistinctIpCount = ips.filter((ip) => !existingDistinctIps.has(ip)).length;
  const cumulativeDistinctIpCount = new Set([...existingDistinctIps, ...ips]).size;

  await prisma.exposureDailyAgg.create({
    data: {
      productKey,
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
    productKey,
    snapshotDate,
    version,
    count,
  }));

  for (const batch of chunk(versionRows, batchSize)) {
    await prisma.exposureVersionDailyAgg.createMany({ data: batch, skipDuplicates: true });
  }

  cityReader?.close?.();
  asnReader?.close?.();

  console.log(
    `[import-product] Done. product=${productKey} dateKey=${dateKey} rows=${rows.length} source=${path.basename(sourceFile)}`
  );
}

main()
  .catch((error) => {
    console.error(`[import-product] Failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
