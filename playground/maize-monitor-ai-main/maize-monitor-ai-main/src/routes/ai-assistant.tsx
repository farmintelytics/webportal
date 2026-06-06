import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Send, Loader2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/ai-assistant")({
  head: () => ({
    meta: [
      { title: "AI Assistant — Scenario Modeling | Maize Remote Sensing" },
      {
        name: "description",
        content:
          "Run what-if scenarios for maize farms using remote sensing, climate, and soil data. Predict yield impact and get field-ready actions.",
      },
      { property: "og:title", content: "AI Scenario Modeling Assistant" },
      {
        property: "og:description",
        content:
          "Model rainfall, nitrogen, planting-date, and stress scenarios with satellite-driven AI.",
      },
    ],
  }),
  component: AIAssistantPage,
});

type Msg = { role: "user" | "assistant"; content: string };

const SCENARIOS = [
  {
    title: "Rainfall deficit at tasselling",
    prompt:
      "What if rainfall drops 40% during the tasselling stage (weeks 6–8) for a 50-hectare maize farm in central Kenya? Current NDVI is 0.72.",
  },
  {
    title: "Delayed planting by 3 weeks",
    prompt:
      "Scenario: Planting is delayed by 3 weeks past the optimal CHIRPS rainfall onset. How does this affect yield, growth stages, and which RS layers should I monitor?",
  },
  {
    title: "Reduced nitrogen application",
    prompt:
      "What if I reduce urea top-dressing by 30% across all plots? Currently GCVI averages 4.2. Predict impact on yield and NDRE/GCVI signals.",
  },
  {
    title: "Heat wave during pollination",
    prompt:
      "Model a 5-day heat wave (LST anomaly +6°C) during pollination. What yield loss should I expect and what mitigation actions are realistic?",
  },
];

function AIAssistantPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const send = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: Msg = { role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setIsLoading(true);

    try {
      const resp = await fetch("/api/public/ai-scenario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });

      if (!resp.ok || !resp.body) {
        const errText = await resp.text().catch(() => "");
        let errMsg = "AI request failed.";
        try {
          errMsg = JSON.parse(errText).error || errMsg;
        } catch {}
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `⚠️ ${errMsg}` },
        ]);
        setIsLoading(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let acc = "";
      let done = false;

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (!done) {
        const { done: d, value } = await reader.read();
        if (d) break;
        buf += decoder.decode(value, { stream: true });
        let idx: number;
        while ((idx = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, idx);
          buf = buf.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") {
            done = true;
            break;
          }
          try {
            const parsed = JSON.parse(json);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              acc += delta;
              setMessages((prev) =>
                prev.map((m, i) =>
                  i === prev.length - 1 ? { ...m, content: acc } : m,
                ),
              );
              requestAnimationFrame(() => {
                scrollRef.current?.scrollTo({
                  top: scrollRef.current.scrollHeight,
                  behavior: "smooth",
                });
              });
            }
          } catch {
            buf = line + "\n" + buf;
            break;
          }
        }
      }
    } catch (e) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Network error. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="flex flex-col h-[calc(100vh-3.5rem)]">
        <header className="border-b px-6 py-4 flex items-center justify-between bg-card/30 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-primary/60 grid place-items-center text-primary-foreground">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold leading-tight">
                Scenario Modeling Assistant
              </h1>
              <p className="text-xs text-muted-foreground">
                What-if analysis powered by remote sensing & AI
              </p>
            </div>
          </div>
          <div className="hidden md:flex gap-2">
            <Badge variant="secondary">NDVI</Badge>
            <Badge variant="secondary">GCVI</Badge>
            <Badge variant="secondary">CHIRPS</Badge>
            <Badge variant="secondary">VHI</Badge>
          </div>
        </header>

        {/* Chat area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6">
          {messages.length === 0 ? (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">
                  Model maize scenarios with satellite intelligence
                </h2>
                <p className="text-muted-foreground">
                  Describe a what-if scenario — rainfall, nitrogen, planting
                  date, heat stress — and get a quantified yield impact plus
                  field actions.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {SCENARIOS.map((s) => (
                  <Card
                    key={s.title}
                    onClick={() => send(s.prompt)}
                    className="p-4 cursor-pointer hover:border-primary hover:bg-accent/40 transition"
                  >
                    <p className="font-medium text-sm mb-1">{s.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {s.prompt}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.role === "assistant" && (
                    <div className="h-8 w-8 rounded-full bg-primary/10 text-primary grid place-items-center flex-shrink-0">
                      <Sparkles className="h-4 w-4" />
                    </div>
                  )}
                  <div
                    className={`rounded-2xl px-4 py-3 max-w-[85%] ${
                      m.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border"
                    }`}
                  >
                    {m.role === "assistant" ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:mt-3 prose-headings:mb-2 prose-p:my-2 prose-ul:my-2">
                        <ReactMarkdown>
                          {m.content || "Thinking…"}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap text-sm">{m.content}</p>
                    )}
                  </div>
                </div>
              ))}
              {isLoading &&
                messages[messages.length - 1]?.role === "user" && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> Analyzing
                    scenario…
                  </div>
                )}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t bg-card/40 px-6 py-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="max-w-3xl mx-auto flex gap-2 items-end"
          >
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder="Describe a scenario — e.g. 'What if rainfall is 50% below normal during weeks 5–8?'"
              rows={2}
              className="resize-none"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !input.trim()}
              className="h-[60px] w-[60px]"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
          <p className="max-w-3xl mx-auto text-[11px] text-muted-foreground mt-2 text-center">
            Estimates are model-driven and should be validated with field
            observations.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
