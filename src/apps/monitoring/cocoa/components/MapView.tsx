import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Polygon, LayersControl, Tooltip as LeafletTooltip, useMap, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { blocks, type HealthClass, type Block } from "../lib/cocoa-data";
import { Layers, Search, X, Eye, EyeOff, Crosshair, ChevronDown, ChevronRight, Calendar } from "lucide-react";
import { cn } from "@monitoring-shared/lib/utils";


// Schematic farm geographic coords centered on Ashanti, Ghana cocoa region
const FARM_CENTER: [number, number] = [6.685, -1.625];

// Generate realistic-looking polygon coords for each block (small offsets in degrees)
const blockShapes: Record<string, [number, number][]> = {
  B1: [[6.690, -1.632], [6.692, -1.628], [6.689, -1.625], [6.686, -1.628], [6.687, -1.631]],
  B2: [[6.692, -1.628], [6.694, -1.624], [6.691, -1.621], [6.689, -1.625]],
  B3: [[6.694, -1.624], [6.696, -1.620], [6.693, -1.617], [6.691, -1.621]],
  B4: [[6.696, -1.620], [6.698, -1.616], [6.695, -1.613], [6.693, -1.617]],
  B5: [[6.686, -1.628], [6.689, -1.625], [6.687, -1.621], [6.683, -1.620], [6.682, -1.625]],
  B6: [[6.689, -1.625], [6.691, -1.621], [6.689, -1.617], [6.687, -1.621]],
  B7: [[6.691, -1.621], [6.693, -1.617], [6.690, -1.614], [6.689, -1.617]],
  B8: [[6.693, -1.617], [6.695, -1.613], [6.692, -1.610], [6.690, -1.614]],
};

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
    legend: [{ color: "#1e40af", label: "Boundary outline" }] },
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
      { color: "#1d4ed8", label: "≥ 480 mm" },
      { color: "#60a5fa", label: "400–480 mm" },
      { color: "#fde68a", label: "< 400 mm" },
    ] },
];

const colorForLayer = (b: Block, key: LayerKey): string => {
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
    case "boundaries": return "#1e40af";
  }
};

interface Props {
  selected?: string;
  onSelect?: (id: string) => void;
}

