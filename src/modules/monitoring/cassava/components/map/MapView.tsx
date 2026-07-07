import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Polygon, useMap } from "react-leaflet";
import { LatLngBoundsExpression } from "leaflet";
import { statusColors, Plot } from "../../lib/fallbackData";
import { PlotDetailCard } from "./PlotDetailCard";
import { LayerPanel } from "./LayerPanel";
import { Search, Layers as LayersIcon } from "lucide-react";
import { Input } from "@monitoring-shared/ui/input";
import { Button } from "@monitoring-shared/ui/button";
import { cn } from "@monitoring-shared/lib/utils";
import { useMonitoring } from "../../../shared/MonitoringContext";
import { fetchTimeseriesSlider } from "../../../../../services/organizationMonitorApi";

function FitBounds({ bounds }: { bounds: LatLngBoundsExpression }) {
  const map = useMap();
  useEffect(() => { 
    if (bounds && (bounds as any)[0]?.[0] !== Infinity) {
      map.fitBounds(bounds, { padding: [60, 60] }); 
    }
  }, [map, bounds]);
  return null;
}

export function MapView() {
  const { cropSummary, cropBlocks, cropLoading } = useMonitoring();
  const [selected, setSelected] = useState<any>(null);
  const [showLayers, setShowLayers] = useState(true);
  const [source, setSource] = useState<"sentinel" | "landsat">("sentinel");
  const [basemap, setBasemap] = useState<"satellite" | "terrain" | "streets">("satellite");
  const [date, setDate] = useState("Now · Dec '25");
  const [query, setQuery] = useState("");

  const [activeLayers, setActiveLayers] = useState<Record<string, boolean>>({ boundaries: true, ndvi: true });
  const [layerOpacity, setLayerOpacity] = useState<Record<string, number>>({});

  // Zarr raster slider state
  const [timeIndex, setTimeIndex] = useState(0);
  const [sliderData, setSliderData] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [zarrBounds, setZarrBounds] = useState<any>(null);

  const primaryLayer = activeLayers.ndvi ? "ndvi" : activeLayers.evi ? "evi" : activeLayers.msavi ? "msavi" : activeLayers.lswi ? "lswi" : "ndvi";
  const tenant = cropSummary?.tenant || "olam";

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

  const plotsData = useMemo(() => {
    if (!cropBlocks || cropBlocks.length === 0) return [];
    return cropBlocks.map((p: any) => {
      let polygon: [number, number][] = [];
      let center: [number, number] = [7.51, 5.02];
      if (p.geometry && p.geometry.coordinates && p.geometry.coordinates[0]) {
        polygon = p.geometry.coordinates[0];
        const lats = polygon.map(pt => pt[1]);
        const lngs = polygon.map(pt => pt[0]);
        center = [lats.reduce((a,b)=>a+b,0)/lats.length, lngs.reduce((a,b)=>a+b,0)/lngs.length];
      }
      const ndvi = p.current_indices?.ndvi ?? 0.65;
      const statusVal: Plot["status"] = ndvi > 0.7 ? "harvest" : ndvi > 0.55 ? "healthy" : p.health_class === "Critical" ? "alert" : "stress";
      return {
        id: p.id,
        farmId: p.farm_id ?? "F1",
        batchId: p.plot_nb ? `Plot ${p.plot_nb}` : p.id,
        size: p.area_ha ?? 2.0,
        soil: "Loam",
        slope: "0-5°",
        plantingDate: "2024-01-20",
        ageMonths: 6,
        ndvi,
        lswi: p.current_indices?.lswi ?? p.current_indices?.ndwi ?? 0.45,
        vhi: Math.round(ndvi * 100),
        predictedYield: Math.round(ndvi * 24),
        status: statusVal,
        harvestWindow: ndvi > 0.7 ? "Now - 4 weeks" : "3-4 months",
        polygon,
        center
      };
    });
  }, [cropBlocks]);

  const bounds = useMemo<LatLngBoundsExpression>(() => {
    if (plotsData.length === 0) return [[7.50, 5.01], [7.52, 5.03]];
    const lats = plotsData.map(p => p.center[0]);
    const lngs = plotsData.map(p => p.center[1]);
    return [[Math.min(...lats) - 0.005, Math.min(...lngs) - 0.005], [Math.max(...lats) + 0.005, Math.max(...lngs) + 0.005]];
  }, [plotsData]);

  const filteredHighlight = query
    ? plotsData.find(p => p.id.toLowerCase().includes(query.toLowerCase()) || p.batchId.toLowerCase().includes(query.toLowerCase()))
    : null;

  return (
    <div className="absolute inset-0">
      <MapContainer center={[7.51, 5.02]} zoom={14} className="size-full" zoomControl={false}>
        <TileLayer
          url={
            basemap === "streets"
              ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              : basemap === "terrain"
              ? "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
              : "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          }
          attribution={
            basemap === "streets" 
              ? "© OpenStreetMap" 
              : basemap === "terrain" 
              ? "© OpenTopoMap" 
              : "© Esri World Imagery"
          }
        />
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
          attribution=""
          opacity={0.6}
        />
        {currentTileUrl && activeLayers[primaryLayer] && (
          <TileLayer
            url={currentTileUrl}
            opacity={(layerOpacity[primaryLayer] ?? 80) / 100}
            bounds={zarrBounds || undefined}
            zIndex={300}
          />
        )}
        <FitBounds bounds={bounds} />
        {activeLayers.boundaries && plotsData.map(p => {
          const isHi = filteredHighlight?.id === p.id;
          const isRasterActive = activeLayers[primaryLayer] && currentTileUrl;
          const strokeColor = isRasterActive ? "#ffffff" : statusColors[p.status];
          const fillColor = isRasterActive ? "transparent" : statusColors[p.status];
          const fillOpacity = isRasterActive ? 0 : (isHi ? 0.7 : 0.4);
          
          return (
            <Polygon
              key={p.id}
              positions={p.polygon.map(c => [c[1], c[0]]) as [number, number][]}
              pathOptions={{
                color: strokeColor,
                fillColor: fillColor,
                fillOpacity: fillOpacity,
                weight: isHi ? 4 : (isRasterActive ? 1.5 : 2),
              }}
              eventHandlers={{ click: () => setSelected(p) }}
            />
          );
        })}
      </MapContainer>

      {/* Imagery Explorer (Top) */}
      <div className="absolute top-4 left-4 z-[400] flex items-center gap-2 pointer-events-none">
        <div className="bg-white border border-border rounded-xl shadow-lg px-4 py-3 w-[440px] pointer-events-auto flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LayersIcon className="h-3.5 w-3.5 text-emerald-700"/>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-800">Imagery Explorer</span>
                <span className="text-xs text-emerald-700 font-mono font-bold">{date}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between gap-3">
              <div className="flex bg-muted p-0.5 rounded-lg flex-1">
                {(["satellite", "terrain", "streets"] as const).map((b) => (
                  <button
                    key={b}
                    onClick={() => setBasemap(b)}
                    className={cn(
                      "flex-1 px-2 py-1 text-[9px] font-black rounded-md transition-all uppercase",
                      basemap === b ? "bg-white shadow-sm text-emerald-700 font-bold" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {b}
                  </button>
                ))}
              </div>
              <div className="flex bg-muted p-0.5 rounded-lg">
                <button 
                  onClick={() => setSource("sentinel")}
                  className={cn("px-2 py-0.5 text-[9px] font-black rounded-md transition-all", source === "sentinel" ? "bg-white shadow-sm text-emerald-700 font-bold" : "text-muted-foreground")}
                >SENTINEL</button>
                <button 
                  onClick={() => setSource("landsat")}
                  className={cn("px-2 py-0.5 text-[9px] font-black rounded-md transition-all", source === "landsat" ? "bg-white shadow-sm text-emerald-700 font-bold" : "text-muted-foreground")}
                >LANDSAT</button>
              </div>
            </div>
          </div>
          <input 
            type="range" min={0} max={Math.max(0, timeline.length - 1)} value={timeIndex}
            onChange={e => setTimeIndex(Number(e.target.value))}
            className="w-full h-1.5 accent-emerald-600 appearance-none bg-muted rounded-full cursor-pointer"
          />
        </div>

        <div className="relative w-64 pointer-events-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search plots…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="pl-9 bg-card shadow-md border-border h-10"
          />
        </div>
      </div>

      {/* Toggle layers btn */}
      <Button
        variant="secondary"
        size="icon"
        className="absolute top-4 right-4 z-[400] shadow-md bg-emerald-600 hover:bg-emerald-700 text-white"
        onClick={() => setShowLayers(s => !s)}
      >
        <LayersIcon className="size-4" />
      </Button>

      {showLayers && (
        <div className="absolute top-16 right-4 z-[400] w-72">
          <LayerPanel active={activeLayers} setActive={setActiveLayers} opacity={layerOpacity} setOpacity={setLayerOpacity} />
        </div>
      )}

      {selected && (
        <div className="absolute top-4 right-20 bottom-24 z-[400] w-80 overflow-y-auto">
          <PlotDetailCard plot={selected} onClose={() => setSelected(null)} />
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-24 left-4 z-[400] bg-white rounded-lg shadow-card p-3 text-xs space-y-1.5 border border-emerald-100">
        <div className="font-semibold mb-1 text-slate-800">Plot Status</div>
        {Object.entries(statusColors).map(([k, v]) => (
          <div key={k} className="flex items-center gap-2 text-slate-600 font-medium">
            <span className="size-3 rounded border border-slate-200" style={{ background: v }} />
            <span className="capitalize">{k}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
