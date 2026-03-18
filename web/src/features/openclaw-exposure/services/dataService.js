import { DATA_PATHS } from "../../../config.js";

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  return res.json();
}

export function fetchStats() {
  return fetchJson(DATA_PATHS.STATS);
}

export function fetchWorldDist() {
  return fetchJson(DATA_PATHS.WORLD_DIST);
}

export function fetchChinaDist() {
  return fetchJson(DATA_PATHS.CHINA_DIST);
}

export function fetchExposureTrend() {
  return fetchJson(DATA_PATHS.EXPOSURE_TREND);
}

export function fetchVersionTrend() {
  return fetchJson(DATA_PATHS.VERSION_TREND);
}

export function fetchExposureList() {
  return fetchJson(DATA_PATHS.EXPOSURE_DATA);
}

export function buildCsvContent(rows, isLoggedIn) {
  const headers = [
    "\u0049\u0050\u5730\u5740", // IP地址
    "\u4e3b\u673a\u540d", // 主机名
    "\u7aef\u53e3/\u670d\u52a1", // 端口/服务
    "\u5730\u533a", // 地区
    "\u57ce\u5e02", // 城市
    "AS",
    "\u5382\u5546", // 厂商
    "\u8fd0\u884c\u72b6\u6001", // 运行状态
    "\u5883\u5185\u5b9e\u4f8b", // 境内实例
    "\u7248\u672c\u53f7", // 版本号
    "\u5386\u53f2\u6f0f\u6d1e\u5173\u8054", // 历史漏洞关联
    "\u6700\u540e\u53d1\u73b0\u65f6\u95f4", // 最后发现时间
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
        r.vendor ?? "-",
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
