import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { TopBar } from "@/components/TopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { blocks } from "@/data/mockData";
import { Download, FileText, Printer } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/reports")({ component: Reports });

function Reports() {
  const [reportType, setReportType] = useState("summary");
  const [selected, setSelected] = useState<string[]>(blocks.map((b) => b.id));
  const previewRef = useRef<HTMLDivElement>(null);

  const chosen = blocks.filter((b) => selected.includes(b.id));
  const totalHa = chosen.reduce((s, b) => s + b.hectares, 0);
  const totalYield = chosen.reduce((s, b) => s + b.predictedYield * b.hectares, 0);

  async function exportPdf() {
    toast.loading("Generating PDF…", { id: "pdf" });
    const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
      import("jspdf"), import("html2canvas"),
    ]);
    if (!previewRef.current) return;
    const canvas = await html2canvas(previewRef.current, { scale: 2, backgroundColor: "#ffffff" });
    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ unit: "pt", format: "a4" });
    const w = pdf.internal.pageSize.getWidth();
    const h = (canvas.height * w) / canvas.width;
    pdf.addImage(img, "PNG", 0, 0, w, h);
    pdf.save(`canesense-${reportType}-${Date.now()}.pdf`);
    toast.success("PDF downloaded", { id: "pdf" });
  }

  function exportCsv() {
    const headers = ["Block ID", "Name", "Hectares", "Stage", "NDVI", "EVI", "LAI", "LSWI", "VHI", "Yield (t/ha)", "Total tonnes", "Alert", "Harvest Window"];
    const rows = chosen.map((b) => [
      b.id, b.name, b.hectares, b.growthStage, b.ndvi, b.evi, b.lai, b.lswi, b.vhi,
      b.predictedYield, (b.predictedYield * b.hectares).toFixed(0), b.stressAlert, b.harvestWindow,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `canesense-${reportType}-${Date.now()}.csv`;
    a.click();
    toast.success("CSV downloaded");
  }

  return (
    <>
      <TopBar title="Reports" />
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
          {/* Builder */}
          <Card>
            <CardHeader><CardTitle className="text-sm">Build Report</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs">Report type</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="summary">Farm Summary</SelectItem>
                    <SelectItem value="activity">Activity Report</SelectItem>
                    <SelectItem value="monitoring">Monitoring (Satellite)</SelectItem>
                    <SelectItem value="yield">Yield Forecast</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Date range</Label>
                <Select defaultValue="season">
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="season">Current season</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Blocks ({selected.length} of {blocks.length})</Label>
                <div className="mt-2 space-y-1.5 rounded-md border border-border p-2 max-h-56 overflow-y-auto">
                  {blocks.map((b) => (
                    <label key={b.id} className="flex items-center gap-2 text-xs">
                      <Checkbox
                        checked={selected.includes(b.id)}
                        onCheckedChange={(v) =>
                          setSelected(v ? [...selected, b.id] : selected.filter((x) => x !== b.id))
                        }
                      />
                      <span>{b.name}</span>
                      <span className="ml-auto text-muted-foreground">{b.hectares} ha</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2 pt-2">
                <Button onClick={exportPdf} className="w-full"><FileText className="mr-2 h-4 w-4" /> Export PDF</Button>
                <Button onClick={exportCsv} variant="outline" className="w-full"><Download className="mr-2 h-4 w-4" /> Export CSV</Button>
                <Button onClick={() => window.print()} variant="ghost" className="w-full"><Printer className="mr-2 h-4 w-4" /> Print</Button>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Preview</CardTitle>
              <Badge variant="secondary">A4 layout</Badge>
            </CardHeader>
            <CardContent>
              <div ref={previewRef} className="rounded-md border border-border bg-white p-8 text-[#1a2b1c]" style={{ minHeight: 800 }}>
                <header className="mb-6 flex items-start justify-between border-b border-emerald-700/30 pb-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-emerald-700">CaneSense Report</p>
                    <h1 className="text-2xl font-bold">Bacita Sugarcane Estate</h1>
                    <p className="text-xs text-neutral-600">Kwara State, Nigeria · Season 2025/26</p>
                  </div>
                  <div className="text-right text-[11px] text-neutral-600">
                    <div>Generated: {new Date().toLocaleDateString()}</div>
                    <div>Type: {reportType}</div>
                  </div>
                </header>

                <section className="mb-5 grid grid-cols-4 gap-3 text-xs">
                  <Stat label="Total Area" value={`${totalHa} ha`} />
                  <Stat label="Blocks" value={String(chosen.length)} />
                  <Stat label="Forecast" value={`${totalYield.toLocaleString()} t`} />
                  <Stat label="Avg Yield" value={`${(totalYield / Math.max(totalHa, 1)).toFixed(1)} t/ha`} />
                </section>

                <h2 className="mb-2 text-sm font-bold text-emerald-800">Block Performance</h2>
                <table className="w-full text-[10px]">
                  <thead>
                    <tr className="border-b border-neutral-300 text-left text-neutral-600">
                      <th className="py-1">Block</th><th>Stage</th><th>EVI</th><th>VHI</th>
                      <th>Yield</th><th>Total t</th><th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chosen.map((b) => (
                      <tr key={b.id} className="border-b border-neutral-200">
                        <td className="py-1 font-medium">{b.name}</td>
                        <td>{b.growthStage}</td>
                        <td>{b.evi.toFixed(2)}</td>
                        <td>{b.vhi}</td>
                        <td>{b.predictedYield} t/ha</td>
                        <td>{(b.predictedYield * b.hectares).toFixed(0)}</td>
                        <td>{b.stressAlert === "None" ? "Healthy" : b.stressAlert}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <h2 className="mt-6 mb-2 text-sm font-bold text-emerald-800">Insights & Recommendations</h2>
                <ul className="list-disc space-y-1 pl-5 text-xs text-neutral-700">
                  {chosen.filter((b) => b.harvestReady).map((b) => (
                    <li key={b.id}><strong>{b.name}</strong> — Maturation signal detected. Recommend harvest by {b.harvestWindow}.</li>
                  ))}
                  {chosen.filter((b) => b.stressAlert !== "None").map((b) => (
                    <li key={b.id}><strong>{b.name}</strong> — {b.stressAlert} (LSWI {b.lswi.toFixed(2)}, VHI {b.vhi}). Consider intervention.</li>
                  ))}
                  <li>Total expected cane harvest: <strong>{totalYield.toLocaleString()} tonnes</strong> across {chosen.length} blocks.</li>
                </ul>

                <footer className="mt-8 border-t border-neutral-300 pt-3 text-[9px] text-neutral-500">
                  Indices derived from Sentinel-2, Sentinel-1, MODIS and CHIRPS following Bégué et al. (2010), Morel et al. (2014), Simoes et al. (2005).
                </footer>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-emerald-700/20 bg-emerald-50 p-2">
      <div className="text-[9px] uppercase text-emerald-700">{label}</div>
      <div className="text-base font-bold">{value}</div>
    </div>
  );
}
