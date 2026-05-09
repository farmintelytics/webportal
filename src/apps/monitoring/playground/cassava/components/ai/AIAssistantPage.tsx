import { useState } from "react";
import { Card } from "@monitoring-shared/ui/card";
import { Button } from "@monitoring-shared/ui/button";
import { Input } from "@monitoring-shared/ui/input";
import { Label } from "@monitoring-shared/ui/label";
import { Switch } from "@monitoring-shared/ui/switch";
import { Slider } from "@monitoring-shared/ui/slider";
import { Badge } from "@monitoring-shared/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@monitoring-shared/ui/select";
import { Sparkles, Send, Plus, Edit3, Download } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from "recharts";

const presets = [
  "Which batch is most at risk this season?",
  "When is the optimal harvest window for Batch 2?",
  "What happens to yield if rainfall drops 30%?",
  "Which plots need irrigation intervention?",
];

interface Msg {
  role: "user" | "ai";
  content: string;
  data?: { yields: { batch: string; tha: number; ci: string }[] };
  actions?: { text: string; pri: "High" | "Medium" | "Low" }[];
}

const initial: Msg[] = [
  {
    role: "ai",
    content:
      "Based on the loaded context (Farm A · Batches 1–4 · Jan–Jul 2024), Batch 3 is the most at-risk. NDVI is **0.38** vs an expected 0.55 for month 4, and VHI sits at **31** indicating drought stress. Rainfall in June–July was 38% below normal across plots P006/P007.",
    data: {
      yields: [
        { batch: "Batch 1", tha: 22, ci: "±1.8" },
        { batch: "Batch 2", tha: 17, ci: "±2.1" },
        { batch: "Batch 3", tha: 12, ci: "±3.4" },
      ],
    },
    actions: [
      { text: "Trigger irrigation on plots P004, P006, P007", pri: "High" },
      { text: "Apply NPK 15-15-15 to Batch 3", pri: "High" },
      { text: "Re-survey NDVI in 2 weeks", pri: "Medium" },
    ],
  },
];

