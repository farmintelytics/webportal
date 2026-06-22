import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AppLayout } from "../components/AppLayout";
import { MapView, ActiveLayers, LayerId } from "../components/MapView";
import { Plot, alertColors, stageColors, plots } from "../lib/fallbackData";
import {
  Layers, Droplets, Sprout, Activity, X, ChevronRight, MapPin,
  Eye, EyeOff, Satellite, FileText
} from "lucide-react";

import { Dashboard } from "./dashboard";
import { cn } from "@monitoring-shared/lib/utils";
import { fetchPlotsIntelligence } from "../../../../services/agromonitorApi";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — PaddyLens" },
      { name: "description", content: "Interactive paddy field map: NDVI, VHI, LSWI, suitability and yield layers from Sentinel-1/2 and MODIS." },
    ],
  }),
  component: Dashboard,
});

type LayerDef = {
  id: LayerId;
  label: string;
  source: string;
  icon: typeof Layers;
  legend: { color: string; label: string }[];
};

const LAYERS: LayerDef[] = [
  {
    id: "alert", label: "Crop Health (VHI)", source: "MODIS LST + NDVI", icon: Activity,
    legend: [
      { color: alertColors.healthy, label: "Healthy" },
      { color: alertColors.stressed, label: "Stressed" },
      { color: alertColors.critical, label: "Critical" },
    ],
  },
  {
    id: "ndvi", label: "NDVI Vegetation", source: "Sentinel-2 MSI", icon: Sprout,
    legend: [
      { color: "#15803d", label: "High > 0.7" },
      { color: "#84cc16", label: "Medium 0.5–0.7" },
      { color: "#f59e0b", label: "Low 0.35–0.5" },
      { color: "#a16207", label: "Bare < 0.35" },
    ],
  },
  {
    id: "lswi", label: "Water Index (LSWI)", source: "Sentinel-2 SWIR", icon: Droplets,
    legend: [
      { color: "#1e40af", label: "Flooded" },
      { color: "#3b82f6", label: "Saturated" },
      { color: "#93c5fd", label: "Moist" },
      { color: "#fde68a", label: "Dry" },
    ],
  },
  {
    id: "stage", label: "Growth Stage", source: "S1 SAR + S2 NDVI", icon: Layers,
    legend: Object.entries(stageColors).slice(0, 4).map(([label, color]) => ({ label, color })),
  },
  {
    id: "yield", label: "Predicted Yield", source: "GeoAI ensemble", icon: Sprout,
    legend: [
      { color: "#15803d", label: "> 5 t/ha" },
      { color: "#84cc16", label: "4–5 t/ha" },
      { color: "#f59e0b", label: "3–4 t/ha" },
      { color: "#dc2626", label: "< 3 t/ha" },
    ],
  },
  {
    id: "suitability", label: "Planting Suitability", source: "Soil + climate + DEM", icon: MapPin,
    legend: [
      { color: "#15803d", label: "High" },
      { color: "#f59e0b", label: "Moderate" },
      { color: "#dc2626", label: "Low" },
    ],
  },
];

