import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { blocks } from "@/lib/cocoa-data";
import { AlertTriangle, CheckCircle2, Droplets, Leaf, Activity } from "lucide-react";

export const Route = createFileRoute("/alerts")({ component: Alerts });

function Alerts() {
  const alertBlocks = blocks.filter((b) => b.alert);
  return (
    <>
      <PageHeader
        eyebrow="Field operations"
        title="Stress Alerts & Inspections"
        subtitle="Triggered when NDRE < 0.15, LSWI < 0.20, or VHI < 35. Each alert maps to a recommended field action."
      />
      <div className="px-6 lg:px-10 py-8 space-y-4">
        {alertBlocks.length === 0 && (
          <div className="rounded-xl border border-success/30 bg-success/10 p-6 flex items-center gap-3">
            <CheckCircle2 className="size-6 text-success" />
            <div><div className="font-semibold">All blocks healthy</div><div className="text-sm text-muted-foreground">No stress thresholds exceeded.</div></div>
          </div>
        )}

        {alertBlocks.map((b) => {
          const reasons = [];
          if (b.ndre < 0.15) reasons.push({ icon: Leaf, label: "Severe chlorophyll decline (NDRE)", action: "Inspect for black pod disease, scout 10 trees per ha" });
          if (b.lswi < 0.2) reasons.push({ icon: Droplets, label: "Water deficit at canopy (LSWI)", action: "Check soil moisture, schedule irrigation if available" });
          if (b.vhi < 35) reasons.push({ icon: Activity, label: "Composite stress critical (VHI)", action: "Combined drought + thermal stress — escalate" });
          return (
            <div key={b.id} className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
              <div className="px-5 py-4 bg-warning/10 border-b border-warning/30 flex items-center gap-3">
                <div className="size-9 rounded-md bg-warning/30 flex items-center justify-center"><AlertTriangle className="size-4 text-warning-foreground" /></div>
                <div className="flex-1">
                  <div className="font-semibold">{b.name} <span className="text-muted-foreground font-normal">· {b.id} · {b.area} ha</span></div>
                  <div className="text-xs text-muted-foreground">{b.alert}</div>
                </div>
                <span className="text-[11px] font-medium px-2 py-1 rounded-full bg-danger/15 text-danger border border-danger/30">{b.health}</span>
              </div>
              <div className="px-5 py-4 grid md:grid-cols-3 gap-4">
                {reasons.map((r, i) => (
                  <div key={i} className="rounded-lg border border-border bg-secondary/30 p-3">
                    <div className="flex items-center gap-2 text-sm font-medium"><r.icon className="size-3.5 text-warning-foreground" />{r.label}</div>
                    <div className="text-xs text-muted-foreground mt-1.5">{r.action}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
