/** Global data and route configuration */

/** API endpoints */
export const DATA_PATHS = {
  STATS: "/api/exposure/stats",
  WORLD_DIST: "/api/exposure/world-distribution",
  CHINA_DIST: "/api/exposure/china-distribution",
  EXPOSURE_TREND: "/api/exposure/trend",
  VERSION_TREND: "/api/exposure/version-trend",
  EXPOSURE_LIST: "/api/exposure/list",
  OPENCLAW_RISK_OVERVIEW: "/api/openclaw-risk/overview",
  OPENCLAW_RISK_ISSUES: "/api/openclaw-risk/issues",
  SECURITY_RESEARCH_OVERVIEW: "/api/security-research/overview",
  SECURITY_RESEARCH_PAPERS: "/api/security-research/papers",
};

/** Static fallback paths when API is unavailable */
export const FALLBACK_DATA_PATHS = {
  EXPOSURE_DATA: "/data/exposure-data.json",
  STATS: "/data/mock/stats.json",
  WORLD_DIST: "/data/mock/world-dist.json",
  CHINA_DIST: "/data/mock/china-dist.json",
  EXPOSURE_TREND: "/data/mock/exposure-trend.json",
  VERSION_TREND: "/data/mock/version-trend.json",
};

/** Map GeoJSON resources */
export const GEO_PATHS = {
  WORLD: "/data/geo/world.json",
  CHINA: "/data/geo/china.json",
};

/** Page identifiers */
export const PAGE_IDS = {
  HOME: "home",
  OPENCLAW_EXPOSURE: "openclaw-exposure",
  SECURITY_RESEARCH: "openclaw-deploy",
};

/** Table page-size options */
export const PAGE_SIZE_OPTIONS = [20, 50, 100];

export const AUTH_CONFIG = {
  ADMIN_DEFAULT_API_KEY: import.meta.env.VITE_ADMIN_DEFAULT_API_KEY || "",
};

/** Version trend selectable lines */
export const VERSION_TOP_OPTIONS = [5, 10, 15, 20];
