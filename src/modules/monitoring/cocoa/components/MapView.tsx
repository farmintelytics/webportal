import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Polygon, useMap, Tooltip as LeafletTooltip, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { type HealthClass, type Block } from "../lib/cocoa-data";
import { Layers, Search, X, Eye, EyeOff, ChevronDown, ChevronRight, Calendar } from "lucide-react";
import { cn } from "@monitoring-shared/lib/utils";
import { useMonitoring } from "../../shared/MonitoringContext";
import { fetchTimeseriesSlider } from "../../../../services/organizationMonitorApi";


// Schematic farm geographic coords centered on Ashanti, Ghana cocoa region
const FARM_CENTER: [number, number] = [6.685, -1.625];

const healthColor = (h: HealthClass) => {
  switch (h) {
    case "Excellent": return "#16a34a";
    case "Good": return "#65a30d";
    case "Stressed": return "#f59e0b";
    case "Severely Stressed": return "#dc2626";
  }
};

const ndviColor = (v: number) => {
  if (v >= 0.75) return "#14532d";
  if (v >= 0.65) return "#166534";
  if (v >= 0.55) return "#65a30d";
  if (v >= 0.45) return "#facc15";
  return "#b45309";
};

type LayerKey = "boundaries" | "health" | "ndvi" | "ndre" | "lswi" | "soil" | "rainfall";

interface LayerDef {
  key: LayerKey;
  label: string;
  group: "Operational" | "Biophysical" | "Monitoring";
  desc: string;
  legend: { color: string; label: string }[];
}

const LAYERS: LayerDef[] = [
  { key: "boundaries", label: "Farm Boundaries", group: "Operational", desc: "Plot polygons & block IDs",
    legend: [{ color: "#16a34a", label: "Boundary outline" }] },
  { key: "health", label: "Canopy Health (NDRE class)", group: "Monitoring", desc: "Health classification per block",
    legend: [
      { color: "#16a34a", label: "Excellent (NDRE ≥ 0.35)" },
      { color: "#65a30d", label: "Good (0.22–0.35)" },
      { color: "#f59e0b", label: "Stressed (0.15–0.22)" },
      { color: "#dc2626", label: "Severe (< 0.15)" },
    ] },
  { key: "ndvi", label: "NDVI (vegetation density)", group: "Biophysical", desc: "Sentinel-2 monthly composite",
    legend: [
      { color: "#14532d", label: "Dense (≥ 0.75)" },
      { color: "#166534", label: "0.65–0.75" },
      { color: "#65a30d", label: "0.55–0.65" },
      { color: "#facc15", label: "0.45–0.55" },
      { color: "#b45309", label: "Sparse (< 0.45)" },
    ] },
  { key: "ndre", label: "NDRE (chlorophyll)", group: "Biophysical", desc: "Red-edge index — early stress signal",
    legend: [
      { color: "#0f766e", label: "High (≥ 0.35)" },
      { color: "#22c55e", label: "0.22–0.35" },
      { color: "#eab308", label: "0.15–0.22" },
      { color: "#dc2626", label: "Low (< 0.15)" },
    ] },
  { key: "lswi", label: "LSWI (canopy water)", group: "Biophysical", desc: "Land Surface Water Index",
    legend: [
      { color: "#0369a1", label: "Wet (≥ 0.30)" },
      { color: "#38bdf8", label: "0.20–0.30" },
      { color: "#fbbf24", label: "Dry (< 0.20)" },
    ] },
  { key: "soil", label: "Soil Suitability (SoilGrids)", group: "Biophysical", desc: "pH, texture, depth composite",
    legend: [
      { color: "#7c2d12", label: "Highly suitable" },
      { color: "#a16207", label: "Moderate" },
      { color: "#78716c", label: "Marginal" },
    ] },
  { key: "rainfall", label: "CHIRPS Rainfall (3-mo)", group: "Monitoring", desc: "Rolling rainfall accumulation",
    legend: [
      { color: "#1d4ed8", label: "Rolling precipitation totals" },
    ] },
];

