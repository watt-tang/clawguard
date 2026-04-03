const SKILL_INTELLIGENCE_OVERVIEW_ENDPOINT = "/api/skill/intelligence/overview";

export async function getSkillIntelligenceOverview() {
  const response = await fetch(SKILL_INTELLIGENCE_OVERVIEW_ENDPOINT, {
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
