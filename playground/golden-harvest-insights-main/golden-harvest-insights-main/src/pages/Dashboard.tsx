import { blocks, alerts, totals, rainfall, ageClassColor, ageClassLabel } from "@/lib/mock-data";
import { StatusBadge } from "@/components/StatusBadge";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, ReferenceLine, ScatterChart, Scatter, ZAxis, ComposedChart, Cell, Legend,
} from "recharts";
import { TrendingUp, AlertTriangle, MapPin, X, Sparkles, Droplets, Calendar } from "lucide-react";

const KPI = ({ label, value, sub, accent = false, danger = false }: { label: string; value: string; sub?: string; accent?: boolean; danger?: boolean }) => (
  <div className="bg-card border border-border rounded-lg p-4">
    <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">{label}</div>
    <div className={`mt-1 text-2xl font-semibold ${danger ? "text-destructive" : accent ? "text-primary" : ""}`}>{value}</div>
    {sub && <div className="text-[11px] text-muted-foreground mt-1">{sub}</div>}
  </div>
);

// NDVI by age class — average per month
const ndviByAgeData = (() => {
  const groups = ["immature", "young", "peak", "aging", "declining"] as const;
  return Array.from({ length: 24 }, (_, i) => {
    const row: any = { month: i + 1 };
    groups.forEach(g => {
      const subset = blocks.filter(b => b.ageClass === g);
      if (subset.length) {
        row[g] = +(subset.reduce((s, b) => s + b.ndviTrend[i], 0) / subset.length).toFixed(3);
      }
    });
    return row;
  });
})();

const yieldData = blocks
  .map(b => ({ id: b.id, yield: b.ffbYield, age: b.age, ageClass: b.ageClass }))
  .sort((a, b) => b.yield - a.yield);

const estateAvgYield = +(blocks.reduce((s, b) => s + b.ffbYield, 0) / blocks.length).toFixed(1);

const cireHeatmap = blocks.map(b => {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return {
    id: b.id,
    cells: months.map((m, i) => {
      const noise = Math.sin(i + b.id.charCodeAt(2)) * 0.15;
      const v = +Math.max(0.5, b.cire + noise).toFixed(2);
      return { month: m, v };
    }),
  };
});

const cireColor = (v: number) =>
  v >= 1.6 ? "var(--color-canopy)" : v >= 1.2 ? "var(--color-aging)" : "var(--color-disease)";

const diseaseScatter = blocks.map(b => {
  const baseline = 0.7;
  const anomaly = +(baseline - b.ndvi).toFixed(2);
  return {
    id: b.id, age: b.age, anomaly, area: b.areaHa,
    risk: b.bsrRisk,
    color: b.bsrRisk === "high" ? "var(--color-disease)" : b.bsrRisk === "medium" ? "var(--color-aging)" : "var(--color-peak)",
  };
});

