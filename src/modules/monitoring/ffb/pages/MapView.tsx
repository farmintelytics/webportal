import { useMemo, useState, useEffect } from "react";
import { MapContainer, TileLayer, Polygon, Tooltip, useMap } from "react-leaflet";
import { blocks, ageClassColor, ageClassLabel, type Block, mapCenter } from "../lib/mock-data";
import { StatusBadge } from "../components/StatusBadge";
import { Layers, X, Calendar, AlertTriangle, FileText, MapPin, Search } from "lucide-react";
import { cn } from "@monitoring-shared/lib/utils";
import L from "leaflet";

type LayerKey =
  | "ndvi" | "evi" | "cire" | "lai" | "lswi" | "bsi"
  | "boundaries" | "standAge" | "suitability" | "yield" | "harvest"
  | "bsr" | "drought" | "rainfall" | "lst";

const LAYER_GROUPS: { title: string; layers: { key: LayerKey; label: string; sub: string }[] }[] = [
  {
    title: "Biophysical",
    layers: [
      { key: "ndvi", label: "NDVI", sub: "Sentinel-2 · 10m canopy density" },
      { key: "evi", label: "EVI", sub: "Reduces saturation in dense canopy" },
      { key: "cire", label: "Red-Edge CIre", sub: "Chlorophyll / nutrient status" },
      { key: "lai", label: "LAI", sub: "Leaf Area Index" },
      { key: "lswi", label: "LSWI", sub: "Canopy water content" },
      { key: "bsi", label: "BSI", sub: "Bare soil — replant detection" },
    ],
  },
  {
    title: "Operational",
    layers: [
      { key: "boundaries", label: "Block Boundaries", sub: "Estate parcels" },
      { key: "standAge", label: "Stand Age Map", sub: "Years since planting" },
      { key: "suitability", label: "Planting Suitability", sub: "Soil + climate + slope" },
      { key: "yield", label: "FFB Yield Forecast", sub: "t/ha per block" },
      { key: "harvest", label: "Harvest Schedule", sub: "Next harvest window" },
    ],
  },
  {
    title: "Disease & Stress",
    layers: [
      { key: "bsr", label: "BSR Risk Map", sub: "Basal Stem Rot — Ganoderma" },
      { key: "drought", label: "Drought Index (VHI)", sub: "MODIS-derived" },
      { key: "rainfall", label: "Rainfall Anomaly", sub: "CHIRPS vs 10-yr normal" },
      { key: "lst", label: "LST Heat Stress", sub: "MODIS surface temp" },
    ],
  },
];

const SEASONS = [
  "Dry · Jan '24","Dry · Feb '24","Wet onset · Mar '24","Wet · Apr '24","Wet · May '24","Wet · Jun '24",
  "Wet · Jul '24","Wet · Aug '24","Wet · Sep '24","Peak Production · Oct '24","Dry onset · Nov '24","Dry · Dec '24",
  "Dry · Jan '25","Dry · Feb '25","Wet onset · Mar '25","Wet · Apr '25","Wet · May '25","Wet · Jun '25",
  "Wet · Jul '25","Wet · Aug '25","Wet · Sep '25","Peak Production · Oct '25","Dry onset · Nov '25","Now · Dec '25",
];

function blockColor(b: Block, activeLayer: LayerKey): string {
  if (b.bsrRisk === "high") return "#dc2626";
  if (activeLayer === "bsr") {
    if (b.bsrRisk === "medium") return "#f59e0b";
    return "#16a34a";
  }
  if (activeLayer === "yield") {
    if (b.ffbYield === 0) return "#a3e635";
    if (b.ffbYield >= 22) return "#15803d";
    if (b.ffbYield >= 16) return "#16a34a";
    if (b.ffbYield >= 10) return "#f59e0b";
    return "#78716c";
  }
  if (activeLayer === "cire") {
    if (b.cire >= 1.6) return "#15803d";
    if (b.cire >= 1.2) return "#f59e0b";
    return "#dc2626";
  }
  const ageColors: Record<string, string> = {
    immature: "#a3e635",
    young: "#4ade80",
    peak: "#16a34a",
    aging: "#ca8a04",
    declining: "#78716c"
  };
  return ageColors[b.ageClass] || "#16a34a";
}

function FitBounds() {
  const map = useMap();
  useEffect(() => {
    const all = blocks.flatMap((b) => b.polygon) as [number, number][];
    if (all.length) map.fitBounds(all, { padding: [40, 40] });
  }, [map]);
  return null;
}

