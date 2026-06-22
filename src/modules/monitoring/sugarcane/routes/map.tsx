import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useState, useEffect } from "react";
import { TopBar } from "../components/TopBar";
import { AppLayout } from "../components/AppLayout";
import { LayersPanel } from "../components/LayersPanel";
import { BlockDetail } from "../components/BlockDetail";
import { defaultLayers, type Block, type MapLayer, blocks as fallbackBlocks } from "../data/fallbackData";
import { AlertTriangle, Sprout, Map as MapIcon, Mountain, Globe, Layers as LayersIcon } from "lucide-react";
import { cn } from "@monitoring-shared/lib/utils";
import { fetchPlotsIntelligence } from "../../../../services/agromonitorApi";

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
  const [blocksData, setBlocksData] = useState<Block[]>(fallbackBlocks);

  useEffect(() => {
    setClient(true);
    fetchPlotsIntelligence()
      .then((res) => {
        if (res && res.length > 0) {
          const mapped = res.map((p: any) => {
            let polygon: [number, number][] = [];
            if (p.boundary && p.boundary.coordinates && p.boundary.coordinates[0]) {
              polygon = p.boundary.coordinates[0].map(([lng, lat]: [number, number]) => [lat, lng]);
            }
            const ndvi = p.indices?.ndvi ?? 0.65;
            const ndmi = p.indices?.ndmi ?? 0.45;
            return {
              id: p.plot_id,
              name: p.name || p.plot_id,
              hectares: p.area_ha ?? 10.0,
              polygon,
              cropAgeMonths: 6,
              growthStage: ndvi > 0.7 ? "Harvest Ready" : ndvi > 0.55 ? "Grand Growth" : "Tillering",
              ndvi,
              evi: +(ndvi * 0.8).toFixed(2),
              lai: 3.5,
              lswi: ndmi,
              vhi: Math.round(ndvi * 100),
              sar: -9.0,
              stressAlert: p.indices?.uas_anomaly_score > 0.4 ? "Water Stress" : "None",
              predictedYield: Math.round(ndvi * 85),
              harvestReady: ndvi > 0.7,
              harvestWindow: ndvi > 0.7 ? "End of month" : "Jul 2026",
              suitability: ndvi > 0.6 ? "Suitable" : "Marginal",
              soilScore: 85,
              thermalScore: 80,
              rainfallScore: 78,
              waterAvailability: "Irrigated",
              landUseStatus: "Vegetated"
            };
          });
          setBlocksData(mapped);
        }
      })
      .catch((err) => console.error("Error fetching sugarcane plots:", err));
  }, []);

  return (
    <AppLayout>
      <TopBar title="Map View" />
      <main className="relative flex-1 overflow-hidden">
        {client && (
          <Suspense fallback={<div className="h-full w-full bg-muted" />}>
            <FarmMap layers={layers} onSelect={setSelected} selectedId={selected?.id} basemap={basemap} blocks={blocksData} />
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
