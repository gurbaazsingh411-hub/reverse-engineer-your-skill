// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";


const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { goal, skill, otherSkillTitles } = await req.json();

    if (!goal || !skill) {
      return new Response(JSON.stringify({ error: "Goal and skill are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY is not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `You are a learning roadmap skill generator. Given a user's goal and an existing skill to replace, generate ONE new alternative skill that fits the same position in the roadmap.

Return ONLY valid JSON with this exact structure, no markdown, no code fences:
{"id": "${skill.id}", "title": "New Skill Name", "description": "Description", "why": "Why it matters", "tools": ["Tool1", "Tool2"], "difficulty": "${skill.difficulty}", "estimatedTime": "2-3 weeks", "level": ${skill.level}}

Requirements:
- Keep the same level (${skill.level}) and similar difficulty (${skill.difficulty})
- Generate something DIFFERENT from the original: "${skill.title}"
- Also avoid these other skills already in the roadmap: ${(otherSkillTitles || []).join(", ")}
- Tailor specifically to the user's goal
- Be specific and actionable, not generic`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Goal: "${goal}"\n\nReplace this skill with a new alternative:\nTitle: ${skill.title}\nDescription: ${skill.description}\nLevel: ${skill.level}` },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Too many requests. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached. Please add credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: `AI error (${response.status})` }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return new Response(JSON.stringify({ error: "Empty AI response" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let jsonStr = content.trim();
    if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    const newSkill = JSON.parse(jsonStr);
    newSkill.status = "not-started";
    newSkill.id = skill.id;

    return new Response(JSON.stringify({ skill: newSkill }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("regenerate-skill error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