export function MapView() {
  const [selected, setSelected] = useState<Block | null>(blocks[6]);
  const [layersOpen, setLayersOpen] = useState(true);
  const [active, setActive] = useState<Record<string, boolean>>({
    ndvi: true, boundaries: true, bsr: true,
  });
  const [opacity, setOpacity] = useState<Record<string, number>>({});
  const [source, setSource] = useState<"sentinel" | "landsat">("sentinel");
  const [time, setTime] = useState(23);

  const primaryLayer: LayerKey = (active.bsr ? "bsr" : active.yield ? "yield" : active.cire ? "cire" : "ndvi");

  const stats = useMemo(() => ({
    total: blocks.length,
    healthy: blocks.filter(b => b.bsrRisk === "low" && b.ageClass !== "declining").length,
    risk: blocks.filter(b => b.bsrRisk !== "low").length,
  }), []);

  return (
    <div className="relative h-full w-full">
      <MapContainer center={mapCenter} zoom={13} className="h-full w-full" zoomControl={false}>
        <TileLayer 
          attribution="&copy; Esri World Imagery"
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
        <TileLayer 
          attribution="&copy; Esri Boundaries"
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
          opacity={0.6}
        />
        <FitBounds />
        {blocks.map((b) => {
          const isSelected = selected?.id === b.id;
          const fill = blockColor(b, primaryLayer);
          const layerOpacity = opacity[primaryLayer] ?? 70;
          return (
            <Polygon
              key={b.id}
              positions={b.polygon}
              pathOptions={{
                fillColor: fill,
                fillOpacity: layerOpacity / 100,
                color: isSelected ? "#ffffff" : "#000000",
                weight: isSelected ? 3 : 1,
                opacity: 0.5
              }}
              eventHandlers={{ click: () => setSelected(b) }}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={0.9}>
                <div className="text-xs font-semibold">
                  {b.id} · {b.estate}
                  <div className="font-normal opacity-80">{ageClassLabel[b.ageClass]}</div>
                </div>
              </Tooltip>
            </Polygon>
          );
        })}
      </MapContainer>

      {/* Top Floating Controls */}
      <div className="absolute top-4 left-4 right-4 z-[500] flex items-start justify-between pointer-events-none">
        <div className="flex flex-col gap-3 pointer-events-auto">
          {/* Time Filter (Top) */}
          <div className="bg-white border border-border rounded-xl shadow-md px-4 py-2.5 w-[420px]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-primary"/>
                <span className="text-[11px] font-bold uppercase tracking-wider">Imagery Explorer</span>
                <span className="text-xs text-primary font-mono font-bold">{SEASONS[time]}</span>
              </div>
              <div className="flex bg-muted p-0.5 rounded-lg">
                <button 
                  onClick={() => setSource("sentinel")}
                  className={cn("px-2 py-0.5 text-[9px] font-bold rounded-md transition-all", source === "sentinel" ? "bg-white shadow-sm text-primary" : "text-muted-foreground")}
                >SENTINEL</button>
                <button 
                  onClick={() => setSource("landsat")}
                  className={cn("px-2 py-0.5 text-[9px] font-bold rounded-md transition-all", source === "landsat" ? "bg-white shadow-sm text-primary" : "text-muted-foreground")}
                >LANDSAT</button>
              </div>
            </div>
            <input
              type="range" min={0} max={23} value={time} onChange={e => setTime(+e.target.value)}
              className="w-full h-1.5 accent-primary appearance-none bg-muted rounded-full cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Layer panel */}
      <button
        onClick={() => setLayersOpen(!layersOpen)}
        className="absolute top-4 right-4 z-[500] bg-card border border-border rounded-md p-2 shadow-md hover:bg-muted"
        aria-label="Toggle layers"
      >
        <Layers className="h-4 w-4" />
      </button>

      {layersOpen && (
        <div className="absolute top-16 right-4 z-[500] w-72 max-h-[calc(100vh-100px)] bg-card border border-border rounded-lg shadow-xl flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-semibold">Intelligence Layers</h3>
            <button onClick={() => setLayersOpen(false)}><X className="h-4 w-4 text-muted-foreground"/></button>
          </div>
          <div className="overflow-auto flex-1 p-2 space-y-3">
            {LAYER_GROUPS.map(group => (
              <div key={group.title}>
                <div className="px-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 mt-2">{group.title}</div>
                <div className="space-y-0.5">
                  {group.layers.map(l => {
                    const isActive = !!active[l.key];
                    return (
                      <div key={l.key} className={cn("px-2 py-1 rounded transition-colors", isActive && "bg-muted/50")}>
                        <label className="flex items-start gap-2 py-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isActive}
                            onChange={e => setActive({ ...active, [l.key]: e.target.checked })}
                            className="mt-1 accent-primary"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold">{l.label}</div>
                            <div className="text-[10px] text-muted-foreground">{l.sub}</div>
                          </div>
                        </label>
                        {isActive && (
                          <div className="pl-6 pb-2 space-y-2">
                            <div className="pt-1">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-[9px] font-bold text-muted-foreground uppercase">Opacity</span>
                                <span className="text-[9px] font-bold">{opacity[l.key] ?? 70}%</span>
                              </div>
                              <input 
                                type="range" min={0} max={100} 
                                value={opacity[l.key] ?? 70} 
                                onChange={e => setOpacity({ ...opacity, [l.key]: +e.target.value })}
                                className="w-full h-1 accent-primary appearance-none bg-muted rounded-full cursor-pointer"
                              />
                            </div>
                            {/* Inline Legend for specific layers */}
                            {l.key === "standAge" && (
                              <div className="space-y-1">
                                {Object.entries(ageClassLabel).map(([k, v]) => (
                                  <div key={k} className="flex items-center gap-2 text-[10px]">
                                    <span className="h-2 w-2 rounded-full" style={{ background: ageClassColor[k as keyof typeof ageClassColor] }} />
                                    <span className="text-muted-foreground">{v}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                            {l.key === "yield" && (
                              <div className="flex items-center gap-3 text-[9px] font-bold">
                                <div className="flex items-center gap-1"><span className="h-2 w-2 bg-[#15803d] rounded-full"/>High</div>
                                <div className="flex items-center gap-1"><span className="h-2 w-2 bg-[#f59e0b] rounded-full"/>Med</div>
                                <div className="flex items-center gap-1"><span className="h-2 w-2 bg-[#78716c] rounded-full"/>Low</div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

          </div>
        </div>
      )}

      {/* Block detail card */}
      {selected && (
        <div className="absolute top-4 right-[19.5rem] z-[500] w-80 bg-card border border-border rounded-lg shadow-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold font-mono">{selected.id}</h3>
                <StatusBadge variant={selected.ageClass}>{ageClassLabel[selected.ageClass]}</StatusBadge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{selected.estate} · Planted {selected.plantingYear}</p>
            </div>
            <button onClick={() => setSelected(null)}><X className="h-4 w-4 text-muted-foreground"/></button>
          </div>
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-md bg-muted/60 p-2">
                <div className="text-[10px] uppercase text-muted-foreground tracking-wider">Age</div>
                <div className="font-semibold text-sm">{selected.age}y</div>
              </div>
              <div className="rounded-md bg-muted/60 p-2">
                <div className="text-[10px] uppercase text-muted-foreground tracking-wider">Area</div>
                <div className="font-semibold text-sm">{selected.areaHa}ha</div>
              </div>
              <div className="rounded-md bg-muted/60 p-2">
                <div className="text-[10px] uppercase text-muted-foreground tracking-wider">Palms</div>
                <div className="font-semibold text-sm">{selected.palmCount.toLocaleString()}</div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">NDVI Trend (24mo)</span>
                <span className="font-mono font-semibold">{selected.ndvi.toFixed(2)}</span>
              </div>
              <div className="h-10 w-full bg-muted/30 rounded flex items-end gap-0.5 p-1">
                {selected.ndviTrend.map((v, i) => (
                  <div key={i} className="flex-1 bg-primary/40 rounded-t-sm" style={{ height: `${(v - 0.2) * 120}%` }} />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between"><span className="text-muted-foreground">CIre</span><span className="font-mono">{selected.cire.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">LSWI</span><span className="font-mono">{selected.lswi.toFixed(2)}</span></div>
              <div className="flex justify-between items-center col-span-2"><span className="text-muted-foreground">BSR Risk</span><StatusBadge variant={selected.bsrRisk}>{selected.bsrRisk.toUpperCase()}</StatusBadge></div>
            </div>

            <div className="border-t border-border pt-3 space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-muted-foreground">Predicted FFB</span>
                <span className="text-lg font-semibold text-primary">{selected.ffbYield} <span className="text-xs text-muted-foreground">t/ha</span></span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Last harvest</span>
                <span>{selected.lastHarvest}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Next window</span>
                <span className={cn(selected.overdue && "text-destructive font-semibold")}>
                  {selected.overdue ? "Overdue · 3 weeks" : selected.nextHarvestWeeks === 0 ? "This week" : `In ${selected.nextHarvestWeeks} wk`}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1.5 pt-2">
              <button className="text-[11px] px-2 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-1"><FileText className="h-3 w-3"/>Report</button>
              <button className="text-[11px] px-2 py-1.5 rounded-md bg-muted hover:bg-muted/70 flex items-center justify-center gap-1"><AlertTriangle className="h-3 w-3"/>Flag</button>
              <button className="text-[11px] px-2 py-1.5 rounded-md bg-muted hover:bg-muted/70 flex items-center justify-center gap-1"><Calendar className="h-3 w-3"/>Log</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function KpiPill({ label, value, tone }: { label: string; value: string; tone?: "warn" | "success" }) {
  return (
    <div className={cn(
      "rounded-full border border-border bg-white px-3 py-1.5 text-xs shadow-sm",
      tone === "warn" && "text-destructive font-bold",
      tone === "success" && "text-primary font-bold"
    )}>
      <span className="flex items-center gap-1.5">
        <span className="text-muted-foreground font-normal">{label}</span>
        <span>{value}</span>
      </span>
    </div>
  );
}
