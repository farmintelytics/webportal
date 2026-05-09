import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Polygon, useMap } from "react-leaflet";
import { LatLngBoundsExpression } from "leaflet";
import { plots, statusColors, Plot } from "./lib/mockData";
import { PlotDetailCard } from "./PlotDetailCard";
import { LayerPanel } from "./LayerPanel";
import { TimeSlider } from "./TimeSlider";
import { Search, Layers as LayersIcon } from "lucide-react";
import { Input } from "@monitoring-shared/ui/input";
import { Button } from "@monitoring-shared/ui/button";

function FitBounds({ bounds }: { bounds: LatLngBoundsExpression }) {
  const map = useMap();
  useEffect(() => { map.fitBounds(bounds, { padding: [60, 60] }); }, [map, bounds]);
  return null;
}

export function MapView() {
  const [selected, setSelected] = useState<Plot | null>(null);
  const [showLayers, setShowLayers] = useState(true);
  const [query, setQuery] = useState("");

  const bounds = useMemo<LatLngBoundsExpression>(() => {
    const lats = plots.map(p => p.center[0]);
    const lngs = plots.map(p => p.center[1]);
    return [[Math.min(...lats) - 0.005, Math.min(...lngs) - 0.005], [Math.max(...lats) + 0.005, Math.max(...lngs) + 0.005]];
  }, []);

  const filteredHighlight = query
    ? plots.find(p => p.id.toLowerCase().includes(query.toLowerCase()) || p.batchId.toLowerCase().includes(query.toLowerCase()))
    : null;

  return (
    <div className="absolute inset-0">
      <MapContainer center={[7.51, 5.02]} zoom={14} className="size-full" zoomControl={false}>
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="Tiles © Esri"
        />
        <FitBounds bounds={bounds} />
        {plots.map(p => {
          const isHi = filteredHighlight?.id === p.id;
          return (
            <Polygon
              key={p.id}
              positions={p.polygon.map(c => [c[1], c[0]]) as [number, number][]}
              pathOptions={{
                color: statusColors[p.status],
                fillColor: statusColors[p.status],
                fillOpacity: isHi ? 0.7 : 0.4,
                weight: isHi ? 4 : 2,
              }}
              eventHandlers={{ click: () => setSelected(p) }}
            />
          );
        })}
      </MapContainer>

      {/* Search */}
      <div className="absolute top-4 left-4 z-[400] w-72">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search plot, batch, farm…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="pl-9 bg-card shadow-md border-border"
          />
        </div>
      </div>

      {/* Toggle layers btn */}
      <Button
        variant="secondary"
        size="icon"
        className="absolute top-4 right-4 z-[400] shadow-md"
        onClick={() => setShowLayers(s => !s)}
      >
        <LayersIcon className="size-4" />
      </Button>

      {showLayers && (
        <div className="absolute top-16 right-4 z-[400] w-72">
          <LayerPanel />
        </div>
      )}

      {selected && (
        <div className="absolute top-4 right-20 bottom-24 z-[400] w-80 overflow-y-auto">
          <PlotDetailCard plot={selected} onClose={() => setSelected(null)} />
        </div>
      )}

      <div className="absolute bottom-4 left-4 right-4 z-[400]">
        <TimeSlider />
      </div>

      {/* Legend */}
      <div className="absolute bottom-24 left-4 z-[400] bg-card/95 backdrop-blur rounded-lg shadow-card p-3 text-xs space-y-1.5">
        <div className="font-semibold mb-1">Plot Status</div>
        {Object.entries(statusColors).map(([k, v]) => (
          <div key={k} className="flex items-center gap-2">
            <span className="size-3 rounded" style={{ background: v }} />
            <span className="capitalize">{k}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
