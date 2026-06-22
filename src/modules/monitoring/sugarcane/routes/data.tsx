import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "../components/TopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@monitoring-shared/ui/card";
import { AppLayout } from "../components/AppLayout";
import { blocks } from "../data/fallbackData";
import { Badge } from "@monitoring-shared/ui/badge";

export const Route = createFileRoute("/data")({ component: DataPage });

function DataPage() {
  return (
    <AppLayout>
      <TopBar title="Data Management" />
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="mb-4 grid gap-3 sm:grid-cols-3">
          <Card><CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Sentinel-2 last sync</div>
            <div className="mt-1 text-lg font-bold">2 days ago</div>
            <Badge variant="secondary" className="mt-2">10m optical</Badge>
          </CardContent></Card>
          <Card><CardContent className="p-4">
            <div className="text-xs text-muted-foreground">Sentinel-1 last sync</div>
            <div className="mt-1 text-lg font-bold">5 days ago</div>
            <Badge variant="secondary" className="mt-2">SAR C-band</Badge>
          </CardContent></Card>
          <Card><CardContent className="p-4">
            <div className="text-xs text-muted-foreground">CHIRPS rainfall</div>
            <div className="mt-1 text-lg font-bold">Updated daily</div>
            <Badge variant="secondary" className="mt-2">5 km grid</Badge>
          </CardContent></Card>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-sm">Block Inventory & Suitability</CardTitle></CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="border-b border-border text-left text-muted-foreground">
                <tr>
                  {["Block ID", "Name", "Hectares", "Land Use", "Soil", "Thermal", "Rainfall", "Water", "Suitability"].map((h) => (
                    <th key={h} className="px-2 py-2 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {blocks.map((b) => (
                  <tr key={b.id} className="border-b border-border/50">
                    <td className="px-2 py-2 font-mono">{b.id}</td>
                    <td className="px-2 py-2">{b.name}</td>
                    <td className="px-2 py-2">{b.hectares}</td>
                    <td className="px-2 py-2">{b.landUseStatus}</td>
                    <td className="px-2 py-2">{b.soilScore}</td>
                    <td className="px-2 py-2">{b.thermalScore}</td>
                    <td className="px-2 py-2">{b.rainfallScore}</td>
                    <td className="px-2 py-2">{b.waterAvailability}</td>
                    <td className="px-2 py-2">
                      <Badge className={
                        b.suitability === "Suitable" ? "bg-emerald-600 text-white"
                          : b.suitability === "Marginal" ? "bg-amber-500 text-white" : "bg-red-600 text-white"
                      }>{b.suitability}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </main>
    </AppLayout>
  );
}
