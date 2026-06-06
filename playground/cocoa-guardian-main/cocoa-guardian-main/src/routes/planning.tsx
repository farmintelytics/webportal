import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { suitabilityZones, suitabilityBg } from "@/lib/cocoa-data";
import { CheckCircle2, MapPin, Droplets, Thermometer, Sprout } from "lucide-react";

export const Route = createFileRoute("/planning")({ component: Planning });

const indices = [
  { name: "EVI", source: "Sentinel-2", role: "Identifies high-biomass closed canopy zones — distinguishes cocoa from open land" },
  { name: "NDRE", source: "Sentinel-2 Red Edge", role: "Chlorophyll density in closed-canopy cocoa — differentiates from other tree crops" },
  { name: "LST", source: "MODIS", role: "Cocoa requires warm humid conditions: 18–32°C with no dry months below 100 mm" },
  { name: "NDWI / LSWI", source: "Sentinel-2", role: "Soil and canopy water availability — cocoa is sensitive to water deficit" },
  { name: "TWI", source: "SRTM DEM", role: "Identifies moist valley positions and humid hillsides preferred by cocoa" },
];

function Planning() {
  return (
    <>
      <PageHeader
        eyebrow="Objective 1"
        title="Plan Planting — Where to Plant"
        subtitle="Suitability analysis combining red-edge canopy detection, bioclimatic windows from CHIRPS/ERA5, soil profile from SoilGrids, and slope from SRTM DEM."
      />
      <div className="px-6 lg:px-10 py-8 space-y-8">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Suitability Map</div>
            <div className="text-sm font-semibold mt-0.5 mb-4">6 candidate zones evaluated</div>
            <SuitabilityMap />
          </div>

          <div className="space-y-3">
            <Criterion icon={Droplets} title="Rainfall" value="> 1,500 mm/yr" hint="No month < 100 mm (CHIRPS + ERA5)" />
            <Criterion icon={Thermometer} title="Temperature" value="18–32 °C" hint="Year-round, RH > 70% (ERA5)" />
            <Criterion icon={Sprout} title="Soil" value="pH 5.0–7.5, OC > 2.5%" hint="Deep, well-drained loam (SoilGrids)" />
            <Criterion icon={MapPin} title="Slope" value="< 25°" hint="From SRTM DEM" />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-border flex items-baseline justify-between">
            <div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Suitability Table</div>
              <div className="text-sm font-semibold mt-0.5">Zone-level scoring</div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <Th>Zone</Th><Th>Existing Cover</Th><Th>Rain</Th><Th>Temp</Th><Th>Humidity</Th><Th>Soil</Th><Th>Class</Th><Th>Notes</Th>
                </tr>
              </thead>
              <tbody>
                {suitabilityZones.map((z) => (
                  <tr key={z.id} className="border-t border-border hover:bg-secondary/30">
                    <Td><div className="font-medium text-foreground">{z.name}</div><div className="text-xs text-muted-foreground">{z.id}</div></Td>
                    <Td className="text-muted-foreground">{z.existingCover}</Td>
                    <Td><Score v={z.rainfallScore} /></Td>
                    <Td><Score v={z.tempScore} /></Td>
                    <Td><Score v={z.humidityScore} /></Td>
                    <Td><Score v={z.soilScore} /></Td>
                    <Td><span className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${suitabilityBg(z.suitability)}`}>{z.suitability}</span></Td>
                    <Td className="text-xs text-muted-foreground">{z.notes}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Recommended Index Combination</div>
          <div className="text-sm font-semibold mt-0.5 mb-4">How layers are combined</div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {indices.map((i) => (
              <div key={i.name} className="rounded-lg border border-border bg-secondary/30 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">{i.name}</span>
                  <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{i.source}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{i.role}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="text-left font-medium px-4 py-2.5">{children}</th>;
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 ${className}`}>{children}</td>;
}
function Score({ v }: { v: number }) {
  const tone = v >= 80 ? "bg-success" : v >= 60 ? "bg-leaf" : v >= 40 ? "bg-warning" : "bg-danger";
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 rounded-full bg-secondary overflow-hidden"><div className={`h-full ${tone}`} style={{ width: `${v}%` }} /></div>
      <span className="text-xs tabular-nums text-muted-foreground">{v}</span>
    </div>
  );
}
function Criterion({ icon: Icon, title, value, hint }: { icon: React.ComponentType<{ className?: string }>; title: string; value: string; hint: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-2.5">
        <div className="size-8 rounded-md bg-primary/10 text-primary flex items-center justify-center"><Icon className="size-4" /></div>
        <div className="text-sm font-semibold">{title}</div>
        <CheckCircle2 className="size-3.5 text-success ml-auto" />
      </div>
      <div className="mt-2 text-base font-semibold tabular-nums">{value}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{hint}</div>
    </div>
  );
}

function SuitabilityMap() {
  const zones = [
    { id: "Z1", points: "10,8 38,6 42,22 14,24",  color: "var(--success)" },
    { id: "Z2", points: "42,6 70,8 72,24 42,22",  color: "var(--success)" },
    { id: "Z3", points: "70,8 92,12 94,28 72,24", color: "var(--leaf)" },
    { id: "Z4", points: "10,24 42,22 44,42 12,44", color: "var(--warning)" },
    { id: "Z5", points: "42,22 72,24 70,46 44,42", color: "var(--danger)" },
    { id: "Z6", points: "72,24 94,28 92,52 70,46", color: "var(--success)" },
  ];
  return (
    <svg viewBox="0 0 100 60" className="w-full h-auto rounded-lg bg-secondary/30">
      {zones.map((z) => (
        <g key={z.id}>
          <polygon points={z.points} fill={z.color} fillOpacity={0.65} stroke="var(--card)" strokeWidth={0.3} />
          <text x={parseFloat(z.points.split(" ")[0].split(",")[0]) + 8} y={parseFloat(z.points.split(" ")[0].split(",")[1]) + 8} fontSize="3" fontWeight="600" fill="white">{z.id}</text>
        </g>
      ))}
    </svg>
  );
}
