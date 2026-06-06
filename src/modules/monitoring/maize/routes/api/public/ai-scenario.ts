import { createFileRoute } from "@tanstack/react-router";

const SYSTEM_PROMPT = `You are an expert agronomist and remote sensing analyst specializing in maize farming in sub-Saharan Africa. You help farm managers run "what-if" scenario models using remote sensing indices (NDVI, EVI, GCVI, NDRE, SAVI, NDTI, VHI), climate data (CHIRPS rainfall, ERA5 temperature, LST), and soil data (SoilGrids).

When the user describes a scenario (e.g., "what if rainfall drops 30% in tasselling stage", "what if I delay planting 2 weeks", "what if nitrogen application is reduced by 25%"), respond with:

1. **Scenario Summary** — restate the inputs in plain language
2. **Remote Sensing Signals** — which indices would show change and how (e.g., NDVI dip at week 6, GCVI plateau, VHI drop)
3. **Predicted Yield Impact** — quantitative estimate (e.g., -1.2 t/ha, ~18% reduction) with reasoning, citing relevant literature where possible (Mkhabela 2011, Lobell 2015, Jin 2019, Gitelson 2003)
4. **Confidence Level** — Low / Medium / High and why
5. **Recommended Actions** — concrete steps a supervisor can take in the field
6. **Map/Data Layers to Watch** — which layers in the platform to monitor

Be concise, use markdown, prefer bullet points and short tables. Always speak in plain language a non-technical farm manager can act on.`;

export const Route = createFileRoute("/api/public/ai-scenario")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { messages } = (await request.json()) as {
            messages: { role: "user" | "assistant"; content: string }[];
          };

          const apiKey = process.env.FarmIntelytics_API_KEY;
          if (!apiKey) {
            return new Response(
              JSON.stringify({ error: "AI gateway is not configured" }),
              { status: 500, headers: { "Content-Type": "application/json" } },
            );
          }

          const response = await fetch(
            "https://ai.gateway.FarmIntelytics.dev/v1/chat/completions",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                model: "google/gemini-3-flash-preview",
                stream: true,
                messages: [
                  { role: "system", content: SYSTEM_PROMPT },
                  ...messages,
                ],
              }),
            },
          );

          if (response.status === 429) {
            return new Response(
              JSON.stringify({
                error: "Rate limit reached. Please wait a moment and try again.",
              }),
              { status: 429, headers: { "Content-Type": "application/json" } },
            );
          }
          if (response.status === 402) {
            return new Response(
              JSON.stringify({
                error:
                  "AI credits exhausted. Add credits in Settings → Workspace → Usage.",
              }),
              { status: 402, headers: { "Content-Type": "application/json" } },
            );
          }
          if (!response.ok || !response.body) {
            const text = await response.text();
            console.error("AI gateway error:", response.status, text);
            return new Response(
              JSON.stringify({ error: "AI gateway error" }),
              { status: 500, headers: { "Content-Type": "application/json" } },
            );
          }

          return new Response(response.body, {
            headers: { "Content-Type": "text/event-stream" },
          });
        } catch (e) {
          console.error("ai-scenario error:", e);
          return new Response(
            JSON.stringify({
              error: e instanceof Error ? e.message : "Unknown error",
            }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});
