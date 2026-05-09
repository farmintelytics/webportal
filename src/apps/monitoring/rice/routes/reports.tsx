import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { AppLayout } from "../components/AppLayout";
import { plots } from "../lib/mockData";
import {
  FileText, Download, Calendar, MapPin, Sprout, Wheat, Search,
  Printer, Share2, ChevronRight, Layers, Droplets, AlertTriangle
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [
    { title: "Reports — PaddyLens" },
    { name: "description", content: "Generate plot-level and farm-wide PDF reports with charts, alerts and remote-sensing summaries." },
  ] }),
  component: Reports,
});

type Tab = "farm" | "plot";

const farmReports = [
  { id: "weekly", title: "Weekly Farm Health", date: "May 4, 2026", desc: "Crop health, stress and irrigation status across all plots.", icon: Sprout, badge: "Weekly" },
  { id: "yield", title: "Yield Forecast — Wet Season 2026", date: "May 1, 2026", desc: "Plot-level yield projection with confidence intervals.", icon: Wheat, badge: "Seasonal" },
  { id: "suitability", title: "Planting Suitability Map", date: "Apr 15, 2026", desc: "Multi-criteria suitability analysis per parcel.", icon: MapPin, badge: "One-off" },
  { id: "anomaly", title: "Stress & Anomaly Log", date: "May 3, 2026", desc: "All VHI, LSWI and SAR anomalies in the past 30 days.", icon: AlertTriangle, badge: "30 days" },
  { id: "climate", title: "Climate Context Brief", date: "May 1, 2026", desc: "Rainfall, temperature and humidity vs. seasonal norms.", icon: Calendar, badge: "Monthly" },
];

