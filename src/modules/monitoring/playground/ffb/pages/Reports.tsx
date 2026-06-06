import { useState } from "react";
import { blocks, totals } from "./lib/mock-data";
import { StatusBadge } from "./components/StatusBadge";
import { FileText, Download, Share2, Check, ChevronRight } from "lucide-react";
import { cn } from "@monitoring-shared/lib/utils";

const METRICS = [
  "NDVI Canopy Health",
  "Red-Edge Chlorophyll (CIre) — Nutrient Status",
  "FFB Yield Forecast",
  "BSR Disease Risk Score",
  "Rainfall Adequacy",
  "Harvest Schedule Compliance",
  "Replanting Candidates",
];
const REPORT_TYPES = [
  "Estate Summary Report",
  "Block Health & Monitoring Report",
  "FFB Yield Forecast Report",
  "Disease Risk Report",
  "Replanting Decision Report",
];

const SAVED = [
  { name: "Q4 2025 Estate Summary — Ondo Alpha", type: "Estate Summary", date: "Dec 1, 2025", status: "Final" },
  { name: "B07 Disease Risk Brief", type: "Disease Risk", date: "Nov 28, 2025", status: "Final" },
  { name: "Cross River FFB Forecast — Q1 2026", type: "FFB Forecast", date: "Nov 22, 2025", status: "Draft" },
  { name: "B11/B12 Replanting Analysis", type: "Replanting", date: "Oct 15, 2025", status: "Final" },
];

