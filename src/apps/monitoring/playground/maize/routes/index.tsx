import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "./components/AppShell";
import { Card } from "@monitoring-shared/ui/card";
import { Badge } from "@monitoring-shared/ui/badge";
import { Button } from "@monitoring-shared/ui/button";
import {
  LineChart,
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
import { PLOTS, NDVI_TIMESERIES, RAINFALL_DATA, farmTotal } from "./lib/farm-data";

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
    <Card className="p-5 relative overflow-hidden">
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/5" />
      <div className="flex items-start justify-between relative">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
            {label}
          </p>
          <p className="mt-2 text-3xl font-bold tracking-tight">
            {value}
            {unit && (
              <span className="text-base font-normal text-muted-foreground ml-1">
                {unit}
              </span>
            )}
          </p>
          {delta && (
            <p
              className={`mt-1 text-xs font-medium flex items-center gap-1 ${
                trend === "up"
                  ? "text-primary"
                  : trend === "down"
                    ? "text-destructive"
                    : "text-muted-foreground"
              }`}
            >
              <ArrowUpRight className="h-3 w-3" /> {delta}
            </p>
          )}
        </div>
        <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary grid place-items-center">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}

function Dashboard() {
  const yieldVsLast =
    ((farmTotal.expectedTonnes - farmTotal.lastSeasonTonnes) /
      farmTotal.lastSeasonTonnes) *
    100;

  const yieldByPlot = PLOTS.map((p) => ({
    name: p.id,
    predicted: +(p.area * p.predictedYield).toFixed(1),
    last: +(p.area * p.lastSeasonYield).toFixed(1),
  }));

  return (
    <AppShell>
      <div className="p-6 lg:p-8 space-y-6 max-w-[1600px]">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              Maize · Long Rains 2026
            </p>
            <h1 className="text-3xl font-bold tracking-tight mt-1">
              Farm Operations Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {PLOTS.length} plots · {farmTotal.totalArea.toFixed(1)} ha ·
              Central Rift Valley, Kenya
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" /> Export
            </Button>
            <Button size="sm">Generate Report</Button>
          </div>
        </div>

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
            delta="Above national avg (2.1 t/ha)"
            icon={TrendingUp}
          />
          <KPI
            label="Plots at Risk"
            value={String(farmTotal.riskCount)}
            unit={`/ ${PLOTS.length}`}
            delta="Action recommended"
            icon={AlertTriangle}
            trend="down"
          />
          <KPI
            label="Season Rainfall"
            value="293"
            unit="mm"
            delta="-8% vs CHIRPS norm"
            icon={Droplets}
            trend="down"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <Card className="p-5 xl:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold">NDVI Growth Curve</h3>
                <p className="text-xs text-muted-foreground">
                  Sentinel-2 weekly composite vs expected maize curve
                </p>
              </div>
              <Badge variant="secondary" className="gap-1">
                <Leaf className="h-3 w-3" /> Tasselling
              </Badge>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={NDVI_TIMESERIES}>
                <defs>
                  <linearGradient id="ndvi" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="oklch(0.52 0.14 145)"
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="95%"
                      stopColor="oklch(0.52 0.14 145)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis
                  dataKey="week"
                  tickFormatter={(v) => `W${v}`}
                  fontSize={11}
                />
                <YAxis fontSize={11} domain={[0, 1]} />
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
                  stroke="oklch(0.52 0.14 145)"
                  strokeWidth={2.5}
                  fill="url(#ndvi)"
                  name="Observed NDVI"
                />
                <Line
                  type="monotone"
                  dataKey="expected"
                  stroke="oklch(0.7 0.16 75)"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Expected"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-5">
            <div className="mb-4">
              <h3 className="font-semibold">Rainfall (CHIRPS)</h3>
              <p className="text-xs text-muted-foreground">
                Weekly received vs expected (mm)
              </p>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={RAINFALL_DATA}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis
                  dataKey="week"
                  tickFormatter={(v) => `W${v}`}
                  fontSize={11}
                />
                <YAxis fontSize={11} />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                  }}
                />
                <Bar
                  dataKey="expected"
                  fill="oklch(0.9 0.02 130)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="mm"
                  fill="oklch(0.5 0.12 220)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Predicted Yield by Plot</h3>
              <p className="text-xs text-muted-foreground">
                Tonnes — current season vs last season
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={yieldByPlot}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" fontSize={11} />
              <YAxis fontSize={11} />
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
                fill="oklch(0.85 0.04 130)"
                radius={[4, 4, 0, 0]}
                name="Last season"
              />
              <Bar
                dataKey="predicted"
                fill="oklch(0.52 0.14 145)"
                radius={[4, 4, 0, 0]}
                name="Predicted"
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-0 overflow-hidden">
          <div className="p-5 border-b flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Plot Monitoring</h3>
              <p className="text-xs text-muted-foreground">
                Live RS indices and stress flags
              </p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="text-left px-5 py-3">Plot</th>
                  <th className="text-right px-3 py-3">Area</th>
                  <th className="text-right px-3 py-3">NDVI</th>
                  <th className="text-right px-3 py-3">GCVI (N)</th>
                  <th className="text-right px-3 py-3">NDRE</th>
                  <th className="text-right px-3 py-3">VHI</th>
                  <th className="text-right px-3 py-3">Yield (t/ha)</th>
                  <th className="text-left px-3 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {PLOTS.map((p) => (
                  <tr
                    key={p.id}
                    className="border-t hover:bg-accent/20 transition"
                  >
                    <td className="px-5 py-3">
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {p.id} · {p.stage}
                      </div>
                    </td>
                    <td className="text-right px-3 py-3">{p.area} ha</td>
                    <td className="text-right px-3 py-3 font-mono">
                      {p.ndvi.toFixed(2)}
                    </td>
                    <td className="text-right px-3 py-3 font-mono">
                      {p.gcvi.toFixed(1)}
                    </td>
                    <td className="text-right px-3 py-3 font-mono">
                      {p.ndre.toFixed(2)}
                    </td>
                    <td className="text-right px-3 py-3 font-mono">{p.vhi}</td>
                    <td className="text-right px-3 py-3 font-semibold">
                      {p.predictedYield.toFixed(1)}
                    </td>
                    <td className="px-3 py-3">
                      <Badge
                        variant={
                          p.status === "Healthy" ? "secondary" : "destructive"
                        }
                        className={
                          p.status === "Healthy"
                            ? "bg-primary/10 text-primary border-primary/20"
                            : p.status === "Nitrogen Risk"
                              ? "bg-accent/30 text-accent-foreground border-accent/40"
                              : ""
                        }
                      >
                        {p.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
