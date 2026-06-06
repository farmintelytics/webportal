import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { blocks, farmSummary } from "@/lib/cocoa-data";
import { FileText, Download, FileSpreadsheet, Image as ImageIcon } from "lucide-react";

export const Route = createFileRoute("/exports")({ component: Exports });

function Exports() {
  const downloadCSV = () => {
    const header = "Block,Name,Area(ha),NDVI,NDRE,EVI,LSWI,VHI,Health,Predicted_kg_per_ha,Total_bags,Alert\n";
    const rows = blocks.map((b) => [b.id, `"${b.name}"`, b.area, b.ndvi, b.ndre, b.evi, b.lswi, b.vhi, b.health, b.predictedYield, Math.round(b.predictedYield * b.area / 64), `"${b.alert ?? ""}"`].join(",")).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "cocoa-blocks.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <PageHeader
        eyebrow="Reports & Exports"
        title="Plain-Language Reports"
        subtitle="Designed so any farm manager, supervisor or policy officer — with no remote sensing background — can read and act on them immediately."
      />
      <div className="px-6 lg:px-10 py-8 space-y-8">
        <div className="grid md:grid-cols-3 gap-4">
          <ExportCard icon={FileText} title="Health Report" desc="Block-level canopy health summary in plain English." />
          <ExportCard icon={ImageIcon} title="Summary Map (PDF)" desc="Color-coded farm map for management review." />
          <ExportCard icon={FileSpreadsheet} title="Block Data (CSV)" desc="All indices and yield predictions." onClick={downloadCSV} />
        </div>

        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-border bg-accent/30">
            <div className="text-xs font-medium uppercase tracking-wide text-cocoa">Layman-Readable Summary</div>
            <div className="text-sm font-semibold mt-0.5">Asante Estate · Season Report</div>
          </div>
          <div className="p-6 space-y-5 text-sm leading-relaxed">
            <Statement
              title="Farm Health Map"
              text={`${farmSummary.healthyBlocks} blocks healthy (green), ${farmSummary.stressedBlocks} blocks need attention (orange), ${farmSummary.criticalBlocks} critical (red).`}
            />
            <Statement
              title="Stress Alert"
              text={farmSummary.alerts > 0
                ? `${farmSummary.alerts} block(s) showing stress. Inspect for black pod or water shortage.`
                : "No active alerts. All blocks within healthy thresholds."}
            />
            <Statement
              title="Yield Forecast"
              text={`Expected harvest: ${farmSummary.totalBags.toLocaleString()} bags (${(farmSummary.totalPredictedKg / 1000).toFixed(1)} tonnes) — farm average ${Math.round(farmSummary.totalPredictedKg / farmSummary.totalArea)} kg/ha.`}
            />
            <Statement
              title="Season Rainfall"
              text="Rainfall over the past 3 months has been favourable for pod development. Monitor southern blocks for late-season deficit."
            />
          </div>
        </div>
      </div>
    </>
  );
}

function ExportCard({ icon: Icon, title, desc, onClick }: { icon: React.ComponentType<{ className?: string }>; title: string; desc: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="text-left rounded-xl border border-border bg-card p-5 shadow-sm hover:border-primary/40 hover:shadow-md transition group">
      <div className="flex items-center justify-between">
        <div className="size-9 rounded-md bg-primary/10 text-primary flex items-center justify-center"><Icon className="size-4" /></div>
        <Download className="size-4 text-muted-foreground group-hover:text-primary transition" />
      </div>
      <div className="mt-3 font-semibold">{title}</div>
      <div className="text-sm text-muted-foreground mt-1">{desc}</div>
    </button>
  );
}

function Statement({ title, text }: { title: string; text: string }) {
  return (
    <div className="border-l-2 border-primary/40 pl-4">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-primary">{title}</div>
      <div className="mt-1 text-foreground">{text}</div>
    </div>
  );
}
