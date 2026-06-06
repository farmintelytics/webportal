import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useState, useEffect } from "react";
import { TopBar } from "../components/TopBar";
import { AppLayout } from "../components/AppLayout";
import { LayersPanel } from "../components/LayersPanel";
import { BlockDetail } from "../components/BlockDetail";
import { defaultLayers, type Block, type MapLayer, blocks } from "../data/mockData";
import { AlertTriangle, Sprout, Map as MapIcon, Mountain, Globe, Layers as LayersIcon } from "lucide-react";
import { cn } from "@monitoring-shared/lib/utils";

const FarmMap = lazy(() => import("../components/FarmMap").then((m) => ({ default: m.FarmMap })));

export type Basemap = "satellite" | "streets" | "terrain" | "hybrid";

export const Route = createFileRoute("/map")({ component: MapPage });

const basemaps: { id: Basemap; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "satellite", label: "Geospatial Intelligence", icon: Globe },
  { id: "streets", label: "Streets", icon: MapIcon },
  { id: "terrain", label: "Terrain", icon: Mountain },
  { id: "hybrid", label: "Hybrid", icon: LayersIcon },
];

function MapPage() {
  const [layers, setLayers] = useState<MapLayer[]>(defaultLayers);
  const [selected, setSelected] = useState<Block | null>(null);
  const [client, setClient] = useState(false);
  const [basemap, setBasemap] = useState<Basemap>("satellite");
  const [source, setSource] = useState<"sentinel" | "landsat">("sentinel");
  const [date, setDate] = useState("Peak · Oct '25");
  useEffect(() => setClient(true), []);

  return (
    <AppLayout>
      <TopBar title="Map View" />
      <main className="relative flex-1 overflow-hidden">
        {client && (
          <Suspense fallback={<div className="h-full w-full bg-muted" />}>
            <FarmMap layers={layers} onSelect={setSelected} selectedId={selected?.id} basemap={basemap} />
          </Suspense>
        )}

        {/* Imagery Explorer (Top Left) */}
        <div className="absolute top-4 left-4 z-[1000] pointer-events-none">
          <div className="bg-white border border-border rounded-xl shadow-lg px-4 py-3 w-[440px] pointer-events-auto flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="h-3.5 w-3.5 text-primary"/>
                  <span className="text-[10px] font-black uppercase tracking-wider">Imagery Explorer</span>
                  <span className="text-xs text-primary font-mono font-bold">{date}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between gap-3">
                <div className="flex bg-muted p-0.5 rounded-lg flex-1">
                  {(["satellite", "streets", "terrain"] as const).map((b) => (
                    <button
                      key={b}
                      onClick={() => setBasemap(b as Basemap)}
                      className={cn(
                        "flex-1 px-2 py-1 text-[9px] font-black rounded-md transition-all uppercase",
                        basemap === b ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {b}
                    </button>
                  ))}
                </div>
                <div className="flex bg-muted p-0.5 rounded-lg">
                  <button 
                    onClick={() => setSource("sentinel")}
                    className={cn("px-2 py-0.5 text-[9px] font-black rounded-md transition-all", source === "sentinel" ? "bg-white shadow-sm text-primary" : "text-muted-foreground")}
                  >SENTINEL</button>
                  <button 
                    onClick={() => setSource("landsat")}
                    className={cn("px-2 py-0.5 text-[9px] font-black rounded-md transition-all", source === "landsat" ? "bg-white shadow-sm text-primary" : "text-muted-foreground")}
                  >LANDSAT</button>
                </div>
              </div>
            </div>
            <input 
              type="range" min={0} max={23} defaultValue={20}
              onChange={e => setDate(`Cycle ${e.target.value} · 2025`)}
              className="w-full h-1.5 accent-primary appearance-none bg-muted rounded-full cursor-pointer"
            />
          </div>
        </div>


        {selected && <BlockDetail block={selected} onClose={() => setSelected(null)} />}
        <LayersPanel layers={layers} setLayers={setLayers} />
      </main>
    </AppLayout>
  );
}
