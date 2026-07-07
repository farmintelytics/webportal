import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "../components/AppShell";
import { Card } from "@monitoring-shared/ui/card";
import { Button } from "@monitoring-shared/ui/button";
import { Slider } from "@monitoring-shared/ui/slider";
import { Switch } from "@monitoring-shared/ui/switch";
import { Label } from "@monitoring-shared/ui/label";
import { Badge } from "@monitoring-shared/ui/badge";
import { useState, useEffect, lazy, Suspense } from "react";
import { Layers, ChevronRight, Calendar, Search } from "lucide-react";
import { PLOTS, statusColor, type Plot } from "../lib/farm-data";
import { cn } from "@monitoring-shared/lib/utils";

const FarmMap = lazy(() =>
  import("../components/FarmMap").then((m) => ({ default: m.FarmMap })),
);

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Map View — MaizeRS" },
      {
        name: "description",
        content:
          "Interactive geospatial map of farm plots with NDVI, soil moisture, and stress overlays.",
      },
    ],
  }),
  component: MapPage,
});

const LAYERS = [
  {
    group: "Biophysical",
    items: [
      { id: "ndvi", name: "NDVI", desc: "Sentinel-2 vegetation index" },
      { id: "gcvi", name: "GCVI", desc: "Nitrogen / chlorophyll" },
      { id: "ndre", name: "NDRE", desc: "Red edge — early N stress" },
    ],
  },
  {
    group: "Operational",
    items: [
      { id: "boundaries", name: "Plot Boundaries", desc: "Field outlines" },
      { id: "soil", name: "Soil pH", desc: "SoilGrids 250m" },
      { id: "tillage", name: "NDTI Tillage", desc: "Field preparation" },
    ],
  },
  {
    group: "Monitoring",
    items: [
      { id: "vhi", name: "VHI Stress", desc: "Drought + heat stress" },
      { id: "rainfall", name: "Rainfall (CHIRPS)", desc: "Dekadal totals" },
      { id: "lst", name: "LST Anomaly", desc: "MODIS thermal" },
    ],
  },
];

function PlotMarker({
  plot,
  selected,
  onClick,
}: {
  plot: Plot;
  selected: boolean;
  onClick: () => void;
}) {
  // Project lat/lng to a 1000x600 viewbox
  const x = ((plot.lng - 35.22) / 0.1) * 1000;
  const y = ((-0.49 - plot.lat) / 0.08) * 600;
  const size = Math.max(28, plot.area * 2.2);
  return (
    <g
      onClick={onClick}
      style={{ cursor: "pointer" }}
      transform={`translate(${x},${y})`}
    >
      <circle
        r={size}
        fill={statusColor[plot.status]}
        opacity={selected ? 0.85 : 0.55}
        stroke={selected ? "white" : statusColor[plot.status]}
        strokeWidth={selected ? 4 : 1}
      />
      <text
        textAnchor="middle"
        dy={5}
        fontSize={12}
        fontWeight={700}
        fill="white"
        pointerEvents="none"
      >
        {plot.id}
      </text>
    </g>
  );
}

