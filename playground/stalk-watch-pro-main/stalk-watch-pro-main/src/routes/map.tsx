import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useState, useEffect } from "react";
import { TopBar } from "@/components/TopBar";
import { LayersPanel } from "@/components/LayersPanel";
import { BlockDetail } from "@/components/BlockDetail";
import { defaultLayers, type Block, type MapLayer, blocks } from "@/data/mockData";
import { AlertTriangle, Sprout, Map as MapIcon, Mountain, Globe, Layers as LayersIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const FarmMap = lazy(() => import("@/components/FarmMap").then((m) => ({ default: m.FarmMap })));

export type Basemap = "satellite" | "streets" | "terrain" | "hybrid";

export const Route = createFileRoute("/map")({ component: MapPage });

const basemaps: { id: Basemap; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "satellite", label: "Satellite", icon: Globe },
  { id: "streets", label: "Streets", icon: MapIcon },
  { id: "terrain", label: "Terrain", icon: Mountain },
  { id: "hybrid", label: "Hybrid", icon: LayersIcon },
];

function MapPage() {
  const [layers, setLayers] = useState<MapLayer[]>(defaultLayers);
  const [selected, setSelected] = useState<Block | null>(null);
  const [client, setClient] = useState(false);
  const [basemap, setBasemap] = useState<Basemap>("satellite");
  useEffect(() => setClient(true), []);

  const alerts = blocks.filter((b) => b.stressAlert !== "None");
  const harvestReady = blocks.filter((b) => b.harvestReady);

  return (
    <>
      <TopBar title="Map View" />
      <main className="relative flex-1 overflow-hidden">
        {client && (
          <Suspense fallback={<div className="h-full w-full bg-muted" />}>
            <FarmMap layers={layers} onSelect={setSelected} selectedId={selected?.id} basemap={basemap} />
          </Suspense>
        )}

        {/* Floating KPI strip */}
        <div className="absolute left-4 top-4 z-[1000] flex gap-2">
          <KpiPill label="Blocks" value={String(blocks.length)} />
          <KpiPill label="Hectares" value={String(blocks.reduce((s, b) => s + b.hectares, 0))} />
          <KpiPill label="Harvest-ready" value={String(harvestReady.length)} icon={<Sprout className="h-3 w-3" />} />
          <KpiPill label="Alerts" value={String(alerts.length)} icon={<AlertTriangle className="h-3 w-3" />} tone="warn" />
        </div>

        {/* Basemap switcher */}
        <div className="absolute bottom-6 left-4 z-[1000] flex overflow-hidden rounded-full border border-border bg-card/95 p-1 shadow-[var(--shadow-elegant)] backdrop-blur">
          {basemaps.map((b) => {
            const active = basemap === b.id;
            return (
              <button
                key={b.id}
                onClick={() => setBasemap(b.id)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                  active ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <b.icon className="h-3.5 w-3.5" />
                {b.label}
              </button>
            );
          })}
        </div>

        {selected && <BlockDetail block={selected} onClose={() => setSelected(null)} />}
        <LayersPanel layers={layers} setLayers={setLayers} />
      </main>
    </>
  );
}

function KpiPill({ label, value, icon, tone }: { label: string; value: string; icon?: React.ReactNode; tone?: "warn" }) {
  return (
    <div className={`rounded-full border border-border bg-card/95 px-3 py-1.5 text-xs shadow-sm backdrop-blur ${tone === "warn" ? "text-orange-700" : "text-foreground"}`}>
      <span className="flex items-center gap-1.5">
        {icon}
        <span className="text-muted-foreground">{label}</span>
        <span className="font-bold">{value}</span>
      </span>
    </div>
  );
}
