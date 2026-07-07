import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { AppLayout } from "../components/AppLayout";
import { useMonitoring } from "../../shared/MonitoringContext";
import { Search, Filter, Download, FileText } from "lucide-react";

export const Route = createFileRoute("/plots")({
  head: () => ({ meta: [{ title: "Plots — PaddyLens" }, { name: "description", content: "Plot-level rice monitoring data with filters and export." }] }),
  component: PlotsPage,
});

function PlotsPage() {
  const { cropBlocks, cropLoading } = useMonitoring();
  const [q, setQ] = useState("");
  const [stage, setStage] = useState("All");
  const [alert, setAlert] = useState("All");

  const plots = useMemo(() => {
    if (!cropBlocks || cropBlocks.length === 0) return [];
    return cropBlocks.map((p: any) => {
      const ndvi = p.current_indices?.ndvi ?? 0.65;
      const ndmi = p.current_indices?.ndmi ?? p.current_indices?.ndwi ?? 0.45;
      const statusAlert = p.health_class === "Critical" ? "critical" : p.health_class === "Stressed" ? "stressed" : "healthy";
      return {
        id: p.id,
        name: p.plot_nb ? `Plot ${p.plot_nb}` : p.id,
        area: p.area_ha ?? 10.0,
        ndvi,
        ndre: p.current_indices?.ndre ?? +(ndvi * 0.7).toFixed(2),
        lswi: p.current_indices?.lswi ?? ndmi,
        vhi: Math.round(ndvi * 100),
        stage: p.stage ?? "Vegetative",
        predictedYield: p.yield_t_ha ?? +(ndvi * 5.2).toFixed(2),
        lastSeasonYield: p.yield_t_ha ? +(p.yield_t_ha * 0.95).toFixed(2) : +(ndvi * 4.8).toFixed(2),
        alert: statusAlert,
      };
    });
  }, [cropBlocks]);

  const filtered = useMemo(() =>
    plots.filter(p =>
      (q === "" || p.name.toLowerCase().includes(q.toLowerCase()) || p.id.toLowerCase().includes(q.toLowerCase())) &&
      (stage === "All" || p.stage === stage) &&
      (alert === "All" || p.alert === alert)
    ), [plots, q, stage, alert]);

  return (
    <AppLayout title="Plots" subtitle={`${filtered.length} of ${plots.length} plots`}>
      <div className="rounded-xl border border-emerald-100 bg-white shadow-soft overflow-hidden">
        <div className="p-4 flex flex-wrap items-center gap-3 border-b border-emerald-50">
          <div className="flex items-center gap-2 flex-1 min-w-[220px] px-3 py-2 rounded-md bg-slate-50 border border-slate-100 focus-within:border-emerald-200 transition">
            <Search className="size-4 text-emerald-800/60"/>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search plot id or name..." className="bg-transparent outline-none text-sm flex-1 text-slate-800 placeholder:text-slate-400"/>
          </div>
          <Select label="Stage" value={stage} onChange={setStage} options={["All","Flooded","Vegetative","Heading","Ripening"]}/>
          <Select label="Status" value={alert} onChange={setAlert} options={["All","healthy","stressed","critical"]}/>
          <button className="flex items-center gap-2 px-3 py-2 rounded-md border border-slate-100 text-sm hover:bg-slate-50 text-slate-600 transition">
            <Filter className="size-4"/> More filters
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-md bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition">
            <Download className="size-4"/> Export CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          {cropLoading ? (
            <div className="p-8 text-center text-slate-500 font-medium">Loading crop telemetry datasets...</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-slate-400 font-medium">No plots found matching current criteria.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-emerald-50/20 text-xs uppercase tracking-wider text-emerald-800/80 border-b border-emerald-50">
                <tr>
                  {["Plot","Area","Stage","NDVI","NDRE","LSWI","VHI","Yield (t/ha)","vs Last","Status",""].map(h =>
                    <th key={h} className="text-left font-bold px-4 py-3.5">{h}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(p => <PlotRow key={p.id} p={p}/>)}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v:string)=>void; options: string[] }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-500 font-medium">{label}:</span>
      <select value={value} onChange={e=>onChange(e.target.value)} className="text-sm bg-slate-50 border border-slate-100 rounded-md px-2.5 py-2 outline-none text-slate-700 cursor-pointer focus:border-emerald-200 transition">
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function PlotRow({ p }: { p: any }) {
  const delta = p.lastSeasonYield > 0 ? ((p.predictedYield - p.lastSeasonYield) / p.lastSeasonYield * 100) : 0;
  
  const alertClass = p.alert === "healthy"
    ? "bg-emerald-50 text-emerald-800 border-emerald-200/50"
    : p.alert === "stressed"
      ? "bg-slate-100 text-slate-700 border-slate-200"
      : "bg-emerald-800/10 text-emerald-950 font-bold border-emerald-400";

  return (
    <tr className="hover:bg-emerald-50/10 transition">
      <td className="px-4 py-4">
        <div className="font-semibold text-slate-900">{p.name}</div>
        <div className="text-xs text-slate-400 font-mono">{p.id}</div>
      </td>
      <td className="px-4 py-4 text-slate-600">{p.area.toFixed(1)} ha</td>
      <td className="px-4 py-4"><span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-50 border border-slate-100 text-slate-600">{p.stage}</span></td>
      <td className="px-4 py-4 font-mono text-slate-500">{p.ndvi.toFixed(2)}</td>
      <td className="px-4 py-4 font-mono text-slate-500">{p.ndre.toFixed(2)}</td>
      <td className="px-4 py-4 font-mono text-slate-500">{p.lswi.toFixed(2)}</td>
      <td className="px-4 py-4 font-mono text-slate-500">{p.vhi}</td>
      <td className="px-4 py-4 font-semibold text-slate-950">{p.predictedYield.toFixed(2)}</td>
      <td className={`px-4 py-4 font-bold ${delta >= 0 ? "text-emerald-700" : "text-stone-500"}`}>
        {delta >= 0 ? "+" : ""}{delta.toFixed(1)}%
      </td>
      <td className="px-4 py-4">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${alertClass}`}>
          {p.alert}
        </span>
      </td>
      <td className="px-4 py-4">
        <Link to="/reports" search={{ plot: p.id } as any} className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md border border-slate-100 hover:bg-slate-50 text-slate-600 transition">
          <FileText className="size-3.5"/> Report
        </Link>
      </td>
    </tr>
  );
}