export function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPI label="Total Planted Area" value={`${totals.area} ha`} sub="12 active blocks · 2 estates"/>
        <KPI label="Active Blocks" value={`${totals.blocks}`} sub="2 immature · 8 producing · 2 replant"/>
        <KPI label="Projected FFB · Q1" value={`${totals.ffbQuarter} t`} sub="Estate avg 18.2 t/ha" accent/>
        <KPI label="Active Health Alerts" value={`${totals.alertBlocks}`} sub="High-severity blocks" danger={totals.alertBlocks > 0}/>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2 bg-card border border-border rounded-lg p-3">
        <span className="text-xs text-muted-foreground mr-1">Filters:</span>
        {["Estate: All", "Age: All", "Cycle: 2024–2025", "Status: Active"].map(t => (
          <span key={t} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
            {t} <X className="h-3 w-3 cursor-pointer"/>
          </span>
        ))}
        <button className="ml-auto text-xs text-muted-foreground hover:text-foreground">Reset all</button>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-4">

          <ChartCard title="NDVI Trend by Stand Age" subtitle="24-month canopy density · Sentinel-2">
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={ndviByAgeData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)"/>
                <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="var(--color-muted-foreground)"/>
                <YAxis domain={[0.3, 0.9]} tick={{ fontSize: 10 }} stroke="var(--color-muted-foreground)"/>
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6 }}/>
                <Legend wrapperStyle={{ fontSize: 11 }}/>
                <Line dot={false} type="monotone" dataKey="immature" stroke="var(--color-immature)" name="Immature"/>
                <Line dot={false} type="monotone" dataKey="young" stroke="var(--color-peak)" name="Young Mature"/>
                <Line dot={false} type="monotone" dataKey="peak" stroke="var(--color-canopy)" strokeWidth={2} name="Peak"/>
                <Line dot={false} type="monotone" dataKey="aging" stroke="var(--color-aging)" name="Aging"/>
                <Line dot={false} type="monotone" dataKey="declining" stroke="var(--color-replant)" name="Declining"/>
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="FFB Yield Forecast by Block" subtitle={`Estate avg: ${estateAvgYield} t/ha`}>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart layout="vertical" data={yieldData} margin={{ top: 5, right: 10, left: 5, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)"/>
                <XAxis type="number" tick={{ fontSize: 10 }} stroke="var(--color-muted-foreground)"/>
                <YAxis type="category" dataKey="id" tick={{ fontSize: 10 }} stroke="var(--color-muted-foreground)" width={40}/>
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6 }}/>
                <ReferenceLine x={estateAvgYield} stroke="var(--color-primary)" strokeDasharray="4 4" label={{ value: "avg", position: "top", fontSize: 10 }}/>
                <Bar dataKey="yield" radius={[0, 3, 3, 0]}>
                  {yieldData.map((d) => <Cell key={d.id} fill={ageClassColor[d.ageClass]}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Red-Edge CIre · Nutrient Status" subtitle="Green = adequate · Amber = deficient · Red = severe">
            <div className="overflow-x-auto">
              <table className="text-[10px] font-mono w-full">
                <thead>
                  <tr className="text-muted-foreground">
                    <th className="text-left pl-1 py-1 sticky left-0 bg-card">Block</th>
                    {cireHeatmap[0].cells.map(c => <th key={c.month} className="px-1">{c.month}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {cireHeatmap.map(row => (
                    <tr key={row.id}>
                      <td className="font-semibold pl-1 py-0.5 sticky left-0 bg-card">{row.id}</td>
                      {row.cells.map((c, i) => (
                        <td key={i} className="p-0.5">
                          <div title={`${c.month}: CIre ${c.v}`} className="h-5 w-full rounded-sm" style={{ background: cireColor(c.v), opacity: 0.5 + Math.min(0.5, c.v / 3) }}/>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ChartCard>

          <ChartCard title="Disease Risk Monitor (BSR)" subtitle="Bubble = block area · color = BSR risk">
            <ResponsiveContainer width="100%" height={240}>
              <ScatterChart margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)"/>
                <XAxis type="number" dataKey="age" name="Age" tick={{ fontSize: 10 }} unit="y" stroke="var(--color-muted-foreground)"/>
                <YAxis type="number" dataKey="anomaly" name="NDVI Δ" tick={{ fontSize: 10 }} stroke="var(--color-muted-foreground)"/>
                <ZAxis type="number" dataKey="area" range={[60, 400]}/>
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6 }} cursor={{ strokeDasharray: "3 3" }}/>
                <Scatter data={diseaseScatter}>
                  {diseaseScatter.map((d, i) => <Cell key={i} fill={d.color}/>)}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Rainfall vs Water Requirement" subtitle="CHIRPS monthly · 150–200mm/mo target" wide>
            <ResponsiveContainer width="100%" height={220}>
              <ComposedChart data={rainfall} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)"/>
                <XAxis dataKey="month" tick={{ fontSize: 9 }} stroke="var(--color-muted-foreground)"/>
                <YAxis tick={{ fontSize: 10 }} stroke="var(--color-muted-foreground)"/>
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6 }}/>
                <Bar dataKey="rainfall" radius={[3, 3, 0, 0]}>
                  {rainfall.map((d, i) => <Cell key={i} fill={d.rainfall < 100 ? "var(--color-aging)" : "var(--color-canopy)"} opacity={0.85}/>)}
                </Bar>
                <Line type="monotone" dataKey="requirement" stroke="var(--color-primary)" strokeDasharray="4 4" dot={false}/>
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Harvest Calendar" subtitle="52-week schedule · gold = upcoming · red = overdue" wide>
            <div className="space-y-1.5">
              {blocks.filter(b => b.age >= 5).map(b => {
                const lastWeek = 30 + (b.id.charCodeAt(2) % 6);
                const nextWeek = lastWeek + 6;
                const overdue = b.overdue;
                return (
                  <div key={b.id} className="flex items-center gap-2 text-[11px]">
                    <span className="font-mono w-8 text-right text-muted-foreground">{b.id}</span>
                    <div className="relative flex-1 h-4 bg-muted rounded-sm overflow-hidden">
                      <div className="absolute h-full bg-muted-foreground/30" style={{ left: `${(lastWeek / 52) * 100}%`, width: "8%" }}/>
                      <div className="absolute h-full" style={{
                        left: `${(nextWeek / 52) * 100}%`, width: "8%",
                        background: overdue ? "var(--color-disease)" : "var(--color-harvest)",
                      }}/>
                    </div>
                    <span className="w-12 text-right font-mono text-muted-foreground">{overdue ? "−3w" : `+${(b.id.charCodeAt(2) % 5)}w`}</span>
                  </div>
                );
              })}
            </div>
          </ChartCard>
        </div>

        {/* Alert feed */}
        <div className="bg-card border border-border rounded-lg flex flex-col">
          <div className="px-4 py-3 border-b border-border flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive"/>
            <h3 className="text-sm font-semibold">Active Alerts</h3>
            <span className="ml-auto text-xs text-muted-foreground">{alerts.length} active</span>
          </div>
          <div className="overflow-auto divide-y divide-border">
            {alerts.map(a => (
              <div key={a.id} className="p-4 hover:bg-muted/40">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold">{a.blockId}</span>
                    <span className="text-[10px] text-muted-foreground">Age {a.age}y</span>
                  </div>
                  <StatusBadge variant={a.severity}>{a.severity.toUpperCase()}</StatusBadge>
                </div>
                <div className="text-sm font-medium mb-0.5 flex items-center gap-1.5">
                  {a.type === "BSR Disease Risk" && <AlertTriangle className="h-3.5 w-3.5 text-destructive"/>}
                  {a.type === "Nutrient Deficiency" && <Sparkles className="h-3.5 w-3.5 text-primary"/>}
                  {a.type === "Rainfall Deficit" && <Droplets className="h-3.5 w-3.5 text-primary"/>}
                  {a.type === "Harvest Overdue" && <Calendar className="h-3.5 w-3.5 text-[var(--color-drought)]"/>}
                  {a.type}
                </div>
                <p className="text-xs text-muted-foreground mb-2">{a.msg}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">{a.date}</span>
                  <button className="text-[11px] text-primary hover:underline flex items-center gap-1"><MapPin className="h-3 w-3"/>View on map</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, children, wide }: { title: string; subtitle?: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className={`bg-card border border-border rounded-lg p-4 ${wide ? "lg:col-span-2" : ""}`}>
      <div className="mb-3">
        <h3 className="text-sm font-semibold flex items-center gap-1.5"><TrendingUp className="h-3.5 w-3.5 text-primary"/>{title}</h3>
        {subtitle && <p className="text-[11px] text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
