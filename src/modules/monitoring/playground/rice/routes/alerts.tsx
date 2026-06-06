import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "./components/AppLayout";
import { plots } from "./lib/mockData";
import { AlertTriangle, Droplets, Thermometer, TrendingDown } from "lucide-react";

export const Route = createFileRoute("/alerts")({
  head: () => ({ meta: [{ title: "Alerts — PaddyLens" }, { name: "description", content: "Stress, irrigation and yield alerts across paddy plots." }] }),
  component: Alerts,
});

const iconFor = (kind: string) => kind === "Heat Stress" ? Thermometer : kind === "Irrigation" ? Droplets : kind === "Yield Risk" ? TrendingDown : AlertTriangle;

function Alerts() {
  const items = plots
    .filter(p => p.alert !== "healthy")
    .map(p => ({
      plot: p,
      kind: p.vhi < 35 ? "Heat Stress" : p.lswi < 0.2 ? "Irrigation" : "Yield Risk",
      message: p.vhi < 35
        ? "Heat/drought stress detected via MODIS LST + VHI. Consider immediate irrigation."
        : p.lswi < 0.2
        ? "LSWI below threshold — possible irrigation failure. Inspect water inlet."
        : "Predicted yield 20%+ below last season — investigate canopy & nutrients.",
    }));

  return (
    <AppLayout title="Alerts" subtitle={`${items.length} active alerts across all plots`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <SummaryCard label="Critical" count={items.filter(i=>i.plot.alert==="critical").length} color="destructive"/>
        <SummaryCard label="Stressed" count={items.filter(i=>i.plot.alert==="stressed").length} color="stress"/>
        <SummaryCard label="Healthy" count={plots.filter(p=>p.alert==="healthy").length} color="healthy"/>
      </div>

      <div className="space-y-3">
        {items.map(({ plot, kind, message }) => {
          const Icon = iconFor(kind);
          const isCrit = plot.alert === "critical";
          return (
            <div key={plot.id} className={`flex items-start gap-4 p-4 rounded-xl border bg-card shadow-soft ${
              isCrit ? "border-destructive/40" : "border-stress/40"
            }`}>
              <div className={`size-10 rounded-lg grid place-items-center shrink-0 ${
                isCrit ? "bg-destructive/10 text-destructive" : "bg-stress/10 text-stress"
              }`}>
                <Icon className="size-5"/>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs font-semibold uppercase tracking-wider ${isCrit?"text-destructive":"text-stress"}`}>{kind}</span>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="font-semibold">{plot.name}</span>
                  <span className="text-xs text-muted-foreground">{plot.id}</span>
                </div>
                <p className="text-sm text-foreground/80 mt-1">{message}</p>
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span>NDVI: <b className="text-foreground">{plot.ndvi}</b></span>
                  <span>VHI: <b className="text-foreground">{plot.vhi}</b></span>
                  <span>LSWI: <b className="text-foreground">{plot.lswi}</b></span>
                  <span>Stage: <b className="text-foreground">{plot.stage}</b></span>
                </div>
              </div>
              <button className="px-3 py-1.5 text-xs font-medium rounded-md border border-border hover:bg-accent">View plot</button>
            </div>
          );
        })}
      </div>
    </AppLayout>
  );
}

function SummaryCard({ label, count, color }: { label: string; count: number; color: string }) {
  const map: Record<string, string> = {
    destructive: "bg-destructive/10 text-destructive border-destructive/30",
    stress: "bg-stress/10 text-stress border-stress/30",
    healthy: "bg-healthy/10 text-healthy border-healthy/30",
  };
  return (
    <div className={`rounded-xl border p-5 ${map[color]}`}>
      <div className="text-xs uppercase tracking-wider font-semibold opacity-80">{label}</div>
      <div className="font-display text-4xl font-semibold mt-2">{count}</div>
      <div className="text-xs opacity-80 mt-1">plots</div>
    </div>
  );
}