export function Reports() {
  const [step, setStep] = useState(1);
  const [scope, setScope] = useState<"estate" | "block">("estate");
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>(blocks.map(b => b.id));
  const [metrics, setMetrics] = useState<Record<string, boolean>>({
    "NDVI Canopy Health": true, "FFB Yield Forecast": true, "BSR Disease Risk Score": true, "Replanting Candidates": true,
  });
  const [type, setType] = useState(REPORT_TYPES[0]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_1fr] gap-4 p-6 h-full">
      {/* Saved reports */}
      <div className="bg-card border border-border rounded-lg overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-sm font-semibold">Saved Reports</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">{SAVED.length} reports</p>
        </div>
        <div className="overflow-auto divide-y divide-border">
          {SAVED.map(r => (
            <div key={r.name} className="p-3 hover:bg-muted/40 cursor-pointer">
              <div className="text-xs font-medium leading-snug">{r.name}</div>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-[10px] text-muted-foreground">{r.date}</span>
                <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-medium",
                  r.status === "Final" ? "bg-[var(--color-peak)]/10 text-[var(--color-canopy)]" : "bg-muted text-muted-foreground")}>{r.status}</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <button className="text-[11px] text-primary hover:underline flex items-center gap-1"><Download className="h-3 w-3"/>PDF</button>
                <button className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1"><Share2 className="h-3 w-3"/>Share</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Wizard */}
      <div className="bg-card border border-border rounded-lg overflow-hidden flex flex-col">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-base font-semibold">Build a Report</h2>
          <div className="flex items-center gap-2 mt-3">
            {[1,2,3,4,5].map(n => (
              <div key={n} className="flex items-center gap-2">
                <div className={cn("h-6 w-6 rounded-full text-[11px] font-semibold flex items-center justify-center",
                  step >= n ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                  {step > n ? <Check className="h-3 w-3"/> : n}
                </div>
                {n < 5 && <ChevronRight className="h-3 w-3 text-muted-foreground"/>}
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 flex-1 overflow-auto">
          {step === 1 && (
            <Section title="Step 1 — Select Scope">
              <div className="flex gap-2">
                {(["estate", "block"] as const).map(s => (
                  <button key={s} onClick={() => setScope(s)}
                    className={cn("flex-1 rounded-md border py-3 text-sm font-medium",
                      scope === s ? "border-primary bg-primary/5 text-primary" : "border-border hover:bg-muted")}>
                    {s === "estate" ? "Estate-level" : "Block-level"}
                  </button>
                ))}
              </div>
              <div className="mt-4 max-h-64 overflow-auto border border-border rounded-md p-2 space-y-1">
                {blocks.map(b => (
                  <label key={b.id} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted text-xs cursor-pointer">
                    <input type="checkbox" checked={selectedBlocks.includes(b.id)} onChange={e => {
                      setSelectedBlocks(e.target.checked ? [...selectedBlocks, b.id] : selectedBlocks.filter(x => x !== b.id));
                    }} className="accent-primary"/>
                    <span className="font-mono font-semibold">{b.id}</span>
                    <span className="text-muted-foreground">{b.estate}</span>
                    <span className="ml-auto text-muted-foreground">Age {b.age}y · {b.areaHa}ha</span>
                  </label>
                ))}
              </div>
            </Section>
          )}
          {step === 2 && (
            <Section title="Step 2 — Time Range">
              <div className="grid grid-cols-2 gap-2">
                <div><label className="text-xs text-muted-foreground">From</label><input type="date" defaultValue="2025-01-01" className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm"/></div>
                <div><label className="text-xs text-muted-foreground">To</label><input type="date" defaultValue="2025-12-31" className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm"/></div>
              </div>
              <div className="mt-3 flex gap-1.5">
                {["Quarter", "Semester", "Annual"].map(p => (
                  <button key={p} className="px-3 py-1.5 text-xs rounded-md bg-muted hover:bg-primary/10 hover:text-primary border border-transparent">{p}</button>
                ))}
              </div>
            </Section>
          )}
          {step === 3 && (
            <Section title="Step 3 — Metrics">
              <div className="space-y-1.5">
                {METRICS.map(m => (
                  <label key={m} className="flex items-center gap-2 px-3 py-2 rounded-md bg-muted/40 hover:bg-muted cursor-pointer text-sm">
                    <input type="checkbox" checked={!!metrics[m]} onChange={e => setMetrics({ ...metrics, [m]: e.target.checked })} className="accent-primary"/>
                    {m}
                  </label>
                ))}
              </div>
            </Section>
          )}
          {step === 4 && (
            <Section title="Step 4 — Report Type">
              <div className="space-y-1.5">
                {REPORT_TYPES.map(t => (
                  <label key={t} className={cn("flex items-center gap-3 px-3 py-3 rounded-md border cursor-pointer text-sm",
                    type === t ? "border-primary bg-primary/5" : "border-border hover:bg-muted")}>
                    <input type="radio" checked={type === t} onChange={() => setType(t)} className="accent-primary"/>
                    {t}
                  </label>
                ))}
              </div>
            </Section>
          )}
          {step === 5 && (
            <Section title="Step 5 — Export">
              <div className="grid grid-cols-2 gap-2">
                <button className="bg-primary text-primary-foreground py-3 rounded-md text-sm font-semibold hover:bg-primary/90 flex items-center justify-center gap-2"><Download className="h-4 w-4"/>Export PDF</button>
                <button className="bg-muted hover:bg-muted/70 py-3 rounded-md text-sm font-semibold flex items-center justify-center gap-2"><Download className="h-4 w-4"/>Export CSV</button>
              </div>
              <p className="text-xs text-muted-foreground mt-3">Preview is shown on the right →</p>
            </Section>
          )}

          <div className="flex justify-between mt-6 pt-4 border-t border-border">
            <button onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1} className="px-4 py-2 text-sm rounded-md border border-border hover:bg-muted disabled:opacity-40">Back</button>
            <button onClick={() => setStep(Math.min(5, step + 1))} disabled={step === 5} className="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40">Next</button>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-card border border-border rounded-lg overflow-auto">
        <div className="px-5 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary"/>
            <h3 className="text-sm font-semibold">{type}</h3>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">Ondo Alpha + Cross River Beta · 6.5°N 5.5°E · Generated Dec 4, 2025</p>
        </div>

        <div className="p-5 space-y-5">
          {/* Map snapshot */}
          <div className="aspect-video bg-[#1a2818] rounded-md overflow-hidden border border-border">
            <svg viewBox="0 0 800 450" className="w-full h-full">
              <rect width="800" height="450" fill="#2d3a25"/>
              {blocks.map(b => {
                const fill = b.bsrRisk === "high" ? "var(--color-disease)" : b.ffbYield >= 20 ? "var(--color-canopy)" : b.ffbYield >= 12 ? "var(--color-peak)" : "var(--color-aging)";
                const pts = b.polygon.map(p => `${p[0] * 0.8},${p[1] * 0.65}`).join(" ");
                return <polygon key={b.id} points={pts} fill={fill} fillOpacity={0.7} stroke="#000" strokeWidth="1"/>;
              })}
            </svg>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-4 gap-2">
            <Metric label="Total Area" value={`${totals.area} ha`}/>
            <Metric label="Active Blocks" value={`${totals.blocks}`}/>
            <Metric label="Q1 FFB" value={`${totals.ffbQuarter} t`}/>
            <Metric label="Risk Blocks" value={`${totals.alertBlocks}`} danger/>
          </div>

          {/* Block table */}
          <div>
            <h4 className="text-sm font-semibold mb-2">Block Status</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-left text-muted-foreground border-b border-border">
                    <th className="py-1.5 pr-2">Block</th>
                    <th className="pr-2">Age</th>
                    <th className="pr-2">NDVI</th>
                    <th className="pr-2">CIre</th>
                    <th className="pr-2">BSR</th>
                    <th className="pr-2">FFB t/ha</th>
                    <th className="pr-2">Total t</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {blocks.map(b => (
                    <tr key={b.id} className="border-b border-border/50">
                      <td className="py-1.5 font-mono font-semibold">{b.id}</td>
                      <td>{b.age}y</td>
                      <td className="font-mono">{b.ndvi.toFixed(2)}</td>
                      <td className="font-mono">{b.cire.toFixed(1)}</td>
                      <td><StatusBadge variant={b.bsrRisk}>{b.bsrRisk}</StatusBadge></td>
                      <td className="font-mono">{b.ffbYield}</td>
                      <td className="font-mono">{Math.round(b.ffbYield * b.areaHa)}</td>
                      <td className="text-muted-foreground">{b.bsrRisk === "high" ? "Inspect" : b.cire < 1.2 ? "Fertilize" : b.age >= 25 ? "Replant" : "Maintain"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Plain language */}
          <div>
            <h4 className="text-sm font-semibold mb-2">Plain-Language Insights</h4>
            <ul className="space-y-2 text-xs text-foreground/90">
              <Insight><strong>B05</strong> — Age 13y. Canopy excellent, FFB on track at 24 t/ha. Next harvest in 2 weeks.</Insight>
              <Insight><strong>B07</strong> — NDVI decline detected (−0.19 anomaly). Possible early BSR infection. Recommend immediate field inspection.</Insight>
              <Insight><strong>B10</strong> — Nutrient deficiency (CIre 0.8). Potassium application recommended before next wet season.</Insight>
              <Insight><strong>B11/B12</strong> — Age 26y. Approaching replanting threshold. Yield declined to 11 t/ha.</Insight>
              <Insight><strong>Estate Total Projected FFB</strong>: ~{totals.ffbQuarter} t this quarter across 10 producing blocks.</Insight>
              <Insight><strong>Drought Alert</strong>: 3 blocks showing moisture stress. Rainfall deficit −58mm vs 10-year average.</Insight>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-semibold mb-3">{title}</h3>
      {children}
    </div>
  );
}
function Metric({ label, value, danger }: { label: string; value: string; danger?: boolean }) {
  return (
    <div className="bg-muted/50 rounded-md p-2.5">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={cn("text-sm font-semibold mt-0.5", danger && "text-destructive")}>{value}</div>
    </div>
  );
}
function Insight({ children }: { children: React.ReactNode }) {
  return <li className="flex gap-2"><span className="text-primary mt-0.5">•</span><span>{children}</span></li>;
}