function Reports() {
  const [tab, setTab] = useState<Tab>("farm");
  const [selectedFarm, setSelectedFarm] = useState(farmReports[0]);
  const [selectedPlotId, setSelectedPlotId] = useState(plots[0].id);
  const [q, setQ] = useState("");

  const selectedPlot = useMemo(() => plots.find(p => p.id === selectedPlotId)!, [selectedPlotId]);
  const filteredPlots = plots.filter(p =>
    p.name.toLowerCase().includes(q.toLowerCase()) || p.id.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <AppLayout title="Reports" subtitle="PDF exports for managers, supervisors and policy officers">
      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-5">
        {/* LEFT: list */}
        <aside className="rounded-xl border border-border bg-card shadow-soft overflow-hidden flex flex-col" style={{ maxHeight: "calc(100vh - 180px)" }}>
          <div className="flex border-b border-border">
            {(["farm","plot"] as Tab[]).map(t => (
              <button key={t} onClick={()=>setTab(t)}
                className={`flex-1 px-4 py-3 text-sm font-medium capitalize transition ${
                  tab === t ? "bg-card text-primary border-b-2 border-primary -mb-px" : "text-muted-foreground hover:bg-accent"
                }`}>
                {t === "farm" ? "Farm reports" : "Plot reports"}
              </button>
            ))}
          </div>

          {tab === "farm" ? (
            <div className="overflow-y-auto p-3 space-y-2">
              {farmReports.map(r => {
                const Icon = r.icon;
                const active = selectedFarm.id === r.id;
                return (
                  <button key={r.id} onClick={()=>setSelectedFarm(r)}
                    className={`w-full text-left flex gap-3 p-3 rounded-lg border transition ${
                      active ? "border-primary bg-primary/5 shadow-soft" : "border-border hover:bg-accent"
                    }`}>
                    <div className={`size-10 rounded-lg grid place-items-center shrink-0 ${active ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"}`}>
                      <Icon className="size-5"/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm truncate">{r.title}</h4>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{r.desc}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-accent text-accent-foreground">{r.badge}</span>
                        <span className="text-[10px] text-muted-foreground">{r.date}</span>
                      </div>
                    </div>
                    <ChevronRight className={`size-4 shrink-0 self-center text-muted-foreground transition ${active?"text-primary":""}`}/>
                  </button>
                );
              })}
            </div>
          ) : (
            <>
              <div className="p-3 border-b border-border">
                <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-muted">
                  <Search className="size-4 text-muted-foreground"/>
                  <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search plot..." className="bg-transparent outline-none text-sm flex-1"/>
                </div>
              </div>
              <div className="overflow-y-auto p-2">
                {filteredPlots.map(p => {
                  const active = selectedPlotId === p.id;
                  const dot = p.alert === "healthy" ? "bg-healthy" : p.alert === "stressed" ? "bg-stress" : "bg-destructive";
                  return (
                    <button key={p.id} onClick={()=>setSelectedPlotId(p.id)}
                      className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${
                        active ? "bg-primary/10 text-primary" : "hover:bg-accent"
                      }`}>
                      <span className={`size-2.5 rounded-full ${dot}`}/>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{p.name}</div>
                        <div className="text-[11px] text-muted-foreground">{p.id} · {p.area} ha · {p.stage}</div>
                      </div>
                      <span className="text-xs font-mono text-muted-foreground">{p.predictedYield} t</span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </aside>

        {/* RIGHT: live PDF-style preview */}
        <section className="rounded-xl border border-border bg-card shadow-soft overflow-hidden flex flex-col" style={{ maxHeight: "calc(100vh - 180px)" }}>
          <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-muted/40">
            <div className="text-xs text-muted-foreground">Preview · A4 · Generated {new Date().toLocaleDateString()}</div>
            <div className="flex items-center gap-2">
              <button className="text-xs px-2.5 py-1.5 rounded-md border border-border hover:bg-accent flex items-center gap-1.5"><Printer className="size-3.5"/> Print</button>
              <button className="text-xs px-2.5 py-1.5 rounded-md border border-border hover:bg-accent flex items-center gap-1.5"><Share2 className="size-3.5"/> Share</button>
              <button className="text-xs px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:opacity-90 flex items-center gap-1.5 font-medium">
                <Download className="size-3.5"/> Download PDF
              </button>
            </div>
          </div>
          <div className="overflow-y-auto bg-muted/30 p-6">
            <div className="mx-auto bg-card shadow-glow rounded-md max-w-3xl" style={{ aspectRatio: "1 / 1.414", minHeight: 800 }}>
              {tab === "farm"
                ? <FarmReportPreview title={selectedFarm.title}/>
                : <PlotReportPreview plot={selectedPlot}/>}
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}

function ReportHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="flex items-start justify-between border-b border-border pb-4 mb-5">
      <div>
        <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-widest">
          <Sprout className="size-4"/> PaddyLens · GeoAI Rice Intel
        </div>
        <h1 className="font-display font-bold text-2xl mt-1.5 text-foreground">{title}</h1>
        <p className="text-xs text-muted-foreground mt-1">{sub}</p>
      </div>
      <div className="text-right text-[10px] text-muted-foreground">
        <div>Report ID</div>
        <div className="font-mono text-foreground">RPT-{Math.floor(Math.random()*9000+1000)}</div>
        <div className="mt-2">Issued {new Date().toLocaleDateString()}</div>
      </div>
    </div>
  );
}

function FarmReportPreview({ title }: { title: string }) {
  const totalArea = plots.reduce((s, p) => s + p.area, 0);
  const totalYield = plots.reduce((s, p) => s + p.predictedYield * p.area, 0);
  const stressed = plots.filter(p => p.alert !== "healthy").length;
  return (
    <div className="p-8 text-foreground">
      <ReportHeader title={title} sub="Wet Season 2026 · Mekong Delta region · 14 monitored plots"/>
      <div className="grid grid-cols-3 gap-3 mb-5">
        <KpiBlock label="Total area" value={`${totalArea.toFixed(1)} ha`}/>
        <KpiBlock label="Predicted harvest" value={`${totalYield.toFixed(0)} t`}/>
        <KpiBlock label="Plots at risk" value={`${stressed}`} tone={stressed>3?"warn":"ok"}/>
      </div>

      <h2 className="font-display font-semibold text-base mb-2">Executive summary</h2>
      <p className="text-sm leading-relaxed text-foreground/80">
        Crop performance across the farm is <b>+11.4% above last season</b> based on Sentinel-2 NDVI integrals
        and MODIS-derived VHI. Three plots show heat or irrigation stress and need intervention this week.
        Climate context (CHIRPS) is favourable: rainfall 6% above seasonal norm, ERA5 daytime temperatures
        within target window for heading.
      </p>

      <h2 className="font-display font-semibold text-base mt-5 mb-2">Index trends · 12 weeks</h2>
      <div className="rounded-md border border-border p-3">
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={[0.32,0.4,0.48,0.55,0.6,0.66,0.7,0.72,0.74,0.73,0.71,0.68].map((v,i)=>({w:`W${i+1}`,ndvi:v}))}>
            <XAxis dataKey="w" fontSize={9} stroke="#94a3b8"/>
            <YAxis fontSize={9} stroke="#94a3b8" domain={[0,1]}/>
            <Tooltip contentStyle={{ borderRadius:6, fontSize:11 }}/>
            <Area type="monotone" dataKey="ndvi" stroke="#15803d" fill="#15803d" fillOpacity={0.25}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <h2 className="font-display font-semibold text-base mt-5 mb-2">Plot-level highlights</h2>
      <table className="w-full text-xs">
        <thead className="text-muted-foreground">
          <tr className="border-b border-border">
            <th className="text-left font-medium py-1.5">Plot</th>
            <th className="text-left font-medium">Stage</th>
            <th className="text-right font-medium">NDVI</th>
            <th className="text-right font-medium">VHI</th>
            <th className="text-right font-medium">Yield t/ha</th>
            <th className="text-right font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {plots.slice(0, 8).map(p => (
            <tr key={p.id} className="border-b border-border/50">
              <td className="py-1.5">{p.name} · <span className="text-muted-foreground">{p.id}</span></td>
              <td>{p.stage}</td>
              <td className="text-right font-mono">{p.ndvi}</td>
              <td className="text-right font-mono">{p.vhi}</td>
              <td className="text-right font-mono">{p.predictedYield}</td>
              <td className={`text-right capitalize ${p.alert==="critical"?"text-destructive":p.alert==="stressed"?"text-stress":"text-healthy"}`}>{p.alert}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-[10px] text-muted-foreground mt-6 pt-3 border-t border-border">
        Data sources: Sentinel-2 MSI · Sentinel-1 SAR C-band · MODIS Terra/Aqua · CHIRPS · ERA5 · SoilGrids 250m · GeoAI yield model v3.2
      </p>
    </div>
  );
}

function PlotReportPreview({ plot }: { plot: typeof plots[number] }) {
  const p = plot;
  const delta = ((p.predictedYield - p.lastSeasonYield) / p.lastSeasonYield * 100).toFixed(1);
  return (
    <div className="p-8 text-foreground">
      <ReportHeader title={`${p.name} — Plot Report`} sub={`${p.id} · ${p.area} ha · ${p.stage} stage · day ${p.daysSincePlanting} after planting`}/>
      <div className="grid grid-cols-4 gap-3 mb-5">
        <KpiBlock label="NDVI" value={`${p.ndvi}`}/>
        <KpiBlock label="LSWI" value={`${p.lswi}`}/>
        <KpiBlock label="VHI" value={`${p.vhi}`} tone={p.vhi<40?"warn":"ok"}/>
        <KpiBlock label="Yield" value={`${p.predictedYield} t/ha`}/>
      </div>

      <h2 className="font-display font-semibold text-base mb-2">Field summary</h2>
      <p className="text-sm leading-relaxed text-foreground/80">
        Plot <b>{p.name}</b> is currently in the <b>{p.stage}</b> phenological stage. Vegetation vigour
        (NDVI {p.ndvi}) is {p.ndvi > 0.6 ? "strong and consistent" : p.ndvi > 0.4 ? "moderate" : "below the seasonal norm"} for this growth window.
        LSWI of {p.lswi} indicates {p.lswi > 0.3 ? "adequate water saturation" : "water stress — irrigation should be inspected"}.
        Predicted yield is <b>{p.predictedYield} t/ha</b> ({delta}% vs. last season's {p.lastSeasonYield} t/ha).
      </p>

      <h2 className="font-display font-semibold text-base mt-5 mb-2">Index timeline</h2>
      <div className="rounded-md border border-border p-3">
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={Array.from({length:12}).map((_,i)=>({w:`W${i+1}`, ndvi:+(0.3+Math.sin(i/2)*0.1+i*0.03).toFixed(2), lswi:+(0.15+Math.sin(i/3)*0.08+i*0.02).toFixed(2)}))}>
            <XAxis dataKey="w" fontSize={9} stroke="#94a3b8"/>
            <YAxis fontSize={9} stroke="#94a3b8" domain={[0,1]}/>
            <Tooltip contentStyle={{ borderRadius:6, fontSize:11 }}/>
            <Area type="monotone" dataKey="ndvi" stroke="#15803d" fill="#15803d" fillOpacity={0.2}/>
            <Area type="monotone" dataKey="lswi" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.2}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-5">
        <div className="rounded-md border border-border p-3">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5"><Layers className="size-3"/> Suitability</div>
          <div className="mt-1.5 text-sm">{p.suitability} · score {p.suitabilityScore}/100</div>
          <div className="text-[11px] text-muted-foreground mt-1">Soil {p.soilScore} · Water {p.waterScore} · Climate {p.climateScore}</div>
        </div>
        <div className="rounded-md border border-border p-3">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5"><Droplets className="size-3"/> Recommended action</div>
          <div className="mt-1.5 text-sm">
            {p.alert === "critical" ? "Irrigate within 48h. Inspect for blast & sheath blight." :
             p.alert === "stressed" ? "Schedule supplemental irrigation. Re-image in 5 days." :
             "Maintain current irrigation cycle. Re-image weekly."}
          </div>
        </div>
      </div>

      <p className="text-[10px] text-muted-foreground mt-6 pt-3 border-t border-border">
        Generated from Sentinel-2 (Apr 28, 2026), Sentinel-1 SAR (May 2, 2026), MODIS LST (May 3, 2026), and the PaddyLens GeoAI yield model v3.2.
      </p>
    </div>
  );
}

function KpiBlock({ label, value, tone="ok" }: { label: string; value: string; tone?: "ok"|"warn" }) {
  return (
    <div className={`rounded-md border p-3 ${tone==="warn" ? "border-stress/40 bg-stress/5" : "border-border bg-muted/40"}`}>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</div>
      <div className={`mt-0.5 font-display font-semibold text-xl ${tone==="warn"?"text-stress":"text-foreground"}`}>{value}</div>
    </div>
  );
}
