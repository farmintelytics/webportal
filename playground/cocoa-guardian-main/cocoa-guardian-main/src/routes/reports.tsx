import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { blocks, farmSummary } from "@/lib/cocoa-data";
import { FileText, Download, Check, Loader2 } from "lucide-react";
import jsPDF from "jspdf";

export const Route = createFileRoute("/reports")({
  component: ReportsPage,
  head: () => ({
    meta: [
      { title: "Reports — CocoaSense" },
      { name: "description", content: "Generate per-plot or per-farm PDF reports with map, metrics and insights." },
    ],
  }),
});

const REPORT_TYPES = [
  { id: "summary", label: "Farm Summary Report", desc: "Overview of area, yield and health" },
  { id: "activity", label: "Activity Report", desc: "Field activity logs over a date range" },
  { id: "monitoring", label: "Monitoring Report", desc: "Satellite-based canopy & stress analysis" },
];

const METRICS = ["Yield Estimate", "NDRE", "NDVI", "LSWI", "Rainfall", "Activity Logs", "Stress Alerts"];

function ReportsPage() {
  const [reportType, setReportType] = useState("summary");
  const [selectedPlots, setSelectedPlots] = useState<string[]>(blocks.map((b) => b.id));
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["Yield Estimate", "NDRE", "Rainfall"]);
  const [from, setFrom] = useState("2026-01-01");
  const [to, setTo] = useState("2026-05-06");
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);

  const toggle = (arr: string[], setter: (v: string[]) => void, val: string) =>
    setter(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);

  const generatePDF = async () => {
    setGenerating(true);
    setDone(false);
    await new Promise((r) => setTimeout(r, 600));

    const doc = new jsPDF();
    const reportTitle = REPORT_TYPES.find((r) => r.id === reportType)?.label ?? "Report";

    // Header
    doc.setFontSize(20);
    doc.setTextColor(34, 84, 60);
    doc.text("CocoaSense", 20, 20);
    doc.setFontSize(11);
    doc.setTextColor(120);
    doc.text(reportTitle, 20, 27);
    doc.setDrawColor(220);
    doc.line(20, 32, 190, 32);

    doc.setTextColor(40);
    doc.setFontSize(10);
    doc.text(`Farm: Asante Estate, Ashanti Region`, 20, 40);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 46);
    doc.text(`Period: ${from}  →  ${to}`, 20, 52);
    doc.text(`Plots: ${selectedPlots.length} of ${blocks.length}`, 20, 58);

    // Map placeholder
    doc.setFillColor(245, 245, 240);
    doc.rect(20, 65, 170, 50, "F");
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text("[ Farm boundary map snapshot ]", 95, 90);

    // Key metrics
    let y = 125;
    doc.setFontSize(13);
    doc.setTextColor(34, 84, 60);
    doc.text("Key Metrics", 20, y);
    y += 7;
    doc.setFontSize(10);
    doc.setTextColor(40);
    const totalArea = selectedPlots.reduce((s, id) => s + (blocks.find((b) => b.id === id)?.area ?? 0), 0);
    const totalKg = selectedPlots.reduce((s, id) => {
      const b = blocks.find((b) => b.id === id);
      return s + (b ? b.predictedYield * b.area : 0);
    }, 0);
    doc.text(`Total Area: ${totalArea.toFixed(1)} ha`, 20, y); y += 6;
    doc.text(`Crop Type: Cocoa (Theobroma cacao)`, 20, y); y += 6;
    doc.text(`Yield Estimate: ${(totalKg / 1000).toFixed(1)} tonnes (${Math.round(totalKg / 64)} bags)`, 20, y); y += 6;
    doc.text(`Activity Completion: 78%`, 20, y); y += 10;

    // Per-plot table
    doc.setFontSize(13);
    doc.setTextColor(34, 84, 60);
    doc.text("Per-Plot Summary", 20, y);
    y += 7;
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text("Block", 20, y);
    doc.text("Area", 50, y);
    doc.text("NDRE", 75, y);
    doc.text("Health", 100, y);
    doc.text("Predicted (kg/ha)", 140, y);
    y += 4;
    doc.line(20, y, 190, y);
    y += 5;
    doc.setTextColor(40);
    selectedPlots.forEach((id) => {
      const b = blocks.find((x) => x.id === id);
      if (!b) return;
      if (y > 270) { doc.addPage(); y = 20; }
      doc.text(b.id, 20, y);
      doc.text(`${b.area} ha`, 50, y);
      doc.text(b.ndre.toFixed(2), 75, y);
      doc.text(b.health, 100, y);
      doc.text(b.predictedYield.toString(), 140, y);
      y += 5;
    });

    // Insights
    if (y > 250) { doc.addPage(); y = 20; }
    y += 8;
    doc.setFontSize(13);
    doc.setTextColor(34, 84, 60);
    doc.text("Insights", 20, y);
    y += 7;
    doc.setFontSize(10);
    doc.setTextColor(40);
    const stressed = blocks.filter((b) => selectedPlots.includes(b.id) && b.alert);
    if (stressed.length) {
      stressed.forEach((b) => {
        if (y > 270) { doc.addPage(); y = 20; }
        const lines = doc.splitTextToSize(`• ${b.name}: ${b.alert}`, 170);
        doc.text(lines, 20, y);
        y += lines.length * 5;
      });
    } else {
      doc.text("• All selected plots are within healthy thresholds.", 20, y); y += 6;
    }
    if (y > 260) { doc.addPage(); y = 20; }
    doc.text(`• Rainfall over the selected period averaged ${Math.round(blocks.reduce((s, b) => s + b.rainfall3mo, 0) / blocks.length)} mm — within optimal cocoa range.`, 20, y, { maxWidth: 170 });

    doc.save(`cocoasense-${reportType}-${Date.now()}.pdf`);
    setGenerating(false);
    setDone(true);
    setTimeout(() => setDone(false), 3000);
  };

  return (
    <>
      <PageHeader
        eyebrow="Reports"
        title="Generate Reports"
        subtitle="Build PDF reports for any plot or farm with maps, metrics, charts and insights."
      />

      <div className="px-6 lg:px-10 py-6 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Section title="1. Report Type">
            <div className="grid sm:grid-cols-3 gap-3">
              {REPORT_TYPES.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setReportType(r.id)}
                  className={`text-left rounded-lg border p-3 transition ${
                    reportType === r.id ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/40"
                  }`}
                >
                  <div className="text-sm font-semibold">{r.label}</div>
                  <div className="text-[11px] text-muted-foreground mt-1">{r.desc}</div>
                </button>
              ))}
            </div>
          </Section>

          <Section title="2. Plots">
            <div className="flex items-center gap-2 mb-3">
              <button onClick={() => setSelectedPlots(blocks.map((b) => b.id))} className="text-xs px-2 py-1 rounded bg-secondary hover:bg-secondary/80">Select all</button>
              <button onClick={() => setSelectedPlots([])} className="text-xs px-2 py-1 rounded bg-secondary hover:bg-secondary/80">Clear</button>
            </div>
            <div className="grid sm:grid-cols-2 gap-2">
              {blocks.map((b) => {
                const on = selectedPlots.includes(b.id);
                return (
                  <button
                    key={b.id}
                    onClick={() => toggle(selectedPlots, setSelectedPlots, b.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md border text-left transition ${on ? "border-primary bg-primary/5" : "border-border bg-card hover:bg-secondary/40"}`}
                  >
                    <div className={`size-4 rounded flex items-center justify-center ${on ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
                      {on && <Check className="size-3" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate">{b.name}</div>
                      <div className="text-[10px] text-muted-foreground">{b.area} ha · {b.health}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </Section>

          <Section title="3. Time Range">
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs">
                <span className="text-muted-foreground">From</span>
                <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="mt-1 w-full text-sm bg-secondary border border-transparent rounded-md px-3 py-1.5 focus:outline-none focus:border-primary/40" />
              </label>
              <label className="text-xs">
                <span className="text-muted-foreground">To</span>
                <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="mt-1 w-full text-sm bg-secondary border border-transparent rounded-md px-3 py-1.5 focus:outline-none focus:border-primary/40" />
              </label>
            </div>
          </Section>

          <Section title="4. Metrics">
            <div className="flex flex-wrap gap-2">
              {METRICS.map((m) => {
                const on = selectedMetrics.includes(m);
                return (
                  <button
                    key={m}
                    onClick={() => toggle(selectedMetrics, setSelectedMetrics, m)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition ${on ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary/40"}`}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
          </Section>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm sticky top-16">
            <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Preview</div>
            <div className="mt-2 text-sm font-semibold">{REPORT_TYPES.find((r) => r.id === reportType)?.label}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {selectedPlots.length} plots · {from} → {to}<br />
              {selectedMetrics.length} metrics included
            </div>

            <div className="mt-4 rounded-md border border-dashed border-border p-4 bg-secondary/30 text-[11px] space-y-1.5 text-muted-foreground">
              <div className="font-semibold text-foreground">Will include:</div>
              <div>✓ Header & branding</div>
              <div>✓ Map snapshot of selected plots</div>
              <div>✓ Key metrics summary</div>
              <div>✓ Per-plot table</div>
              <div>✓ Auto-generated insights</div>
            </div>

            <button
              onClick={generatePDF}
              disabled={generating || selectedPlots.length === 0}
              className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground px-4 py-2.5 text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition"
            >
              {generating ? <><Loader2 className="size-4 animate-spin" /> Generating…</> : done ? <><Check className="size-4" /> Downloaded</> : <><Download className="size-4" /> Generate PDF</>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="text-sm font-semibold mb-3 flex items-center gap-2">
        <FileText className="size-4 text-primary" />
        {title}
      </div>
      {children}
    </div>
  );
}
