import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "./components/AppShell";
import { Card } from "@monitoring-shared/ui/card";
import { Button } from "@monitoring-shared/ui/button";
import { Badge } from "@monitoring-shared/ui/badge";
import { Checkbox } from "@monitoring-shared/ui/checkbox";
import { Label } from "@monitoring-shared/ui/label";
import { FileText, Download, Eye, Calendar } from "lucide-react";
import { PLOTS, farmTotal } from "./lib/farm-data";
import { useState } from "react";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports — MaizeRS" },
      {
        name: "description",
        content:
          "Generate and export farm summary, monitoring, and yield reports as PDF or CSV.",
      },
    ],
  }),
  component: ReportsPage,
});

const RECENT = [
  { name: "Farm Summary — Apr 2026", date: "Apr 22, 2026", type: "PDF", size: "2.4 MB" },
  { name: "Plot 03 Monitoring Report", date: "Apr 18, 2026", type: "PDF", size: "1.1 MB" },
  { name: "Yield Forecast Q2", date: "Apr 15, 2026", type: "PDF", size: "3.2 MB" },
  { name: "All Plots — Activity Log", date: "Apr 10, 2026", type: "CSV", size: "180 KB" },
];

function ReportsPage() {
  const [type, setType] = useState("Farm Summary");
  const [metrics, setMetrics] = useState<Record<string, boolean>>({
    yield: true,
    ndvi: true,
    rainfall: true,
    activity: false,
    insights: true,
  });

  return (
    <AppShell>
      <div className="p-6 lg:p-8 max-w-[1400px] space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Generate clean, structured PDF & CSV reports for stakeholders.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_400px] gap-6">
          {/* Builder */}
          <Card className="p-6 space-y-6">
            <div>
              <h3 className="font-semibold mb-3">1. Report Type</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "Farm Summary",
                  "Activity Report",
                  "Monitoring Report",
                  "Yield Forecast",
                ].map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`text-left p-3 rounded-lg border-2 transition ${
                      type === t
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <p className="font-medium text-sm">{t}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t === "Farm Summary"
                        ? "Overview, KPIs, charts"
                        : t === "Activity Report"
                          ? "Field operations log"
                          : t === "Monitoring Report"
                            ? "RS indices per plot"
                            : "Yield prediction"}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">2. Plots</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PLOTS.map((p) => (
                  <label
                    key={p.id}
                    className="flex items-center gap-2 p-2 rounded-md border hover:bg-accent/30 cursor-pointer text-sm"
                  >
                    <Checkbox defaultChecked />
                    <span className="font-mono text-xs">{p.id}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">3. Date Range</h3>
              <div className="flex gap-2 items-center">
                <Card className="px-3 py-2 flex items-center gap-2 flex-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Mar 1, 2026 → Apr 22, 2026</span>
                </Card>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">4. Include Metrics</h3>
              <div className="grid sm:grid-cols-2 gap-2">
                {[
                  { id: "yield", label: "Yield estimates" },
                  { id: "ndvi", label: "NDVI / GCVI trends" },
                  { id: "rainfall", label: "Rainfall (CHIRPS)" },
                  { id: "activity", label: "Activity logs" },
                  { id: "insights", label: "AI insights & alerts" },
                ].map((m) => (
                  <label
                    key={m.id}
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-accent/30 cursor-pointer"
                  >
                    <Checkbox
                      checked={!!metrics[m.id]}
                      onCheckedChange={(v) =>
                        setMetrics((s) => ({ ...s, [m.id]: !!v }))
                      }
                    />
                    <Label className="text-sm cursor-pointer">{m.label}</Label>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button className="flex-1">
                <Download className="h-4 w-4 mr-2" /> Generate PDF
              </Button>
              <Button variant="outline" className="flex-1">
                <Download className="h-4 w-4 mr-2" /> Export CSV
              </Button>
            </div>
          </Card>

          {/* Preview */}
          <Card className="p-6 bg-gradient-to-br from-muted/30 to-background">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">
              Preview
            </p>
            <div className="bg-card rounded-md border shadow-sm aspect-[3/4] p-5 text-xs space-y-3 overflow-hidden">
              <div className="border-b pb-2">
                <p className="font-bold text-sm">{type}</p>
                <p className="text-[10px] text-muted-foreground">
                  Long Rains 2026 · Generated Apr 22
                </p>
              </div>
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded grid place-items-center text-[10px] text-muted-foreground">
                Farm boundary map snapshot
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-muted/30 p-2 rounded">
                  <p className="font-bold">{farmTotal.totalArea.toFixed(0)}</p>
                  <p className="text-[9px] text-muted-foreground">ha</p>
                </div>
                <div className="bg-muted/30 p-2 rounded">
                  <p className="font-bold">
                    {farmTotal.expectedTonnes.toFixed(0)}t
                  </p>
                  <p className="text-[9px] text-muted-foreground">yield</p>
                </div>
                <div className="bg-muted/30 p-2 rounded">
                  <p className="font-bold">{farmTotal.riskCount}</p>
                  <p className="text-[9px] text-muted-foreground">at risk</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-[11px]">Insights</p>
                <p className="text-[10px] text-muted-foreground">
                  • Plot 03 shows nitrogen deficiency — top-dress in 7 days
                </p>
                <p className="text-[10px] text-muted-foreground">
                  • Plot 05 dry spell · 195mm vs 320mm expected
                </p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-0 overflow-hidden">
          <div className="px-5 py-4 border-b">
            <h3 className="font-semibold">Recent Reports</h3>
          </div>
          <div className="divide-y">
            {RECENT.map((r) => (
              <div
                key={r.name}
                className="flex items-center gap-4 px-5 py-3 hover:bg-accent/20"
              >
                <div className="h-9 w-9 rounded-md bg-primary/10 text-primary grid place-items-center">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{r.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {r.date} · {r.size}
                  </p>
                </div>
                <Badge variant="secondary">{r.type}</Badge>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
