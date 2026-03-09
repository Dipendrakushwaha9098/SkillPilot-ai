import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { skillLevel, interest, goal, dailyTime } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: "You are an expert tech mentor who creates personalized learning roadmaps."
          },
          {
            role: "user",
            content: `Create a 3-month personalized learning roadmap for a student with:
- Skill Level: ${skillLevel}
- Interest: ${interest}
- Goal: ${goal}
- Daily Study Time: ${dailyTime}

Generate a structured roadmap with 6-10 topics. Each topic should have a title, description, week number, resources (2-3), practice exercises (2-3), and an optional project name.`
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "create_roadmap",
              description: "Create a structured learning roadmap",
              parameters: {
                type: "object",
                properties: {
                  title: { type: "string", description: "Roadmap title" },
                  duration: { type: "string", description: "e.g. '3 months'" },
                  topics: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        title: { type: "string" },
                        description: { type: "string" },
                        week: { type: "number" },
                        completed: { type: "boolean" },
                        resources: { type: "array", items: { type: "string" } },
                        exercises: { type: "array", items: { type: "string" } },
                        project: { type: "string" }
                      },
                      required: ["id", "title", "description", "week", "completed", "resources", "exercises"],
                      additionalProperties: false
                    }
                  }
                },
                required: ["title", "duration", "topics"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "create_roadmap" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      return new Response(JSON.stringify({ error: "AI did not return a roadmap" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const roadmap = JSON.parse(toolCall.function.arguments);
    return new Response(JSON.stringify(roadmap), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-roadmap error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
