import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { blocks, farmSummary } from "@/lib/cocoa-data";
import { StatCard } from "@/components/StatCard";
import { Package, Scale, CloudRain } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";

export const Route = createFileRoute("/yield")({ component: YieldPage });

function YieldPage() {
  const sorted = [...blocks].sort((a, b) => b.predictedYield - a.predictedYield);
  const avg = farmSummary.totalPredictedKg / farmSummary.totalArea;

  return (
    <>
      <PageHeader
        eyebrow="Objective 3"
        title="Predict Expected Yield"
        subtitle="Pre-harvest yield model: NDRE 3 months before harvest + LSWI canopy water + CHIRPS rainfall. Achieved R² = 0.76 in Ghana farm trials (Kofi Asare et al., 2019)."
      />
      <div className="px-6 lg:px-10 py-8 space-y-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Predicted Total" value={(farmSummary.totalPredictedKg / 1000).toFixed(1)} unit="tonnes" icon={Package} tone="default" />
          <StatCard label="Total Bags" value={farmSummary.totalBags.toLocaleString()} unit="× 64kg" icon={Package} />
          <StatCard label="Farm Average" value={Math.round(avg)} unit="kg/ha" icon={Scale} tone="success" />
          <StatCard label="Season Rainfall" value={Math.round(blocks.reduce((a, b) => a + b.rainfall3mo, 0) / blocks.length)} unit="mm (3 mo)" icon={CloudRain} hint="Pod development window" />
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Predicted Yield by Block</div>
              <div className="text-sm font-semibold mt-0.5">kg per hectare</div>
            </div>
            <div className="text-[11px] text-muted-foreground">Dashed line = farm average</div>
          </div>
          <div className="h-72 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sorted} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" />
                <XAxis dataKey="id" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="predictedYield" radius={[6, 6, 0, 0]}>
                  {sorted.map((b) => (
                    <Cell key={b.id} fill={b.predictedYield >= avg ? "var(--leaf)" : "var(--warning)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-border">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Yield Forecast Table</div>
            <div className="text-sm font-semibold mt-0.5">Block-level prediction</div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="text-left font-medium px-4 py-2.5">Block</th>
                  <th className="text-right font-medium px-4 py-2.5">Area</th>
                  <th className="text-right font-medium px-4 py-2.5">NDRE</th>
                  <th className="text-right font-medium px-4 py-2.5">LSWI</th>
                  <th className="text-right font-medium px-4 py-2.5">Rain (3 mo)</th>
                  <th className="text-right font-medium px-4 py-2.5">kg/ha</th>
                  <th className="text-right font-medium px-4 py-2.5">Total bags</th>
                  <th className="text-left font-medium px-4 py-2.5">Class</th>
                </tr>
              </thead>
              <tbody>
                {blocks.map((b) => {
                  const cls = b.predictedYield >= 420 ? { l: "Above avg", c: "bg-success/15 text-success border-success/30" }
                    : b.predictedYield >= 350 ? { l: "Average", c: "bg-leaf/15 text-leaf border-leaf/30" }
                    : { l: "Below avg", c: "bg-warning/20 text-warning-foreground border-warning/40" };
                  return (
                    <tr key={b.id} className="border-t border-border hover:bg-secondary/30">
                      <td className="px-4 py-3"><div className="font-medium">{b.name}</div><div className="text-xs text-muted-foreground">{b.id}</div></td>
                      <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{b.area} ha</td>
                      <td className="px-4 py-3 text-right tabular-nums">{b.ndre.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{b.lswi.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{b.rainfall3mo} mm</td>
                      <td className="px-4 py-3 text-right tabular-nums font-semibold">{b.predictedYield}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{Math.round(b.predictedYield * b.area / 64)}</td>
                      <td className="px-4 py-3"><span className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${cls.c}`}>{cls.l}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
