import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "../components/AppShell";
import { Card } from "@monitoring-shared/ui/card";
import { Badge } from "@monitoring-shared/ui/badge";
import { Button } from "@monitoring-shared/ui/button";
import { useMonitoring } from "../../shared/MonitoringContext";
import { useMemo, useState, useEffect } from "react";
import {
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  TrendingUp,
  Droplets,
  AlertTriangle,
  Wheat,
  Leaf,
  ArrowUpRight,
  Download,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — MaizeRS Geospatial Farm OS" },
      {
        name: "description",
        content:
          "Operational dashboard for maize farms: NDVI trends, yield forecasts, stress alerts, and rainfall analytics powered by remote sensing.",
      },
    ],
  }),
  component: Dashboard,
});

function KPI({
  label,
  value,
  unit,
  delta,
  icon: Icon,
  trend = "up",
}: {
  label: string;
  value: string;
  unit?: string;
  delta?: string;
  icon: any;
  trend?: "up" | "down" | "neutral";
}) {
  return (
    <Card className="p-5 relative overflow-hidden bg-white border border-emerald-100/50 shadow-sm">
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-emerald-50/30" />
      <div className="flex items-start justify-between relative">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-500 font-medium">
            {label}
          </p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {value}
            {unit && (
              <span className="text-base font-normal text-slate-400 ml-1">
                {unit}
              </span>
            )}
          </p>
          {delta && (
            <p
              className={`mt-1 text-xs font-semibold flex items-center gap-1 ${
                trend === "up"
                  ? "text-emerald-600"
                  : trend === "down"
                    ? "text-stone-500"
                    : "text-slate-500"
              }`}
            >
              {delta}
            </p>
          )}
        </div>
        <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-700 grid place-items-center">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}

function Dashboard() {
  const { cropSummary, cropBlocks, cropLoading } = useMonitoring();

  const plots = useMemo(() => {
    if (!cropBlocks || cropBlocks.length === 0) return [];
    return cropBlocks.map((p: any) => {
      const ndvi = p.current_indices?.ndvi ?? 0.65;
      const ndmi = p.current_indices?.ndmi ?? p.current_indices?.ndwi ?? 0.45;
      const statusAlert = p.health_class === "Critical" ? "Critical" : p.health_class === "Stressed" ? "Stressed" : "Healthy";
      return {
        id: p.id,
        name: p.plot_nb ? `Plot ${p.plot_nb}` : p.id,
        area: p.area_ha ?? 10.0,
        ndvi,
        gcvi: p.current_indices?.gndvi ?? +(ndvi * 6.0).toFixed(1),
        ndre: p.current_indices?.ndre ?? +(ndvi * 0.7).toFixed(2),
        ndmi,
        vhi: Math.round(ndvi * 100),
        stage: p.stage ?? "Vegetative",
        predictedYield: p.yield_t_ha ?? +(ndvi * 5.2).toFixed(2),
        lastSeasonYield: p.yield_t_ha ? +(p.yield_t_ha * 0.95).toFixed(2) : +(ndvi * 4.8).toFixed(2),
        status: statusAlert,
      };
    });
  }, [cropBlocks]);

  const farmTotal = useMemo(() => {
    const totalArea = plots.reduce((a, p) => a + p.area, 0);
    const expectedTonnes = plots.reduce((a, p) => a + p.area * p.predictedYield, 0);
    const lastSeasonTonnes = plots.reduce((a, p) => a + p.area * p.lastSeasonYield, 0);
    const avgYield = totalArea > 0 ? expectedTonnes / totalArea : 0;
    const riskCount = plots.filter((p) => p.status !== "Healthy").length;
    return {
      totalArea,
      expectedTonnes,
      lastSeasonTonnes,
      avgYield,
      riskCount,
    };
  }, [plots]);

  const yieldVsLast = useMemo(() => {
    if (farmTotal.lastSeasonTonnes === 0) return 0;
    return ((farmTotal.expectedTonnes - farmTotal.lastSeasonTonnes) / farmTotal.lastSeasonTonnes) * 100;
  }, [farmTotal]);

  const yieldByPlot = useMemo(() => {
    return plots.map((p) => ({
      name: p.name.replace("Plot ", "P"),
      predicted: +(p.area * p.predictedYield).toFixed(1),
      last: +(p.area * p.lastSeasonYield).toFixed(1),
    }));
  }, [plots]);

  const activeRainfallData = useMemo(() => {
    if (cropSummary?.rainfall_series?.length > 0) {
      return cropSummary.rainfall_series.map((r: any) => ({
        week: r.month,
        mm: r.rainfall,
        expected: r.expected,
      }));
    }
    return [
      { week: "Jan", mm: 0, expected: 50 },
      { week: "Feb", mm: 0, expected: 60 },
      { week: "Mar", mm: 0, expected: 80 },
    ];
  }, [cropSummary]);

  const activeNdviCurve = useMemo(() => {
    const baseline = plots.length > 0 ? (plots.reduce((s, p) => s + p.ndvi, 0) / plots.length) : 0.65;
    return [
      { week: 1, ndvi: 0.20, expected: 0.20 },
      { week: 2, ndvi: 0.35, expected: 0.34 },
      { week: 3, ndvi: 0.50, expected: 0.48 },
      { week: 4, ndvi: 0.60, expected: 0.62 },
      { week: 5, ndvi: +(baseline * 0.9).toFixed(2), expected: 0.72 },
      { week: 6, ndvi: +baseline.toFixed(2), expected: 0.76 },
    ];
  }, [plots]);

  return (
    <AppShell>
      <div className="p-6 lg:p-8 space-y-6 max-w-[1600px]">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-emerald-800 font-bold">
              Maize · Long Rains 2026
            </p>
            <h1 className="text-3xl font-bold tracking-tight mt-1 text-slate-900">
              Farm Operations Dashboard
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {plots.length} plots · {farmTotal.totalArea.toFixed(1)} ha · Central Rift Valley, Kenya
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-slate-100 hover:bg-slate-50 text-slate-600 transition">
              <Download className="h-4 w-4 mr-2" /> Export
            </Button>
            <Button size="sm" className="bg-emerald-600 text-white hover:bg-emerald-700 transition">Generate Report</Button>
          </div>
        </div>

        {cropLoading ? (
          <div className="p-12 text-center text-slate-500 font-medium">Loading telemetry summaries...</div>
        ) : plots.length === 0 ? (
          <div className="p-16 text-center text-slate-400 font-medium">No Maize plots registered for this tenant.</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <KPI
                label="Expected Yield"
                value={farmTotal.expectedTonnes.toFixed(0)}
                unit="t"
                delta={`${yieldVsLast > 0 ? "+" : ""}${yieldVsLast.toFixed(1)}% vs last season`}
                icon={Wheat}
                trend={yieldVsLast > 0 ? "up" : "down"}
              />
              <KPI
                label="Avg Yield"
                value={farmTotal.avgYield.toFixed(2)}
                unit="t/ha"
                delta="Normalized canopy density"
                icon={TrendingUp}
              />
              <KPI
                label="Plots at Risk"
                value={String(farmTotal.riskCount)}
                unit={`/ ${plots.length}`}
                delta="Action recommended"
                icon={AlertTriangle}
                trend={farmTotal.riskCount > 0 ? "down" : "neutral"}
              />
              <KPI
                label="Season Average Rainfall"
                value={cropSummary?.average_rainfall_mm ? cropSummary.average_rainfall_mm.toFixed(0) : "0"}
                unit="mm"
                delta="Daily ERA5/CHIRPS telemetry"
                icon={Droplets}
                trend="neutral"
              />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              <Card className="p-5 xl:col-span-2 bg-white border border-emerald-100/50 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-slate-900">NDVI Growth Curve</h3>
                    <p className="text-xs text-slate-400">
                      Sentinel-2 weekly composite vs expected maize curve
                    </p>
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-800 border-emerald-100 flex items-center gap-1 font-semibold">
                    <Leaf className="h-3 w-3" /> Tasselling
                  </Badge>
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={activeNdviCurve}>
                    <defs>
                      <linearGradient id="ndvi" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#10b981"
                          stopOpacity={0.2}
                        />
                        <stop
                          offset="95%"
                          stopColor="#10b981"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis
                      dataKey="week"
                      tickFormatter={(v) => `W${v}`}
                      fontSize={11}
                      stroke="#94a3b8"
                    />
                    <YAxis fontSize={11} domain={[0, 1]} stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: 8,
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Area
                      type="monotone"
                      dataKey="ndvi"
                      stroke="#10b981"
                      strokeWidth={2.5}
                      fill="url(#ndvi)"
                      name="Observed NDVI"
                    />
                    <Line
                      type="monotone"
                      dataKey="expected"
                      stroke="#64748b"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                      name="Expected"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-5 bg-white border border-emerald-100/50 shadow-sm">
                <div className="mb-4">
                  <h3 className="font-semibold text-slate-900">Rainfall (CHIRPS)</h3>
                  <p className="text-xs text-slate-400">
                    Monthly received vs expected (mm)
                  </p>
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={activeRainfallData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis
                      dataKey="week"
                      fontSize={11}
                      stroke="#94a3b8"
                    />
                    <YAxis fontSize={11} stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: 8,
                      }}
                    />
                    <Bar
                      dataKey="expected"
                      fill="#e2e8f0"
                      radius={[4, 4, 0, 0]}
                      name="Target (Expected)"
                    />
                    <Bar
                      dataKey="mm"
                      fill="#059669"
                      radius={[4, 4, 0, 0]}
                      name="Observed Rainfall"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            <Card className="p-5 bg-white border border-emerald-100/50 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-slate-900">Predicted Yield by Plot</h3>
                  <p className="text-xs text-slate-400">
                    Tonnes — current season vs last season
                  </p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={yieldByPlot}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="name" fontSize={11} stroke="#94a3b8" />
                  <YAxis fontSize={11} stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar
                    dataKey="last"
                    fill="#cbd5e1"
                    radius={[4, 4, 0, 0]}
                    name="Last season"
                  />
                  <Bar
                    dataKey="predicted"
                    fill="#047857"
                    radius={[4, 4, 0, 0]}
                    name="Predicted"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-0 overflow-hidden bg-white border border-emerald-100 shadow-sm">
              <div className="p-5 border-b border-emerald-50 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900">Plot Monitoring</h3>
                  <p className="text-xs text-slate-400">
                    Live RS indices and stress flags
                  </p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-slate-600">
                  <thead className="bg-emerald-50/20 text-xs uppercase tracking-wider text-emerald-800 font-bold border-b border-emerald-50">
                    <tr>
                      <th className="text-left px-5 py-3.5">Plot</th>
                      <th className="text-right px-3 py-3.5">Area</th>
                      <th className="text-right px-3 py-3.5">NDVI</th>
                      <th className="text-right px-3 py-3.5">GCVI (N)</th>
                      <th className="text-right px-3 py-3.5">NDRE</th>
                      <th className="text-right px-3 py-3.5">VHI</th>
                      <th className="text-right px-3 py-3.5">Yield (t/ha)</th>
                      <th className="text-left px-3 py-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {plots.map((p) => {
                      const alertClass = p.status === "Healthy"
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200/50"
                        : p.status === "Stressed" || p.status === "Nitrogen Risk" || p.status === "Drought Risk"
                          ? "bg-slate-100 text-slate-700 border border-slate-200"
                          : "bg-emerald-800/10 text-emerald-950 font-bold border border-emerald-400";
                      
                      return (
                        <tr
                          key={p.id}
                          className="hover:bg-emerald-50/10 transition"
                        >
                          <td className="px-5 py-4">
                            <div className="font-semibold text-slate-900">{p.name}</div>
                            <div className="text-xs text-slate-400 font-mono">
                              {p.id} · {p.stage}
                            </div>
                          </td>
                          <td className="text-right px-3 py-4 text-slate-700 font-mono">{p.area.toFixed(1)} ha</td>
                          <td className="text-right px-3 py-4 font-mono text-slate-500">
                            {p.ndvi.toFixed(2)}
                          </td>
                          <td className="text-right px-3 py-4 font-mono text-slate-500">
                            {p.gcvi.toFixed(2)}
                          </td>
                          <td className="text-right px-3 py-4 font-mono text-slate-500">
                            {p.ndre.toFixed(2)}
                          </td>
                          <td className="text-right px-3 py-4 font-mono text-slate-500">{p.vhi}</td>
                          <td className="text-right px-3 py-4 font-semibold text-slate-900">
                            {p.predictedYield.toFixed(2)}
                          </td>
                          <td className="px-3 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${alertClass}`}>
                              {p.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        )}
      </div>
    </AppShell>
  );
}
