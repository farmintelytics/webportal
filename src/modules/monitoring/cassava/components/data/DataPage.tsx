import { Card } from "@monitoring-shared/ui/card";
import { Button } from "@monitoring-shared/ui/button";
import { Badge } from "@monitoring-shared/ui/badge";
import { Input } from "@monitoring-shared/ui/input";
import { plots, batches, farms } from "../../lib/fallbackData";
import { Upload, Download, Search, Database, Satellite, CloudRain, Thermometer } from "lucide-react";

const sources = [
  { name: "Sentinel-2 L2A", icon: Satellite, status: "Synced", last: "2024-07-14", count: "1,248 scenes" },
  { name: "MODIS LST", icon: Thermometer, status: "Synced", last: "2024-07-13", count: "856 tiles" },
  { name: "CHIRPS Rainfall", icon: CloudRain, status: "Syncing", last: "2024-07-15", count: "12 months" },
  { name: "Sentinel-1 SAR", icon: Satellite, status: "Synced", last: "2024-07-12", count: "412 scenes" },
];

export function DataPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {sources.map(s => (
          <Card key={s.name} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <s.icon className="size-5" />
              </div>
              <Badge variant={s.status === "Synced" ? "default" : "secondary"} className={s.status === "Synced" ? "bg-healthy/10 text-healthy border-healthy/20" : ""}>{s.status}</Badge>
            </div>
            <div className="font-semibold text-sm">{s.name}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.count} · last sync {s.last}</div>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold">Farms & Plots</h3>
            <p className="text-xs text-muted-foreground">Manage geospatial assets and batch metadata</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input placeholder="Search…" className="pl-9 h-9 w-56" />
            </div>
            <Button variant="outline" size="sm"><Download className="size-4 mr-1.5" /> Export</Button>
            <Button size="sm"><Upload className="size-4 mr-1.5" /> Import GeoJSON</Button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                {["Plot ID", "Farm", "Batch", "Size (ha)", "Soil", "Slope", "Planting", "Status"].map(h => (
                  <th key={h} className="px-4 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {plots.map(p => {
                const farm = farms.find(f => f.id === p.farmId)!;
                const batch = batches.find(b => b.id === p.batchId)!;
                return (
                  <tr key={p.id} className="border-t border-border hover:bg-muted/30">
                    <td className="px-4 py-3 font-mono">{p.id}</td>
                    <td className="px-4 py-3">{farm.name}</td>
                    <td className="px-4 py-3">{batch.name}</td>
                    <td className="px-4 py-3 font-mono">{p.size.toFixed(1)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.soil}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.slope}</td>
                    <td className="px-4 py-3 font-mono text-xs">{p.plantingDate}</td>
                    <td className="px-4 py-3"><Badge variant="secondary" className="capitalize">{p.status}</Badge></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <Database className="size-5 text-primary" />
          <h3 className="font-semibold">Batches</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {batches.map(b => (
            <div key={b.id} className="rounded-lg border border-border p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold">{b.name}</span>
                <Badge variant="secondary" className="text-[10px]">{b.status}</Badge>
              </div>
              <div className="text-xs text-muted-foreground space-y-0.5">
                <div>Planted {b.plantingDate}</div>
                <div>Age {b.ageMonths} months</div>
                <div className="font-mono">NDVI {b.ndvi} · VHI {b.vhi}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
