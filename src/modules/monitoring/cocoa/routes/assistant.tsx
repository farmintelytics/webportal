import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { PageHeader } from "../components/PageHeader";
import { blocks, farmSummary } from "../lib/cocoa-data";
import { Sparkles, Send, Loader2, CloudRain, Thermometer, Droplets, Bug, Scissors, TrendingDown, User, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";

export const Route = createFileRoute("/assistant")({
  component: AssistantPage,
  head: () => ({
    meta: [
      { title: "AI Assistant — Scenario Modeling — CocoaSense" },
      { name: "description", content: "Run what-if scenarios on your farm using remote sensing data and AI-assisted insights." },
    ],
  }),
});

type Msg = { role: "user" | "assistant"; content: string };

const SCENARIOS = [
  { icon: CloudRain, label: "Drought scenario", prompt: "What happens to my farm yield if rainfall drops 30% over the next 3 months? Which blocks are most at risk?" },
  { icon: Thermometer, label: "Heat stress", prompt: "Model the impact of a +2°C temperature anomaly during pod-fill stage. Which blocks should I prioritize?" },
  { icon: Droplets, label: "Irrigation plan", prompt: "If I install drip irrigation on the 2 driest blocks (LSWI < 0.20), what yield uplift can I expect this season?" },
  { icon: Scissors, label: "Pruning impact", prompt: "Predict the NDRE recovery and yield change if I prune the 3 most stressed blocks in the next 2 weeks." },
  { icon: Bug, label: "Black pod outbreak", prompt: "If black pod disease spreads from blocks showing NDRE < 0.15, what's the projected farm-wide yield loss?" },
  { icon: TrendingDown, label: "Climate stress", prompt: "Run a worst-case scenario combining 25% rainfall reduction and +1.5°C warming for next season." },
];

function AssistantPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const farmContext = {
    farm: "Asante Estate, Ashanti Region, Ghana",
    totalArea: farmSummary.totalArea,
    totalBlocks: blocks.length,
    averageNDRE: Number(farmSummary.avgNdre.toFixed(3)),
    forecastBags: farmSummary.totalBags,
    activeAlerts: farmSummary.alerts,
    blocks: blocks.map((b) => ({
      id: b.id,
      name: b.name,
      area_ha: b.area,
      ndvi: b.ndvi,
      ndre: b.ndre,
      lswi: b.lswi,
      vhi: b.vhi,
      health: b.health,
      rainfall_3mo_mm: b.rainfall3mo,
      predicted_yield_kg_per_ha: b.predictedYield,
      alert: b.alert,
    })),
  };

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Msg = { role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const resp = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, context: farmContext }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Request failed" }));
        setMessages([...next, { role: "assistant", content: `⚠️ ${err.error || "Something went wrong"}` }]);
        setLoading(false);
        return;
      }

      const reader = resp.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assistant = "";
      let done = false;

      setMessages([...next, { role: "assistant", content: "" }]);

      while (!done) {
        const { done: d, value } = await reader.read();
        if (d) break;
        buffer += decoder.decode(value, { stream: true });

        let nl;
        while ((nl = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, nl);
          buffer = buffer.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") { done = true; break; }
          try {
            const parsed = JSON.parse(json);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              assistant += delta;
              setMessages((prev) => {
                const copy = [...prev];
                copy[copy.length - 1] = { role: "assistant", content: assistant };
                return copy;
              });
              scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch (e) {
      setMessages((prev) => [...prev, { role: "assistant", content: "⚠️ Connection error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="AI Assistant"
        title="Scenario Modeling"
        subtitle="Ask what-if questions grounded in your farm's live remote sensing data — Sentinel-2, MODIS, CHIRPS and SoilGrids."
        actions={
          <span className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
            <Sparkles className="size-3" /> Powered by AI
          </span>
        }
      />

      <div className="px-6 lg:px-10 py-6 grid lg:grid-cols-[1fr_280px] gap-6 h-[calc(100vh-3rem-7rem)] min-h-[500px]">
        {/* Chat */}
        <div className="flex flex-col bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
                <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                  <Sparkles className="size-6" />
                </div>
                <div className="text-base font-semibold">Run a what-if scenario</div>
                <div className="text-sm text-muted-foreground mt-1">
                  I have access to all 8 blocks of your farm — NDRE, NDVI, LSWI, rainfall and predicted yields. Ask me to model droughts, heat waves, irrigation plans, pest outbreaks or pruning impact.
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`size-7 shrink-0 rounded-md flex items-center justify-center ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"}`}>
                  {m.role === "user" ? <User className="size-4" /> : <Bot className="size-4" />}
                </div>
                <div className={`max-w-[80%] rounded-lg px-4 py-2.5 text-sm ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary/60"}`}>
                  {m.role === "assistant" ? (
                    <div className="prose prose-sm max-w-none prose-headings:mt-2 prose-headings:mb-1 prose-p:my-1.5 prose-ul:my-1.5 prose-ol:my-1.5 prose-li:my-0.5 prose-strong:text-foreground">
                      <ReactMarkdown>{m.content || (loading && i === messages.length - 1 ? "…" : "")}</ReactMarkdown>
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap">{m.content}</div>
                  )}
                </div>
              </div>
            ))}

            {loading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex gap-3">
                <div className="size-7 rounded-md bg-secondary flex items-center justify-center">
                  <Loader2 className="size-4 animate-spin text-primary" />
                </div>
                <div className="rounded-lg px-4 py-2.5 text-sm bg-secondary/60 text-muted-foreground">Analyzing remote sensing data…</div>
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="border-t border-border p-3 flex items-center gap-2 bg-card"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a what-if question about your farm…"
              className="flex-1 h-10 px-3 text-sm bg-secondary/60 border border-transparent rounded-md focus:outline-none focus:border-primary/40 focus:bg-card"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="h-10 px-4 inline-flex items-center gap-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
            >
              <Send className="size-4" />
              Send
            </button>
          </form>
        </div>

        {/* Scenario presets */}
        <div className="space-y-4 overflow-y-auto">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Quick Scenarios</div>
            <div className="space-y-2">
              {SCENARIOS.map((s) => (
                <button
                  key={s.label}
                  onClick={() => send(s.prompt)}
                  disabled={loading}
                  className="w-full text-left rounded-lg border border-border bg-card p-3 hover:border-primary/40 hover:bg-secondary/40 transition disabled:opacity-50"
                >
                  <div className="flex items-center gap-2">
                    <s.icon className="size-3.5 text-primary" />
                    <span className="text-xs font-semibold">{s.label}</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-1 line-clamp-2">{s.prompt}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-secondary/30 p-3">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Live Context</div>
            <div className="space-y-1 text-[11px]">
              <Row label="Total area" value={`${farmSummary.totalArea.toFixed(1)} ha`} />
              <Row label="Avg NDRE" value={farmSummary.avgNdre.toFixed(2)} />
              <Row label="Forecast" value={`${farmSummary.totalBags.toLocaleString()} bags`} />
              <Row label="Alerts" value={`${farmSummary.alerts} active`} />
            </div>
            <div className="mt-2 pt-2 border-t border-border/60 text-[10px] text-muted-foreground">
              The assistant sees all {blocks.length} blocks with their indices, rainfall and yield predictions.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold tabular-nums">{value}</span>
    </div>
  );
}
