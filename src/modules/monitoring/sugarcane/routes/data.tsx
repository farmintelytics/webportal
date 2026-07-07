import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "../components/TopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@monitoring-shared/ui/card";
import { AppLayout } from "../components/AppLayout";
import { Badge } from "@monitoring-shared/ui/badge";
import { useMonitoring } from "../../shared/MonitoringContext";
import { useMemo } from "react";

export const Route = createFileRoute("/data")({ component: DataPage });

function DataPage() {
  const { cropSummary, cropBlocks, cropLoading } = useMonitoring();

  const plots = useMemo(() => {
    if (!cropBlocks || cropBlocks.length === 0) return [];
    return cropBlocks.map((p: any) => {
      const ndvi = p.current_indices?.ndvi ?? 0.65;
      const suitability = ndvi > 0.6 ? "Suitable" : ndvi > 0.4 ? "Marginal" : "Unsuitable";
      return {
        id: p.id,
        name: p.plot_nb ? `Block ${p.plot_nb}` : p.id,
        hectares: p.area_ha ?? 10.0,
        landUseStatus: p.stage ?? "Vegetative",
        soilScore: 82,
        thermalScore: 78,
        rainfallScore: 85,
        waterAvailability: "Adequate",
        suitability,
      };
    });
  }, [cropBlocks]);

  return (
    <AppLayout>
      <TopBar title="Data Management" />
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="mb-4 grid gap-3 sm:grid-cols-3">
          <Card className="bg-white border border-emerald-100/50 shadow-sm"><CardContent className="p-4">
            <div className="text-xs text-slate-500 font-medium">Sentinel-2 last sync</div>
            <div className="mt-1 text-lg font-bold text-slate-900">2 days ago</div>
            <Badge variant="secondary" className="mt-2 bg-emerald-50 text-emerald-800 border-emerald-100 font-bold uppercase text-[9px] tracking-wider">10m optical</Badge>
          </CardContent></Card>
          <Card className="bg-white border border-emerald-100/50 shadow-sm"><CardContent className="p-4">
            <div className="text-xs text-slate-500 font-medium">Sentinel-1 last sync</div>
            <div className="mt-1 text-lg font-bold text-slate-900">5 days ago</div>
            <Badge variant="secondary" className="mt-2 bg-emerald-50 text-emerald-800 border-emerald-100 font-bold uppercase text-[9px] tracking-wider">SAR C-band</Badge>
          </CardContent></Card>
          <Card className="bg-white border border-emerald-100/50 shadow-sm"><CardContent className="p-4">
            <div className="text-xs text-slate-500 font-medium">CHIRPS rainfall</div>
            <div className="mt-1 text-lg font-bold text-slate-900">Updated daily</div>
            <Badge variant="secondary" className="mt-2 bg-emerald-50 text-emerald-800 border-emerald-100 font-bold uppercase text-[9px] tracking-wider">5 km grid</Badge>
          </CardContent></Card>
        </div>

        <Card className="bg-white border border-emerald-100 shadow-sm overflow-hidden">
          <CardHeader className="border-b border-emerald-50 p-4"><CardTitle className="text-sm font-semibold text-slate-800">Block Inventory & Suitability</CardTitle></CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            {cropLoading ? (
              <div className="p-8 text-center text-slate-500 font-medium">Loading block inventory...</div>
            ) : plots.length === 0 ? (
              <div className="p-12 text-center text-slate-400 font-medium">No sugarcane blocks registered for this tenant.</div>
            ) : (
              <table className="w-full text-xs">
                <thead className="bg-emerald-50/20 text-emerald-800 font-bold uppercase tracking-wider text-[10px] border-b border-emerald-50 text-left">
                  <tr>
                    {["Block ID", "Name", "Hectares", "Land Use", "Soil", "Thermal", "Rainfall", "Water", "Suitability"].map((h) => (
                      <th key={h} className="px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {plots.map((b) => {
                    const badgeClass = b.suitability === "Suitable"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200/50"
                      : b.suitability === "Marginal"
                        ? "bg-slate-100 text-slate-700 border border-slate-200"
                        : "bg-emerald-800/10 text-emerald-950 font-bold border border-emerald-400";
                    return (
                      <tr key={b.id} className="hover:bg-emerald-50/10 transition">
                        <td className="px-4 py-3.5 font-mono text-slate-500 font-semibold">{b.id}</td>
                        <td className="px-4 py-3.5 font-semibold text-slate-800">{b.name}</td>
                        <td className="px-4 py-3.5 text-slate-600">{b.hectares.toFixed(1)} ha</td>
                        <td className="px-4 py-3.5"><span className="px-2 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-100">{b.landUseStatus}</span></td>
                        <td className="px-4 py-3.5 text-slate-500 font-mono">{b.soilScore}</td>
                        <td className="px-4 py-3.5 text-slate-500 font-mono">{b.thermalScore}</td>
                        <td className="px-4 py-3.5 text-slate-500 font-mono">{b.rainfallScore}</td>
                        <td className="px-4 py-3.5 text-slate-500">{b.waterAvailability}</td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${badgeClass}`}>
                            {b.suitability}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </main>
    </AppLayout>
  );
}
