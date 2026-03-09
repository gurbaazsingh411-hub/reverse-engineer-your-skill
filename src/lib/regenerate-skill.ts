import type { Skill } from "@/lib/roadmap-data";

const FUNCTIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/regenerate-skill`;

export async function regenerateSkill(
  goal: string,
  skill: Skill,
  otherSkillTitles: string[]
): Promise<Skill> {
  const response = await fetch(FUNCTIONS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ goal, skill, otherSkillTitles }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || `Request failed (${response.status})`);
  }

  if (!data?.skill) {
    throw new Error("Invalid response");
  }

  return data.skill as Skill;
}