const colorForLayer = (b: any, key: LayerKey): string => {
  switch (key) {
    case "health": return healthColor(b.health);
    case "ndvi": return ndviColor(b.ndvi);
    case "ndre":
      if (b.ndre >= 0.35) return "#0f766e";
      if (b.ndre >= 0.22) return "#22c55e";
      if (b.ndre >= 0.15) return "#eab308";
      return "#dc2626";
    case "lswi":
      if (b.lswi >= 0.30) return "#0369a1";
      if (b.lswi >= 0.20) return "#38bdf8";
      return "#fbbf24";
    case "soil":
      if (b.area > 4) return "#7c2d12";
      if (b.area > 3) return "#a16207";
      return "#78716c";
    case "rainfall":
      if (b.rainfall3mo >= 480) return "#1d4ed8";
      if (b.rainfall3mo >= 400) return "#60a5fa";
      return "#fde68a";
    case "boundaries": return "#16a34a";
  }
};

interface Props {
  selected?: string;
  onSelect?: (id: string) => void;
}

export function MapView({ selected, onSelect }: Props) {
  const { cropSummary, cropBlocks, cropLoading } = useMonitoring();
  const tenant = cropSummary?.tenant || "olam";

  const [activeLayers, setActiveLayers] = useState<Record<LayerKey, boolean>>({
    boundaries: true, health: true, ndvi: false, ndre: false, lswi: false, soil: false, rainfall: false,
  });
  const [opacity, setOpacity] = useState<Record<LayerKey, number>>({
    boundaries: 1, health: 0.6, ndvi: 0.7, ndre: 0.7, lswi: 0.7, soil: 0.7, rainfall: 0.7,
  });
  const [source, setSource] = useState<"sentinel" | "landsat">("sentinel");
  const [basemap, setBasemap] = useState<"satellite" | "terrain" | "streets">("satellite");
  const [panelOpen, setPanelOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({ Operational: true, Monitoring: true, Biophysical: false });
  const [timeIndex, setTimeIndex] = useState(0);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const plotsData = useMemo(() => {
    if (!cropBlocks || cropBlocks.length === 0) return [];
    return cropBlocks.map((p: any) => {
      let polygon: [number, number][] = [];
      let center: [number, number] = FARM_CENTER;
      if (p.geometry && p.geometry.coordinates && p.geometry.coordinates[0]) {
        polygon = p.geometry.coordinates[0].map(([lng, lat]: [number, number]) => [lat, lng]);
        const lats = polygon.map(pt => pt[0]);
        const lngs = polygon.map(pt => pt[1]);
        center = [lats.reduce((a,b)=>a+b,0)/lats.length, lngs.reduce((a,b)=>a+b,0)/lngs.length];
      }
      const ndvi = p.current_indices?.ndvi ?? 0.65;
      const ndre = p.current_indices?.ndre ?? +(ndvi * 0.7).toFixed(2);
      const lswi = p.current_indices?.lswi ?? p.current_indices?.ndwi ?? 0.45;
      const statusVal = p.health_class === "Critical" ? "Severely Stressed" : p.health_class === "Stressed" ? "Stressed" : ndvi > 0.7 ? "Excellent" : "Good";
      return {
        id: p.id,
        name: p.plot_nb ? `Block ${p.plot_nb}` : p.id,
        area: p.area_ha ?? 2.0,
        health: statusVal as HealthClass,
        ndvi,
        ndre,
        lswi,
        rainfall3mo: cropSummary?.average_rainfall_mm ?? 420,
        predictedYield: p.yield_t_ha ? Math.round(p.yield_t_ha * 1000) : Math.round(ndvi * 2400),
        polygon,
        center
      };
    });
  }, [cropBlocks, cropSummary]);

  // Zarr raster slider state
  const [sliderData, setSliderData] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [zarrBounds, setZarrBounds] = useState<any>(null);

  const biophysicalActiveLayer = useMemo(() => {
    if (activeLayers.ndvi) return "ndvi";
    if (activeLayers.ndre) return "ndre";
    if (activeLayers.lswi) return "lswi";
    return null;
  }, [activeLayers]);

  useEffect(() => {
    if (!biophysicalActiveLayer) return;
    fetchTimeseriesSlider({
      farm: tenant,
      index: biophysicalActiveLayer,
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
  }, [biophysicalActiveLayer, tenant]);

  const currentTileUrl = useMemo(() => {
    if (!biophysicalActiveLayer || !timeline || timeline.length === 0) return null;
    const currentEntry = timeline[Math.min(timeIndex, timeline.length - 1)];
    return currentEntry ? sliderData?.tiles?.[currentEntry.date] : null;
  }, [sliderData, timeline, timeIndex, biophysicalActiveLayer]);

  const bounds = useMemo<LatLngBoundsExpression>(() => {
    if (plotsData.length === 0) return [[6.68, -1.63], [6.69, -1.62]];
    const lats = plotsData.map(p => p.center[0]);
    const lngs = plotsData.map(p => p.center[1]);
    return [[Math.min(...lats) - 0.005, Math.min(...lngs) - 0.005], [Math.max(...lats) + 0.005, Math.max(...lngs) + 0.005]];
  }, [plotsData]);

  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    return plotsData.filter((b) => b.name.toLowerCase().includes(search.toLowerCase()) || b.id.toLowerCase().includes(search.toLowerCase())).slice(0, 5);
  }, [search, plotsData]);

  const activeLayerDefs = LAYERS.filter((l) => activeLayers[l.key]);
  const primaryFillLayer = activeLayerDefs.find((l) => l.key !== "boundaries");

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={FARM_CENTER}
        zoom={15}
        scrollWheelZoom
        className="w-full h-full"
        style={{ background: "#0d1f0d" }}
        zoomControl={false}
      >
        <TileLayer
          url={
            basemap === "streets"
              ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              : basemap === "terrain"
              ? "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
              : "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          }
          attribution={basemap === "streets" ? "© OpenStreetMap" : basemap === "terrain" ? "© OpenTopoMap" : "© Esri World Imagery"}
        />
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
          attribution=""
          opacity={0.6}
        />

        {currentTileUrl && biophysicalActiveLayer && (
          <TileLayer
            url={currentTileUrl}
            opacity={opacity[biophysicalActiveLayer] ?? 0.7}
            bounds={zarrBounds || undefined}
            zIndex={300}
          />
        )}

        {plotsData.map((b) => {
          const fillKey = primaryFillLayer?.key ?? "boundaries";
          const fillColor = colorForLayer(b, fillKey);
          const isSel = selected === b.id;
          
          const isRasterActive = biophysicalActiveLayer && currentTileUrl;
          const strokeColor = isRasterActive ? "#ffffff" : (activeLayers.boundaries ? "#16a34a" : fillColor);
          const drawFillColor = isRasterActive ? "transparent" : fillColor;
          const drawFillOpacity = isRasterActive ? 0 : (primaryFillLayer ? opacity[primaryFillLayer.key] : 0.05);

          const polyBounds = b.polygon.length > 0 ? b.polygon : [
            [b.center[0] - 0.002, b.center[1] - 0.002],
            [b.center[0] - 0.002, b.center[1] + 0.002],
            [b.center[0] + 0.002, b.center[1] + 0.002],
            [b.center[0] + 0.002, b.center[1] - 0.002],
          ];

          return (
            <Polygon
              key={b.id}
              positions={polyBounds}
              eventHandlers={{ click: () => onSelect?.(b.id) }}
              pathOptions={{
                color: isSel ? "#fef08a" : strokeColor,
                weight: isSel ? 3 : (isRasterActive ? 1.5 : (activeLayers.boundaries ? 2 : 0.5)),
                fillColor: drawFillColor,
                fillOpacity: drawFillOpacity,
              }}
            >
              <LeafletTooltip direction="center" permanent className="block-tooltip">
                <span style={{ fontSize: 10, fontWeight: 700, color: "#fff", textShadow: "0 1px 2px rgba(0,0,0,.7)" }}>{b.id}</span>
              </LeafletTooltip>
              <Popup>
                <div style={{ minWidth: 180 }} className="p-1">
                  <div className="font-semibold text-slate-900 text-sm">{b.name}</div>
                  <div className="text-xs text-slate-500">{b.area} ha · {b.health}</div>
                  <div className="mt-2 text-xs text-slate-700">
                    NDVI {b.ndvi.toFixed(2)} · NDRE {b.ndre.toFixed(2)}<br />
                    Predicted: {b.predictedYield} kg/ha
                  </div>
                </div>
              </Popup>
            </Polygon>
          );
        })}

        {searchResults.length > 0 && <FlyTo position={searchResults[0].center} />}
        <FitBounds bounds={bounds} />
      </MapContainer>

      {/* Imagery Explorer (Top) */}
      <div className="absolute top-4 left-4 z-[400] flex items-center gap-2 pointer-events-none">
        <div className="bg-white border border-border rounded-xl shadow-lg px-4 py-3 w-[440px] pointer-events-auto flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-emerald-700"/>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-800">Imagery Explorer</span>
                <span className="text-xs text-emerald-700 font-mono font-bold">
                  {timeline.length > 0 ? (timeline[timeIndex]?.date ?? "Now") : "Now · Dec '25"}
                </span>
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
        <div className="relative w-72 pointer-events-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search farms, plots…"
            className="w-full h-10 pl-9 pr-9 text-sm bg-white border border-slate-100 rounded-lg shadow-md focus:outline-none focus:border-emerald-600"
          />
        </div>
      </div>

      {/* Layer toggle button */}
      {!panelOpen && (
        <button
          onClick={() => setPanelOpen(true)}
          className="absolute top-3 right-3 z-[400] size-11 rounded-lg bg-emerald-600 text-white shadow-md flex items-center justify-center hover:bg-emerald-700 transition"
          title="Layers"
        >
          <Layers className="size-5" />
        </button>
      )}

      {/* Layer drawer */}
      {panelOpen && (
        <div className="absolute top-3 right-3 z-[400] w-80 max-h-[calc(100%-1.5rem)] flex flex-col bg-white border border-emerald-100 rounded-lg shadow-xl">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Layers className="size-4 text-emerald-700" />
              <span className="text-sm font-semibold text-slate-800">Map Layers</span>
            </div>
            <button onClick={() => setPanelOpen(false)} className="size-7 rounded hover:bg-slate-50 flex items-center justify-center">
              <X className="size-4 text-slate-500" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {(["Operational", "Monitoring", "Biophysical"] as const).map((group) => {
              const layers = LAYERS.filter((l) => l.group === group);
              const open = openGroups[group];
              return (
                <div key={group} className="rounded-md border border-slate-100 overflow-hidden">
                  <button
                    onClick={() => setOpenGroups({ ...openGroups, [group]: !open })}
                    className="w-full flex items-center justify-between px-3 py-2 bg-slate-50 hover:bg-slate-100 text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    <span>{group}</span>
                    {open ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
                  </button>
                  {open && (
                    <div className="divide-y divide-slate-100">
                      {layers.map((layer) => {
                        const on = activeLayers[layer.key];
                        return (
                          <div key={layer.key} className="px-3 py-2.5">
                            <div className="flex items-start gap-2">
                              <button
                                onClick={() => {
                                  setActiveLayers(prev => {
                                    const next = { ...prev };
                                    if (layer.group === "Biophysical") {
                                      // Mutually exclusive biophysical layers
                                      LAYERS.filter(ly => ly.group === "Biophysical").forEach(ly => {
                                        next[ly.key] = false;
                                      });
                                    }
                                    next[layer.key] = !on;
                                    return next;
                                  });
                                }}
                                className={`mt-0.5 size-4 rounded flex items-center justify-center transition ${on ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-400"}`}
                              >
                                {on ? <Eye className="size-2.5" /> : <EyeOff className="size-2.5" />}
                              </button>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-medium text-slate-800">{layer.label}</div>
                                <div className="text-[10px] text-slate-400">{layer.desc}</div>
                              </div>
                            </div>
                            {on && (
                              <div className="mt-2 ml-6 space-y-2">
                                <div>
                                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                                    <span>Opacity</span><span>{Math.round(opacity[layer.key] * 100)}%</span>
                                  </div>
                                  <input
                                    type="range" min={0} max={100} value={opacity[layer.key] * 100}
                                    onChange={(e) => setOpacity({ ...opacity, [layer.key]: Number(e.target.value) / 100 })}
                                    className="w-full h-1 accent-emerald-600"
                                  />
                                </div>
                                <div className="space-y-1">
                                  {layer.legend.map((l) => (
                                    <div key={l.label} className="flex items-center gap-2 text-[10px] text-slate-500">
                                      <span className="size-2.5 rounded-sm border border-slate-100" style={{ background: l.color }} />
                                      <span>{l.label}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}

function FlyTo({ position }: { position: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(position, 17, { duration: 1.2 });
  }, [position[0], position[1]]);
  return null;
}

// Fix default leaflet marker icon
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});
