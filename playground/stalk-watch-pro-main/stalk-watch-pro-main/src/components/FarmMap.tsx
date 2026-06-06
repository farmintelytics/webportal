import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polygon, Tooltip, useMap } from "react-leaflet";
import { blocks, mapCenter, type Block, type MapLayer } from "@/data/mockData";
import type { Basemap } from "@/routes/map";

function colorForGrowth(stage: Block["growthStage"]) {
  switch (stage) {
    case "Tillering": return "#a7d1a3";
    case "Grand Growth": return "#2f7d3a";
    case "Maturation": return "#d6a64a";
    case "Harvest Ready": return "#c46a18";
  }
}
function colorForVHI(v: number) {
  if (v < 35) return "#dc2626";
  if (v < 60) return "#f59e0b";
  return "#16a34a";
}
function colorForLSWI(v: number) {
  if (v < 0.2) return "#fca5a5";
  if (v > 0.35) return "#0284c7";
  return "#bae6fd";
}
function colorForEVI(v: number) {
  if (v < 0.3) return "#fde68a";
  if (v < 0.5) return "#84cc16";
  return "#15803d";
}
function colorForSuitability(s: Block["suitability"]) {
  return s === "Suitable" ? "#16a34a" : s === "Marginal" ? "#f59e0b" : "#dc2626";
}

function FitBounds() {
  const map = useMap();
  useEffect(() => {
    const all = blocks.flatMap((b) => b.polygon) as [number, number][];
    if (all.length) map.fitBounds(all, { padding: [40, 40] });
  }, [map]);
  return null;
}

const basemapTiles: Record<Basemap, { url: string; attribution: string; overlay?: string }> = {
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "&copy; Esri",
  },
  streets: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "&copy; OpenStreetMap contributors",
  },
  terrain: {
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution: "&copy; OpenTopoMap (CC-BY-SA)",
  },
  hybrid: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "&copy; Esri",
    overlay: "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
  },
};

export function FarmMap({
  layers, onSelect, selectedId, basemap = "satellite",
}: {
  layers: MapLayer[];
  onSelect: (b: Block) => void;
  selectedId?: string;
  basemap?: Basemap;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-full w-full bg-muted" />;

  const enabled = (id: string) => layers.find((l) => l.id === id)?.enabled;
  const opacity = (id: string) => layers.find((l) => l.id === id)?.opacity ?? 0.7;
  const tile = basemapTiles[basemap];

  return (
    <MapContainer center={mapCenter} zoom={14} className="h-full w-full" zoomControl={false}>
      <TileLayer key={basemap} attribution={tile.attribution} url={tile.url} />
      {tile.overlay && <TileLayer key={`${basemap}-overlay`} url={tile.overlay} attribution="" />}
      <FitBounds />
      {blocks.map((b) => {
        let fill = "transparent";
        let fillOpacity = 0;
        if (enabled("growth-stage")) { fill = colorForGrowth(b.growthStage); fillOpacity = opacity("growth-stage"); }
        if (enabled("evi")) { fill = colorForEVI(b.evi); fillOpacity = opacity("evi"); }
        if (enabled("lswi")) { fill = colorForLSWI(b.lswi); fillOpacity = opacity("lswi"); }
        if (enabled("vhi")) { fill = colorForVHI(b.vhi); fillOpacity = opacity("vhi"); }
        if (enabled("suitability")) { fill = colorForSuitability(b.suitability); fillOpacity = opacity("suitability"); }
        const stroke = enabled("boundaries") ? "#fcd34d" : "transparent";
        const isSel = selectedId === b.id;
        return (
          <Polygon
            key={b.id}
            positions={b.polygon}
            pathOptions={{
              color: isSel ? "#fef08a" : stroke,
              weight: isSel ? 3 : 2,
              fillColor: fill,
              fillOpacity,
            }}
            eventHandlers={{ click: () => onSelect(b) }}
          >
            <Tooltip direction="center" permanent={false} opacity={0.9}>
              <div className="text-xs font-semibold">{b.name}</div>
              <div className="text-[10px]">{b.growthStage} · {b.hectares} ha</div>
            </Tooltip>
          </Polygon>
        );
      })}
    </MapContainer>
  );
}