export function MapView({ selected, onSelect }: Props) {
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
  const [timeIndex, setTimeIndex] = useState(11);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    return blocks.filter((b) => b.name.toLowerCase().includes(search.toLowerCase()) || b.id.toLowerCase().includes(search.toLowerCase())).slice(0, 5);
  }, [search]);

  const activeLayerDefs = LAYERS.filter((l) => activeLayers[l.key]);
  const primaryFillLayer = activeLayerDefs.find((l) => l.key !== "boundaries");

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={FARM_CENTER}
        zoom={15}
        scrollWheelZoom
        className="w-full h-full"
        style={{ background: "var(--secondary)" }}
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

        {blocks.map((b) => {
          const fillKey = primaryFillLayer?.key ?? "boundaries";
          const fillColor = colorForLayer(b, fillKey);
          const isSel = selected === b.id;
          const showFill = !!primaryFillLayer;
          return (
            <Polygon
              key={b.id}
              positions={blockShapes[b.id]}
              eventHandlers={{ click: () => onSelect?.(b.id) }}
              pathOptions={{
                color: activeLayers.boundaries ? "#1e40af" : fillColor,
                weight: isSel ? 3 : activeLayers.boundaries ? 1.5 : 0.5,
                fillColor,
                fillOpacity: showFill ? (primaryFillLayer ? opacity[primaryFillLayer.key] : 0.5) : 0.05,
                dashArray: isSel ? "" : undefined,
              }}
            >
              <LeafletTooltip direction="center" permanent className="block-tooltip">
                <span style={{ fontSize: 10, fontWeight: 700, color: "#fff", textShadow: "0 1px 2px rgba(0,0,0,.7)" }}>{b.id}</span>
              </LeafletTooltip>
              <Popup>
                <div style={{ minWidth: 180 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{b.name}</div>
                  <div style={{ fontSize: 11, color: "#555" }}>{b.area} ha · {b.health}</div>
                  <div style={{ marginTop: 6, fontSize: 11 }}>
                    NDVI {b.ndvi.toFixed(2)} · NDRE {b.ndre.toFixed(2)}<br />
                    Predicted: {b.predictedYield} kg/ha
                  </div>
                </div>
              </Popup>
            </Polygon>
          );
        })}

        {searchResults.length > 0 && <FlyTo position={blockShapes[searchResults[0].id][0]} />}
      </MapContainer>

      {/* Imagery Explorer (Top) */}
      <div className="absolute top-4 left-4 z-[400] flex items-center gap-2 pointer-events-none">
        <div className="bg-white border border-border rounded-xl shadow-lg px-4 py-3 w-[440px] pointer-events-auto flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-primary"/>
                <span className="text-[10px] font-black uppercase tracking-wider">Imagery Explorer</span>
                <span className="text-xs text-primary font-mono font-bold">{months[timeIndex]} '26</span>
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
            type="range" min={0} max={11} value={timeIndex}
            onChange={e => setTimeIndex(+e.target.value)}
            className="w-full h-1.5 accent-primary appearance-none bg-muted rounded-full cursor-pointer"
          />
        </div>
        <div className="relative w-72 pointer-events-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search farms, plots…"
            className="w-full h-10 pl-9 pr-9 text-sm bg-white border border-border rounded-lg shadow-md focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Layer toggle button */}
      {!panelOpen && (
        <button
          onClick={() => setPanelOpen(true)}
          className="absolute top-3 right-3 z-[400] size-11 rounded-lg bg-white border border-border shadow-md flex items-center justify-center hover:bg-card transition"
          title="Layers"
        >
          <Layers className="size-5 text-foreground" />
        </button>
      )}

      {/* Layer drawer */}
      {panelOpen && (
        <div className="absolute top-3 right-3 z-[400] w-80 max-h-[calc(100%-1.5rem)] flex flex-col bg-white border border-border rounded-lg shadow-xl">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Layers className="size-4 text-primary" />
              <span className="text-sm font-semibold">Map Layers</span>
            </div>
            <button onClick={() => setPanelOpen(false)} className="size-7 rounded hover:bg-secondary flex items-center justify-center">
              <X className="size-4 text-muted-foreground" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {(["Operational", "Monitoring", "Biophysical"] as const).map((group) => {
              const layers = LAYERS.filter((l) => l.group === group);
              const open = openGroups[group];
              return (
                <div key={group} className="rounded-md border border-border/60 overflow-hidden">
                  <button
                    onClick={() => setOpenGroups({ ...openGroups, [group]: !open })}
                    className="w-full flex items-center justify-between px-3 py-2 bg-secondary/40 hover:bg-secondary/60 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                  >
                    <span>{group}</span>
                    {open ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
                  </button>
                  {open && (
                    <div className="divide-y divide-border/60">
                      {layers.map((layer) => {
                        const on = activeLayers[layer.key];
                        return (
                          <div key={layer.key} className="px-3 py-2.5">
                            <div className="flex items-start gap-2">
                              <button
                                onClick={() => setActiveLayers({ ...activeLayers, [layer.key]: !on })}
                                className={`mt-0.5 size-4 rounded flex items-center justify-center transition ${on ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}
                              >
                                {on ? <Eye className="size-2.5" /> : <EyeOff className="size-2.5" />}
                              </button>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-medium text-foreground">{layer.label}</div>
                                <div className="text-[10px] text-muted-foreground">{layer.desc}</div>
                              </div>
                            </div>
                            {on && (
                              <div className="mt-2 ml-6 space-y-2">
                                <div>
                                  <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-0.5">
                                    <span>Opacity</span><span>{Math.round(opacity[layer.key] * 100)}%</span>
                                  </div>
                                  <input
                                    type="range" min={0} max={100} value={opacity[layer.key] * 100}
                                    onChange={(e) => setOpacity({ ...opacity, [layer.key]: Number(e.target.value) / 100 })}
                                    className="w-full h-1 accent-primary"
                                  />
                                </div>
                                <div className="space-y-1">
                                  {layer.legend.map((l) => (
                                    <div key={l.label} className="flex items-center gap-2 text-[10px]">
                                      <span className="size-2.5 rounded-sm border border-border/60" style={{ background: l.color }} />
                                      <span className="text-muted-foreground">{l.label}</span>
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
