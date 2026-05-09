import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "../components/TopBar";
import { AppLayout } from "../components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@monitoring-shared/ui/card";
import { Badge } from "@monitoring-shared/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@monitoring-shared/ui/select";
import { blocks, eviTimeSeries, rainfallSeries, seasonComparison } from "../data/mockData";
import { Sprout, TrendingUp, AlertTriangle, Droplets } from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, ComposedChart, Area, AreaChart,
} from "recharts";

export const Route = createFileRoute("/")({ component: Dashboard });

function Dashboard() {
  const totalHa = blocks.reduce((s, b) => s + b.hectares, 0);
  const totalYield = blocks.reduce((s, b) => s + b.predictedYield * b.hectares, 0);
  const avgYield = totalYield / totalHa;
  const alerts = blocks.filter((b) => b.stressAlert !== "None").length;
  const harvest = blocks.filter((b) => b.harvestReady).length;

  const stageDist = ["Tillering", "Grand Growth", "Maturation", "Harvest Ready"].map((s) => ({
    stage: s,
    blocks: blocks.filter((b) => b.growthStage === s).length,
    hectares: blocks.filter((b) => b.growthStage === s).reduce((a, b) => a + b.hectares, 0),
  }));

  return (
    <AppLayout>
      <TopBar title="Dashboard" />
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        {/* Hero */}
        <div className="mb-6 overflow-hidden rounded-xl border border-border bg-[var(--gradient-primary)] p-5 text-primary-foreground shadow-[var(--shadow-elegant)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] opacity-80">Bacita Estate · Season 2025/26</div>
              <h2 className="mt-1 text-2xl font-bold">Welcome back, Field Manager 🌱</h2>
              <p className="mt-1 max-w-xl text-sm opacity-90">
                Your fields are tracked across NDVI, EVI, LSWI and SAR. {alerts} active stress alert{alerts === 1 ? "" : "s"} require attention.
              </p>
            </div>
            <div className="flex gap-2">
              <Badge className="bg-white/15 text-white hover:bg-white/20">{blocks.length} blocks</Badge>
              <Badge className="bg-white/15 text-white hover:bg-white/20">{totalHa} ha</Badge>
              <Badge className="bg-white/15 text-white hover:bg-white/20">{harvest} harvest-ready</Badge>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase text-muted-foreground">Filters:</span>
          <Select defaultValue="sugarcane"><SelectTrigger className="h-8 w-40"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="sugarcane">Sugarcane</SelectItem></SelectContent></Select>
          <Select defaultValue="bacita"><SelectTrigger className="h-8 w-40"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="bacita">Bacita Estate</SelectItem></SelectContent></Select>
          <Select defaultValue="2025-26"><SelectTrigger className="h-8 w-40"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="2025-26">Season 2025/26</SelectItem></SelectContent></Select>
        </div>

        {/* KPI cards */}
        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard icon={<Sprout className="h-4 w-4" />} label="Total Hectares" value={`${totalHa} ha`} sub="across 8 blocks" />
          <KpiCard icon={<TrendingUp className="h-4 w-4" />} label="Forecast Tonnage" value={totalYield.toLocaleString()} sub="tonnes this season" tone="primary" />
          <KpiCard icon={<Droplets className="h-4 w-4" />} label="Avg Yield" value={`${avgYield.toFixed(1)} t/ha`} sub="vs farm avg 72 t/ha" />
          <KpiCard icon={<AlertTriangle className="h-4 w-4" />} label="Active Alerts" value={`${alerts}`} sub={`${harvest} blocks harvest-ready`} tone="warn" />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle className="text-sm">EVI Trend by Block — Grand Growth Tracking</CardTitle></CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={eviTimeSeries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={11} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="Block 1" stroke="var(--chart-1)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="Block 2" stroke="var(--chart-2)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="Block 3" stroke="var(--chart-3)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="Block 4" stroke="var(--chart-4)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="Block 6" stroke="var(--chart-5)" strokeWidth={2} dot={false} strokeDasharray="4 2" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm">Rainfall (CHIRPS) vs Land Surface Temperature (MODIS)</CardTitle></CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={rainfallSeries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={11} />
                  <YAxis yAxisId="l" stroke="var(--muted-foreground)" fontSize={11} />
                  <YAxis yAxisId="r" orientation="right" stroke="var(--muted-foreground)" fontSize={11} />
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar yAxisId="l" dataKey="rainfall" fill="var(--chart-4)" name="Rainfall (mm)" />
                  <Line yAxisId="r" type="monotone" dataKey="lst" stroke="var(--chart-3)" strokeWidth={2} name="LST (°C)" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm">Growth Stage Distribution</CardTitle></CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stageDist}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="stage" stroke="var(--muted-foreground)" fontSize={11} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", fontSize: 12 }} />
                  <Bar dataKey="hectares" fill="var(--primary)" name="Hectares" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm">Season-on-Season Cane Tonnage</CardTitle></CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={seasonComparison}>
                  <defs>
                    <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="season" stroke="var(--muted-foreground)" fontSize={11} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", fontSize: 12 }} />
                  <Area type="monotone" dataKey="tonnage" stroke="var(--primary)" strokeWidth={2} fill="url(#gA)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Block table */}
        <Card className="mt-6">
          <CardHeader><CardTitle className="text-sm">Block Monitoring Table</CardTitle></CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="border-b border-border text-left text-muted-foreground">
                <tr>
                  {["Block", "Stage", "NDVI", "EVI", "LAI", "LSWI", "VHI", "Yield (t/ha)", "Alert", "Harvest"].map((h) => (
                    <th key={h} className="px-2 py-2 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {blocks.map((b) => (
                  <tr key={b.id} className="border-b border-border/50 hover:bg-muted/40">
                    <td className="px-2 py-2 font-medium">{b.name}</td>
                    <td className="px-2 py-2">{b.growthStage}</td>
                    <td className="px-2 py-2">{b.ndvi.toFixed(2)}</td>
                    <td className="px-2 py-2">{b.evi.toFixed(2)}</td>
                    <td className="px-2 py-2">{b.lai.toFixed(1)}</td>
                    <td className="px-2 py-2">{b.lswi.toFixed(2)}</td>
                    <td className="px-2 py-2">{b.vhi}</td>
                    <td className="px-2 py-2 font-semibold text-primary">{b.predictedYield}</td>
                    <td className="px-2 py-2">
                      {b.stressAlert === "None"
                        ? <span className="text-muted-foreground">—</span>
                        : <Badge variant="destructive">{b.stressAlert}</Badge>}
                    </td>
                    <td className="px-2 py-2">{b.harvestWindow}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </main>
    </AppLayout>
  );
}

function KpiCard({ icon, label, value, sub, tone }: { icon: React.ReactNode; label: string; value: string; sub: string; tone?: "primary" | "warn" }) {
  return (
    <Card className={tone === "primary" ? "border-primary/30 bg-gradient-to-br from-primary/5 to-transparent" : ""}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between text-muted-foreground">
          <span className="text-xs">{label}</span>
          <span className={tone === "warn" ? "text-orange-600" : "text-primary"}>{icon}</span>
        </div>
        <div className="mt-1 text-2xl font-bold">{value}</div>
        <div className="text-[11px] text-muted-foreground">{sub}</div>
      </CardContent>
    </Card>
  );
}
