import { DATA_PATHS } from "../../../config.js";

async function fetchJson(url) {
  const response = await fetch(url);
  const contentType = response.headers.get("content-type") || "";
  if (!response.ok) {
    if (contentType.includes("application/json")) {
      const payload = await response.json().catch(() => null);
      throw new Error(payload?.message || `HTTP ${response.status}`);
    }
    throw new Error((await response.text().catch(() => "")).slice(0, 120) || `HTTP ${response.status}`);
  }
  return response.json();
}

export async function fetchGovernanceOverview() {
  const [exposure, risk, research] = await Promise.all([
    fetchJson(DATA_PATHS.STATS),
    fetchJson(DATA_PATHS.OPENCLAW_RISK_OVERVIEW),
    fetchJson(DATA_PATHS.SECURITY_RESEARCH_OVERVIEW),
  ]);

  return { exposure, risk, research };
}
