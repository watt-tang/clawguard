import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import maxmind from "maxmind";
import { prisma } from "../lib/prisma.mjs";
import { formatDate, formatDateTime } from "../lib/date.mjs";
import { buildAsnProfile } from "../lib/operator.mjs";
import {
  DEFAULT_CLAW_EXPOSURE_PRODUCT_KEY,
  getClawExposureProduct,
} from "../../shared/clawExposureProducts.mjs";

const DEFAULT_SOURCE_DIR = "web/clawdbot_alive";
const CACHE_TTL_MS = Math.max(1000, Number(process.env.EXPOSURE_CACHE_TTL_MS || 30000));
const endpointCache = new Map();
const geoLookupCache = new Map();
let cityReaderPromise;
let asnReaderPromise;
const DOMESTIC_SCOPE_KEYWORD = "\u5883\u5185";
const DOMESTIC_SCOPE_LIKE = `%${DOMESTIC_SCOPE_KEYWORD}%`;
const HIGH_RISK_CN = "\u9AD8\u5371";
const UNKNOWN_PROVINCE_ZH = "\u672A\u77E5";
const INVALID_CHINA_DIVISION_NAMES = new Set(["", "-", "Unknown", "unknown", UNKNOWN_PROVINCE_ZH, "δ֪"]);

const INVALID_GEO_NAMES = new Set(["", "-", "Unknown", "unknown", "UNKNOWN", "\u672A\u77E5", UNKNOWN_PROVINCE_ZH]);
const PRODUCT_IP_LINE_PATTERN = /^\d{1,3}(?:\.\d{1,3}){3}$/;
const DOMESTIC_IP_PREFIXES = new Set([
  10, 36, 39, 42, 43, 47, 49, 58, 59, 60, 61, 101, 106, 111, 112, 113, 114,
  115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 139, 140, 150, 152,
  153, 157, 159, 161, 163, 171, 175, 180, 182, 183, 202, 203, 210, 211, 218,
  219, 220, 221, 222,
]);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "../..");

function normalizeChinaDivisionName(name) {
  const raw = String(name || "").trim();
  if (!raw || INVALID_CHINA_DIVISION_NAMES.has(raw)) return "";

  const specialCases = {
    "\u5185\u8499\u53e4\u81ea\u6cbb\u533a": "\u5185\u8499\u53e4",
    "\u5e7f\u897f\u58ee\u65cf\u81ea\u6cbb\u533a": "\u5e7f\u897f",
    "\u5b81\u590f\u56de\u65cf\u81ea\u6cbb\u533a": "\u5b81\u590f",
    "\u65b0\u7586\u7ef4\u543e\u5c14\u81ea\u6cbb\u533a": "\u65b0\u7586",
    "\u897f\u85cf\u81ea\u6cbb\u533a": "\u897f\u85cf",
    "\u9999\u6e2f\u7279\u522b\u884c\u653f\u533a": "\u9999\u6e2f",
    "\u6fb3\u95e8\u7279\u522b\u884c\u653f\u533a": "\u6fb3\u95e8",
  };

  if (specialCases[raw]) return specialCases[raw];

  const cleaned = raw
    .replace(/特别行政区$/u, "")
    .replace(/壮族自治区$/u, "")
    .replace(/回族自治区$/u, "")
    .replace(/维吾尔自治区$/u, "")
    .replace(/自治区$/u, "")
    .replace(/省$/u, "")
    .replace(/市$/u, "")
    .trim();

  if (!cleaned || INVALID_CHINA_DIVISION_NAMES.has(cleaned)) return "";
  return cleaned;
}

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

