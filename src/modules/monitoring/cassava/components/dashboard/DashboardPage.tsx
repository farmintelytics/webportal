import { Fragment } from "react";
import { Card } from "@monitoring-shared/ui/card";
import { Badge } from "@monitoring-shared/ui/badge";
import { Button } from "@monitoring-shared/ui/button";
import { batches, plots, alerts, rainfall, totalArea, totalYield, stressCount, statusColors } from "../../lib/fallbackData";
import { Sprout, Layers, Wheat, AlertTriangle, Info, Download, Maximize2, X } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, ComposedChart, XAxis, YAxis, Tooltip, ResponsiveContainer,
  ReferenceLine, CartesianGrid, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";

const kpis = [
  { label: "Total Area Under Cassava", value: `${totalArea.toFixed(1)} ha`, icon: Sprout, color: "var(--color-primary)" },
  { label: "Active Batches", value: String(batches.length), icon: Layers, color: "var(--color-info)" },
  { label: "Expected Production", value: `${Math.round(totalYield)} t`, icon: Wheat, color: "var(--color-harvest)" },
  { label: "Active Stress Alerts", value: String(stressCount), icon: AlertTriangle, color: stressCount > 0 ? "var(--color-alert)" : "var(--color-healthy)" },
];

const filters = ["Cassava", "Ondo Farm A", "All Batches", "2024", "Monitoring"];

export function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(k => (
          <Card key={k.label} className="p-4 flex items-center gap-4">
            <div className="size-11 rounded-xl flex items-center justify-center" style={{ background: `${k.color}1a`, color: k.color }}>
              <k.icon className="size-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">{k.label}</div>
              <div className="text-2xl font-semibold" style={{ color: k.label.includes("Alert") && stressCount > 0 ? "var(--color-alert)" : undefined }}>
                {k.value}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-muted-foreground mr-1">Filters:</span>
        {filters.map(f => (
          <Badge key={f} variant="secondary" className="gap-1 pr-1">
            {f} <X className="size-3 cursor-pointer" />
          </Badge>
        ))}
        <Button variant="ghost" size="sm" className="h-6 text-xs">Reset all</Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Widget title="NDVI Growth Curves" hint="NDVI per batch over months since planting">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={Array.from({ length: 12 }, (_, i) => {
                const r: any = { month: i + 1 };
                batches.forEach(b => (r[b.name] = b.ndviSeries[i]));
                r.expected = [0.15, 0.25, 0.4, 0.55, 0.65, 0.72, 0.75, 0.74, 0.7, 0.65, 0.55, 0.45][i];
                return r;
              })}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 0.9]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line dataKey="expected" stroke="#94a3b8" strokeDasharray="4 4" dot={false} name="Expected" />
                {batches.map((b, i) => (
                  <Line key={b.id} dataKey={b.name} stroke={["#16A34A", "#0EA5E9", "#DC2626", "#6366F1"][i]} strokeWidth={2} dot={false} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </Widget>

          <Widget title="Rainfall vs Requirement" hint="Monthly CHIRPS rainfall vs crop requirement">
            <ResponsiveContainer width="100%" height={220}>
              <ComposedChart data={rainfall}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="rainfall" fill="var(--color-harvest)" radius={[4, 4, 0, 0]} />
                <Line dataKey="expected" stroke="var(--color-warning)" strokeWidth={2} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </Widget>

          <Widget title="VHI Drought Heatmap" hint="Plot × Week — green=OK, amber=stress, red=drought">
            <div className="overflow-auto">
              <div className="grid gap-0.5" style={{ gridTemplateColumns: `60px repeat(12, 1fr)` }}>
                <div />
                {Array.from({ length: 12 }, (_, i) => <div key={i} className="text-[10px] text-center text-muted-foreground">W{i+1}</div>)}
                {plots.slice(0, 9).map(p => (
                  <Fragment key={p.id}>
                    <div className="text-[10px] font-mono text-muted-foreground self-center">{p.id}</div>
                    {Array.from({ length: 12 }, (_, w) => {
                      const v = Math.max(15, Math.min(80, p.vhi + Math.sin(w * 0.7) * 15 + (Math.random() * 10 - 5)));
                      const c = v >= 50 ? "#16A34A" : v >= 35 ? "#D97706" : "#DC2626";
                      return <div key={p.id + w} className="h-5 rounded-sm" style={{ background: c, opacity: 0.85 }} title={`${p.id} W${w+1}: ${Math.round(v)}`} />;
                    })}
                  </Fragment>
                ))}
              </div>
            </div>
          </Widget>

          <Widget title="Yield Forecast by Batch" hint="Predicted t/ha colored by confidence">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={batches} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="predictedYield" fill="var(--color-primary)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Widget>

          <Widget title="Plot vs Plot Comparison" hint="Selected plots compared across key metrics">
            <ResponsiveContainer width="100%" height={240}>
              <RadarChart data={[
                { metric: "NDVI", P001: 72, P004: 64, P006: 38 },
                { metric: "LSWI", P001: 55, P004: 48, P006: 30 },
                { metric: "VHI", P001: 58, P004: 49, P006: 31 },
                { metric: "Rainfall", P001: 70, P004: 65, P006: 42 },
                { metric: "Yield", P001: 88, P004: 70, P006: 48 },
              ]}>
                <PolarGrid stroke="var(--color-border)" />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis tick={{ fontSize: 10 }} angle={30} domain={[0, 100]} />
                <Radar dataKey="P001" stroke="#16A34A" fill="#16A34A" fillOpacity={0.25} />
                <Radar dataKey="P004" stroke="#0EA5E9" fill="#0EA5E9" fillOpacity={0.25} />
                <Radar dataKey="P006" stroke="#DC2626" fill="#DC2626" fillOpacity={0.25} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </RadarChart>
            </ResponsiveContainer>
          </Widget>

          <Widget title="Season Comparison" hint="Average NDVI: current vs previous season">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={[
                { stage: "Planting", current: 0.18, previous: 0.16 },
                { stage: "Growing", current: 0.42, previous: 0.40 },
                { stage: "Canopy", current: 0.68, previous: 0.71 },
                { stage: "Bulking", current: 0.74, previous: 0.69 },
                { stage: "Harvest", current: 0.55, previous: 0.50 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="stage" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="current" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="previous" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Widget>
        </div>

        {/* Alerts */}
        <Card className="p-4 h-fit xl:sticky xl:top-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Active Alerts</h3>
            <Badge variant="secondary">{alerts.length}</Badge>
          </div>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {alerts.map(a => {
              const color = a.severity === "high" ? statusColors.alert : a.severity === "medium" ? statusColors.stress : statusColors.healthy;
              const Icon = a.severity === "info" ? Info : AlertTriangle;
              return (
                <div key={a.id} className="border-l-2 pl-3 py-1" style={{ borderColor: color }}>
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="size-3.5" style={{ color }} />
                    <span className="text-sm font-medium">{a.type}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mb-1">
                    <span className="font-mono">{a.plotId}</span> · {a.batchId} · {a.date}
                  </div>
                  <div className="text-xs mb-2">{a.message}</div>
                  <Button size="sm" variant="ghost" className="h-6 text-xs px-2">View on Map →</Button>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

function Widget({ title, hint, children }: { title: string; hint: string; children: React.ReactNode }) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          <p className="text-[11px] text-muted-foreground">{hint}</p>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="size-7"><Download className="size-3.5" /></Button>
          <Button variant="ghost" size="icon" className="size-7"><Maximize2 className="size-3.5" /></Button>
        </div>
      </div>
      {children}
    </Card>
  );
}
