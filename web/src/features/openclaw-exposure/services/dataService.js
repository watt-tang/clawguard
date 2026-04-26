import { DATA_PATHS, FALLBACK_DATA_PATHS } from "../../../config.js";
import { DEFAULT_CLAW_EXPOSURE_PRODUCT_KEY } from "../../../../shared/clawExposureProducts.mjs";

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  const payload = await res.json();
  if (payload && typeof payload === "object" && "data" in payload && "code" in payload) {
    return payload.data;
  }
  return payload;
}

async function fetchWithFallback(primaryUrl, fallbackUrl) {
  try {
    return await fetchJson(primaryUrl);
  } catch {
    if (!fallbackUrl) throw new Error(`Primary endpoint failed: ${primaryUrl}`);
    return fetchJson(fallbackUrl);
  }
}

function withQuery(baseUrl, query = {}) {
  const entries = Object.entries(query).filter(([, value]) => value !== undefined && value !== null && value !== "");
  if (!entries.length) return baseUrl;
  const qs = new URLSearchParams(entries.map(([key, value]) => [key, String(value)])).toString();
  return `${baseUrl}?${qs}`;
}

function productQuery(productKey) {
  const normalizedKey = String(productKey || DEFAULT_CLAW_EXPOSURE_PRODUCT_KEY).toLowerCase();
  return normalizedKey === DEFAULT_CLAW_EXPOSURE_PRODUCT_KEY ? {} : { product: normalizedKey };
}

function fallbackForDefaultProduct(productKey, fallbackUrl) {
  const normalizedKey = String(productKey || DEFAULT_CLAW_EXPOSURE_PRODUCT_KEY).toLowerCase();
  return normalizedKey === DEFAULT_CLAW_EXPOSURE_PRODUCT_KEY ? fallbackUrl : null;
}

export function fetchStats(productKey = DEFAULT_CLAW_EXPOSURE_PRODUCT_KEY) {
  return fetchWithFallback(
    withQuery(DATA_PATHS.STATS, productQuery(productKey)),
    fallbackForDefaultProduct(productKey, FALLBACK_DATA_PATHS.STATS)
  );
}

export function fetchWorldDist(productKey = DEFAULT_CLAW_EXPOSURE_PRODUCT_KEY) {
  return fetchWithFallback(
    withQuery(DATA_PATHS.WORLD_DIST, productQuery(productKey)),
    fallbackForDefaultProduct(productKey, FALLBACK_DATA_PATHS.WORLD_DIST)
  );
}

export function fetchChinaDist(productKey = DEFAULT_CLAW_EXPOSURE_PRODUCT_KEY) {
  return fetchWithFallback(
    withQuery(DATA_PATHS.CHINA_DIST, productQuery(productKey)),
    fallbackForDefaultProduct(productKey, FALLBACK_DATA_PATHS.CHINA_DIST)
  );
}

export function fetchExposureTrend(productKey = DEFAULT_CLAW_EXPOSURE_PRODUCT_KEY) {
  return fetchWithFallback(
    withQuery(DATA_PATHS.EXPOSURE_TREND, productQuery(productKey)),
    fallbackForDefaultProduct(productKey, FALLBACK_DATA_PATHS.EXPOSURE_TREND)
  );
}

export function fetchVersionTrend(productKey = DEFAULT_CLAW_EXPOSURE_PRODUCT_KEY) {
  return fetchWithFallback(
    withQuery(DATA_PATHS.VERSION_TREND, productQuery(productKey)),
    fallbackForDefaultProduct(productKey, FALLBACK_DATA_PATHS.VERSION_TREND)
  );
}

function applyLocalFilterAndPage(payload, query = {}) {
  const allRows = Array.isArray(payload?.rows) ? payload.rows : [];
  const ip = String(query.ip ?? "").trim();
  const location = String(query.location ?? "").trim();
  const operator = String(query.operator ?? query.vendor ?? "").trim();
  const page = Math.max(1, Number(query.page ?? 1));
  const pageSize = Math.max(0, Number(query.page_size ?? 20));

  const filtered = allRows.filter((row) => {
    const ipMatch = !ip || String(row.ip ?? "").includes(ip);
    const locationField = String(row.region ?? row.location ?? "");
    const locationMatch = !location || locationField.includes(location);
    const operatorField = String(row.operator ?? row.vendor ?? "");
    const operatorMatch = !operator || operatorField.includes(operator);
    return ipMatch && locationMatch && operatorMatch;
  });

  const pagedRows =
    pageSize > 0 ? filtered.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize) : filtered;

  return {
    total: filtered.length,
    page,
    page_size: pageSize > 0 ? pageSize : pagedRows.length,
    latestSnapshot: payload?.latestSnapshot ?? "",
    sourceDir: payload?.sourceDir ?? "web/clawdbot_alive",
    rows: pagedRows,
  };
}

export async function fetchExposureList({
  productKey = DEFAULT_CLAW_EXPOSURE_PRODUCT_KEY,
  isLoggedIn = false,
  page = 1,
  page_size = 20,
  ip = "",
  location = "",
  operator = "",
} = {}) {
  const query = {
    ...productQuery(productKey),
    is_logged_in: isLoggedIn ? 1 : 0,
    page,
    page_size,
    ip,
    location,
    operator,
  };
  const url = withQuery(DATA_PATHS.EXPOSURE_LIST, query);

  try {
    return await fetchJson(url);
  } catch {
    if (String(productKey || DEFAULT_CLAW_EXPOSURE_PRODUCT_KEY).toLowerCase() !== DEFAULT_CLAW_EXPOSURE_PRODUCT_KEY) {
      return {
        total: 0,
        page,
        page_size,
        latestSnapshot: "",
        sourceDir: "",
        rows: [],
      };
    }
    const fallback = await fetchJson(FALLBACK_DATA_PATHS.EXPOSURE_DATA);
    return applyLocalFilterAndPage(fallback, query);
  }
}

export function buildCsvContent(rows, isLoggedIn) {
  const headers = [
    "IP地址",
    "主机名",
    "端口/服务",
    "地区",
    "城市",
    "AS",
    "运营商",
    "运行状态",
    "境内实例",
    "版本号",
    "历史漏洞关联",
    "最后发现时间",
  ];

  const maskIpFn = isLoggedIn
    ? (v) => v
    : (v) => {
      if (!v) return "";
      const p = String(v).split(".");
      return p.length === 4 ? `${p[0]}.*.*.${p[3]}` : String(v);
    };

  const maskFn = isLoggedIn ? (v) => v ?? "" : () => "***";

  const lines = [headers.join(",")];
  for (const r of rows) {
    lines.push(
      [
        maskIpFn(r.ip),
        r.host ?? "-",
        r.service ?? r.serviceDesc ?? "-",
        r.region ?? r.location ?? "-",
        maskFn(r.city),
        maskFn(r.asn ?? r.isp),
        r.operator ?? r.vendor ?? "-",
        r.status ?? "-",
        r.scope ?? "-",
        r.version ?? "-",
        r.risk ?? "-",
        r.lastSeen ?? r.lastSnapshot ?? "-",
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",")
    );
  }

  return lines.join("\n");
}

export function downloadCsv(content, filename) {
  const bom = "\uFEFF";
  const blob = new Blob([bom + content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
