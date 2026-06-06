import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/assistant")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env.LOVABLE_API_KEY;
        if (!apiKey) {
          return new Response(JSON.stringify({ error: "AI not configured" }), { status: 500, headers: { "Content-Type": "application/json" } });
        }

        const { messages, context } = await request.json();

        const systemPrompt = `You are CocoaSense AI, a remote-sensing-driven scenario modeling assistant for cocoa farms. You help farm managers, agronomists and policymakers run "what-if" scenarios using satellite-derived data (Sentinel-2 NDVI/NDRE/EVI/LSWI, MODIS LST, CHIRPS rainfall, SoilGrids).

CURRENT FARM CONTEXT (live remote sensing snapshot):
${JSON.stringify(context, null, 2)}

When the user asks a question:
1. Always ground your answer in the remote sensing data above (cite specific blocks, NDRE values, rainfall mm, etc.).
2. For scenario questions ("what if rainfall drops 30%", "what if I prune block 5", "what if temperature rises 2°C"), produce a structured analysis:
   - **Predicted Impact** (yield change in kg/ha and % per block)
   - **Affected Blocks** (which ones, why)
   - **Risk Level** (Low/Moderate/High/Severe)
   - **Recommended Actions** (concrete, ordered)
3. Use markdown with headings, bullet lists and bold for key numbers.
4. Be concise but quantitative. Show your reasoning briefly (e.g. "NDRE 0.13 → black pod risk + LSWI 0.18 → water deficit ⇒ compounding stress").
5. If the user asks for a chart, describe what to plot.

Domain rules:
- Cocoa optimum: 1500–2000 mm rainfall/yr, 21–32°C, NDRE 0.30–0.45.
- NDRE < 0.15 = severe chlorophyll loss / black pod risk.
- LSWI < 0.20 = canopy water deficit.
- Yield proxy: base 420 kg/ha × NDRE-factor × LSWI-factor × rainfall-factor.`;

        const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "google/gemini-3-flash-preview",
            messages: [{ role: "system", content: systemPrompt }, ...messages],
            stream: true,
          }),
        });

        if (!resp.ok) {
          if (resp.status === 429) return new Response(JSON.stringify({ error: "Rate limit reached. Please wait a moment." }), { status: 429, headers: { "Content-Type": "application/json" } });
          if (resp.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted. Add credits in workspace settings." }), { status: 402, headers: { "Content-Type": "application/json" } });
          return new Response(JSON.stringify({ error: "AI gateway error" }), { status: 500, headers: { "Content-Type": "application/json" } });
        }

        return new Response(resp.body, { headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" } });
      },
    },
  },
});
