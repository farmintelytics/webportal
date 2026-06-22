import { useState } from "react";
import { Card } from "@monitoring-shared/ui/card";
import { Button } from "@monitoring-shared/ui/button";
import { Badge } from "@monitoring-shared/ui/badge";
import { Checkbox } from "@monitoring-shared/ui/checkbox";
import { Label } from "@monitoring-shared/ui/label";
import { RadioGroup, RadioGroupItem } from "@monitoring-shared/ui/radio-group";
import { Input } from "@monitoring-shared/ui/input";
import { batches, plots, totalArea, totalYield } from "../../lib/fallbackData";
import { Download, Share2, FileText, Check } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from "recharts";

const saved = [
  { name: "Ondo Farm A — July Summary", type: "Farm Summary", date: "2024-07-12", status: "Ready" },
  { name: "Batch 3 Drought Alert", type: "Drought Alert", date: "2024-07-10", status: "Ready" },
  { name: "Q2 Yield Forecast", type: "Yield Forecast", date: "2024-07-01", status: "Draft" },
];

export function ReportsPage() {
  const [step, setStep] = useState(1);
  const [type, setType] = useState("farm");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 p-6">
      {/* Saved reports */}
      <Card className="p-4 h-fit">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm">Saved Reports</h3>
          <Button size="sm" variant="ghost" className="h-7 text-xs">+ New</Button>
        </div>
        <div className="space-y-2">
          {saved.map(r => (
            <div key={r.name} className="p-2.5 rounded-lg border border-border hover:bg-muted/50 cursor-pointer">
              <div className="text-sm font-medium truncate">{r.name}</div>
              <div className="text-[11px] text-muted-foreground flex items-center gap-2 mt-0.5">
                <span>{r.type}</span>·<span>{r.date}</span>
              </div>
              <div className="flex items-center justify-between mt-1.5">
                <Badge variant={r.status === "Ready" ? "default" : "secondary"} className="text-[10px] h-4">{r.status}</Badge>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" className="size-6"><Download className="size-3" /></Button>
                  <Button size="icon" variant="ghost" className="size-6"><Share2 className="size-3" /></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-6">
        {/* Wizard */}
        <Card className="p-5 h-fit">
          <h3 className="font-semibold mb-4">Report Builder</h3>

          <div className="flex items-center mb-5">
            {[1, 2, 3, 4, 5].map(s => (
              <div key={s} className="flex-1 flex items-center">
                <div className={`size-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                  step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  {step > s ? <Check className="size-3.5" /> : s}
                </div>
                {s < 5 && <div className={`flex-1 h-0.5 mx-1 ${step > s ? "bg-primary" : "bg-muted"}`} />}
              </div>
            ))}
          </div>

          <div className="space-y-3 min-h-[260px]">
            {step === 1 && (
              <>
                <div className="text-sm font-medium">Select scope</div>
                <RadioGroup defaultValue="farm">
                  <div className="flex items-center gap-2"><RadioGroupItem value="farm" id="farm" /><Label htmlFor="farm">Farm-level</Label></div>
                  <div className="flex items-center gap-2"><RadioGroupItem value="plot" id="plot" /><Label htmlFor="plot">Plot-level</Label></div>
                </RadioGroup>
                <div className="text-xs font-medium text-muted-foreground mt-3">Plots</div>
                <div className="grid grid-cols-3 gap-2">
                  {plots.slice(0, 9).map(p => (
                    <label key={p.id} className="flex items-center gap-1.5 text-xs">
                      <Checkbox defaultChecked /> <span className="font-mono">{p.id}</span>
                    </label>
                  ))}
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <div className="text-sm font-medium">Time range</div>
                <div className="grid grid-cols-2 gap-2">
                  <div><Label className="text-xs">From</Label><Input type="date" defaultValue="2024-01-01" /></div>
                  <div><Label className="text-xs">To</Label><Input type="date" defaultValue="2024-07-15" /></div>
                </div>
              </>
            )}
            {step === 3 && (
              <>
                <div className="text-sm font-medium">Metrics to include</div>
                {["NDVI Growth", "VHI Drought Score", "Rainfall Adequacy", "Predicted Yield", "Activity Completion"].map(m => (
                  <label key={m} className="flex items-center gap-2 text-sm"><Checkbox defaultChecked /> {m}</label>
                ))}
              </>
            )}
            {step === 4 && (
              <>
                <div className="text-sm font-medium">Report type</div>
                <RadioGroup value={type} onValueChange={setType}>
                  {[
                    ["farm", "Farm Summary Report"],
                    ["batch", "Batch Monitoring Report"],
                    ["yield", "Yield Forecast Report"],
                    ["drought", "Drought Alert Report"],
                  ].map(([v, l]) => (
                    <div key={v} className="flex items-center gap-2"><RadioGroupItem value={v} id={v} /><Label htmlFor={v}>{l}</Label></div>
                  ))}
                </RadioGroup>
              </>
            )}
            {step === 5 && (
              <div className="space-y-3">
                <div className="text-sm font-medium">Ready to export</div>
                <Button className="w-full"><Download className="size-4 mr-2" /> Export PDF</Button>
                <Button className="w-full" variant="outline"><Download className="size-4 mr-2" /> Export CSV</Button>
              </div>
            )}
          </div>

          <div className="flex justify-between mt-5 pt-4 border-t border-border">
            <Button variant="ghost" size="sm" disabled={step === 1} onClick={() => setStep(s => s - 1)}>Back</Button>
            <Button size="sm" disabled={step === 5} onClick={() => setStep(s => s + 1)}>Next</Button>
          </div>
        </Card>

        {/* Preview */}
        <Card className="p-6 overflow-hidden">
          <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
            <div>
              <h2 className="text-lg font-semibold">Ondo Farm A — Monitoring Report</h2>
              <p className="text-xs text-muted-foreground">Ondo State, Nigeria · Generated July 15, 2024</p>
            </div>
            <div className="size-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-semibold">FS</div>
          </div>

          <div className="aspect-[2/1] rounded-lg bg-muted relative overflow-hidden mb-4 border border-border">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-muted to-harvest/10" />
            <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">Static map snapshot · 9 plots</div>
            {[
              { l: 25, t: 30, c: "#16A34A" }, { l: 50, t: 40, c: "#0EA5E9" }, { l: 70, t: 25, c: "#DC2626" },
              { l: 30, t: 65, c: "#16A34A" }, { l: 60, t: 70, c: "#D97706" },
            ].map((d, i) => <div key={i} className="absolute size-6 rounded opacity-80" style={{ left: `${d.l}%`, top: `${d.t}%`, background: d.c }} />)}
          </div>

          <div className="grid grid-cols-4 gap-3 mb-5">
            <Mini label="Total Area" value={`${totalArea.toFixed(1)} ha`} />
            <Mini label="Crop" value="Cassava" />
            <Mini label="Yield Estimate" value={`${Math.round(totalYield)} t`} />
            <Mini label="Activity %" value="86%" />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-5">
            <Card className="p-3">
              <div className="text-xs font-semibold mb-2">NDVI Time Series</div>
              <ResponsiveContainer width="100%" height={120}>
                <LineChart data={batches[0].ndviSeries.map((v, i) => ({ m: i, v }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="m" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Line dataKey="v" stroke="var(--color-primary)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
            <Card className="p-3">
              <div className="text-xs font-semibold mb-2">Rainfall vs Requirement</div>
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={[{m:"M",r:80,e:120},{m:"J",r:160,e:170},{m:"J",r:120,e:180},{m:"A",r:90,e:170}]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="m" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Bar dataKey="r" fill="var(--color-harvest)" radius={[3,3,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <div className="text-xs font-semibold mb-2 uppercase tracking-wide text-muted-foreground">Batch Status</div>
          <div className="overflow-x-auto rounded-lg border border-border mb-5">
            <table className="w-full text-xs">
              <thead className="bg-muted">
                <tr>
                  {["Plot","Batch","Age","NDVI","VHI","Yield t/ha","Total t","Harvest","Conf."].map(h => (
                    <th key={h} className="text-left px-3 py-2 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {plots.slice(0, 6).map(p => {
                  const b = batches.find(x => x.id === p.batchId)!;
                  return (
                    <tr key={p.id} className="border-t border-border">
                      <td className="px-3 py-2 font-mono">{p.id}</td>
                      <td className="px-3 py-2">{b.name}</td>
                      <td className="px-3 py-2">{p.ageMonths}m</td>
                      <td className="px-3 py-2 font-mono">{p.ndvi.toFixed(2)}</td>
                      <td className="px-3 py-2 font-mono">{p.vhi}</td>
                      <td className="px-3 py-2 font-mono">{p.predictedYield}</td>
                      <td className="px-3 py-2 font-mono">{(p.size * p.predictedYield).toFixed(1)}</td>
                      <td className="px-3 py-2 text-[11px]">{p.harvestWindow}</td>
                      <td className="px-3 py-2"><Badge variant="secondary" className="text-[10px] h-4">High</Badge></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div>
            <div className="text-xs font-semibold mb-2 uppercase tracking-wide text-muted-foreground flex items-center gap-1.5"><FileText className="size-3.5" /> Plain-Language Insights</div>
            <ul className="space-y-2 text-sm">
              <li className="border-l-2 border-harvest pl-3">Batch 1 — Harvest Window: NOW to 4 weeks. Predicted Yield: 22 t/ha.</li>
              <li className="border-l-2 border-healthy pl-3">Batch 2 — Age: 6 months. Canopy: Good. On track for harvest from October.</li>
              <li className="border-l-2 border-warning pl-3">Batch 3 — NDVI Below Expected. Consider fertilizer application and irrigation.</li>
              <li className="border-l-2 border-primary pl-3">Farm Total Expected: ~{Math.round(totalYield)} tonnes across {batches.length} active batches.</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/50 p-3">
      <div className="text-[10px] uppercase text-muted-foreground tracking-wide">{label}</div>
      <div className="text-base font-semibold mt-0.5">{value}</div>
    </div>
  );
}
