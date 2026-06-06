import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { AppLayout } from "./components/AppLayout";
import { Send, Sparkles, Bot, User } from "lucide-react";

export const Route = createFileRoute("/assistant")({
  head: () => ({ meta: [{ title: "AI Assistant — PaddyLens" }, { name: "description", content: "Chat with the GeoAI assistant about scenarios and remote sensing intelligence." }] }),
  component: Assistant,
});

type Msg = { role: "user" | "assistant"; content: string };

const suggestions = [
  "Which plots are at risk this week?",
  "What if rainfall drops 30% next month?",
  "Recommend planting window for new parcel near Plot D",
  "Compare predicted yield vs last season",
];

const cannedAnswer = (q: string) => {
  if (/risk|stress|alert/i.test(q))
    return "Based on the latest Sentinel-2 (Apr 28) and MODIS LST composites, **3 plots** are showing stress: **Plot C (VHI 32)** with heat stress, **Plot G (LSWI 0.14)** suggesting irrigation failure, and **Plot K** with a 22% yield-deviation flag. Recommended action: irrigate C and G within 48h, and inspect K's panicle development.";
  if (/rainfall|drought|water/i.test(q))
    return "A 30% rainfall reduction next month would lower CHIRPS-projected soil moisture by ~18% across the eastern plots. Plots D, E, K (clay-loam, low TWI) would remain viable; plots A and L (sandy, higher elevation) would likely require **supplemental irrigation of ~45mm** to maintain target NDVI through heading.";
  if (/plant|window|suitab/i.test(q))
    return "For a new parcel near Plot D: NDWI and TWI scores are **High**, soil pH 6.2 (ideal), and ERA5 thermal window opens **April 18 – May 12**. Recommended planting: **Late April**, with transplanting around **May 5**. Confidence: 87%.";
  if (/yield|harvest|tonnage/i.test(q))
    return "Aggregated forecast for Wet Season 2026: **172 tonnes** total across 14 plots — a **+11.4% increase** vs. last season's 154 t. Best performers: Plot B (+18%), Plot F (+15%). Underperformers: Plot C (-9%), Plot K (-12%). Driver: stronger NDVI integral at heading stage.";
  return "I can analyze NDVI, EVI, LSWI, NDRE, VHI and SAR backscatter trends per plot, run scenarios on rainfall/temperature, and recommend planting windows. Try one of the suggestions, or ask about a specific plot id.";
};

function Assistant() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi! I'm your GeoAI rice intelligence assistant. Ask me about plot health, scenarios, or yield forecasts." },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages(m => [...m, { role: "user", content: text }]);
    setInput("");
    setTimeout(() => {
      setMessages(m => [...m, { role: "assistant", content: cannedAnswer(text) }]);
    }, 600);
  };

  return (
    <AppLayout title="AI Assistant" subtitle="Scenario reasoning powered by remote sensing data">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">
        <div className="rounded-xl border border-border bg-card shadow-soft flex flex-col" style={{ height: "calc(100vh - 200px)", minHeight: 560 }}>
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
                {m.role === "assistant" && (
                  <div className="size-8 rounded-lg bg-primary text-primary-foreground grid place-items-center shrink-0 shadow-soft">
                    <Bot className="size-4"/>
                  </div>
                )}
                <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-sm"
                    : "bg-muted text-foreground rounded-tl-sm"
                }`}
                  dangerouslySetInnerHTML={{ __html: m.content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }}
                />
                {m.role === "user" && (
                  <div className="size-8 rounded-lg bg-accent text-accent-foreground grid place-items-center shrink-0">
                    <User className="size-4"/>
                  </div>
                )}
              </div>
            ))}
            <div ref={endRef}/>
          </div>
          <div className="border-t border-border p-3">
            <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2">
              <input
                value={input}
                onChange={e=>setInput(e.target.value)}
                placeholder="Ask about plot health, scenarios, yield..."
                className="flex-1 px-4 py-3 rounded-lg bg-muted border border-border outline-none text-sm focus:ring-2 focus:ring-ring"
              />
              <button type="submit" className="px-4 py-3 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition flex items-center gap-2 text-sm font-medium">
                <Send className="size-4"/> Send
              </button>
            </form>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-xl border border-border bg-gradient-to-br from-primary/10 to-water/10 p-4">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="size-4"/>
              <span className="text-xs font-semibold uppercase tracking-wider">Quick prompts</span>
            </div>
            <div className="mt-3 space-y-2">
              {suggestions.map(s => (
                <button key={s} onClick={() => send(s)} className="w-full text-left text-sm px-3 py-2.5 rounded-md bg-card border border-border hover:bg-accent transition">
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 text-xs text-muted-foreground">
            <div className="font-semibold text-foreground mb-1">Connected sources</div>
            <ul className="space-y-1">
              <li>✓ Sentinel-2 — last sync 2h ago</li>
              <li>✓ Sentinel-1 SAR — daily</li>
              <li>✓ MODIS LST — 6h</li>
              <li>✓ CHIRPS rainfall</li>
              <li>✓ SoilGrids 250m</li>
            </ul>
          </div>
        </aside>
      </div>
    </AppLayout>
  );
}
