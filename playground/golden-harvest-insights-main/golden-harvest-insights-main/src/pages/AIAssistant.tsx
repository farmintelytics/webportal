import { useState } from "react";
import { blocks, estates } from "@/lib/mock-data";
import { Sparkles, Send, Edit3, Plus, Download } from "lucide-react";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from "recharts";

type Msg = { role: "user" | "ai"; content: string; chart?: { label: string; value: number; color: string }[]; actions?: { tag: "High" | "Medium" | "Low"; text: string }[] };

const SCENARIO_TYPES = [
  "FFB Yield Forecast",
  "Disease Risk Assessment (BSR)",
  "Replanting Decision Analysis",
  "Drought Impact Projection",
  "Fertilizer Intervention Recommendation",
  "Harvest Window Optimization",
  "Stand Age vs Yield Productivity",
];

const PRESETS = [
  "Which blocks are approaching replanting age?",
  "What is the FFB forecast for the next quarter?",
  "Which blocks show early signs of BSR disease?",
  "Which blocks need fertilizer most urgently?",
  "What happens to yield if I delay harvest by 2 weeks?",
  "Compare Block B05 and B07 productivity this season",
  "Identify top 3 underperforming blocks and explain why",
];

const DATA_LAYERS = ["NDVI time series", "Red-Edge CIre", "LSWI", "BSR Risk", "Rainfall (CHIRPS)", "LST anomaly", "Stand Age Map"];

