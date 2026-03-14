/**
 * 全局路径与接口配置
 * 所有接口路径、静态数据路径、地图资源路径统一在此维护，
 * 组件内不允许硬编码任何 URL 或路径。
 */

/** 数据接口路径 */
export const DATA_PATHS = {
  /** 暴露服务列表（主数据源，由 generate-exposure-data.mjs 生成） */
  EXPOSURE_DATA: '/data/exposure-data.json',
  /** 情况分析统计卡片 */
  STATS: '/data/mock/stats.json',
  /** 全球暴露实例分布 */
  WORLD_DIST: '/data/mock/world-dist.json',
  /** 中国境内实例分布 */
  CHINA_DIST: '/data/mock/china-dist.json',
  /** 暴露实例演化趋势 */
  EXPOSURE_TREND: '/data/mock/exposure-trend.json',
  /** 版本实例演化趋势 */
  VERSION_TREND: '/data/mock/version-trend.json',
};

/** 地图 GeoJSON 资源路径（由 scripts/download-geo.mjs 下载到 public/data/geo/） */
export const GEO_PATHS = {
  WORLD: '/data/geo/world.json',
  CHINA: '/data/geo/china.json',
};

/** 页面标识常量 */
export const PAGE_IDS = {
  HOME: 'home',
  OPENCLAW_EXPOSURE: 'openclaw-exposure',
};

/** 表格每页可选数量 */
export const PAGE_SIZE_OPTIONS = [20, 50, 100];

/** 版本趋势图可选展示数量 */
export const VERSION_TOP_OPTIONS = [5, 10, 15, 20];
