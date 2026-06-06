import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, Legend, AreaChart, Area } from "recharts";
import { PageHeader } from "../components/PageHeader";
import { StatCard } from "../components/StatCard";
import { blocks, farmSummary, seasonalTrend } from "../lib/cocoa-data";
import { MapPin, Activity, Package, AlertTriangle, X, TrendingUp, Filter } from "lucide-react";

import { MapHome } from "./index";

export const Route = createFileRoute("/dashboard")({
  component: MapHome,
  head: () => ({
    meta: [
      { title: "Map View — CocoaSense" },
      { name: "description", content: "Interactive satellite map of cocoa farms with NDVI, NDRE, soil and rainfall layers." },
    ],
  }),
});

const CROPS = ["Cocoa", "Coffee", "Rubber"];
const ACTIVITIES = ["Pruning", "Spraying", "Harvest", "Fertilizing"];

export function DashboardPage() {
  const [crop, setCrop] = useState("Cocoa");
  const [scope, setScope] = useState<"all" | string>("all");
  const [range, setRange] = useState("12m");
  const [activity, setActivity] = useState("All");
  const [chips, setChips] = useState<string[]>(["Crop: Cocoa", "Range: 12 months"]);

  const removeChip = (c: string) => setChips(chips.filter((x) => x !== c));

  const seasonCompare = seasonalTrend.map((s, i) => ({
    month: s.month,
    "2025": Math.max(0.1, s.ndre - 0.05 + Math.sin(i) * 0.02),
    "2026": s.ndre,
  }));

  const plotCompare = blocks.map((b) => ({ id: b.id, ndre: b.ndre, ndvi: b.ndvi, yield: b.predictedYield }));

  return (
    <>
      <PageHeader
        eyebrow="Analytics Mode"
        title="Performance Dashboard"
        subtitle="Trends, comparisons and decision-making insights across your farms, plots and seasons."
      />

      <div className="px-6 lg:px-10 py-6 space-y-6">
        {/* Filter bar */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="size-4 text-muted-foreground" />
            <FilterSelect label="Crop" value={crop} onChange={(v) => { setCrop(v); setChips([`Crop: ${v}`, `Range: 12 months`]); }} options={CROPS} />
            <FilterSelect label="Location" value={scope === "all" ? "All Farms" : scope} onChange={setScope} options={["All Farms", ...blocks.map((b) => b.name)]} />
            <FilterSelect label="Date Range" value={range} onChange={setRange} options={["7d", "30d", "3m", "12m", "All time"]} />
            <FilterSelect label="Activity" value={activity} onChange={setActivity} options={["All", ...ACTIVITIES]} />
          </div>
          {chips.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-border/60">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Active</span>
              {chips.map((c) => (
                <span key={c} className="inline-flex items-center gap-1 text-[11px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {c}
                  <button onClick={() => removeChip(c)} className="hover:bg-primary/20 rounded-full size-3.5 flex items-center justify-center">
                    <X className="size-2.5" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Farm Area" value={farmSummary.totalArea.toFixed(1)} unit="ha" icon={MapPin} hint={`${blocks.length} blocks`} />
          <StatCard label="Avg Canopy Health" value={farmSummary.avgHealth.toFixed(0)} unit="VHI" icon={Activity} tone="success" />
          <StatCard label="Forecast Yield" value={farmSummary.totalBags.toLocaleString()} unit="bags" icon={Package} hint={`${(farmSummary.totalPredictedKg / 1000).toFixed(1)} tonnes`} />
          <StatCard label="Active Alerts" value={farmSummary.alerts} icon={AlertTriangle} tone={farmSummary.alerts > 0 ? "warning" : "success"} />
        </div>

        {/* Modular widgets */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Widget title="Season vs Season — NDRE" subtitle="Compare current vs previous season chlorophyll trends">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={seasonCompare} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="2025" stroke="var(--chart-2)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="2026" stroke="var(--chart-1)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Widget>

          <Widget title="Rainfall (CHIRPS)" subtitle="Monthly rainfall over selected period">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={seasonalTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="rainfall" stroke="var(--chart-5)" fill="var(--chart-5)" fillOpacity={0.25} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </Widget>

          <Widget title="Plot vs Plot — Predicted Yield" subtitle="Yield comparison across all blocks (kg/ha)">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={plotCompare} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" />
                <XAxis dataKey="id" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="yield" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Widget>

          <Widget title="Index Trends" subtitle="NDVI, NDRE and LSWI across the season">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={seasonalTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="ndvi" stroke="var(--chart-1)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="ndre" stroke="var(--chart-3)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="lswi" stroke="var(--chart-5)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Widget>
        </div>
      </div>
    </>
  );
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[11px] text-muted-foreground">{label}:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-xs bg-secondary border border-transparent rounded-md px-2 py-1 focus:outline-none focus:border-primary/40"
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function Widget({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-baseline justify-between mb-3">
        <div>
          <div className="text-sm font-semibold">{title}</div>
          {subtitle && <div className="text-[11px] text-muted-foreground mt-0.5">{subtitle}</div>}
        </div>
        <TrendingUp className="size-4 text-muted-foreground" />
      </div>
      <div className="h-56">{children}</div>
    </div>
  );
}
