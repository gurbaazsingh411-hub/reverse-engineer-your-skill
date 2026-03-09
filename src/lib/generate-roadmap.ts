import type { Skill } from "@/lib/roadmap-data";

const FUNCTIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-roadmap`;

export async function generateRoadmap(goal: string): Promise<Skill[]> {
  const response = await fetch(FUNCTIONS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ goal }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || `Request failed (${response.status})`);
  }

  if (!data?.skills || !Array.isArray(data.skills)) {
    throw new Error("Invalid roadmap response");
  }

  return data.skills as Skill[];
}
