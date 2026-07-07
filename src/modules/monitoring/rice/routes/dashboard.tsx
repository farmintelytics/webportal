import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { AppLayout } from "../components/AppLayout";
import { KpiCard } from "../components/KpiCard";
import { ndviTimeSeries, rainfallData, stageColors } from "../lib/fallbackData";
import { useMonitoring } from "../../shared/MonitoringContext";
import { Sprout, Droplets, AlertTriangle, Wheat } from "lucide-react";
import {
  Line, ResponsiveContainer, XAxis, YAxis, Tooltip, BarChart, Bar, Cell,
  AreaChart, Area, CartesianGrid, Legend, ComposedChart, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from "recharts";

import { MapHome } from "./index";
import { fetchDashboardTrends } from "../../../../services/organizationMonitorApi";


export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Map View — PaddyLens" },
      { name: "description", content: "Interactive paddy field map: NDVI, VHI, LSWI, suitability and yield layers from Sentinel-1/2 and MODIS." },
    ],
  }),
  component: MapHome,
});

const indices = [
  { id: "ndvi", label: "NDVI", color: "#15803d" },
  { id: "evi", label: "EVI", color: "#0ea5e9" },
  { id: "ndre", label: "NDRE", color: "#f59e0b" },
] as const;

export function Dashboard() {
  const { cropSummary, cropBlocks, cropLoading } = useMonitoring();
  const [range, setRange] = useState<"4w" | "12w" | "season">("12w");
  const [enabled, setEnabled] = useState<Record<string, boolean>>({ ndvi: true, evi: true, ndre: true });
  const [compareLast, setCompareLast] = useState(true);
  const [trendsData, setTrendsData] = useState<any>(null);

  useEffect(() => {
    fetchDashboardTrends()
      .then((res) => {
        if (res) {
          setTrendsData(res);
        }
      })
      .catch((err) => console.error("Error fetching dashboard trends:", err));
  }, []);

  const plotsData = useMemo(() => {
    if (!cropBlocks || cropBlocks.length === 0) return [];
    return cropBlocks.map((p: any) => {
      const ndvi = p.current_indices?.ndvi ?? 0.65;
      const ndmi = p.current_indices?.ndmi ?? p.current_indices?.ndwi ?? 0.45;
      const alert = p.health_class === "Critical" ? "critical" : p.health_class === "Stressed" ? "stressed" : "healthy";
      return {
        id: p.id,
        name: p.plot_nb ? `Plot ${p.plot_nb}` : p.id,
        area: p.area_ha ?? 10.0,
        ndvi,
        ndre: p.current_indices?.ndre ?? +(ndvi * 0.7).toFixed(2),
        lswi: p.current_indices?.lswi ?? ndmi,
        vhi: Math.round(ndvi * 100),
        stage: p.stage ?? "Vegetative",
        predictedYield: p.yield_t_ha ?? +(ndvi * 5.2).toFixed(2),
        lastSeasonYield: p.yield_t_ha ? +(p.yield_t_ha * 0.95).toFixed(2) : +(ndvi * 4.8).toFixed(2),
        alert,
        soilScore: 85,
        waterScore: 80,
        climateScore: 78,
        suitabilityScore: 82,
      };
    });
  }, [cropBlocks]);

  const activeNdviTimeSeries = useMemo(() => {
    if (trendsData && trendsData.ndvi_vigor_trends) {
      return trendsData.ndvi_vigor_trends.map((t: any) => ({
        week: t.label,
        ndvi: t.ndvi,
        evi: +(t.ndvi * 0.85).toFixed(2),
        ndre: +(t.ndvi * 0.75).toFixed(2)
      }));
    }
    return ndviTimeSeries;
  }, [trendsData]);

  const activeRainfallData = useMemo(() => {
    return cropSummary?.rainfall_series?.length > 0
      ? cropSummary.rainfall_series
      : rainfallData;
  }, [cropSummary]);

  const activeYieldByStage = useMemo(() => {
    return [
      { stage: "Flooded", plots: plotsData.filter(p => p.stage === "Flooded").length },
      { stage: "Vegetative", plots: plotsData.filter(p => p.stage === "Vegetative").length },
      { stage: "Heading", plots: plotsData.filter(p => p.stage === "Heading").length },
      { stage: "Ripening", plots: plotsData.filter(p => p.stage === "Ripening").length },
    ];
  }, [plotsData]);

  const series = useMemo(() => {
    const len = range === "4w" ? 4 : range === "12w" ? 12 : 16;
    return activeNdviTimeSeries.slice(-len).map((d: any) => ({
      ...d,
      ndviPrev: +(d.ndvi * (0.82 + Math.sin(parseInt(d.week.slice(1)) / 2) * 0.05)).toFixed(2),
    }));
  }, [range, activeNdviTimeSeries]);

  const totalArea = plotsData.reduce((s, p) => s + p.area, 0);
  const totalYield = plotsData.reduce((s, p) => s + p.predictedYield * p.area, 0);
  const stressed = plotsData.filter(p => p.alert !== "healthy").length;
  const avgNdvi = plotsData.length > 0 ? +(plotsData.reduce((s,p)=>s+p.ndvi,0)/plotsData.length).toFixed(2) : 0;

  const radarData = ["soilScore","waterScore","climateScore","suitabilityScore"].map(k => ({
    metric: k.replace("Score",""),
    score: plotsData.length > 0 ? Math.round(plotsData.reduce((s,p)=>s+(p as any)[k],0)/plotsData.length) : 0,
  }));

  return (
    <AppLayout title="Dashboard" subtitle="Trends · comparisons · time-series intelligence">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Plots Monitored" value={plotsData.length} icon={Sprout} accent="primary" trend={{value:8,direction:"up"}} />
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
            <BarChart data={activeYieldByStage} margin={{ top: 16, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.01 130)" />
              <XAxis dataKey="stage" fontSize={11} stroke="#94a3b8"/>
              <YAxis fontSize={10} stroke="#94a3b8"/>
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }}/>
              <Bar dataKey="plots" radius={[6,6,0,0]}>
                {activeYieldByStage.map((s, i) => <Cell key={i} fill={stageColors[s.stage as keyof typeof stageColors]}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5 shadow-soft">
          <h3 className="font-display font-semibold">Climate Context (CHIRPS · ERA5)</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Monthly rainfall vs temperature</p>
          <ResponsiveContainer width="100%" height={220}>
            <ComposedChart data={activeRainfallData} margin={{ top: 16, right: 10, left: -10, bottom: 0 }}>
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
            <BarChart data={plotsData.map(p=>({name:p.name.replace("Plot ",""), now:p.predictedYield, last:p.lastSeasonYield}))}>
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