export function MapHome() {
  const [open, setOpen] = useState(true);
  const [basemap, setBasemap] = useState<"satellite" | "street" | "terrain">("satellite");
  const [active, setActive] = useState<ActiveLayers>({ alert: 0.7 });
  const [expanded, setExpanded] = useState<LayerId | null>("alert");
  const [sel, setSel] = useState<Plot | null>(null);
  const [source, setSource] = useState<"sentinel" | "landsat">("sentinel");
  const [date, setDate] = useState("Now · Dec '25");
  const [plotsData, setPlotsData] = useState<Plot[]>(plots);

  useEffect(() => {
    fetchPlotsIntelligence()
      .then((res) => {
        if (res && res.length > 0) {
          const mapped = res.map((p: any) => {
            let polygon: [number, number][] = [];
            if (p.boundary && p.boundary.coordinates && p.boundary.coordinates[0]) {
              polygon = p.boundary.coordinates[0].map(([lng, lat]: [number, number]) => [lat, lng]);
            }
            const latSum = polygon.reduce((s, pt) => s + pt[0], 0);
            const lngSum = polygon.reduce((s, pt) => s + pt[1], 0);
            const centroid: [number, number] = polygon.length > 0
              ? [latSum / polygon.length, lngSum / polygon.length]
              : [10.45, 105.63];

            const ndvi = p.indices?.ndvi ?? 0.65;
            const ndmi = p.indices?.ndmi ?? 0.45;
            const alert = p.indices?.uas_anomaly_score > 0.4 ? "critical" : p.indices?.uas_anomaly_score > 0.15 ? "stressed" : "healthy";

            return {
              id: p.plot_id,
              name: p.name,
              area: p.area_ha ?? 10.0,
              polygon,
              centroid,
              suitability: ndvi > 0.6 ? "High" : ndvi > 0.4 ? "Moderate" : "Low",
              suitabilityScore: Math.round(ndvi * 100),
              ndvi,
              ndre: +(ndvi * 0.7).toFixed(2),
              lswi: ndmi,
              vhi: Math.round(ndvi * 100),
              stage: p.stage ?? "Vegetative",
              daysSincePlanting: 45,
              predictedYield: +(ndvi * 5.2).toFixed(2),
              lastSeasonYield: +(ndvi * 4.8).toFixed(2),
              alert,
              recommendedPlanting: "May",
              soilScore: 85,
              waterScore: 80,
              climateScore: 78,
            };
          });
          setPlotsData(mapped);
        }
      })
      .catch((err) => console.error("Error fetching plots intelligence:", err));
  }, []);

  const toggle = (id: LayerId) => {
    setActive((a) => {
      const next = { ...a };
      if (next[id] !== undefined) delete next[id];
      else next[id] = 0.7;
      return next;
    });
    setExpanded(id);
  };

  const setOpacity = (id: LayerId, v: number) =>
    setActive((a) => ({ ...a, [id]: v }));

  return (
    <AppLayout title="Map View" subtitle="Sentinel-1 · Sentinel-2 · MODIS · CHIRPS · SoilGrids">
      <div className="relative rounded-xl border border-border bg-card overflow-hidden shadow-soft" style={{ height: "calc(100vh - 180px)", minHeight: 560 }}>
        <MapView layers={active} basemap={basemap} onSelect={setSel} selectedId={sel?.id} plots={plotsData} />

        {/* Imagery Explorer (Top Left) */}
        <div className="absolute top-4 left-4 z-[1000] pointer-events-none">
          <div className="bg-white border border-border rounded-xl shadow-glow px-4 py-2.5 w-[380px] pointer-events-auto">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Satellite className="h-3.5 w-3.5 text-primary"/>
                <span className="text-[10px] font-black uppercase tracking-wider">Imagery Explorer</span>
                <span className="text-xs text-primary font-mono font-bold">{date}</span>
              </div>
            <div className="flex items-center justify-between gap-4 mt-2">
              <div className="flex bg-muted p-0.5 rounded-lg flex-1">
                {(["satellite", "street", "terrain"] as const).map((b) => (
                  <button
                    key={b}
                    onClick={() => setBasemap(b)}
                    className={cn(
                      "flex-1 px-2 py-1 text-[9px] font-black rounded-md transition-all uppercase",
                      basemap === b ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {b === "street" ? "STREETS" : b}
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
            type="range" min={0} max={23} defaultValue={23}
            onChange={e => setDate(`Month ${e.target.value} · 2025`)}
            className="w-full h-1.5 accent-primary appearance-none bg-muted rounded-full cursor-pointer mt-2"
          />
        </div>
        </div>

        {/* Floating layers panel — right side */}
        <div className={`absolute top-4 right-4 z-[1000] transition-all ${open ? "w-80" : "w-12"}`}>
          {open ? (
            <div className="bg-white border border-border rounded-xl shadow-glow max-h-[calc(100vh-220px)] overflow-y-auto">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border sticky top-0 bg-white">
                <div className="flex items-center gap-2">
                  <Satellite className="size-4 text-primary"/>
                  <h3 className="font-display font-semibold text-sm">Satellite Layers</h3>
                </div>
                <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-accent">
                  <ChevronRight className="size-4"/>
                </button>
              </div>


              <div className="p-2">
                {LAYERS.map((l) => {
                  const Icon = l.icon;
                  const on = active[l.id] !== undefined;
                  const isOpen = expanded === l.id;
                  return (
                    <div key={l.id} className={`rounded-lg mb-1 ${isOpen && on ? "bg-accent/40" : ""}`}>
                      <div className="flex items-center gap-2 px-2.5 py-2">
                        <button
                          onClick={() => toggle(l.id)}
                          className={`size-7 rounded-md grid place-items-center transition ${
                            on ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                          }`}
                          aria-label={on ? "Hide layer" : "Show layer"}
                        >
                          {on ? <Eye className="size-3.5"/> : <EyeOff className="size-3.5"/>}
                        </button>
                        <button
                          onClick={() => setExpanded(isOpen ? null : l.id)}
                          className="flex-1 flex items-center gap-2 text-left"
                        >
                          <Icon className="size-4 text-muted-foreground"/>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{l.label}</div>
                            <div className="text-[10px] text-muted-foreground truncate">{l.source}</div>
                          </div>
                          <ChevronRight className={`size-3.5 text-muted-foreground transition ${isOpen ? "rotate-90" : ""}`}/>
                        </button>
                      </div>
                      {isOpen && (
                        <div className="px-3 pb-3 pt-1 space-y-2.5">
                          {on && (
                            <div>
                              <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                                <span>Transparency</span>
                                <span>{Math.round((active[l.id] as number) * 100)}%</span>
                              </div>
                              <input
                                type="range" min={0.1} max={1} step={0.05}
                                value={active[l.id] as number}
                                onChange={(e) => setOpacity(l.id, +e.target.value)}
                                className="w-full accent-primary"
                              />
                            </div>
                          )}
                          <div className="space-y-1">
                            {l.legend.map((lg) => (
                              <div key={lg.label} className="flex items-center gap-2 text-xs">
                                <span className="size-3 rounded" style={{ background: lg.color }}/>
                                <span className="text-foreground/80">{lg.label}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <button
              onClick={() => setOpen(true)}
              className="size-12 grid place-items-center bg-white border border-border rounded-xl shadow-glow hover:bg-accent"
              title="Open layers"
            >
              <Layers className="size-5 text-primary"/>
            </button>
          )}
        </div>

        {sel && <PlotPanel plot={sel} onClose={() => setSel(null)} />}
      </div>
    </AppLayout>
  );
}

function PlotPanel({ plot, onClose }: { plot: Plot; onClose: () => void }) {
  return (
    <div className="absolute top-4 left-4 w-80 max-h-[calc(100%-2rem)] overflow-y-auto bg-white border border-border rounded-xl shadow-glow p-4 z-[1000]">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-muted-foreground">{plot.id}</div>
          <h4 className="font-display font-semibold text-lg">{plot.name}</h4>
          <div className="text-xs text-muted-foreground">{plot.area} ha · {plot.stage}</div>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-accent rounded"><X className="size-4"/></button>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-3">
        <Stat label="NDVI" value={plot.ndvi} />
        <Stat label="NDRE" value={plot.ndre} />
        <Stat label="LSWI" value={plot.lswi} />
        <Stat label="VHI" value={plot.vhi} />
      </div>
      <div className="mt-3 p-3 rounded-lg bg-muted">
        <div className="text-xs text-muted-foreground">Predicted Yield</div>
        <div className="text-2xl font-display font-semibold">{plot.predictedYield} <span className="text-xs font-sans text-muted-foreground">t/ha</span></div>
        <div className="text-xs text-muted-foreground mt-0.5">Last season: {plot.lastSeasonYield} t/ha</div>
      </div>
      <div className={`mt-3 px-3 py-2 rounded-lg text-xs font-medium ${
        plot.alert === "healthy" ? "bg-healthy/10 text-healthy" :
        plot.alert === "stressed" ? "bg-stress/10 text-stress" : "bg-destructive/10 text-destructive"
      }`}>
        {plot.alert === "healthy" ? "✓ Crop is healthy. No action needed." :
         plot.alert === "stressed" ? "⚠ Stress detected. Inspect irrigation." :
         "⚠ Critical heat/drought stress. Irrigate now."}
      </div>
      <a href={`/reports?plot=${plot.id}`} className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
        <FileText className="size-4"/> Generate plot report
      </a>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-border p-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-display font-semibold text-base">{value}</div>
    </div>
  );
}
