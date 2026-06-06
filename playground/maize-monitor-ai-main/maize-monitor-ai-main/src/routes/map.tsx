import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect, lazy, Suspense } from "react";
import { Layers, ChevronRight, Calendar, Search } from "lucide-react";
import { PLOTS, statusColor, type Plot } from "@/lib/farm-data";
const FarmMap = lazy(() =>
  import("@/components/FarmMap").then((m) => ({ default: m.FarmMap })),
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
  const [selected, setSelected] = useState<Plot>(PLOTS[0]);
  const [active, setActive] = useState<Record<string, boolean>>({
    boundaries: true,
    ndvi: true,
    vhi: false,
  });
  const [opacity, setOpacity] = useState(70);
  const [layerOpen, setLayerOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
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
              selected={selected}
              onSelect={setSelected}
              showBoundaries={!!active.boundaries}
              showNDVI={!!active.ndvi}
              showVHI={!!active.vhi}
              opacity={opacity}
            />
          </Suspense>
        ) : (
          <div className="absolute inset-0 bg-muted" />
        )}

        {/* Top floating bar */}
        <div className="absolute top-4 left-4 right-4 flex items-center gap-2 pointer-events-none z-10">
          <Card className="px-3 py-2 flex items-center gap-2 pointer-events-auto shadow-lg">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search plot or location"
              className="bg-transparent outline-none text-sm w-64"
            />
          </Card>
          <div className="flex-1" />
          <Card className="px-3 py-2 flex items-center gap-2 pointer-events-auto shadow-lg">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Apr 22, 2026</span>
            <Badge variant="secondary" className="ml-2">
              Sentinel-2
            </Badge>
          </Card>
        </div>

        {/* Time slider */}
        <Card className="absolute bottom-4 left-4 right-[360px] px-4 py-3 shadow-lg z-10">
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-1">
            <span>Mar 5</span>
            <Slider
              defaultValue={[68]}
              max={100}
              step={1}
              className="flex-1"
            />
            <span>Apr 30</span>
          </div>
          <div className="text-[11px] text-center text-muted-foreground">
            Slide through season to see vegetation change
          </div>
        </Card>

        {/* Layer panel */}
        <div
          className={`absolute top-20 right-4 bottom-4 w-[340px] z-10 transition-transform ${layerOpen ? "translate-x-0" : "translate-x-[calc(100%+1rem)]"}`}
        >
          <Card className="h-full overflow-hidden flex flex-col shadow-2xl">
            <div className="px-4 py-3 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                <span className="font-semibold text-sm">Layers</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setLayerOpen(false)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              {LAYERS.map((g) => (
                <div key={g.group}>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-2">
                    {g.group}
                  </p>
                  <div className="space-y-2">
                    {g.items.map((l) => (
                      <div
                        key={l.id}
                        className="flex items-start gap-3 p-2 rounded-md hover:bg-accent/30"
                      >
                        <Switch
                          id={l.id}
                          checked={!!active[l.id]}
                          onCheckedChange={(v) =>
                            setActive((a) => ({ ...a, [l.id]: v }))
                          }
                        />
                        <div className="flex-1 min-w-0">
                          <Label htmlFor={l.id} className="text-sm font-medium">
                            {l.name}
                          </Label>
                          <p className="text-[11px] text-muted-foreground">
                            {l.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="pt-2 border-t">
                <Label className="text-xs text-muted-foreground">
                  Layer Opacity — {opacity}%
                </Label>
                <Slider
                  value={[opacity]}
                  onValueChange={(v) => setOpacity(v[0])}
                  max={100}
                  className="mt-2"
                />
              </div>

              <div className="pt-2 border-t">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-2">
                  Legend — Plot Status
                </p>
                <div className="space-y-1.5">
                  {Object.entries(statusColor).map(([k, c]) => (
                    <div key={k} className="flex items-center gap-2 text-xs">
                      <div
                        className="h-3 w-3 rounded-sm"
                        style={{ background: c }}
                      />
                      {k}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Selected plot card */}
            <div className="border-t p-4 bg-muted/20">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-xs text-muted-foreground">
                    {selected.id}
                  </p>
                  <p className="font-semibold">{selected.name}</p>
                </div>
                <Badge
                  variant="secondary"
                  style={{
                    background: statusColor[selected.status] + "22",
                    color: statusColor[selected.status],
                    borderColor: statusColor[selected.status] + "55",
                  }}
                >
                  {selected.status}
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-[10px] uppercase text-muted-foreground">
                    NDVI
                  </p>
                  <p className="font-mono font-bold">
                    {selected.ndvi.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-muted-foreground">
                    Yield
                  </p>
                  <p className="font-mono font-bold">
                    {selected.predictedYield.toFixed(1)}t
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-muted-foreground">
                    Area
                  </p>
                  <p className="font-mono font-bold">{selected.area}ha</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {!layerOpen && (
          <Button
            onClick={() => setLayerOpen(true)}
            className="absolute top-20 right-4 z-10 shadow-lg"
            size="sm"
          >
            <Layers className="h-4 w-4 mr-2" /> Layers
          </Button>
        )}
      </div>
    </AppShell>
  );
}
