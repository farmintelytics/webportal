import { useState } from "react";
import { Layers, ChevronRight, X } from "lucide-react";
import { Button } from "@monitoring-shared/ui/button";
import { Switch } from "@monitoring-shared/ui/switch";
import { Slider } from "@monitoring-shared/ui/slider";
import type { MapLayer } from "./data/mockData";
import { cn } from "@monitoring-shared/lib/utils";

export function LayersPanel({
  layers, setLayers,
}: {
  layers: MapLayer[];
  setLayers: (l: MapLayer[]) => void;
}) {
  const [open, setOpen] = useState(true);

  const toggle = (id: string) =>
    setLayers(layers.map((l) => (l.id === id ? { ...l, enabled: !l.enabled } : l)));
  const setOp = (id: string, v: number) =>
    setLayers(layers.map((l) => (l.id === id ? { ...l, opacity: v } : l)));

  const categories: MapLayer["category"][] = ["Operational", "Biophysical", "Monitoring"];

  return (
    <>
      {!open && (
        <Button
          onClick={() => setOpen(true)}
          className="absolute right-4 top-4 z-[1000] shadow-[var(--shadow-elegant)]"
          size="icon"
        >
          <Layers className="h-4 w-4" />
        </Button>
      )}
      <div
        className={cn(
          "absolute right-0 top-0 z-[1000] h-full w-80 border-l border-border bg-card/95 shadow-xl backdrop-blur transition-transform",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold">Map Layers</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="overflow-y-auto p-3" style={{ maxHeight: "calc(100% - 50px)" }}>
          {categories.map((cat) => (
            <div key={cat} className="mb-4">
              <div className="mb-2 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <ChevronRight className="h-3 w-3" />
                {cat}
              </div>
              <div className="space-y-2">
                {layers.filter((l) => l.category === cat).map((l) => (
                  <div key={l.id} className="rounded-md border border-border bg-background/60 p-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{l.name}</span>
                      <Switch checked={l.enabled} onCheckedChange={() => toggle(l.id)} />
                    </div>
                    {l.enabled && (
                      <>
                        <div className="mt-2">
                          <div className="mb-1 flex justify-between text-[10px] text-muted-foreground">
                            <span>Opacity</span><span>{Math.round(l.opacity * 100)}%</span>
                          </div>
                          <Slider
                            value={[l.opacity * 100]}
                            onValueChange={(v) => setOp(l.id, v[0] / 100)}
                            max={100} step={5}
                          />
                        </div>
                        <div className="mt-2 space-y-1">
                          {l.legend.map((lg) => (
                            <div key={lg.label} className="flex items-center gap-2 text-[11px]">
                              <span className="h-3 w-4 rounded-sm border border-border" style={{ background: lg.color }} />
                              <span className="text-muted-foreground">{lg.label}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