function maskIp(ip) {
  if (!ip) return "";
  const parts = String(ip).split(".");
  return parts.length === 4 ? `${parts[0]}.*.*.${parts[3]}` : String(ip);
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

function normalizeGeoName(value) {
  const raw = String(value || "").trim();
  if (!raw || INVALID_GEO_NAMES.has(raw)) return "";
  return raw;
}

async function getCityReader() {
  if (!cityReaderPromise) {
    cityReaderPromise = (async () => {
      const dbPath = readFirstExistingPath([
        process.env.GEOLITE2_CITY_DB,
        path.join(projectRoot, "geoip", "GeoLite2-City.mmdb"),
        path.join(projectRoot, "data", "GeoLite2-City.mmdb"),
        path.join(projectRoot, "GeoLite2-City.mmdb"),
        path.join(projectRoot, "server", "data", "GeoLite2-City.mmdb"),
      ]);

      if (!dbPath) return null;

      try {
        return await maxmind.open(dbPath);
      } catch (error) {
        console.warn(`[exposure-api] Failed to load GeoLite2-City: ${error.message}`);
        return null;
      }
    })();
  }

  return cityReaderPromise;
}

async function getAsnReader() {
  if (!asnReaderPromise) {
    asnReaderPromise = (async () => {
      const dbPath = readFirstExistingPath([
        process.env.GEOLITE2_ASN_DB,
        path.join(projectRoot, "geoip", "GeoLite2-ASN.mmdb"),
        path.join(projectRoot, "data", "GeoLite2-ASN.mmdb"),
        path.join(projectRoot, "GeoLite2-ASN.mmdb"),
        path.join(projectRoot, "server", "data", "GeoLite2-ASN.mmdb"),
      ]);

      if (!dbPath) return null;

      try {
        return await maxmind.open(dbPath);
      } catch (error) {
        console.warn(`[exposure-api] Failed to load GeoLite2-ASN: ${error.message}`);
        return null;
      }
    })();
  }

  return asnReaderPromise;
}

async function lookupLocalizedGeo(ip) {
  const normalizedIp = String(ip || "").trim();
  if (!normalizedIp) return null;

  if (geoLookupCache.has(normalizedIp)) {
    return geoLookupCache.get(normalizedIp);
  }

  const reader = await getCityReader();
  if (!reader) {
    geoLookupCache.set(normalizedIp, null);
    return null;
  }

  const geo = reader.get(normalizedIp);
  const localized = geo
    ? {
        countryZh: normalizeGeoName(pickLocalizedName(geo.country, ["zh-CN", "en"])),
        subdivisionZh: normalizeGeoName(pickLocalizedName(geo.subdivisions?.[0], ["zh-CN", "en"])),
        cityZh: normalizeGeoName(pickLocalizedName(geo.city, ["zh-CN", "en"])),
      }
    : null;

  geoLookupCache.set(normalizedIp, localized);
  return localized;
}

function buildLocalizedRegion(row, localizedGeo) {
  const country =
    normalizeGeoName(localizedGeo?.countryZh) || normalizeGeoName(row.countryZh) || normalizeGeoName(row.country);
  const isChina = row.country === "China" || String(row.countryZh || "").includes("\u4E2D\u56FD");
  const subdivision = normalizeGeoName(localizedGeo?.subdivisionZh) || (isChina ? normalizeGeoName(row.province) : "");

  const parts = [];
  if (country) parts.push(country);
  if (subdivision && subdivision !== country) parts.push(subdivision);

  if (parts.length) {
    return parts.join(" / ");
  }

  return row.region || row.location || "-";
}

function buildLocalizedCity(row, localizedGeo) {
  return normalizeGeoName(localizedGeo?.cityZh) || normalizeGeoName(row.city) || "-";
}

function readCache(key) {
  const cached = endpointCache.get(key);
  if (!cached) return null;
  if (cached.expiresAt <= Date.now()) {
    endpointCache.delete(key);
    return null;
  }
  return cached.data;
}

function writeCache(key, data, ttlMs = CACHE_TTL_MS) {
  endpointCache.set(key, {
    data,
    expiresAt: Date.now() + ttlMs,
  });
  return data;
}

function buildCacheKey(endpoint, latestSnapshot, productKey = DEFAULT_CLAW_EXPOSURE_PRODUCT_KEY) {
  return `${endpoint}:${productKey}:${latestSnapshot?.dateKey || "none"}`;
}

function normalizeExposureProductKey(query = {}) {
  const requestedKey = typeof query === "string" ? query : query.product || query.productKey;
  return getClawExposureProduct(requestedKey).key;
}

function isDefaultExposureProduct(productKey) {
  return productKey === DEFAULT_CLAW_EXPOSURE_PRODUCT_KEY;
}

function dateToCompactKey(dateValue) {
  if (!dateValue) return "";
  const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

function inferProductGeoFallback(ip) {
  const firstOctet = Number(String(ip || "").split(".")[0]);
  const isDomestic = DOMESTIC_IP_PREFIXES.has(firstOctet);
  return {
    country: isDomestic ? "China" : "Unknown",
    countryZh: isDomestic ? "\u4E2D\u56FD" : "\u672A\u77E5",
    province: UNKNOWN_PROVINCE_ZH,
    region: isDomestic ? "\u4E2D\u56FD" : "Unknown",
    city: "Unknown",
    scope: isDomestic ? "\u5883\u5185\u66B4\u9732" : "\u5883\u5916\u66B4\u9732",
  };
}

async function lookupProductGeo(ip) {
  const fallback = inferProductGeoFallback(ip);
  const reader = await getCityReader();
  if (!reader) return fallback;

  const geo = reader.get(ip);
  if (!geo) return fallback;

  const country = normalizeGeoName(pickLocalizedName(geo.country, ["en", "zh-CN"])) || fallback.country;
  const countryZh = normalizeGeoName(pickLocalizedName(geo.country, ["zh-CN", "en"])) || fallback.countryZh;
  const isChina = country === "China" || String(countryZh || "").includes("\u4E2D\u56FD");
  const province = isChina
    ? normalizeChinaDivisionName(pickLocalizedName(geo.subdivisions?.[0], ["zh-CN", "en"])) || UNKNOWN_PROVINCE_ZH
    : "";
  const city = normalizeGeoName(pickLocalizedName(geo.city, ["zh-CN", "en"])) || "Unknown";
  const regionParts = [countryZh || country];
  if (province && province !== countryZh) regionParts.push(province);

  return {
    country,
    countryZh,
    province: province || UNKNOWN_PROVINCE_ZH,
    region: regionParts.filter(Boolean).join(" / ") || fallback.region,
    city,
    scope: isChina ? "\u5883\u5185\u66B4\u9732" : "\u5883\u5916\u66B4\u9732",
  };
}

async function lookupProductAsn(ip) {
  const reader = await getAsnReader();
  const asnGeo = reader?.get(ip);
  return buildAsnProfile(asnGeo?.autonomous_system_number, asnGeo?.autonomous_system_organization);
}

function findProductSourceFile(product) {
  if (!product?.sourceFile) return null;

  return readFirstExistingPath([
    process.env.CLAW_PRODUCT_DATA_DIR ? path.join(process.env.CLAW_PRODUCT_DATA_DIR, product.sourceFile) : "",
    path.join(projectRoot, "public", "data", "claw-products", product.sourceFile),
    path.join(projectRoot, "..", "data", product.sourceFile),
    path.join(projectRoot, "..", "..", "data", product.sourceFile),
  ]);
}

async function buildProductRow(ip, index, product, sourceDate) {
  const [geo, asn] = await Promise.all([lookupProductGeo(ip), lookupProductAsn(ip)]);

  return {
    id: `${product.key}-${ip}`,
    ip,
    country: geo.country,
    countryZh: geo.countryZh,
    province: geo.province,
    host: index % 3 === 0 ? "\u4EA7\u54C1\u516C\u7F51\u8282\u70B9" : "-",
    service: product.service,
    serviceDesc: product.serviceDesc,
    region: geo.region,
    location: geo.region,
    city: geo.city,
    isp: asn.isp,
    asn: asn.asn,
    operator: asn.operator,
    vendor: asn.operator,
    status: "\u5F53\u524D\u53D1\u73B0",
    scope: geo.scope,
    version: "unknown",
    risk: product.riskLabel,
    lastSeen: sourceDate,
    snapshotDate: sourceDate,
  };
}

async function loadProductExposureDataset(productKey) {
  const product = getClawExposureProduct(productKey);
  const sourceFilePath = findProductSourceFile(product);
  const sourceDir = sourceFilePath ? path.dirname(sourceFilePath) : "";

  if (!sourceFilePath) {
    return {
      product,
      sourceFilePath: "",
      sourceDir,
      sourceDate: null,
      dateKey: "",
      rows: [],
    };
  }

  const stat = fs.statSync(sourceFilePath);
  const cacheKey = `product-dataset:${product.key}:${sourceFilePath}:${stat.size}:${stat.mtimeMs}`;
  const cached = readCache(cacheKey);
  if (cached) return cached;

  const sourceDate = stat.mtime;
  const ips = Array.from(
    new Set(
      fs
        .readFileSync(sourceFilePath, "utf8")
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => PRODUCT_IP_LINE_PATTERN.test(line))
    )
  ).sort((left, right) => left.localeCompare(right));

  const rows = await Promise.all(ips.map((ip, index) => buildProductRow(ip, index, product, sourceDate)));

  return writeCache(cacheKey, {
    product,
    sourceFilePath,
    sourceDir,
    sourceDate,
    dateKey: dateToCompactKey(sourceDate),
    rows,
  });
}

function countDistinct(rows, key, invalidValues = INVALID_GEO_NAMES) {
  const values = new Set();
  for (const row of rows) {
    const value = String(row[key] || "").trim();
    if (!value || invalidValues.has(value)) continue;
    values.add(value);
  }
  return values.size;
}

function groupRowsByCount(rows, key) {
  const counter = new Map();
  for (const row of rows) {
    const value = String(row[key] || "").trim();
    if (!value || INVALID_GEO_NAMES.has(value)) continue;
    counter.set(value, (counter.get(value) ?? 0) + 1);
  }
  return Array.from(counter.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((left, right) => right.value - left.value);
}

function filterProductRows(rows, query = {}) {
  const ip = String(query.ip || "").trim();
  const location = String(query.location || "").trim().toLowerCase();
  const operator = String(query.operator || query.vendor || "").trim().toLowerCase();

  return rows.filter((row) => {
    const ipMatch = !ip || String(row.ip || "").includes(ip);
    const locationText = [row.region, row.location, row.country, row.countryZh, row.province, row.city]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    const operatorText = String(row.operator || row.vendor || "").toLowerCase();
    return ipMatch && (!location || locationText.includes(location)) && (!operator || operatorText.includes(operator));
  });
}

function toProductResponseRow(row, isLoggedIn) {
  const formatted = {
    ...row,
    lastSeen: formatDate(row.lastSeen),
    lastSnapshot: formatDate(row.snapshotDate),
  };

  if (isLoggedIn) return formatted;

  return {
    ...formatted,
    ip: maskIp(formatted.ip),
    city: "***",
    asn: "***",
    isp: "***",
  };
}

async function getProductExposureStats(productKey) {
  const dataset = await loadProductExposureDataset(productKey);
  const rows = dataset.rows;
  const domesticTotal = rows.filter((row) => String(row.scope || "").includes(DOMESTIC_SCOPE_KEYWORD)).length;
  const highRiskCount = rows.filter((row) => String(row.risk || "").includes("\u9AD8\u98CE\u9669")).length;

  return {
    historyTotal: rows.length,
    currentExposed: rows.length,
    domesticTotal,
    overseasTotal: rows.length - domesticTotal,
    countryCoverage: countDistinct(rows, "country"),
    cityCount: countDistinct(rows, "city"),
    operatorCount: countDistinct(rows, "operator"),
    vendorCount: countDistinct(rows, "operator"),
    highRiskCount,
    updatedAt: dataset.sourceDate ? formatDateTime(dataset.sourceDate) : "",
    product: dataset.product.key,
    sourceFile: dataset.product.sourceLabel,
  };
}

async function getProductWorldDistribution(productKey) {
  const dataset = await loadProductExposureDataset(productKey);
  return { topCountries: groupRowsByCount(dataset.rows, "country") };
}

async function getProductChinaDistribution(productKey) {
  const dataset = await loadProductExposureDataset(productKey);
  const provinceMap = new Map();

  for (const row of dataset.rows) {
    if (!String(row.scope || "").includes(DOMESTIC_SCOPE_KEYWORD)) continue;
    const normalizedName = normalizeChinaDivisionName(row.province);
    if (!normalizedName) continue;
    provinceMap.set(normalizedName, (provinceMap.get(normalizedName) ?? 0) + 1);
  }

  const provinces = Array.from(provinceMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((left, right) => right.value - left.value);

  return { provinces };
}

async function getProductExposureTrend(productKey) {
  const dataset = await loadProductExposureDataset(productKey);
  const date = dataset.sourceDate ? formatDate(dataset.sourceDate) : "";
  return {
    dates: date ? [date] : [],
    daily: date ? [dataset.rows.length] : [],
    cumulative: date ? [dataset.rows.length] : [],
    newAdded: date ? [dataset.rows.length] : [],
  };
}

async function getProductVersionTrend(productKey) {
  const dataset = await loadProductExposureDataset(productKey);
  const date = dataset.sourceDate ? formatDate(dataset.sourceDate) : "";
  return {
    dates: date ? [date] : [],
    versions: date ? { unknown: [dataset.rows.length] } : {},
  };
}

async function getProductExposureList(productKey, query = {}) {
  const dataset = await loadProductExposureDataset(productKey);
  const page = Math.max(1, Number(query.page || 1));
  const hasPageSize = query.page_size !== undefined && query.page_size !== null && query.page_size !== "";
  const parsedPageSize = Number(hasPageSize ? query.page_size : 20);
  const pageSize = Number.isFinite(parsedPageSize) ? Math.max(0, parsedPageSize) : 20;
  const isLoggedIn = query.is_logged_in === "1" || query.is_logged_in === "true" || query.is_logged_in === true;
  const filtered = filterProductRows(dataset.rows, query);
  const pagedRows =
    pageSize > 0 ? filtered.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize) : filtered;

  return {
    total: filtered.length,
    page,
    page_size: pageSize > 0 ? pageSize : pagedRows.length,
    latestSnapshot: dataset.dateKey,
    sourceDir: dataset.sourceDir ? path.relative(projectRoot, dataset.sourceDir) : "",
    rows: pagedRows.map((row) => toProductResponseRow(row, isLoggedIn)),
  };
}

async function toResponseRow(row, latestDateKey, isLoggedIn) {
  const localizedGeo = await lookupLocalizedGeo(row.ip);
  const localizedRegion = buildLocalizedRegion(row, localizedGeo);
  const localizedCity = buildLocalizedCity(row, localizedGeo);

  const formatted = {
    id: `${row.ip}-${latestDateKey}`,
    ip: row.ip,
    host: row.host,
    service: row.service,
    serviceDesc: row.serviceDesc,
    region: localizedRegion,
    location: localizedRegion,
    city: localizedCity,
    isp: row.isp,
    asn: row.asn,
    operator: row.operator,
    vendor: row.operator,
    status: row.status,
    scope: row.scope,
    version: row.version,
    risk: row.risk,
    lastSeen: formatDate(row.lastSeen),
    lastSnapshot: formatDate(row.snapshotDate),
  };

  if (isLoggedIn) return formatted;

  return {
    ...formatted,
    ip: maskIp(formatted.ip),
    city: "***",
    asn: "***",
    isp: "***",
  };
}

async function findLatestSnapshot(productKey = DEFAULT_CLAW_EXPOSURE_PRODUCT_KEY) {
  return prisma.exposureSnapshot.findFirst({
    where: { productKey },
    orderBy: { snapshotDate: "desc" },
  });
}

export async function getExposureStats(query = {}) {
  const productKey = normalizeExposureProductKey(query);
  const latest = await findLatestSnapshot(productKey);
  if (!latest) {
    if (!isDefaultExposureProduct(productKey)) {
      return getProductExposureStats(productKey);
    }
    return {
      historyTotal: 0,
      currentExposed: 0,
      domesticTotal: 0,
      overseasTotal: 0,
      countryCoverage: 0,
      cityCount: 0,
      operatorCount: 0,
      vendorCount: 0,
      highRiskCount: 0,
      updatedAt: "",
    };
  }

  const cacheKey = buildCacheKey("stats", latest, productKey);
  const cached = readCache(cacheKey);
  if (cached) return cached;

  const latestAgg = await prisma.exposureDailyAgg.findUnique({
    where: {
      productKey_snapshotDate: {
        productKey,
        snapshotDate: latest.snapshotDate,
      },
    },
  });

  let historyTotal = latestAgg?.cumulativeDistinctIpCount;
  let currentExposed = latestAgg?.exposedCount;
  let domesticTotal = latestAgg?.domesticCount;
  let overseasTotal = latestAgg?.overseasCount;

  if (!latestAgg) {
    const [historyRows, scopeRows] = await Promise.all([
      prisma.$queryRaw`
        SELECT COUNT(DISTINCT ip) AS count
        FROM ExposureRecord
        WHERE productKey = ${productKey}
      `,
      prisma.$queryRaw`
        SELECT
          SUM(CASE WHEN scope LIKE ${DOMESTIC_SCOPE_LIKE} THEN 1 ELSE 0 END) AS domesticCount,
          SUM(CASE WHEN scope LIKE ${DOMESTIC_SCOPE_LIKE} THEN 0 ELSE 1 END) AS overseasCount
        FROM ExposureRecord
        WHERE snapshotId = ${latest.id}
      `,
    ]);

    historyTotal = toInt(historyRows?.[0]?.count);
    domesticTotal = toInt(scopeRows?.[0]?.domesticCount);
    overseasTotal = toInt(scopeRows?.[0]?.overseasCount);
    currentExposed = domesticTotal + overseasTotal;
  }

  const [coverageRows, highRiskCount] = await Promise.all([
    prisma.$queryRaw`
      SELECT
        COUNT(DISTINCT CASE WHEN country <> 'Unknown' THEN country END) AS countryCount,
        COUNT(DISTINCT CASE WHEN city <> 'Unknown' THEN city END) AS cityCount,
        COUNT(DISTINCT operator) AS operatorCount
      FROM ExposureRecord
      WHERE snapshotId = ${latest.id}
    `,
    prisma.exposureRecord.count({
      where: {
        snapshotId: latest.id,
        OR: [{ risk: { contains: HIGH_RISK_CN } }, { risk: { contains: "high" } }, { risk: { contains: "HIGH" } }],
      },
    }),
  ]);

  return writeCache(cacheKey, {
    historyTotal: toInt(historyTotal),
    currentExposed: toInt(currentExposed),
    domesticTotal: toInt(domesticTotal),
    overseasTotal: toInt(overseasTotal),
    countryCoverage: toInt(coverageRows?.[0]?.countryCount),
    cityCount: toInt(coverageRows?.[0]?.cityCount),
    operatorCount: toInt(coverageRows?.[0]?.operatorCount),
    vendorCount: toInt(coverageRows?.[0]?.operatorCount),
    highRiskCount,
    updatedAt: formatDateTime(latestAgg?.updatedAt || latest.updatedAt),
    product: productKey,
    sourceFile: latest.sourceFile,
  });
}

export async function getWorldDistribution(query = {}) {
  const productKey = normalizeExposureProductKey(query);
  const latest = await findLatestSnapshot(productKey);
  if (!latest) {
    if (!isDefaultExposureProduct(productKey)) {
      return getProductWorldDistribution(productKey);
    }
    return { topCountries: [] };
  }

  const cacheKey = buildCacheKey("world-distribution", latest, productKey);
  const cached = readCache(cacheKey);
  if (cached) return cached;

  const grouped = await prisma.exposureRecord.groupBy({
    by: ["country"],
    where: {
      snapshotId: latest.id,
      country: { not: "Unknown" },
    },
    _count: { _all: true },
  });

  const topCountries = grouped
    .map((item) => ({ name: item.country, value: toInt(item._count._all) }))
    .sort((a, b) => b.value - a.value);

  return writeCache(cacheKey, { topCountries });
}

export async function getChinaDistribution(query = {}) {
  const productKey = normalizeExposureProductKey(query);
  const latest = await findLatestSnapshot(productKey);
  if (!latest) {
    if (!isDefaultExposureProduct(productKey)) {
      return getProductChinaDistribution(productKey);
    }
    return { provinces: [] };
  }

  const cacheKey = buildCacheKey("china-distribution", latest, productKey);
  const cached = readCache(cacheKey);
  if (cached) return cached;

  const grouped = await prisma.exposureRecord.groupBy({
    by: ["province"],
    where: {
      snapshotId: latest.id,
      scope: { contains: DOMESTIC_SCOPE_KEYWORD },
      province: { not: UNKNOWN_PROVINCE_ZH },
    },
    _count: { _all: true },
  });

  const provinceMap = new Map();

  for (const item of grouped) {
    const normalizedName = normalizeChinaDivisionName(item.province);
    if (!normalizedName) continue;
    provinceMap.set(normalizedName, (provinceMap.get(normalizedName) ?? 0) + toInt(item._count._all));
  }

  const provinces = Array.from(provinceMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  return writeCache(cacheKey, { provinces });
}

async function buildExposureTrendFromRaw(snapshots, productKey) {
  const dates = snapshots.map((item) => formatDate(item.snapshotDate));

  const dailyGroups = await prisma.exposureRecord.groupBy({
    by: ["snapshotDate"],
    where: { productKey },
    _count: { _all: true },
  });

  const dailyMap = new Map(dailyGroups.map((item) => [formatDate(item.snapshotDate), toInt(item._count._all)]));
  const daily = dates.map((date) => dailyMap.get(date) ?? 0);

  const firstSeenRows = await prisma.$queryRaw`
    SELECT first_seen AS snapshotDate, COUNT(*) AS count
    FROM (
      SELECT MIN(snapshotDate) AS first_seen
      FROM ExposureRecord
      WHERE productKey = ${productKey}
      GROUP BY ip
    ) t
    GROUP BY first_seen
    ORDER BY first_seen ASC
  `;

  const firstSeenMap = new Map(firstSeenRows.map((item) => [formatDate(item.snapshotDate), toInt(item.count)]));
  const newAdded = dates.map((date) => firstSeenMap.get(date) ?? 0);

  let running = 0;
  const cumulative = newAdded.map((count) => {
    running += count;
    return running;
  });

  return { dates, daily, cumulative, newAdded };
}

export async function getExposureTrend(query = {}) {
  const productKey = normalizeExposureProductKey(query);
  const latest = await findLatestSnapshot(productKey);
  if (!latest) {
    if (!isDefaultExposureProduct(productKey)) {
      return getProductExposureTrend(productKey);
    }
    return { dates: [], daily: [], cumulative: [], newAdded: [] };
  }

  const cacheKey = buildCacheKey("trend", latest, productKey);
  const cached = readCache(cacheKey);
  if (cached) return cached;

  const snapshots = await prisma.exposureSnapshot.findMany({
    where: { productKey },
    orderBy: { snapshotDate: "asc" },
    select: { snapshotDate: true },
  });

  if (!snapshots.length) {
    return writeCache(cacheKey, { dates: [], daily: [], cumulative: [], newAdded: [] });
  }

  const aggRows = await prisma.exposureDailyAgg.findMany({
    where: { productKey },
    orderBy: { snapshotDate: "asc" },
    select: {
      snapshotDate: true,
      exposedCount: true,
      newDistinctIpCount: true,
      cumulativeDistinctIpCount: true,
    },
  });

  if (aggRows.length) {
    const dates = snapshots.map((item) => formatDate(item.snapshotDate));
    const aggMap = new Map(aggRows.map((item) => [formatDate(item.snapshotDate), item]));
    const daily = [];
    const newAdded = [];
    const cumulative = [];
    let running = 0;

    for (const date of dates) {
      const row = aggMap.get(date);
      const dailyCount = row?.exposedCount ?? 0;
      const newCount = row?.newDistinctIpCount ?? 0;
      const cumulativeCount = row?.cumulativeDistinctIpCount;

      running = Number.isFinite(cumulativeCount) ? cumulativeCount : running + newCount;
      daily.push(dailyCount);
      newAdded.push(newCount);
      cumulative.push(running);
    }

    return writeCache(cacheKey, { dates, daily, cumulative, newAdded });
  }

  const fallback = await buildExposureTrendFromRaw(snapshots, productKey);
  return writeCache(cacheKey, fallback);
}

async function buildVersionTrendFromRaw(snapshots, productKey) {
  const dates = snapshots.map((item) => formatDate(item.snapshotDate));
  const dateIndexMap = new Map(dates.map((date, idx) => [date, idx]));

  const groups = await prisma.exposureRecord.groupBy({
    by: ["snapshotDate", "version"],
    where: { productKey },
    _count: { _all: true },
  });

  const versions = {};

  for (const group of groups) {
    const versionName = group.version || "unknown";
    if (!versions[versionName]) {
      versions[versionName] = Array.from({ length: dates.length }, () => 0);
    }

    const idx = dateIndexMap.get(formatDate(group.snapshotDate));
    if (idx !== undefined) {
      versions[versionName][idx] = toInt(group._count._all);
    }
  }

  return { dates, versions };
}

export async function getVersionTrend(query = {}) {
  const productKey = normalizeExposureProductKey(query);
  const latest = await findLatestSnapshot(productKey);
  if (!latest) {
    if (!isDefaultExposureProduct(productKey)) {
      return getProductVersionTrend(productKey);
    }
    return { dates: [], versions: {} };
  }

  const cacheKey = buildCacheKey("version-trend", latest, productKey);
  const cached = readCache(cacheKey);
  if (cached) return cached;

  const snapshots = await prisma.exposureSnapshot.findMany({
    where: { productKey },
    orderBy: { snapshotDate: "asc" },
    select: { snapshotDate: true },
  });

  if (!snapshots.length) {
    return writeCache(cacheKey, { dates: [], versions: {} });
  }

  const dates = snapshots.map((item) => formatDate(item.snapshotDate));
  const dateIndexMap = new Map(dates.map((date, idx) => [date, idx]));

  const aggRows = await prisma.exposureVersionDailyAgg.findMany({
    where: { productKey },
    orderBy: [{ snapshotDate: "asc" }, { version: "asc" }],
    select: {
      snapshotDate: true,
      version: true,
      count: true,
    },
  });

  if (aggRows.length) {
    const versions = {};

    for (const row of aggRows) {
      const versionName = row.version || "unknown";
      if (!versions[versionName]) {
        versions[versionName] = Array.from({ length: dates.length }, () => 0);
      }

      const idx = dateIndexMap.get(formatDate(row.snapshotDate));
      if (idx !== undefined) {
        versions[versionName][idx] = toInt(row.count);
      }
    }

    return writeCache(cacheKey, { dates, versions });
  }

  const fallback = await buildVersionTrendFromRaw(snapshots, productKey);
  return writeCache(cacheKey, fallback);
}

export async function getExposureList(query = {}) {
  const productKey = normalizeExposureProductKey(query);
  const latest = await findLatestSnapshot(productKey);
  if (!latest) {
    if (!isDefaultExposureProduct(productKey)) {
      return getProductExposureList(productKey, query);
    }
    return {
      total: 0,
      page: 1,
      page_size: 20,
      latestSnapshot: "",
      sourceDir: DEFAULT_SOURCE_DIR,
      rows: [],
    };
  }

  const page = Math.max(1, Number(query.page || 1));
  const hasPageSize = query.page_size !== undefined && query.page_size !== null && query.page_size !== "";
  const parsedPageSize = Number(hasPageSize ? query.page_size : 20);
  const pageSize = Number.isFinite(parsedPageSize) ? Math.max(0, parsedPageSize) : 20;
  const isLoggedIn = query.is_logged_in === "1" || query.is_logged_in === "true" || query.is_logged_in === true;

  const ip = String(query.ip || "").trim();
  const location = String(query.location || "").trim();
  const operator = String(query.operator || query.vendor || "").trim();

  const where = { snapshotId: latest.id, productKey };

  if (ip) {
    where.ip = { contains: ip };
  }

  if (operator) {
    where.operator = { contains: operator };
  }

  if (location) {
    where.OR = [
      { region: { contains: location } },
      { country: { contains: location } },
      { countryZh: { contains: location } },
      { province: { contains: location } },
      { city: { contains: location } },
    ];
  }

  const total = await prisma.exposureRecord.count({ where });

  const queryOptions = {
    where,
    orderBy: [{ ip: "asc" }],
    select: {
      ip: true,
      country: true,
      countryZh: true,
      province: true,
      host: true,
      service: true,
      serviceDesc: true,
      region: true,
      city: true,
      isp: true,
      asn: true,
      operator: true,
      status: true,
      scope: true,
      version: true,
      risk: true,
      lastSeen: true,
      snapshotDate: true,
    },
  };

  if (pageSize > 0) {
    queryOptions.skip = (page - 1) * pageSize;
    queryOptions.take = pageSize;
  }

  const rawRows = await prisma.exposureRecord.findMany(queryOptions);
  const rows = await Promise.all(rawRows.map((row) => toResponseRow(row, latest.dateKey, isLoggedIn)));

  return {
    total,
    page,
    page_size: pageSize > 0 ? pageSize : rows.length,
    latestSnapshot: latest.dateKey,
    sourceDir: isDefaultExposureProduct(productKey) ? DEFAULT_SOURCE_DIR : "database",
    rows,
  };
}
