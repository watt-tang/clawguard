import { DATA_PATHS } from "../../../config.js";

async function fetchJson(url) {
  const response = await fetch(url);
  const contentType = response.headers.get("content-type") || "";

  if (!response.ok) {
    if (contentType.includes("application/json")) {
      const payload = await response.json().catch(() => null);
      throw new Error(payload?.message || `HTTP ${response.status}`);
    }
    const text = await response.text().catch(() => "");
    throw new Error(text.slice(0, 120) || `HTTP ${response.status}`);
  }

  if (!contentType.includes("application/json")) {
    const text = await response.text().catch(() => "");
    throw new Error(`Expected JSON but received: ${text.slice(0, 80) || "unknown response"}`);
  }

  return response.json();
}

function withQuery(baseUrl, query = {}) {
  const entries = Object.entries(query).filter(([, value]) => value !== undefined && value !== null && value !== "");
  if (!entries.length) return baseUrl;
  const search = new URLSearchParams(entries.map(([key, value]) => [key, String(value)])).toString();
  return `${baseUrl}?${search}`;
}

export function fetchSecurityResearchOverview(query = {}) {
  return fetchJson(withQuery(DATA_PATHS.SECURITY_RESEARCH_OVERVIEW, query));
}

export function fetchSecurityResearchPapers(query = {}) {
  return fetchJson(withQuery(DATA_PATHS.SECURITY_RESEARCH_PAPERS, query));
}

export async function triggerSecurityResearchRefresh() {
  const response = await fetch("/api/security-research/refresh", { method: "POST" });
  const contentType = response.headers.get("content-type") || "";
  if (!response.ok) {
    if (contentType.includes("application/json")) {
      const payload = await response.json().catch(() => null);
      throw new Error(payload?.message || `HTTP ${response.status}`);
    }
    const text = await response.text().catch(() => "");
    throw new Error(text.slice(0, 120) || `HTTP ${response.status}`);
  }
  if (!contentType.includes("application/json")) {
    const text = await response.text().catch(() => "");
    throw new Error(`Expected JSON but received: ${text.slice(0, 80) || "unknown response"}`);
  }
  return response.json();
}
