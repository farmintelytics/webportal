import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { blocks, healthBg } from "./lib/cocoa-data";
import { Leaf, Droplets, Sun, Activity, AlertTriangle, X } from "lucide-react";

export const Route = createFileRoute("/")({
  component: MapHome,
  head: () => ({
    meta: [
      { title: "Map View — CocoaSense" },
      { name: "description", content: "Interactive satellite map of cocoa farms with NDVI, NDRE, soil and rainfall layers." },
    ],
  }),
});

function MapHome() {
  const [mounted, setMounted] = useState(false);
  const [selected, setSelected] = useState<string | undefined>();
  const [MapView, setMapView] = useState<React.ComponentType<{ selected?: string; onSelect?: (id: string) => void }> | null>(null);

  useEffect(() => {
    setMounted(true);
    import("./components/MapView").then((m) => setMapView(() => m.MapView));
  }, []);

  const block = selected ? blocks.find((b) => b.id === selected) : undefined;

  return (
    <div className="relative w-full h-[calc(100vh-3rem)]">
      {mounted && MapView ? (
        <MapView selected={selected} onSelect={setSelected} />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-secondary/30">
          <div className="text-sm text-muted-foreground">Loading satellite imagery…</div>
        </div>
      )}

      {block && (
        <div className="absolute bottom-20 md:bottom-3 left-3 z-[400] w-80 bg-card/95 backdrop-blur border border-border rounded-lg shadow-xl">
          <div className="flex items-start justify-between px-4 py-3 border-b border-border">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Selected Block</div>
              <div className="text-sm font-semibold mt-0.5">{block.name}</div>
              <div className="text-xs text-muted-foreground">{block.area} ha</div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${healthBg(block.health)}`}>{block.health}</span>
              <button onClick={() => setSelected(undefined)} className="size-6 rounded hover:bg-secondary flex items-center justify-center">
                <X className="size-3.5 text-muted-foreground" />
              </button>
            </div>
          </div>
          <div className="p-4 space-y-2.5">
            <Row icon={Leaf} label="NDRE" value={block.ndre.toFixed(2)} />
            <Row icon={Sun} label="NDVI" value={block.ndvi.toFixed(2)} />
            <Row icon={Droplets} label="LSWI" value={block.lswi.toFixed(2)} />
            <Row icon={Activity} label="VHI" value={block.vhi.toString()} />
            <div className="pt-2 mt-2 border-t border-border">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Predicted yield</div>
              <div className="text-lg font-semibold">{block.predictedYield} <span className="text-xs font-normal text-muted-foreground">kg/ha</span></div>
            </div>
            {block.alert && (
              <div className="rounded-md border border-warning/40 bg-warning/15 px-3 py-2 text-[11px] text-warning-foreground flex gap-2">
                <AlertTriangle className="size-3.5 shrink-0 mt-0.5" />
                <span>{block.alert}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="flex items-center gap-1.5 text-muted-foreground"><Icon className="size-3.5" /> {label}</span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  );
}
