import { useState } from "react";
import { Card } from "@monitoring-shared/ui/card";
import { Switch } from "@monitoring-shared/ui/switch";
import { Slider } from "@monitoring-shared/ui/slider";
import { ChevronDown } from "lucide-react";
import { cn } from "@monitoring-shared/lib/utils";

interface Layer {
  id: string;
  name: string;
  legend?: { color: string; label: string }[];
}

const groups: { name: string; layers: Layer[] }[] = [
  {
    name: "Biophysical",
    layers: [
      { id: "ndvi", name: "NDVI (multi-date)", legend: [
        { color: "#fde68a", label: "Low 0.1" },
        { color: "#84cc16", label: "Mid 0.4" },
        { color: "#15803d", label: "High 0.8" },
      ]},
      { id: "msavi", name: "MSAVI (early growth)" },
      { id: "evi", name: "EVI (intercrop canopy)" },
      { id: "lswi", name: "LSWI (moisture stress)" },
    ],
  },
  {
    name: "Operational",
    layers: [
      { id: "boundaries", name: "Farm Boundaries" },
      { id: "suitability", name: "Planting Suitability" },
      { id: "yield", name: "Predicted Yield Map" },
    ],
  },
  {
    name: "Monitoring",
    layers: [
      { id: "vhi", name: "VHI Drought Index", legend: [
        { color: "#16A34A", label: "≥50 OK" },
        { color: "#D97706", label: "35–50 Stress" },
        { color: "#DC2626", label: "<35 Drought" },
      ]},
      { id: "rain", name: "Rainfall (CHIRPS)" },
      { id: "soil", name: "Soil Moisture (SAR)" },
    ],
  },
];

interface Props {
  active: Record<string, boolean>;
  setActive: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  opacity: Record<string, number>;
  setOpacity: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}

export function LayerPanel({ active, setActive, opacity, setOpacity }: Props) {
  const [open, setOpen] = useState<Record<string, boolean>>({ Biophysical: true, Monitoring: true, Operational: false });

  return (
    <Card className="p-3 shadow-modal max-h-[70vh] overflow-y-auto bg-white border border-emerald-100">
      <div className="font-semibold text-sm mb-2 text-slate-800">Map Layers</div>
      {groups.map(g => (
        <div key={g.name} className="mb-2">
          <button
            onClick={() => setOpen(o => ({ ...o, [g.name]: !o[g.name] }))}
            className="w-full flex items-center justify-between text-xs uppercase tracking-wide font-semibold text-slate-500 py-1.5 hover:text-slate-800"
          >
            {g.name}
            <ChevronDown className={cn("size-3 transition-transform", open[g.name] && "rotate-180")} />
          </button>
          {open[g.name] && g.layers.map(l => (
            <div key={l.id} className="py-1.5 border-b border-slate-100 last:border-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-slate-700">{l.name}</span>
                <Switch
                  checked={!!active[l.id]}
                  onCheckedChange={v => {
                    setActive(s => {
                      const next = { ...s };
                      if (g.name === "Biophysical") {
                        // Mutually exclusive biophysical layers for clear raster interpretation
                        groups[0].layers.forEach(ly => { next[ly.id] = false; });
                      }
                      next[l.id] = v;
                      return next;
                    });
                  }}
                />
              </div>
              {active[l.id] && (
                <div className="mt-2 space-y-1.5 pl-1">
                  <Slider
                    value={[opacity[l.id] ?? 80]}
                    onValueChange={v => setOpacity(s => ({ ...s, [l.id]: v[0] }))}
                    max={100}
                  />
                  {l.legend && (
                    <div className="flex gap-2 flex-wrap text-[10px] mt-1">
                      {l.legend.map(le => (
                        <div key={le.label} className="flex items-center gap-1">
                          <span className="size-2.5 rounded" style={{ background: le.color }} />
                          <span className="text-slate-400 font-medium">{le.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </Card>
  );
}