export function AIAssistantPage() {
  const [scenario, setScenario] = useState("drought");
  const [rain, setRain] = useState(0);
  const [temp, setTemp] = useState(0);
  const [messages, setMessages] = useState<Msg[]>(initial);
  const [input, setInput] = useState("");

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages(m => [...m, { role: "user", content: text }, {
      role: "ai",
      content: `Running **${scenario}** scenario with rainfall ${rain >= 0 ? "+" : ""}${rain}% and ΔT ${temp >= 0 ? "+" : ""}${temp}°C. Projected yield impact below.`,
      data: { yields: [
        { batch: "Batch 1", tha: 22 + rain * 0.05, ci: "±2.0" },
        { batch: "Batch 2", tha: 17 + rain * 0.07, ci: "±2.5" },
        { batch: "Batch 3", tha: Math.max(4, 12 + rain * 0.12), ci: "±3.5" },
      ]},
      actions: [
        { text: "Schedule supplemental irrigation", pri: rain < 0 ? "High" : "Low" },
        { text: "Delay harvest by 2 weeks for Batch 1", pri: "Medium" },
      ],
    }]);
    setInput("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] h-full overflow-hidden">
      {/* Left: scenario builder */}
      <div className="border-r border-border bg-muted/30 overflow-y-auto p-6 space-y-5">
        <div>
          <h2 className="font-semibold text-base mb-1">Scenario Builder</h2>
          <p className="text-xs text-muted-foreground">Configure context, then run a simulation against your data.</p>
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Scenario type</Label>
          <Select value={scenario} onValueChange={setScenario}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="planting">Planting Window Optimization</SelectItem>
              <SelectItem value="drought">Drought Impact Projection</SelectItem>
              <SelectItem value="yield-stress">Yield Forecast Under Stress</SelectItem>
              <SelectItem value="harvest">Harvest Timing Recommendation</SelectItem>
              <SelectItem value="intercrop">Intercrop Interference Analysis</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Plot / Batch</Label>
          <Select defaultValue="all">
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All plots, all batches</SelectItem>
              <SelectItem value="b1">Batch 1 only</SelectItem>
              <SelectItem value="b3">Batch 3 only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card className="p-3 space-y-2.5">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Data context</div>
          {["NDVI", "Rainfall (CHIRPS)", "VHI Drought Index", "LST (Heat Stress)", "Soil Moisture (SAR)"].map(s => (
            <div key={s} className="flex items-center justify-between">
              <span className="text-sm">{s}</span>
              <Switch defaultChecked={s !== "LST (Heat Stress)"} />
            </div>
          ))}
        </Card>

        <Card className="p-3 space-y-4">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Parameters</div>
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span>Rainfall deviation</span>
              <span className="font-mono font-semibold">{rain >= 0 ? "+" : ""}{rain}%</span>
            </div>
            <Slider value={[rain]} min={-50} max={50} step={5} onValueChange={v => setRain(v[0])} />
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span>Temperature anomaly</span>
              <span className="font-mono font-semibold">{temp >= 0 ? "+" : ""}{temp}°C</span>
            </div>
            <Slider value={[temp]} min={-3} max={5} step={1} onValueChange={v => setTemp(v[0])} />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>Fertilizer applied</span>
            <Switch />
          </div>
        </Card>

        <Button className="w-full" onClick={() => send(`Run ${scenario} scenario`)}>
          <Sparkles className="size-4 mr-2" /> Run Scenario
        </Button>
      </div>

      {/* Right: chat */}
      <div className="flex flex-col overflow-hidden">
        <div className="border-b border-border bg-card px-5 py-3 flex items-center justify-between">
          <div className="text-xs">
            <span className="text-muted-foreground">Analyzing: </span>
            <span className="font-medium">Farm A · Batches 1–4 · Jan–Jul 2024 · NDVI + CHIRPS + VHI</span>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" className="h-7"><Edit3 className="size-3.5 mr-1" /> Edit</Button>
            <Button variant="ghost" size="sm" className="h-7" onClick={() => setMessages(initial)}><Plus className="size-3.5 mr-1" /> New</Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "flex justify-end" : ""}>
              <div className={m.role === "user"
                ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[80%]"
                : "bg-card border border-border rounded-2xl rounded-tl-sm p-4 max-w-[90%] shadow-card"}
              >
                {m.role === "ai" && <div className="flex items-center gap-1.5 mb-2 text-xs font-semibold text-primary"><Sparkles className="size-3.5" /> FarmSense AI</div>}
                <p className="text-sm leading-relaxed whitespace-pre-line" dangerouslySetInnerHTML={{ __html: m.content.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>") }} />
                {m.data && (
                  <>
                    <div className="mt-3 rounded-lg overflow-hidden border border-border">
                      <table className="w-full text-xs">
                        <thead className="bg-muted text-left">
                          <tr><th className="px-3 py-2 font-medium">Batch</th><th className="px-3 py-2 font-medium">Yield (t/ha)</th><th className="px-3 py-2 font-medium">CI</th></tr>
                        </thead>
                        <tbody>
                          {m.data.yields.map(y => (
                            <tr key={y.batch} className="border-t border-border">
                              <td className="px-3 py-2 font-medium">{y.batch}</td>
                              <td className="px-3 py-2 font-mono">{y.tha.toFixed(1)}</td>
                              <td className="px-3 py-2 text-muted-foreground font-mono">{y.ci}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="h-32 mt-3">
                      <ResponsiveContainer>
                        <BarChart data={m.data.yields}>
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                          <XAxis dataKey="batch" tick={{ fontSize: 10 }} />
                          <YAxis tick={{ fontSize: 10 }} />
                          <Bar dataKey="tha" fill="var(--color-primary)" radius={[3, 3, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </>
                )}
                {m.actions && (
                  <div className="mt-3 space-y-1.5">
                    <div className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">Recommended actions</div>
                    {m.actions.map((a, ai) => (
                      <div key={ai} className="flex items-start gap-2 text-sm">
                        <Badge variant="secondary" className={
                          a.pri === "High" ? "bg-destructive/10 text-destructive border-destructive/20" :
                          a.pri === "Medium" ? "bg-amber-500/10 text-amber-700 border-amber-500/20" :
                          "bg-muted"
                        }>{a.pri}</Badge>
                        <span className="flex-1">{a.text}</span>
                      </div>
                    ))}
                  </div>
                )}
                {m.role === "ai" && (
                  <Button size="sm" variant="outline" className="mt-3 h-7 text-xs"><Download className="size-3 mr-1" /> Export this scenario</Button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-border p-4 bg-card space-y-3">
          <div className="flex gap-2 flex-wrap">
            {presets.map(p => (
              <button key={p} onClick={() => send(p)}
                className="text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-accent transition border border-border">
                {p}
              </button>
            ))}
          </div>
          <form onSubmit={e => { e.preventDefault(); send(input); }} className="flex gap-2">
            <Input placeholder="Ask FarmSense AI…" value={input} onChange={e => setInput(e.target.value)} />
            <Button type="submit" size="icon"><Send className="size-4" /></Button>
          </form>
        </div>
      </div>
    </div>
  );
}
