import { z } from "zod";
import { blocks } from "../data/fallbackData";

const Schema = z.object({
  messages: z.array(z.object({
    role: z.enum(["user", "assistant", "system"]),
    content: z.string(),
  })),
  scenario: z.string().optional(),
});

export const askAssistant = async ({ data }) => {
  try {
    Schema.parse(data);
    const apiKey = "DUMMY_KEY"; // In a real app, this should be an env var or handled by a real backend
    
    const farmContext = blocks.map((b) =>
      `${b.id} ${b.name}: ${b.hectares}ha, stage=${b.growthStage}, NDVI=${b.ndvi}, EVI=${b.evi}, LSWI=${b.lswi}, VHI=${b.vhi}, SAR=${b.sar}dB, predictedYield=${b.predictedYield}t/ha, alert=${b.stressAlert}, suitability=${b.suitability}`
    ).join("\n");

    const system = `You are CaneSense AI, an agronomy assistant specialized in sugarcane remote sensing and scenario modeling.
You help field managers reason about NDVI/EVI vegetation vigor, LSWI water status, VHI stress, SAR backscatter, CHIRPS rainfall, MODIS LST, and yield forecasts.
When the user describes a scenario (drought, irrigation change, fertilizer, planting date shift, pest outbreak), simulate likely impact on each block using the indices below and return:
1) Short executive summary (2-3 sentences)
2) Per-block impact table (markdown) with predicted yield delta
3) Recommended actions (bullets)

Current farm snapshot (Bacita Estate, Season 2025/26):
${farmContext}

${data.scenario ? `Active scenario preset: ${data.scenario}` : ""}
Be concise, practical, and use markdown.`;

    const resp = await fetch("https://ai.gateway.FarmIntelytics.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: system }, ...data.messages],
      }),
    });

    if (resp.status === 429) return { error: "Rate limited. Please wait a moment and try again." };
    if (resp.status === 402) return { error: "AI credits exhausted. Add credits in Settings → Workspace → Usage." };
    if (!resp.ok) return { error: `AI gateway error: ${resp.status}` };

    const json = await resp.json();
    const content = json.choices?.[0]?.message?.content ?? "";
    return { content };
  } catch (err) {
    return { error: err.message };
  }
};
