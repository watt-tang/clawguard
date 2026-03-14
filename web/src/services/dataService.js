import { DATA_PATHS } from '../config.js';

/**
 * 通用 fetch 封装
 * @param {string} url
 * @returns {Promise<any>}
 */
async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  return res.json();
}

/** 加载情况分析统计数据 */
export function fetchStats() {
  return fetchJson(DATA_PATHS.STATS);
}

/** 加载全球暴露实例分布数据 */
export function fetchWorldDist() {
  return fetchJson(DATA_PATHS.WORLD_DIST);
}

/** 加载中国境内实例分布数据 */
export function fetchChinaDist() {
  return fetchJson(DATA_PATHS.CHINA_DIST);
}

/** 加载暴露实例演化趋势数据 */
export function fetchExposureTrend() {
  return fetchJson(DATA_PATHS.EXPOSURE_TREND);
}

/** 加载版本实例演化趋势数据 */
export function fetchVersionTrend() {
  return fetchJson(DATA_PATHS.VERSION_TREND);
}

/**
 * 加载暴露服务列表（主数据源）
 * 返回完整数据，分页和搜索在客户端处理
 */
export function fetchExposureList() {
  return fetchJson(DATA_PATHS.EXPOSURE_DATA);
}

/**
 * 构造下载 CSV 内容
 * @param {Array} rows   - 要导出的行数组
 * @param {boolean} isLoggedIn - 是否已登录（影响脱敏）
 * @returns {string} CSV 字符串
 */
export function buildCsvContent(rows, isLoggedIn) {
  const headers = [
    'IP地址', '主机名', '端口/服务', '地理位置', '城市', '运营商',
    '厂商', '运行状态', '境内实例', '版本号', '历史漏洞关联', '最后发现时间',
  ];
  const maskIpFn = isLoggedIn
    ? (v) => v
    : (v) => {
        if (!v) return '';
        const p = v.split('.');
        return p.length === 4 ? `${p[0]}.*.*.${p[3]}` : v;
      };
  const maskFn = isLoggedIn ? (v) => v ?? '' : () => '***';

  const lines = [headers.join(',')];
  for (const r of rows) {
    lines.push(
      [
        maskIpFn(r.ip),
        r.host ?? '-',
        r.service ?? '-',
        r.location ?? '-',
        maskFn(r.city),
        maskFn(r.isp),
        r.vendor ?? '-',
        r.status ?? '-',
        r.scope ?? '-',
        r.version ?? '-',
        r.risk ?? '-',
        r.lastSeen ?? '-',
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(',')
    );
  }
  return lines.join('\n');
}

/**
 * 触发浏览器下载 CSV 文件
 * @param {string} content
 * @param {string} filename
 */
export function downloadCsv(content, filename) {
  const bom = '\uFEFF'; // UTF-8 BOM for Excel
  const blob = new Blob([bom + content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
