import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { TopBar } from "./components/TopBar";
import { Card, CardContent } from "@monitoring-shared/ui/card";
import { Button } from "@monitoring-shared/ui/button";
import { Textarea } from "@monitoring-shared/ui/textarea";
import { Badge } from "@monitoring-shared/ui/badge";
import { Sparkles, Send, Loader2, Droplets, Sun, Bug, CalendarDays, Leaf, Brain } from "lucide-react";
import { askAssistant } from "./server/assistant.functions";
import { cn } from "@monitoring-shared/lib/utils";

export const Route = createFileRoute("/assistant")({ component: AssistantPage });

type Msg = { role: "user" | "assistant"; content: string };

const presets = [
  { id: "drought", label: "Drought scenario", icon: Sun, prompt: "Simulate a 6-week rainfall deficit (CHIRPS −60%) starting now. Which blocks suffer most and what's the yield impact?" },
  { id: "irrigation", label: "+30% irrigation", icon: Droplets, prompt: "We increase irrigation by 30% for rainfed blocks. Estimate LSWI recovery and yield uplift per block." },
  { id: "pest", label: "Pest outbreak", icon: Bug, prompt: "Stem borer outbreak detected near Block 6. Predict spread risk based on NDVI/VHI and recommend containment." },
  { id: "harvest", label: "Reschedule harvest", icon: CalendarDays, prompt: "Mill window slips 3 weeks. Re-prioritise harvest order across blocks to maximise total tonnage." },
  { id: "fertiliser", label: "N-fertiliser boost", icon: Leaf, prompt: "Apply +25kg N/ha to Grand Growth blocks. Project EVI response and yield gain." },
];

function AssistantPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(text?: string) {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await askAssistant({ data: { messages: next } });
      if ("error" in res && res.error) {
        setMessages((m) => [...m, { role: "assistant", content: `⚠️ ${res.error}` }]);
      } else {
        setMessages((m) => [...m, { role: "assistant", content: res.content || "(no response)" }]);
      }
    } catch (e) {
      setMessages((m) => [...m, { role: "assistant", content: `⚠️ ${e instanceof Error ? e.message : "Request failed"}` }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <TopBar title="AI Assistant" />
      <main className="flex flex-1 overflow-hidden">
        {/* Left: scenario presets */}
        <aside className="hidden w-72 shrink-0 border-r border-border bg-muted/30 p-4 md:block overflow-y-auto">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold">Scenario Presets</h2>
          </div>
          <p className="mb-4 text-xs text-muted-foreground">
            One-click what-if simulations powered by your remote-sensing data (NDVI, EVI, LSWI, VHI, SAR, CHIRPS, MODIS LST).
          </p>
          <div className="space-y-2">
            {presets.map((p) => (
              <button
                key={p.id}
                onClick={() => send(p.prompt)}
                disabled={loading}
                className="group flex w-full items-start gap-2 rounded-lg border border-border bg-card p-3 text-left text-xs transition-all hover:border-primary/50 hover:shadow-sm disabled:opacity-50"
              >
                <span className="mt-0.5 rounded-md bg-primary/10 p-1.5 text-primary group-hover:bg-primary/20">
                  <p.icon className="h-3.5 w-3.5" />
                </span>
                <span>
                  <div className="font-semibold text-foreground">{p.label}</div>
                  <div className="mt-0.5 line-clamp-2 text-muted-foreground">{p.prompt}</div>
                </span>
              </button>
            ))}
          </div>

          <div className="mt-6 rounded-lg border border-primary/20 bg-[var(--gradient-primary)] p-3 text-primary-foreground">
            <div className="flex items-center gap-1.5 text-xs font-semibold"><Brain className="h-3.5 w-3.5" /> Powered by FarmIntelytics AI</div>
            <div className="mt-1 text-[11px] opacity-90">Reasoning over live block-level vegetation indices.</div>
          </div>
        </aside>

        {/* Right: chat */}
        <section className="flex flex-1 flex-col bg-background">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6">
            {messages.length === 0 && (
              <div className="mx-auto max-w-2xl text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-elegant)]">
                  <Sparkles className="h-7 w-7" />
                </div>
                <h2 className="text-2xl font-bold">Scenario Modeling Assistant</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Ask what-if questions about your sugarcane fields. The assistant reasons over live remote-sensing indices to forecast yield impact and recommend agronomic actions.
                </p>
                <div className="mt-6 grid gap-2 sm:grid-cols-2">
                  {presets.slice(0, 4).map((p) => (
                    <button
                      key={p.id}
                      onClick={() => send(p.prompt)}
                      className="rounded-lg border border-border bg-card p-3 text-left text-xs transition-colors hover:border-primary/50"
                    >
                      <div className="flex items-center gap-2 font-semibold"><p.icon className="h-3.5 w-3.5 text-primary" />{p.label}</div>
                      <div className="mt-1 line-clamp-2 text-muted-foreground">{p.prompt}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mx-auto max-w-3xl space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={cn("flex gap-3", m.role === "user" ? "justify-end" : "justify-start")}>
                  {m.role === "assistant" && (
                    <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--gradient-primary)] text-primary-foreground">
                      <Sparkles className="h-3.5 w-3.5" />
                    </div>
                  )}
                  <Card className={cn("max-w-[85%]", m.role === "user" ? "bg-primary text-primary-foreground" : "bg-card")}>
                    <CardContent className="p-3 text-sm">
                      {m.role === "assistant" ? (
                        <div className="space-y-2 text-sm leading-relaxed [&_h1]:text-base [&_h1]:font-bold [&_h2]:text-sm [&_h2]:font-bold [&_h3]:font-semibold [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_table]:w-full [&_table]:text-xs [&_th]:border [&_th]:border-border [&_th]:px-2 [&_th]:py-1 [&_th]:bg-muted [&_td]:border [&_td]:border-border [&_td]:px-2 [&_td]:py-1 [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_strong]:font-semibold">
                          <ReactMarkdown>{m.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <div className="whitespace-pre-wrap">{m.content}</div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ))}
              {loading && (
                <div className="flex gap-3">
                  <div className="mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--gradient-primary)] text-primary-foreground">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  </div>
                  <Card><CardContent className="p-3 text-sm text-muted-foreground">Analyzing remote sensing data…</CardContent></Card>
                </div>
              )}
            </div>
          </div>

          {/* Composer */}
          <div className="border-t border-border bg-card/50 p-3 backdrop-blur">
            <div className="mx-auto flex max-w-3xl items-end gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder="Ask about a scenario… e.g. What if rainfall drops 40% next month?"
                className="min-h-[52px] resize-none"
                rows={2}
              />
              <Button onClick={() => send()} disabled={loading || !input.trim()} className="h-[52px] px-4">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
            <div className="mx-auto mt-2 flex max-w-3xl items-center justify-between text-[10px] text-muted-foreground">
              <span>Enter to send · Shift+Enter for newline</span>
              <Badge variant="secondary" className="text-[10px]">8 blocks in context</Badge>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
