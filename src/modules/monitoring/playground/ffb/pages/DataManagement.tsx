import { blocks } from "./lib/mock-data";
import { Database, Satellite, Cloud, Layers, FileUp, RefreshCw, Check } from "lucide-react";

const SOURCES = [
  { name: "Sentinel-2 L2A", provider: "Copernicus / ESA", resolution: "10–20m", cadence: "5-day", lastSync: "2 hours ago", status: "active", icon: Satellite },
  { name: "Sentinel-1 SAR", provider: "Copernicus / ESA", resolution: "10m", cadence: "12-day", lastSync: "1 day ago", status: "active", icon: Satellite },
  { name: "MODIS Terra/Aqua", provider: "NASA LAADS", resolution: "250–1000m", cadence: "Daily", lastSync: "4 hours ago", status: "active", icon: Satellite },
  { name: "CHIRPS Rainfall", provider: "UCSB CHG", resolution: "5km", cadence: "Daily", lastSync: "12 hours ago", status: "active", icon: Cloud },
  { name: "SRTM DEM", provider: "USGS", resolution: "30m", cadence: "Static", lastSync: "—", status: "active", icon: Layers },
];

export function DataManagement() {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard icon={Database} label="Block Records" value={`${blocks.length}`} sub="GeoJSON polygons + planting metadata"/>
        <KPICard icon={Satellite} label="Active Data Sources" value={`${SOURCES.length}`} sub="All connected and syncing"/>
        <KPICard icon={RefreshCw} label="Last Full Sync" value="2h ago" sub="Sentinel-2 L2A acquisition"/>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold">Remote Sensing Data Sources</h2>
            <p className="text-xs text-muted-foreground mt-0.5">External feeds powering biophysical and operational layers</p>
          </div>
          <button className="text-xs px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1.5"><RefreshCw className="h-3.5 w-3.5"/>Sync all</button>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr className="text-left text-xs text-muted-foreground">
              <th className="py-2.5 px-5">Source</th>
              <th className="px-3">Provider</th>
              <th className="px-3">Resolution</th>
              <th className="px-3">Cadence</th>
              <th className="px-3">Last Sync</th>
              <th className="px-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {SOURCES.map(s => (
              <tr key={s.name} className="border-t border-border hover:bg-muted/30">
                <td className="py-3 px-5">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-md bg-primary/10 text-primary flex items-center justify-center"><s.icon className="h-4 w-4"/></div>
                    <span className="font-medium">{s.name}</span>
                  </div>
                </td>
                <td className="px-3 text-muted-foreground">{s.provider}</td>
                <td className="px-3 font-mono text-xs">{s.resolution}</td>
                <td className="px-3 text-muted-foreground">{s.cadence}</td>
                <td className="px-3 text-muted-foreground">{s.lastSync}</td>
                <td className="px-3"><span className="inline-flex items-center gap-1 text-xs text-[var(--color-canopy)]"><Check className="h-3 w-3"/>{s.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h2 className="text-base font-semibold">Block Records</h2>
            <button className="text-xs px-3 py-1.5 rounded-md bg-muted hover:bg-muted/70 flex items-center gap-1.5"><FileUp className="h-3.5 w-3.5"/>Import GeoJSON</button>
          </div>
          <div className="max-h-96 overflow-auto">
            <table className="w-full text-xs">
              <thead className="bg-muted/40 sticky top-0">
                <tr className="text-left text-muted-foreground">
                  <th className="py-2 px-4">Block</th>
                  <th className="px-2">Estate</th>
                  <th className="px-2">Planted</th>
                  <th className="px-2">Area</th>
                  <th className="px-2">Palms</th>
                </tr>
              </thead>
              <tbody>
                {blocks.map(b => (
                  <tr key={b.id} className="border-t border-border hover:bg-muted/30">
                    <td className="py-2 px-4 font-mono font-semibold">{b.id}</td>
                    <td className="px-2 text-muted-foreground">{b.estate}</td>
                    <td className="px-2">{b.plantingYear}</td>
                    <td className="px-2 font-mono">{b.areaHa}ha</td>
                    <td className="px-2 font-mono">{b.palmCount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-5">
          <h2 className="text-base font-semibold mb-3">Field Data Uploads</h2>
          <p className="text-xs text-muted-foreground mb-4">Sync ground-truth observations for FFB harvest logs, fertilizer applications, and disease inspections.</p>
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:bg-muted/30 cursor-pointer transition">
            <FileUp className="h-8 w-8 mx-auto text-muted-foreground mb-2"/>
            <div className="text-sm font-medium">Drop CSV / Excel files here</div>
            <div className="text-xs text-muted-foreground mt-1">or click to browse</div>
          </div>
          <div className="mt-4 space-y-2">
            {[
              { name: "harvest-log-2025-w48.csv", size: "12 KB", date: "Today" },
              { name: "fertilizer-applications-Q4.xlsx", size: "34 KB", date: "Yesterday" },
              { name: "field-inspection-B07.csv", size: "4 KB", date: "3 days ago" },
            ].map(f => (
              <div key={f.name} className="flex items-center justify-between text-xs px-3 py-2 bg-muted/40 rounded-md">
                <div className="flex items-center gap-2"><FileUp className="h-3.5 w-3.5 text-muted-foreground"/><span className="font-medium">{f.name}</span></div>
                <div className="flex items-center gap-3 text-muted-foreground"><span>{f.size}</span><span>{f.date}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({ icon: Icon, label, value, sub }: any) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-3">
      <div className="h-11 w-11 rounded-md bg-primary/10 text-primary flex items-center justify-center"><Icon className="h-5 w-5"/></div>
      <div>
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">{label}</div>
        <div className="text-xl font-semibold">{value}</div>
        <div className="text-[11px] text-muted-foreground">{sub}</div>
      </div>
    </div>
  );
}
