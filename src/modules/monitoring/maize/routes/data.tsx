import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "../components/AppShell";
import { Card } from "@monitoring-shared/ui/card";
import { Badge } from "@monitoring-shared/ui/badge";
import { Button } from "@monitoring-shared/ui/button";
import { Database, Upload, Download } from "lucide-react";
import { PLOTS } from "../lib/farm-data";

export const Route = createFileRoute("/data")({
  head: () => ({
    meta: [
      { title: "Data Management — MaizeRS" },
      {
        name: "description",
        content: "Manage farm boundaries, datasets, and remote sensing sources.",
      },
    ],
  }),
  component: DataPage,
});

const SOURCES = [
  { name: "Sentinel-2 L2A", status: "Active", freq: "5-day", coverage: "100%" },
  { name: "Landsat-8/9", status: "Active", freq: "16-day", coverage: "100%" },
  { name: "Sentinel-1 SAR", status: "Active", freq: "6-day", coverage: "100%" },
  { name: "MODIS LST", status: "Active", freq: "Daily", coverage: "100%" },
  { name: "CHIRPS Rainfall", status: "Active", freq: "Dekadal", coverage: "100%" },
  { name: "ERA5 Climate", status: "Active", freq: "Hourly", coverage: "100%" },
  { name: "SoilGrids 250m", status: "Cached", freq: "Static", coverage: "100%" },
  { name: "SRTM DEM", status: "Cached", freq: "Static", coverage: "100%" },
];

function DataPage() {
  return (
    <AppShell>
      <div className="p-6 lg:p-8 max-w-[1400px] space-y-6">
        <div className="flex justify-between items-end flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Data Management
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Sources, datasets, and farm boundaries.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" /> Import boundaries
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" /> Export all
            </Button>
          </div>
        </div>

        <Card className="p-0 overflow-hidden">
          <div className="px-5 py-4 border-b flex items-center gap-2">
            <Database className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Remote Sensing Sources</h3>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-5 py-3">Source</th>
                <th className="text-left px-3 py-3">Status</th>
                <th className="text-left px-3 py-3">Revisit</th>
                <th className="text-left px-3 py-3">Coverage</th>
              </tr>
            </thead>
            <tbody>
              {SOURCES.map((s) => (
                <tr key={s.name} className="border-t hover:bg-accent/20">
                  <td className="px-5 py-3 font-medium">{s.name}</td>
                  <td className="px-3 py-3">
                    <Badge
                      variant="secondary"
                      className="bg-primary/10 text-primary border-primary/20"
                    >
                      {s.status}
                    </Badge>
                  </td>
                  <td className="px-3 py-3 text-muted-foreground">{s.freq}</td>
                  <td className="px-3 py-3 font-mono">{s.coverage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card className="p-0 overflow-hidden">
          <div className="px-5 py-4 border-b">
            <h3 className="font-semibold">Farm Boundaries</h3>
            <p className="text-xs text-muted-foreground">
              {PLOTS.length} registered plots
            </p>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-5 py-3">Plot</th>
                <th className="text-left px-3 py-3">Crop</th>
                <th className="text-right px-3 py-3">Area (ha)</th>
                <th className="text-left px-3 py-3">Coordinates</th>
                <th className="text-left px-3 py-3">Stage</th>
              </tr>
            </thead>
            <tbody>
              {PLOTS.map((p) => (
                <tr key={p.id} className="border-t hover:bg-accent/20">
                  <td className="px-5 py-3">
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-muted-foreground font-mono">
                      {p.id}
                    </div>
                  </td>
                  <td className="px-3 py-3">Maize</td>
                  <td className="px-3 py-3 text-right font-mono">{p.area}</td>
                  <td className="px-3 py-3 font-mono text-xs text-muted-foreground">
                    {p.lat.toFixed(3)}, {p.lng.toFixed(3)}
                  </td>
                  <td className="px-3 py-3">
                    <Badge variant="secondary">{p.stage}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </AppShell>
  );
}