function MapPage() {
  const { cropSummary, cropBlocks, cropLoading } = useMonitoring();
  
  const plots = useMemo(() => {
    if (!cropBlocks || cropBlocks.length === 0) return [];
    return cropBlocks.map((p: any) => {
      let polygon: [number, number][] = [];
      if (p.geometry && p.geometry.coordinates && p.geometry.coordinates[0]) {
        polygon = p.geometry.coordinates[0].map(([lng, lat]: [number, number]) => [lat, lng]);
      }
      const latSum = polygon.reduce((s, pt) => s + pt[0], 0);
      const lngSum = polygon.reduce((s, pt) => s + pt[1], 0);
      const centroid: [number, number] = polygon.length > 0
        ? [latSum / polygon.length, lngSum / polygon.length]
        : [-0.53, 35.275];

      const ndvi = p.current_indices?.ndvi ?? 0.65;
      const statusAlert = p.health_class === "Critical" ? "Heat Stress" : p.health_class === "Stressed" ? "Drought Risk" : "Healthy";
      return {
        id: p.id,
        name: p.plot_nb ? `Plot ${p.plot_nb}` : p.id,
        area: p.area_ha ?? 10.0,
        ndvi,
        gcvi: p.current_indices?.gndvi ?? +(ndvi * 6.0).toFixed(1),
        ndre: p.current_indices?.ndre ?? +(ndvi * 0.7).toFixed(2),
        vhi: Math.round(ndvi * 100),
        stage: p.stage ?? "Vegetative",
        predictedYield: p.yield_t_ha ?? +(ndvi * 5.2).toFixed(2),
        lastSeasonYield: p.yield_t_ha ? +(p.yield_t_ha * 0.95).toFixed(2) : +(ndvi * 4.8).toFixed(2),
        status: statusAlert as any,
        lat: centroid[0],
        lng: centroid[1],
      };
    });
  }, [cropBlocks]);

  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    if (plots.length > 0 && !selected) {
      setSelected(plots[0]);
    }
  }, [plots, selected]);

  const [active, setActive] = useState<Record<string, boolean>>({
    boundaries: true,
    ndvi: true,
    vhi: false,
  });
  const [layerOpacity, setLayerOpacity] = useState<Record<string, number>>({});
  const [source, setSource] = useState<"sentinel" | "landsat">("sentinel");
  const [basemap, setBasemap] = useState<"satellite" | "terrain" | "streets">("satellite");
  const [date, setDate] = useState("Now · Dec '25");
  const [layerOpen, setLayerOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Zarr raster slider state
  const [timeIndex, setTimeIndex] = useState(0);
  const [sliderData, setSliderData] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [zarrBounds, setZarrBounds] = useState<any>(null);

  const primaryLayer = active.ndvi ? "ndvi" : active.vhi ? "vhi" : "ndvi";
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

  useEffect(() => setMounted(true), []);

  return (
    <AppShell>
      <div className="relative h-[calc(100vh-3.5rem)] overflow-hidden">
        {mounted ? (
          <Suspense
            fallback={
              <div className="absolute inset-0 bg-muted grid place-items-center text-sm text-muted-foreground">
                Loading map…
              </div>
            }
          >
            <FarmMap
              selected={selected || plots[0]}
              onSelect={setSelected}
              showBoundaries={!!active.boundaries}
              showNDVI={!!active.ndvi}
              showVHI={!!active.vhi}
              opacity={layerOpacity.ndvi ?? 70}
              basemap={basemap}
              source={source}
              date={date}
              plots={plots}
              currentTileUrl={currentTileUrl}
              zarrBounds={zarrBounds}
            />
          </Suspense>
        ) : (
          <div className="absolute inset-0 bg-muted" />
        )}

        {/* Imagery Explorer (Top) */}
        <div className="absolute top-4 left-4 right-4 flex items-center gap-2 pointer-events-none z-10">
          <div className="bg-white border border-border rounded-xl shadow-lg px-4 py-3 w-[440px] pointer-events-auto flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
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
                    className={cn(
                      "px-2 py-0.5 text-[9px] font-black rounded-md transition-all",
                      source === "sentinel" ? "bg-white shadow-sm text-emerald-700 font-bold" : "text-muted-foreground"
                    )}
                  >
                    SENTINEL
                  </button>
                  <button
                    onClick={() => setSource("landsat")}
                    className={cn(
                      "px-2 py-0.5 text-[9px] font-black rounded-md transition-all",
                      source === "landsat" ? "bg-white shadow-sm text-emerald-700 font-bold" : "text-muted-foreground"
                    )}
                  >
                    LANDSAT
                  </button>
                </div>
              </div>
            </div>

            <input
              type="range"
              min={0}
              max={100}
              defaultValue={68}
              onChange={(e) => setDate(`Season Day ${e.target.value} · 2026`)}
              className="w-full h-1.5 accent-emerald-600 appearance-none bg-muted rounded-full cursor-pointer"
            />
          </div>
          <div className="flex-1" />
          <Card className="px-3 py-2 flex items-center gap-2 pointer-events-auto shadow-lg bg-white border border-slate-100">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search plot or location"
              className="bg-transparent outline-none text-sm w-48"
            />
          </Card>
        </div>


        {/* Layer panel */}
        <div
          className={`absolute top-20 right-4 bottom-4 w-[340px] z-10 transition-transform ${layerOpen ? "translate-x-0" : "translate-x-[calc(100%+1rem)]"}`}
        >
          <Card className="h-full overflow-hidden flex flex-col shadow-2xl bg-white border border-emerald-100">
            <div className="px-4 py-3 border-b flex items-center justify-between border-slate-100">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-emerald-700" />
                <span className="font-semibold text-sm text-slate-800">Layers</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setLayerOpen(false)}
              >
                <ChevronRight className="h-4 w-4 text-slate-500" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              {LAYERS.map((g) => (
                <div key={g.group}>
                  <p className="text-[10px] uppercase tracking-wider text-emerald-800 font-bold mb-2">
                    {g.group}
                  </p>
                  <div className="space-y-1">
                    {g.items.map((l) => {
                      const on = !!active[l.id];
                      return (
                        <div key={l.id} className={cn("rounded-md transition-colors", on && "bg-emerald-50/20")}>
                          <div className="flex items-start gap-3 p-2">
                            <Switch
                              id={l.id}
                              checked={on}
                              onCheckedChange={(v) =>
                                setActive((a) => ({ ...a, [l.id]: v }))
                              }
                            />
                            <div className="flex-1 min-w-0">
                              <Label htmlFor={l.id} className="text-sm font-bold text-slate-800">
                                {l.name}
                              </Label>
                              <p className="text-[11px] text-slate-400">
                                {l.desc}
                              </p>
                            </div>
                          </div>
                          {on && (
                            <div className="px-4 pb-3 space-y-3">
                              <div>
                                <div className="flex justify-between text-[10px] font-bold uppercase mb-1 text-slate-500">
                                  <span>Opacity</span>
                                  <span>{layerOpacity[l.id] ?? 70}%</span>
                                </div>
                                <input 
                                  type="range" min={0} max={100} 
                                  value={layerOpacity[l.id] ?? 70} 
                                  onChange={e => setLayerOpacity({ ...layerOpacity, [l.id]: +e.target.value })}
                                  className="w-full h-1 accent-emerald-600 appearance-none bg-muted rounded-full cursor-pointer"
                                />
                              </div>
                              {/* Inline Legend for specific layers */}
                              {l.id === "ndvi" && (
                                <div className="flex items-center gap-3 text-[9px] font-bold text-slate-500">
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


              <div className="pt-2 border-t border-slate-100">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2">
                  Legend — Plot Status
                </p>
                <div className="space-y-1.5">
                  {Object.entries(statusColor).map(([k, c]) => (
                    <div key={k} className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                      <div
                        className="h-3 w-3 rounded-sm border border-slate-200"
                        style={{ background: c }}
                      />
                      {k}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Selected plot card */}
            {selected && (
              <div className="border-t p-4 bg-slate-50 border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-xs text-slate-400 font-mono">
                      {selected.id}
                    </p>
                    <p className="font-semibold text-slate-800">{selected.name}</p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-emerald-50 text-emerald-800 border-emerald-100 font-bold uppercase tracking-wider text-[9px]"
                  >
                    {selected.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-[10px] uppercase text-slate-400 font-bold">
                      NDVI
                    </p>
                    <p className="font-mono font-bold text-slate-700">
                      {selected.ndvi.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-slate-400 font-bold">
                      Yield
                    </p>
                    <p className="font-mono font-bold text-slate-700">
                      {selected.predictedYield.toFixed(1)}t
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-slate-400 font-bold">
                      Area
                    </p>
                    <p className="font-mono font-bold text-slate-700">{selected.area}ha</p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>

        {!layerOpen && (
          <Button
            onClick={() => setLayerOpen(true)}
            className="absolute top-20 right-4 z-10 shadow-lg bg-emerald-600 text-white hover:bg-emerald-700"
            size="sm"
          >
            <Layers className="h-4 w-4 mr-2" /> Layers
          </Button>
        )}
      </div>
    </AppShell>
  );
}
