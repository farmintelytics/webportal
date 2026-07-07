import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useState, useEffect, useMemo } from "react";
import { TopBar } from "../components/TopBar";
import { AppLayout } from "../components/AppLayout";
import { LayersPanel } from "../components/LayersPanel";
import { BlockDetail } from "../components/BlockDetail";
import { defaultLayers, type Block, type MapLayer } from "../data/fallbackData";
import { AlertTriangle, Sprout, Map as MapIcon, Mountain, Globe, Layers as LayersIcon } from "lucide-react";
import { cn } from "@monitoring-shared/lib/utils";
import { useMonitoring } from "../../shared/MonitoringContext";
import { fetchTimeseriesSlider } from "../../../../services/organizationMonitorApi";

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
  const { cropSummary, cropBlocks, cropLoading } = useMonitoring();
  const tenant = cropSummary?.tenant || "olam";

  const [layers, setLayers] = useState<MapLayer[]>(defaultLayers);
  const [selected, setSelected] = useState<Block | null>(null);
  const [client, setClient] = useState(false);
  const [basemap, setBasemap] = useState<Basemap>("satellite");
  const [source, setSource] = useState<"sentinel" | "landsat">("sentinel");
  const [date, setDate] = useState("Now · Dec '25");

  // Zarr raster slider state
  const [timeIndex, setTimeIndex] = useState(0);
  const [sliderData, setSliderData] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [zarrBounds, setZarrBounds] = useState<any>(null);

  const primaryLayer = layers.find(l => l.active)?.id || "ndvi";

  useEffect(() => {
    fetchTimeseriesSlider({
      farm: tenant,
      index: primaryLayer,
      start: "2024-01-01",
      end: "2027-12-31"
    })
      .then(data => {
        setSliderData(data);
        if (data?.timeline) {
          setTimeline(data.timeline);
          setTimeIndex(Math.max(0, data.timeline.length - 1));
        }
        if (data?.zarr_bounds) setZarrBounds(data.zarr_bounds);
      })
      .catch(err => console.error("Slider fetch error:", err));
  }, [primaryLayer, tenant]);

  const currentTileUrl = useMemo(() => {
    if (!timeline || timeline.length === 0) return null;
    const currentEntry = timeline[Math.min(timeIndex, timeline.length - 1)];
    return currentEntry ? sliderData?.tiles?.[currentEntry.date] : null;
  }, [sliderData, timeline, timeIndex]);

  const blocksData = useMemo(() => {
    if (!cropBlocks || cropBlocks.length === 0) return [];
    return cropBlocks.map((p: any) => {
      let polygon: [number, number][] = [];
      if (p.geometry && p.geometry.coordinates && p.geometry.coordinates[0]) {
        polygon = p.geometry.coordinates[0].map(([lng, lat]: [number, number]) => [lat, lng]);
      }
      const ndvi = p.current_indices?.ndvi ?? 0.65;
      const ndmi = p.current_indices?.ndmi ?? p.current_indices?.ndwi ?? 0.45;
      return {
        id: p.id,
        name: p.plot_nb ? `Block ${p.plot_nb}` : p.id,
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
        stressAlert: p.health_class === "Critical" ? "Water Stress" : "None",
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
  }, [cropBlocks]);

  useEffect(() => {
    setClient(true);
  }, []);

  return (
    <AppLayout>
      <TopBar title="Map View" />
      <main className="relative flex-1 overflow-hidden">
        {client && (
          <Suspense fallback={<div className="h-full w-full bg-muted" />}>
            <FarmMap 
              layers={layers} 
              onSelect={setSelected} 
              selectedId={selected?.id} 
              basemap={basemap} 
              blocks={blocksData}
              currentTileUrl={currentTileUrl}
              zarrBounds={zarrBounds}
              primaryLayer={primaryLayer}
            />
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
                  <span className="text-xs text-primary font-mono font-bold">{timeline[timeIndex]?.label || "Loading..."}</span>
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
              type="range" min={0} max={Math.max(0, timeline.length - 1)} value={timeIndex}
              onChange={e => setTimeIndex(+e.target.value)}
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
