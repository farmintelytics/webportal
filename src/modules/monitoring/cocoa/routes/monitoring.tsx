import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "../components/PageHeader";
import { blocks, healthBg, seasonalTrend } from "../lib/cocoa-data";
import { Activity, AlertTriangle } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export const Route = createFileRoute("/monitoring")({ component: Monitoring });

function Monitoring() {
  return (
    <>
      <PageHeader
        eyebrow="Objective 2"
        title="Monitor What is Planted"
        subtitle="NDRE-led canopy health for each production block. Sylvain et al. (2019) showed NDRE detects cocoa stress up to 3 weeks earlier than NDVI."
      />
      <div className="px-6 lg:px-10 py-8 space-y-8">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Canopy Water Content (LSWI)</div>
            <div className="text-sm font-semibold mt-0.5 mb-4">Drought stress signal — last 12 months</div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={seasonalTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="lswiGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--chart-5)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="var(--chart-5)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" />
                  <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                  <Area type="monotone" dataKey="lswi" stroke="var(--chart-5)" fill="url(#lswiGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Health Distribution</div>
            <div className="text-sm font-semibold mt-0.5">Across {blocks.length} blocks</div>
            <div className="mt-5 space-y-3">
              {(["Excellent", "Good", "Stressed", "Severely Stressed"] as const).map((h) => {
                const count = blocks.filter((b) => b.health === h).length;
                const pct = (count / blocks.length) * 100;
                return (
                  <div key={h}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-foreground">{h}</span>
                      <span className="text-muted-foreground tabular-nums">{count} blocks</span>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-secondary overflow-hidden">
                      <div className={`h-full ${h === "Excellent" ? "bg-success" : h === "Good" ? "bg-leaf" : h === "Stressed" ? "bg-warning" : "bg-danger"}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 pt-4 border-t border-border flex items-center gap-2 text-xs text-muted-foreground">
              <Activity className="size-3.5" /> Updated 06:12 UTC · Sentinel-2 L2A
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-border">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Block-Level Monitoring</div>
            <div className="text-sm font-semibold mt-0.5">NDVI · NDRE · EVI · LSWI · VHI</div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="text-left font-medium px-4 py-2.5">Block</th>
                  <th className="text-right font-medium px-4 py-2.5">Area</th>
                  <th className="text-right font-medium px-4 py-2.5">NDVI</th>
                  <th className="text-right font-medium px-4 py-2.5">NDRE</th>
                  <th className="text-right font-medium px-4 py-2.5">EVI</th>
                  <th className="text-right font-medium px-4 py-2.5">LSWI</th>
                  <th className="text-right font-medium px-4 py-2.5">VHI</th>
                  <th className="text-left font-medium px-4 py-2.5">Health</th>
                  <th className="text-left font-medium px-4 py-2.5">Alert</th>
                </tr>
              </thead>
              <tbody>
                {blocks.map((b) => (
                  <tr key={b.id} className="border-t border-border hover:bg-secondary/30">
                    <td className="px-4 py-3"><div className="font-medium text-foreground">{b.name}</div><div className="text-xs text-muted-foreground">{b.id}</div></td>
                    <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{b.area} ha</td>
                    <td className="px-4 py-3 text-right tabular-nums">{b.ndvi.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-medium">{b.ndre.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{b.evi.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{b.lswi.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{b.vhi}</td>
                    <td className="px-4 py-3"><span className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${healthBg(b.health)}`}>{b.health}</span></td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {b.alert ? (
                        <span className="inline-flex items-center gap-1 text-warning-foreground"><AlertTriangle className="size-3" />{b.alert}</span>
                      ) : <span className="text-success">— OK</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
