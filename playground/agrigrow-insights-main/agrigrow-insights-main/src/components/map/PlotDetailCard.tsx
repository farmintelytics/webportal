import { Plot, statusColors } from "@/lib/mockData";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Flag, FileText } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { batches } from "@/lib/mockData";

export function PlotDetailCard({ plot, onClose }: { plot: Plot; onClose: () => void }) {
  const batch = batches.find(b => b.id === plot.batchId);
  const trendData = batch?.ndviSeries.slice(0, plot.ageMonths + 1).map((v, i) => ({ m: i, v })) ?? [];

  return (
    <Card className="p-4 shadow-modal">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-mono text-xs text-muted-foreground">{plot.id}</div>
          <div className="font-semibold text-base">{batch?.name}</div>
          <Badge
            className="mt-1 text-white border-0 capitalize"
            style={{ background: statusColors[plot.status] }}
          >
            {plot.status}
          </Badge>
        </div>
        <Button size="icon" variant="ghost" onClick={onClose}><X className="size-4" /></Button>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <Field label="Planting" value={plot.plantingDate} />
        <Field label="Age" value={`${plot.ageMonths} months`} />
        <Field label="Size" value={`${plot.size} ha`} />
        <Field label="Soil" value={plot.soil} />
      </div>

      <div className="mt-4 space-y-3">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">NDVI</span>
            <span className="font-mono font-semibold">{plot.ndvi.toFixed(2)}</span>
          </div>
          <div className="h-12">
            <ResponsiveContainer>
              <LineChart data={trendData}>
                <Line type="monotone" dataKey="v" stroke="var(--color-primary)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <Metric label="LSWI Moisture" value={plot.lswi.toFixed(2)} status={plot.lswi > 0.4 ? "ok" : "warn"} />
        <Metric label="VHI Drought" value={String(plot.vhi)} status={plot.vhi >= 50 ? "ok" : plot.vhi >= 35 ? "warn" : "alert"} />
        <Field label="Estimated Harvest" value={plot.harvestWindow} />
        <Field label="Predicted Yield" value={`${plot.predictedYield} t/ha`} />
      </div>

      <div className="mt-4 flex gap-2">
        <Button size="sm" className="flex-1"><FileText className="size-4 mr-1" /> Report</Button>
        <Button size="sm" variant="outline" className="flex-1"><Flag className="size-4 mr-1" /> Flag</Button>
      </div>
    </Card>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}

function Metric({ label, value, status }: { label: string; value: string; status: "ok" | "warn" | "alert" }) {
  const color = status === "ok" ? "var(--color-healthy)" : status === "warn" ? "var(--color-warning)" : "var(--color-alert)";
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono font-semibold" style={{ color }}>{value}</span>
    </div>
  );
}
