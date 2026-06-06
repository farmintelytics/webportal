import { X, AlertTriangle, Droplets, Sprout, Calendar } from "lucide-react";
import type { Block } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function stageColor(s: Block["growthStage"]) {
  return {
    Tillering: "bg-emerald-100 text-emerald-800",
    "Grand Growth": "bg-emerald-700 text-white",
    Maturation: "bg-amber-100 text-amber-900",
    "Harvest Ready": "bg-orange-600 text-white",
  }[s];
}

export function BlockDetail({ block, onClose }: { block: Block; onClose: () => void }) {
  return (
    <div className="absolute left-4 bottom-4 top-4 z-[1000] w-80 overflow-y-auto rounded-lg border border-border bg-card/95 p-4 shadow-[var(--shadow-elegant)] backdrop-blur">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground">{block.id}</p>
          <h2 className="text-base font-semibold">{block.name}</h2>
          <p className="text-xs text-muted-foreground">{block.hectares} hectares</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4" /></Button>
      </div>

      <Badge className={stageColor(block.growthStage)}>{block.growthStage}</Badge>

      {block.stressAlert !== "None" && (
        <div className="mt-3 flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-2">
          <AlertTriangle className="mt-0.5 h-4 w-4 text-destructive" />
          <div>
            <div className="text-xs font-semibold text-destructive">{block.stressAlert}</div>
            <div className="text-[11px] text-muted-foreground">Action recommended</div>
          </div>
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <Stat label="NDVI" value={block.ndvi.toFixed(2)} />
        <Stat label="EVI" value={block.evi.toFixed(2)} />
        <Stat label="LAI" value={block.lai.toFixed(1)} />
        <Stat label="LSWI" value={block.lswi.toFixed(2)} />
        <Stat label="VHI" value={String(block.vhi)} />
        <Stat label="SAR (dB)" value={block.sar.toFixed(1)} />
      </div>

      <div className="mt-4 space-y-2 rounded-md bg-muted/50 p-3">
        <Row icon={<Sprout className="h-3.5 w-3.5" />} label="Crop age" value={`${block.cropAgeMonths} months`} />
        <Row icon={<Droplets className="h-3.5 w-3.5" />} label="Water" value={block.waterAvailability} />
        <Row icon={<Calendar className="h-3.5 w-3.5" />} label="Harvest window" value={block.harvestWindow} />
      </div>

      <div className="mt-4 rounded-md border border-primary/30 bg-primary/5 p-3">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Predicted Yield</div>
        <div className="text-2xl font-bold text-primary">{block.predictedYield} <span className="text-sm font-normal">t/ha</span></div>
        <div className="text-[11px] text-muted-foreground">Total: {(block.predictedYield * block.hectares).toLocaleString()} tonnes</div>
      </div>

      <div className="mt-4 rounded-md bg-secondary p-3 text-xs text-secondary-foreground">
        <div className="mb-1 font-semibold">Plain-language status</div>
        {block.harvestReady
          ? `${block.name} shows full maturity signals. Recommend harvest by ${block.harvestWindow}.`
          : block.stressAlert === "Water Stress"
          ? `${block.name} shows water stress (LSWI low). Consider irrigation.`
          : `${block.name} is in ${block.growthStage.toLowerCase()} and on track.`}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-muted/50 p-2">
      <div className="text-[10px] uppercase text-muted-foreground">{label}</div>
      <div className="text-sm font-semibold">{value}</div>
    </div>
  );
}
function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="flex items-center gap-1.5 text-muted-foreground">{icon}{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