export function AIAssistant() {
  const [scenario, setScenario] = useState(SCENARIO_TYPES[0]);
  const [estate, setEstate] = useState(estates[0]);
  const [layers, setLayers] = useState<Record<string, boolean>>({ "NDVI time series": true, "Red-Edge CIre": true, "Rainfall (CHIRPS)": true, "BSR Risk": true });
  const [rainDev, setRainDev] = useState(0);
  const [delay, setDelay] = useState(0);
  const [fertilizer, setFertilizer] = useState("None");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "ai",
      content: "I'm analyzing **12 blocks** across both estates. Two blocks (**B11, B12**) are approaching replanting threshold (age 26y). Block **B07** is showing high BSR disease risk based on a −0.19 NDVI anomaly and red-edge decline over the last 4 months. Ask me anything, or run a scenario from the left panel.",
    },
  ]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Msg = { role: "user", content: text };
    const ai = generateResponse(text);
    setMessages([...messages, userMsg, ai]);
    setInput("");
  };

  const runScenario = () => {
    const summary = `Running **${scenario}** for ${estate} · rainfall deviation ${rainDev > 0 ? "+" : ""}${rainDev}% · harvest delay ${delay}wk · fertilizer: ${fertilizer}`;
    setMessages([...messages, { role: "user", content: summary }, generateResponse(scenario)]);
  };

  return (
    <div className="flex h-full">
      {/* Left: scenario builder */}
      <aside className="w-[40%] max-w-[460px] border-r border-border bg-card overflow-auto">
        <div className="p-5 space-y-5">
          <div>
            <h2 className="text-base font-semibold">Scenario Builder</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Configure analysis parameters and feed them to the assistant.</p>
          </div>

          <Field label="Scenario Type">
            <select value={scenario} onChange={e => setScenario(e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm">
              {SCENARIO_TYPES.map(s => <option key={s}>{s}</option>)}
            </select>
          </Field>

          <Field label="Estate / Block">
            <select value={estate} onChange={e => setEstate(e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm">
              {estates.map(e => <option key={e}>{e}</option>)}
              <option>All Estates</option>
            </select>
          </Field>

          <Field label="Date Range">
            <div className="grid grid-cols-2 gap-2">
              <input type="date" defaultValue="2024-01-01" className="bg-background border border-border rounded-md px-2 py-2 text-xs"/>
              <input type="date" defaultValue="2025-12-01" className="bg-background border border-border rounded-md px-2 py-2 text-xs"/>
            </div>
          </Field>

          <Field label="Data Layers">
            <div className="grid grid-cols-2 gap-1.5">
              {DATA_LAYERS.map(l => (
                <label key={l} className="flex items-center gap-2 text-xs px-2 py-1.5 rounded-md bg-muted/40 hover:bg-muted cursor-pointer">
                  <input type="checkbox" checked={!!layers[l]} onChange={e => setLayers({ ...layers, [l]: e.target.checked })} className="accent-primary"/>
                  {l}
                </label>
              ))}
            </div>
          </Field>

          <Field label={`Rainfall deviation: ${rainDev > 0 ? "+" : ""}${rainDev}%`}>
            <input type="range" min={-50} max={50} value={rainDev} onChange={e => setRainDev(+e.target.value)} className="w-full accent-primary"/>
          </Field>

          <Field label={`Harvest delay: ${delay} week${delay === 1 ? "" : "s"}`}>
            <div className="flex gap-1">
              {[0, 1, 2, 3].map(n => (
                <button key={n} onClick={() => setDelay(n)} className={`flex-1 py-1.5 text-xs rounded-md border ${delay === n ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border hover:bg-muted"}`}>{n}w</button>
              ))}
            </div>
          </Field>

          <Field label="Fertilizer Application">
            <div className="flex gap-1 flex-wrap">
              {["None", "N", "K", "Mg", "NPK"].map(f => (
                <button key={f} onClick={() => setFertilizer(f)} className={`px-3 py-1.5 text-xs rounded-md border ${fertilizer === f ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border hover:bg-muted"}`}>{f}</button>
              ))}
            </div>
          </Field>

          <button onClick={runScenario} className="w-full bg-primary text-primary-foreground py-2.5 rounded-md text-sm font-semibold hover:bg-primary/90 flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4"/> Run Scenario
          </button>
        </div>
      </aside>

      {/* Right: chat */}
      <section className="flex-1 flex flex-col min-w-0">
        {/* Context banner */}
        <div className="px-5 py-3 border-b border-border bg-card flex items-center gap-3 text-xs">
          <Sparkles className="h-4 w-4 text-primary shrink-0"/>
          <span className="text-muted-foreground">Analyzing:</span>
          <span className="font-medium truncate">{estate} · {blocks.filter(b => b.estate === estate).length} blocks · 2024–2025 · {Object.entries(layers).filter(([_, v]) => v).map(([k]) => k.split(" ")[0]).join(" + ")}</span>
          <button className="ml-auto inline-flex items-center gap-1 text-primary hover:underline shrink-0"><Edit3 className="h-3 w-3"/>Edit</button>
          <button onClick={() => setMessages([])} className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground shrink-0"><Plus className="h-3 w-3"/>New</button>
        </div>

        {/* Presets */}
        <div className="px-5 py-3 border-b border-border flex flex-wrap gap-1.5">
          {PRESETS.map(p => (
            <button key={p} onClick={() => send(p)} className="text-[11px] px-2.5 py-1 rounded-full bg-muted hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20 transition">
              {p}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-auto p-5 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-lg px-4 py-3 text-sm ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-card border border-border"}`}>
                <p dangerouslySetInnerHTML={{ __html: m.content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
                {m.chart && (
                  <div className="mt-3 bg-muted/30 rounded-md p-2">
                    <ResponsiveContainer width="100%" height={140}>
                      <BarChart data={m.chart} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)"/>
                        <XAxis dataKey="label" tick={{ fontSize: 10 }} stroke="var(--color-muted-foreground)"/>
                        <YAxis tick={{ fontSize: 10 }} stroke="var(--color-muted-foreground)"/>
                        <Tooltip contentStyle={{ fontSize: 11, borderRadius: 4 }}/>
                        <Bar dataKey="value" radius={[3, 3, 0, 0]}>
                          {m.chart.map((d, i) => <Cell key={i} fill={d.color}/>)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
                {m.actions && (
                  <div className="mt-3 space-y-1.5">
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Recommended Actions</div>
                    {m.actions.map((a, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0 ${a.tag === "High" ? "bg-destructive/10 text-destructive" : a.tag === "Medium" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{a.tag}</span>
                        <span>{a.text}</span>
                      </div>
                    ))}
                  </div>
                )}
                {m.role === "ai" && (
                  <button className="mt-3 text-[11px] text-primary hover:underline flex items-center gap-1"><Download className="h-3 w-3"/>Export this analysis</button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-border p-4 bg-card">
          <div className="flex items-end gap-2">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
              rows={1}
              placeholder="Ask about FFB forecasts, BSR risk, replanting, fertilizer…"
              className="flex-1 resize-none bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
            />
            <button onClick={() => send(input)} className="bg-primary text-primary-foreground p-2.5 rounded-md hover:bg-primary/90">
              <Send className="h-4 w-4"/>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold block mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function generateResponse(prompt: string): Msg {
  const p = prompt.toLowerCase();
  if (p.includes("replant") || p.includes("aging")) {
    return {
      role: "ai",
      content: "Two blocks are at the **replanting threshold** (age >25y, declining yield):\n\n• **B11** — Age 26y · 11.0 t/ha · NDVI 0.55 (down from 0.62)\n• **B12** — Age 26y · 11.2 t/ha · NDVI 0.56\n\nCurrent yield is **38% below** peak production levels. Replanting now would forfeit ~330t/yr but secure 25y of future production above 22 t/ha by year 13.",
      chart: [
        { label: "B11", value: 11, color: "var(--color-replant)" },
        { label: "B12", value: 11.2, color: "var(--color-replant)" },
        { label: "Peak ref", value: 24, color: "var(--color-canopy)" },
      ],
      actions: [
        { tag: "High", text: "Stage replanting for B11 in Q1 — soil prep & seedling order" },
        { tag: "Medium", text: "Schedule B12 6 months after to phase production loss" },
        { tag: "Low", text: "Re-survey adjacent blocks B09–B10 next dry season" },
      ],
    };
  }
  if (p.includes("forecast") || p.includes("ffb")) {
    return {
      role: "ai",
      content: `Estimated **Q1 FFB production: ~${Math.round(blocks.reduce((s,b)=>s+b.ffbYield*b.areaHa,0)/4)} tonnes** across 10 producing blocks. Confidence interval ±8% based on rainfall normality and current canopy state. Peak contributors: **B05, B06** (35–40ha at 24 t/ha annualized).`,
      chart: blocks.filter(b => b.ffbYield > 0).slice(0, 6).map(b => ({
        label: b.id, value: +(b.ffbYield * b.areaHa / 4).toFixed(0),
        color: b.ffbYield >= 22 ? "var(--color-canopy)" : b.ffbYield >= 16 ? "var(--color-peak)" : "var(--color-aging)",
      })),
      actions: [
        { tag: "High", text: "Confirm harvest crews for B05–B06 peak window in week 4" },
        { tag: "Medium", text: "Resolve B07 BSR inspection before harvest restart" },
      ],
    };
  }
  if (p.includes("bsr") || p.includes("disease")) {
    return {
      role: "ai",
      content: "**Block B07** is showing strong BSR disease signatures:\n\n• NDVI dropped from 0.71 → 0.49 over 4 months (anomaly −0.19)\n• Red-edge CIre declining in localized cluster\n• Adjacent **B08** showing early-stage decline (CIre 1.1)\n\nGanoderma BSR typically presents this exact remote-sensing fingerprint 6–12 months before visible canopy collapse.",
      actions: [
        { tag: "High", text: "Dispatch field team to B07 for soil sampling and basal palm inspection" },
        { tag: "High", text: "Quarantine B07 — halt harvest sharing equipment with healthy blocks" },
        { tag: "Medium", text: "Begin trichoderma soil treatment trials in B08 perimeter" },
      ],
    };
  }
  if (p.includes("fertilizer") || p.includes("nutrient")) {
    return {
      role: "ai",
      content: "Two blocks need urgent fertilizer intervention based on Red-Edge CIre values:\n\n• **B10** — CIre 0.8 (severe K/N deficiency, age 22y declining)\n• **B08** — CIre 1.1 (moderate K deficiency, age 16y)\n\nRecommend split-dose **NPK + Mg** application before next wet season onset (March).",
      chart: [
        { label: "B10", value: 0.8, color: "var(--color-disease)" },
        { label: "B08", value: 1.1, color: "var(--color-aging)" },
        { label: "Healthy ref", value: 1.7, color: "var(--color-canopy)" },
      ],
      actions: [
        { tag: "High", text: "B10: Apply 2.5kg NPK + 0.5kg Mg per palm split over 2 applications" },
        { tag: "Medium", text: "B08: Apply 1.5kg K-rich blend per palm" },
        { tag: "Low", text: "Monitor CIre weekly post-application via Sentinel-2" },
      ],
    };
  }
  if (p.includes("delay") || p.includes("harvest")) {
    return {
      role: "ai",
      content: "Delaying harvest by **2 weeks** across the estate would result in:\n\n• ~**3.2% FFB weight gain** from late ripening\n• ~**11% loss** from over-ripeness, oil quality degradation, and bruising\n• Net effect: **−7.8% revenue** at current CPO prices\n\nHowever, delaying B07 specifically (currently overdue) is necessary pending BSR inspection.",
      chart: [
        { label: "On time", value: 100, color: "var(--color-canopy)" },
        { label: "+1wk", value: 96, color: "var(--color-peak)" },
        { label: "+2wk", value: 92, color: "var(--color-aging)" },
        { label: "+3wk", value: 81, color: "var(--color-disease)" },
      ],
      actions: [
        { tag: "High", text: "Maintain on-schedule harvest for all healthy producing blocks" },
        { tag: "Medium", text: "Accept B07 yield loss pending disease resolution" },
      ],
    };
  }
  if (p.includes("compare")) {
    return {
      role: "ai",
      content: "**Block B05** (Peak, age 13y) significantly outperforms **B07** (Peak-Late, age 16y) this season:\n\n• B05: 24.0 t/ha · NDVI 0.78 · CIre 1.8 · BSR Low\n• B07: 22.0 t/ha → projected 16 t/ha · NDVI 0.49 (anomaly) · BSR HIGH\n\nB05 is a benchmark block. B07's 31% projected yield gap is attributable to BSR infection.",
      chart: [
        { label: "B05", value: 24, color: "var(--color-canopy)" },
        { label: "B07", value: 16, color: "var(--color-disease)" },
      ],
    };
  }
  if (p.includes("underperform") || p.includes("top 3")) {
    return {
      role: "ai",
      content: "Top 3 underperforming producing blocks vs estate average (18.2 t/ha):\n\n• **B11** — 11.0 t/ha (age 26y, structural decline, replant candidate)\n• **B12** — 11.2 t/ha (age 26y, replant candidate)\n• **B10** — 16.0 t/ha (age 22y, severe nutrient stress CIre 0.8)\n\nB11/B12 are age-driven; B10 is reversible with K/N intervention.",
      chart: [
        { label: "B11", value: 11, color: "var(--color-replant)" },
        { label: "B12", value: 11.2, color: "var(--color-replant)" },
        { label: "B10", value: 16, color: "var(--color-disease)" },
      ],
    };
  }
  return {
    role: "ai",
    content: `Analysis ready for **${prompt}**. Across 12 blocks, current canopy health is mostly stable — peak production blocks B05/B06 at NDVI 0.74. Active concerns: B07 (BSR risk), B10 (nutrient stress), B11/B12 (replanting age).`,
    actions: [
      { tag: "Medium", text: "Run a more specific scenario from the left panel for detailed projections" },
    ],
  };
}
