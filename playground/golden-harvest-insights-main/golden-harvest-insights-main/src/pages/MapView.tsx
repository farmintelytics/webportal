import { useMemo, useState } from "react";
import { blocks, ageClassColor, ageClassLabel, type Block } from "@/lib/mock-data";
import { StatusBadge } from "@/components/StatusBadge";
import { Layers, X, Calendar, AlertTriangle, FileText, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

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
  if (b.bsrRisk === "high") return "var(--color-disease)";
  if (activeLayer === "bsr") {
    if (b.bsrRisk === "medium") return "var(--color-aging)";
    return "var(--color-peak)";
  }
  if (activeLayer === "yield") {
    if (b.ffbYield === 0) return "var(--color-immature)";
    if (b.ffbYield >= 22) return "var(--color-canopy)";
    if (b.ffbYield >= 16) return "var(--color-peak)";
    if (b.ffbYield >= 10) return "var(--color-aging)";
    return "var(--color-replant)";
  }
  if (activeLayer === "cire") {
    if (b.cire >= 1.6) return "var(--color-canopy)";
    if (b.cire >= 1.2) return "var(--color-aging)";
    return "var(--color-disease)";
  }
  return ageClassColor[b.ageClass];
}

export function MapView() {
  const [selected, setSelected] = useState<Block | null>(blocks[6]);
  const [layersOpen, setLayersOpen] = useState(true);
  const [active, setActive] = useState<Record<string, boolean>>({
    ndvi: true, boundaries: true, bsr: true,
  });
  const [opacity, setOpacity] = useState(70);
  const [time, setTime] = useState(23);

  const primaryLayer: LayerKey = (active.bsr ? "bsr" : active.yield ? "yield" : active.cire ? "cire" : "ndvi");

  const stats = useMemo(() => ({
    total: blocks.length,
    healthy: blocks.filter(b => b.bsrRisk === "low" && b.ageClass !== "declining").length,
    risk: blocks.filter(b => b.bsrRisk !== "low").length,
  }), []);

  return (
    <div className="relative h-full w-full">
      {/* Faux satellite map */}
      <div className="absolute inset-0 bg-[#1a2818]">
        <svg viewBox="0 0 1000 700" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#2d3a25" strokeWidth="0.5"/>
            </pattern>
            <radialGradient id="terrain" cx="40%" cy="40%" r="80%">
              <stop offset="0%" stopColor="#3a4a2c"/>
              <stop offset="50%" stopColor="#2d3a25"/>
              <stop offset="100%" stopColor="#1a2818"/>
            </radialGradient>
            <filter id="noise"><feTurbulence baseFrequency="0.9" numOctaves="2" /><feColorMatrix values="0 0 0 0 0.15  0 0 0 0 0.2  0 0 0 0 0.1  0 0 0 0.15 0"/></filter>
          </defs>
          <rect width="1000" height="700" fill="url(#terrain)"/>
          <rect width="1000" height="700" filter="url(#noise)" opacity="0.4"/>
          <rect width="1000" height="700" fill="url(#grid)" opacity="0.3"/>

          {/* Rivers */}
          <path d="M 0 350 Q 200 320 400 380 T 1000 360" stroke="#3b5a7a" strokeWidth="6" fill="none" opacity="0.6"/>
          <path d="M 500 0 Q 480 200 520 400 T 540 700" stroke="#3b5a7a" strokeWidth="4" fill="none" opacity="0.5"/>

          {/* Block polygons */}
          {blocks.map((b) => {
            const isSelected = selected?.id === b.id;
            const fill = blockColor(b, primaryLayer);
            const points = b.polygon.map(p => p.join(",")).join(" ");
            return (
              <g key={b.id} className="cursor-pointer" onClick={() => setSelected(b)}>
                <polygon
                  points={points}
                  fill={fill}
                  fillOpacity={opacity / 100}
                  stroke={isSelected ? "#ffffff" : "#000000"}
                  strokeWidth={isSelected ? 2.5 : 1}
                  strokeOpacity={isSelected ? 1 : 0.5}
                />
                <text
                  x={b.centroid[0]} y={b.centroid[1]}
                  textAnchor="middle" dominantBaseline="central"
                  fill="white" fontSize="11" fontWeight="600"
                  className="font-mono pointer-events-none"
                  style={{ textShadow: "0 1px 2px rgba(0,0,0,0.8)" }}
                >
                  {b.id}
                </text>
                {b.bsrRisk === "high" && (
                  <circle cx={b.centroid[0] + 22} cy={b.centroid[1] - 22} r="6" fill="var(--color-disease)" stroke="white" strokeWidth="1.5"/>
                )}
              </g>
            );
          })}

          {/* Estate labels */}
          <text x="280" y="180" fill="#D1D5AE" fontSize="14" fontWeight="600" opacity="0.8">ONDO ESTATE ALPHA</text>
          <text x="660" y="180" fill="#D1D5AE" fontSize="14" fontWeight="600" opacity="0.8">CROSS RIVER ESTATE BETA</text>
        </svg>
      </div>

      {/* Top status pill */}
      <div className="absolute top-4 left-4 flex gap-2">
        <div className="bg-card/95 backdrop-blur border border-border rounded-md px-3 py-2 text-xs flex items-center gap-2 shadow-sm">
          <MapPin className="h-3.5 w-3.5 text-primary" />
          <span className="font-medium">6.5°N, 5.5°E · Edo / Cross River</span>
        </div>
        <div className="bg-card/95 backdrop-blur border border-border rounded-md px-3 py-2 text-xs shadow-sm">
          <span className="text-muted-foreground">Blocks:</span> <span className="font-semibold">{stats.total}</span>
          <span className="mx-2 text-border">|</span>
          <span className="text-muted-foreground">Healthy:</span> <span className="font-semibold text-[var(--color-canopy)]">{stats.healthy}</span>
          <span className="mx-2 text-border">|</span>
          <span className="text-muted-foreground">At Risk:</span> <span className="font-semibold text-destructive">{stats.risk}</span>
        </div>
      </div>

      {/* Layer panel */}
      <button
        onClick={() => setLayersOpen(!layersOpen)}
        className="absolute top-4 right-4 z-10 bg-card border border-border rounded-md p-2 shadow-md hover:bg-muted"
        aria-label="Toggle layers"
      >
        <Layers className="h-4 w-4" />
      </button>

      {layersOpen && (
        <div className="absolute top-16 right-4 w-72 max-h-[calc(100vh-200px)] bg-card border border-border rounded-lg shadow-xl flex flex-col">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-semibold">Map Layers</h3>
            <button onClick={() => setLayersOpen(false)}><X className="h-4 w-4 text-muted-foreground"/></button>
          </div>
          <div className="px-4 py-3 border-b border-border">
            <label className="text-[11px] text-muted-foreground">Layer Opacity · {opacity}%</label>
            <input type="range" min={0} max={100} value={opacity} onChange={e => setOpacity(+e.target.value)} className="w-full accent-primary"/>
          </div>
          <div className="overflow-auto flex-1 p-2 space-y-3">
            {LAYER_GROUPS.map(group => (
              <div key={group.title}>
                <div className="px-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">{group.title}</div>
                <div className="space-y-0.5">
                  {group.layers.map(l => (
                    <label key={l.key} className="flex items-start gap-2 px-2 py-1.5 rounded hover:bg-muted cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!active[l.key]}
                        onChange={e => setActive({ ...active, [l.key]: e.target.checked })}
                        className="mt-0.5 accent-primary"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium">{l.label}</div>
                        <div className="text-[10px] text-muted-foreground">{l.sub}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <div className="border-t border-border pt-3 px-2">
              <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Legend · Stand Age</div>
              <div className="space-y-1">
                {Object.entries(ageClassLabel).map(([k, v]) => (
                  <div key={k} className="flex items-center gap-2 text-[11px]">
                    <span className="h-3 w-3 rounded-sm" style={{ background: ageClassColor[k as keyof typeof ageClassColor] }} />
                    <span>{v}</span>
                  </div>
                ))}
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="h-3 w-3 rounded-sm bg-destructive"/><span>BSR Disease Risk</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Block detail card */}
      {selected && (
        <div className="absolute top-4 right-[19.5rem] w-80 bg-card border border-border rounded-lg shadow-xl">
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

            {/* NDVI sparkline */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">NDVI · 24mo</span>
                <span className="font-mono font-semibold">{selected.ndvi.toFixed(2)}</span>
              </div>
              <svg viewBox="0 0 100 30" className="w-full h-10">
                <polyline
                  fill="none" stroke="var(--color-canopy)" strokeWidth="1.5"
                  points={selected.ndviTrend.map((v, i) => `${(i / 23) * 100},${30 - ((v - 0.3) / 0.6) * 28}`).join(" ")}
                />
              </svg>
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

      {/* Time slider */}
      <div className="absolute bottom-4 left-4 right-4 bg-card/95 backdrop-blur border border-border rounded-lg shadow-md px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary"/>
            <span className="text-xs font-semibold">Sentinel-2 Acquisition</span>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-xs font-mono">{SEASONS[time]}</span>
          </div>
          <span className="text-[10px] text-muted-foreground">24-month window · scrub to update layers</span>
        </div>
        <input
          type="range" min={0} max={23} value={time} onChange={e => setTime(+e.target.value)}
          className="w-full accent-primary"
        />
      </div>
    </div>
  );
}
