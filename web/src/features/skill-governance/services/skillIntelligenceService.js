const SKILL_INTELLIGENCE_OVERVIEW_ENDPOINT = "/api/skill/intelligence/overview";
const SKILL_INTELLIGENCE_CACHE_PREFIX = "clawguard.skill.intelligence.overview:";
const SKILL_INTELLIGENCE_CACHE_TTL_MS = 5 * 60 * 1000;

const memoryCache = new Map();
const inflightRequests = new Map();

function createQueryString(query = {}) {
  const params = new URLSearchParams();

  Object.entries(query)
    .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
    .forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;
      params.set(key, String(value));
    });

  return params.toString();
}

function buildCacheKey(query = {}) {
  const queryString = createQueryString(query);
  return `${SKILL_INTELLIGENCE_CACHE_PREFIX}${queryString || "__default__"}`;
}

function readBrowserCache(cacheKey) {
  if (typeof window === "undefined") return null;

  try {
    const cachedRaw = window.sessionStorage.getItem(cacheKey);
    if (!cachedRaw) return null;

    const cached = JSON.parse(cachedRaw);
    if (!cached || typeof cached !== "object") return null;
    if (Number(cached.expiresAt || 0) <= Date.now()) {
      window.sessionStorage.removeItem(cacheKey);
      return null;
    }

    return cached.data ?? null;
  } catch {
    return null;
  }
}

function writeCache(cacheKey, data) {
  const payload = {
    data,
    expiresAt: Date.now() + SKILL_INTELLIGENCE_CACHE_TTL_MS,
  };

  memoryCache.set(cacheKey, payload);

  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.setItem(cacheKey, JSON.stringify(payload));
  } catch {
    // Ignore browser storage failures.
  }
}

function readMemoryCache(cacheKey) {
  const cached = memoryCache.get(cacheKey);
  if (!cached) return null;
  if (Number(cached.expiresAt || 0) <= Date.now()) {
    memoryCache.delete(cacheKey);
    return null;
  }
  return cached.data ?? null;
}

export function peekSkillIntelligenceOverview(query = {}) {
  const cacheKey = buildCacheKey(query);
  const memoryData = readMemoryCache(cacheKey);
  if (memoryData) return memoryData;

  const browserData = readBrowserCache(cacheKey);
  if (browserData) {
    writeCache(cacheKey, browserData);
    return browserData;
  }

  return null;
}

export async function getSkillIntelligenceOverview(query = {}, options = {}) {
  const cacheKey = buildCacheKey(query);
  const { forceRefresh = false } = options;

  if (!forceRefresh) {
    const cached = peekSkillIntelligenceOverview(query);
    if (cached) return cached;
  }

  if (inflightRequests.has(cacheKey)) {
    return inflightRequests.get(cacheKey);
  }

  const queryString = createQueryString(query);
  const url = queryString ? `${SKILL_INTELLIGENCE_OVERVIEW_ENDPOINT}?${queryString}` : SKILL_INTELLIGENCE_OVERVIEW_ENDPOINT;

  const request = fetch(url, {
    method: "GET",
  })
    .then(async (response) => {
      let data = null;
      try {
        data = await response.json();
      } catch {
        throw new Error("Skill intelligence API returned invalid response.");
      }

      if (!response.ok) {
        throw new Error(data?.message || "Failed to fetch skill intelligence overview.");
      }

      writeCache(cacheKey, data);
      return data;
    })
    .finally(() => {
      inflightRequests.delete(cacheKey);
    });

  inflightRequests.set(cacheKey, request);
  return request;
}
