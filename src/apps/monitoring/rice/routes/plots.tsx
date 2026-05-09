import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { AppLayout } from "../components/AppLayout";
import { plots, Plot } from "../lib/mockData";
import { Search, Filter, Download, FileText } from "lucide-react";

export const Route = createFileRoute("/plots")({
  head: () => ({ meta: [{ title: "Plots — PaddyLens" }, { name: "description", content: "Plot-level rice monitoring data with filters and export." }] }),
  component: PlotsPage,
});

function PlotsPage() {
  const [q, setQ] = useState("");
  const [stage, setStage] = useState("All");
  const [alert, setAlert] = useState("All");

  const filtered = useMemo(() =>
    plots.filter(p =>
      (q === "" || p.name.toLowerCase().includes(q.toLowerCase()) || p.id.toLowerCase().includes(q.toLowerCase())) &&
      (stage === "All" || p.stage === stage) &&
      (alert === "All" || p.alert === alert)
    ), [q, stage, alert]);

  return (
    <AppLayout title="Plots" subtitle={`${filtered.length} of ${plots.length} plots`}>
      <div className="rounded-xl border border-border bg-card shadow-soft overflow-hidden">
        <div className="p-4 flex flex-wrap items-center gap-3 border-b border-border">
          <div className="flex items-center gap-2 flex-1 min-w-[220px] px-3 py-2 rounded-md bg-muted">
            <Search className="size-4 text-muted-foreground"/>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search plot id or name..." className="bg-transparent outline-none text-sm flex-1"/>
          </div>
          <Select label="Stage" value={stage} onChange={setStage} options={["All","Flooded","Vegetative","Heading","Ripening"]}/>
          <Select label="Status" value={alert} onChange={setAlert} options={["All","healthy","stressed","critical"]}/>
          <button className="flex items-center gap-2 px-3 py-2 rounded-md border border-border text-sm hover:bg-accent">
            <Filter className="size-4"/> More filters
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
            <Download className="size-4"/> Export CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                {["Plot","Area","Stage","NDVI","NDRE","LSWI","VHI","Yield (t/ha)","vs Last","Status",""].map(h =>
                  <th key={h} className="text-left font-medium px-4 py-3">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => <PlotRow key={p.id} p={p}/>)}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v:string)=>void; options: string[] }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground">{label}:</span>
      <select value={value} onChange={e=>onChange(e.target.value)} className="text-sm bg-muted border border-border rounded-md px-2.5 py-2 outline-none">
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function PlotRow({ p }: { p: Plot }) {
  const delta = ((p.predictedYield - p.lastSeasonYield) / p.lastSeasonYield * 100);
  const dot = p.alert === "healthy" ? "bg-healthy" : p.alert === "stressed" ? "bg-stress" : "bg-destructive";
  return (
    <tr className="border-t border-border hover:bg-accent/40 transition">
      <td className="px-4 py-3">
        <div className="font-medium">{p.name}</div>
        <div className="text-xs text-muted-foreground">{p.id}</div>
      </td>
      <td className="px-4 py-3">{p.area} ha</td>
      <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs bg-muted">{p.stage}</span></td>
      <td className="px-4 py-3 font-mono">{p.ndvi}</td>
      <td className="px-4 py-3 font-mono">{p.ndre}</td>
      <td className="px-4 py-3 font-mono">{p.lswi}</td>
      <td className="px-4 py-3 font-mono">{p.vhi}</td>
      <td className="px-4 py-3 font-display font-semibold">{p.predictedYield}</td>
      <td className={`px-4 py-3 font-medium ${delta >= 0 ? "text-healthy" : "text-destructive"}`}>
        {delta >= 0 ? "+" : ""}{delta.toFixed(1)}%
      </td>
      <td className="px-4 py-3">
        <span className="inline-flex items-center gap-1.5 text-xs">
          <span className={`size-2 rounded-full ${dot}`}/>
          {p.alert}
        </span>
      </td>
      <td className="px-4 py-3">
        <Link to="/reports" search={{ plot: p.id } as any} className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md border border-border hover:bg-accent">
          <FileText className="size-3.5"/> Report
        </Link>
      </td>
    </tr>
  );
}
