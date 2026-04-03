const SKILL_SEARCH_ENDPOINT = "/api/skill/search";

export async function searchSkills(query, limit = 12) {
  const q = String(query || "").trim();
  if (!q) {
    return { query: "", total: 0, items: [] };
  }

  const response = await fetch(`${SKILL_SEARCH_ENDPOINT}?q=${encodeURIComponent(q)}&limit=${encodeURIComponent(String(limit))}`, {
    method: "GET",
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    throw new Error("Skill search API returned invalid response.");
  }

  if (!response.ok) {
    throw new Error(data?.message || "Failed to search skills.");
  }

  return {
    query: typeof data?.query === "string" ? data.query : q,
    total: Number(data?.total || 0),
    items: Array.isArray(data?.items) ? data.items : [],
  };
}
