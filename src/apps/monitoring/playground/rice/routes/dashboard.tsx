import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { AppLayout } from "./components/AppLayout";
import { KpiCard } from "./components/KpiCard";
import { plots, ndviTimeSeries, rainfallData, yieldByStage, stageColors } from "./lib/mockData";
import { Sprout, Droplets, AlertTriangle, Wheat } from "lucide-react";
import {
  Line, ResponsiveContainer, XAxis, YAxis, Tooltip, BarChart, Bar, Cell,
  AreaChart, Area, CartesianGrid, Legend, ComposedChart, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from "recharts";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — PaddyLens" },
      { name: "description", content: "Trend dashboard: NDVI, EVI, NDRE time series and season comparison across paddy plots." },
    ],
  }),
  component: Dashboard,
});

const indices = [
  { id: "ndvi", label: "NDVI", color: "#15803d" },
  { id: "evi", label: "EVI", color: "#0ea5e9" },
  { id: "ndre", label: "NDRE", color: "#f59e0b" },
] as const;

function Dashboard() {
  const [range, setRange] = useState<"4w" | "12w" | "season">("12w");
  const [enabled, setEnabled] = useState<Record<string, boolean>>({ ndvi: true, evi: true, ndre: true });
  const [compareLast, setCompareLast] = useState(true);

  const series = useMemo(() => {
    const len = range === "4w" ? 4 : range === "12w" ? 12 : 16;
    return ndviTimeSeries.slice(-len).map((d) => ({
      ...d,
      ndviPrev: +(d.ndvi * (0.82 + Math.sin(parseInt(d.week.slice(1)) / 2) * 0.05)).toFixed(2),
    }));
  }, [range]);

  const totalArea = plots.reduce((s, p) => s + p.area, 0);
  const totalYield = plots.reduce((s, p) => s + p.predictedYield * p.area, 0);
  const stressed = plots.filter(p => p.alert !== "healthy").length;
  const avgNdvi = +(plots.reduce((s,p)=>s+p.ndvi,0)/plots.length).toFixed(2);

  const radarData = ["soilScore","waterScore","climateScore","suitabilityScore"].map(k => ({
    metric: k.replace("Score",""),
    score: Math.round(plots.reduce((s,p)=>s+(p as any)[k],0)/plots.length),
  }));

  return (
    <AppLayout title="Dashboard" subtitle="Trends · comparisons · time-series intelligence">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Plots Monitored" value={plots.length} icon={Sprout} accent="primary" trend={{value:8,direction:"up"}} />
        <KpiCard label="Total Area" value={totalArea.toFixed(1)} unit="ha" icon={Droplets} accent="water" />
        <KpiCard label="Predicted Harvest" value={totalYield.toFixed(0)} unit="tonnes" icon={Wheat} accent="soil" trend={{value:12,direction:"up"}} />
        <KpiCard label="Stress Alerts" value={stressed} icon={AlertTriangle} accent="stress" trend={{value:3,direction:"down"}} />
      </div>

      {/* Trend chart with toggles */}
      <div className="mt-6 rounded-xl border border-border bg-card p-5 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-display font-semibold">Vegetation Index Trends</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Avg across all plots — Sentinel-2 (10m)</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {indices.map(i => (
              <button key={i.id}
                onClick={() => setEnabled(e => ({ ...e, [i.id]: !e[i.id] }))}
                className={`text-xs px-2.5 py-1.5 rounded-md border flex items-center gap-1.5 transition ${
                  enabled[i.id] ? "bg-card border-border" : "bg-muted text-muted-foreground border-transparent"
                }`}>
                <span className="size-2.5 rounded-full" style={{ background: enabled[i.id] ? i.color : "currentColor" }}/>
                {i.label}
              </button>
            ))}
            <label className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md border border-border cursor-pointer">
              <input type="checkbox" checked={compareLast} onChange={(e)=>setCompareLast(e.target.checked)} className="accent-primary"/>
              Compare last season
            </label>
            <div className="flex rounded-md border border-border overflow-hidden text-xs">
              {(["4w","12w","season"] as const).map(r => (
                <button key={r} onClick={()=>setRange(r)} className={`px-3 py-1.5 ${range===r?"bg-primary text-primary-foreground":"bg-card hover:bg-accent"}`}>
                  {r === "4w" ? "4 weeks" : r === "12w" ? "12 weeks" : "Full season"}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 text-2xl font-display font-semibold">{avgNdvi} <span className="text-xs text-muted-foreground font-sans">avg NDVI today</span></div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={series} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="gNdvi" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#15803d" stopOpacity={0.4}/>
                <stop offset="100%" stopColor="#15803d" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.01 130)" />
            <XAxis dataKey="week" fontSize={11} stroke="#94a3b8"/>
            <YAxis fontSize={10} stroke="#94a3b8" domain={[0, 1]}/>
            <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }}/>
            <Legend wrapperStyle={{ fontSize: 11 }}/>
            {enabled.ndvi && <Area type="monotone" dataKey="ndvi" stroke="#15803d" fill="url(#gNdvi)" strokeWidth={2} name="NDVI 2026"/>}
            {enabled.evi && <Line type="monotone" dataKey="evi" stroke="#0ea5e9" strokeWidth={2} dot={false} name="EVI 2026"/>}
            {enabled.ndre && <Line type="monotone" dataKey="ndre" stroke="#f59e0b" strokeWidth={2} dot={false} name="NDRE 2026"/>}
            {compareLast && enabled.ndvi && (
              <Line type="monotone" dataKey="ndviPrev" stroke="#15803d" strokeDasharray="4 4" strokeWidth={1.5} dot={false} name="NDVI 2025"/>
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">
        <div className="rounded-xl border border-border bg-card p-5 shadow-soft">
          <h3 className="font-display font-semibold">Growth Stages</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Plots per phenological stage</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={yieldByStage} margin={{ top: 16, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.01 130)" />
              <XAxis dataKey="stage" fontSize={11} stroke="#94a3b8"/>
              <YAxis fontSize={10} stroke="#94a3b8"/>
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }}/>
              <Bar dataKey="plots" radius={[6,6,0,0]}>
                {yieldByStage.map((s, i) => <Cell key={i} fill={stageColors[s.stage as keyof typeof stageColors]}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5 shadow-soft">
          <h3 className="font-display font-semibold">Climate Context (CHIRPS · ERA5)</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Monthly rainfall vs temperature</p>
          <ResponsiveContainer width="100%" height={220}>
            <ComposedChart data={rainfallData} margin={{ top: 16, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.01 130)" />
              <XAxis dataKey="month" fontSize={11} stroke="#94a3b8"/>
              <YAxis yAxisId="l" fontSize={10} stroke="#94a3b8"/>
              <YAxis yAxisId="r" orientation="right" fontSize={10} stroke="#94a3b8"/>
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }}/>
              <Legend wrapperStyle={{ fontSize: 11 }}/>
              <Bar yAxisId="l" dataKey="rainfall" fill="#0ea5e9" radius={[4,4,0,0]} name="Rainfall (mm)"/>
              <Line yAxisId="r" type="monotone" dataKey="temp" stroke="#f97316" strokeWidth={2} name="Temp (°C)"/>
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">
        <div className="rounded-xl border border-border bg-card p-5 shadow-soft">
          <h3 className="font-display font-semibold">Yield: This vs Last Season</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Per-plot tonnes per hectare</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={plots.map(p=>({name:p.name.replace("Plot ",""), now:p.predictedYield, last:p.lastSeasonYield}))}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.01 130)"/>
              <XAxis dataKey="name" fontSize={10} stroke="#94a3b8"/>
              <YAxis fontSize={10} stroke="#94a3b8"/>
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }}/>
              <Legend wrapperStyle={{ fontSize: 11 }}/>
              <Bar dataKey="last" fill="#cbd5e1" name="Last season" radius={[3,3,0,0]}/>
              <Bar dataKey="now" fill="#15803d" name="Predicted 2026" radius={[3,3,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5 shadow-soft">
          <h3 className="font-display font-semibold">Multi-Criteria Suitability</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Average index across the farm</p>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="oklch(0.9 0.01 130)"/>
              <PolarAngleAxis dataKey="metric" fontSize={11}/>
              <PolarRadiusAxis fontSize={10} angle={30} domain={[0, 100]}/>
              <Radar dataKey="score" stroke="#15803d" fill="#15803d" fillOpacity={0.4}/>
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }}/>
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AppLayout>
  );
}
