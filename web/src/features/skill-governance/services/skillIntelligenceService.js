const SKILL_INTELLIGENCE_OVERVIEW_ENDPOINT = "/api/skill/intelligence/overview";

export async function getSkillIntelligenceOverview(query = {}) {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    params.set(key, String(value));
  });

  const url = params.size ? `${SKILL_INTELLIGENCE_OVERVIEW_ENDPOINT}?${params.toString()}` : SKILL_INTELLIGENCE_OVERVIEW_ENDPOINT;

  const response = await fetch(url, {
    method: "GET",
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    throw new Error("Skill intelligence API returned invalid response.");
  }

  if (!response.ok) {
    throw new Error(data?.message || "Failed to fetch skill intelligence overview.");
  }

  return data;
}
