import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polygon, Tooltip, useMap } from "react-leaflet";
import { mapCenter, type Block, type MapLayer } from "../data/fallbackData";
import type { Basemap } from "../routes/map";

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

function FitBounds({ blocks }: { blocks: Block[] }) {
  const map = useMap();
  useEffect(() => {
    const all = blocks.flatMap((b) => b.polygon) as [number, number][];
    if (all.length) map.fitBounds(all, { padding: [40, 40] });
  }, [map, blocks]);
  return null;
}

import { SATELLITE_TILE_URL, BOUNDARIES_TILE_URL, BASE_MAP_ATTRIBUTION } from "../../../../constants/map";

const basemapTiles: Record<Basemap, { url: string; attribution: string; overlay?: string }> = {
  satellite: {
    url: SATELLITE_TILE_URL,
    attribution: BASE_MAP_ATTRIBUTION,
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
    url: SATELLITE_TILE_URL,
    attribution: BASE_MAP_ATTRIBUTION,
    overlay: BOUNDARIES_TILE_URL,
  },
};


// Ramer-Douglas-Peucker geometry simplification algorithm to optimize rendering
function getSqDist(p1: [number, number], p2: [number, number]) {
  const dx = p1[0] - p2[0];
  const dy = p1[1] - p2[1];
  return dx * dx + dy * dy;
}
function getSqSegDist(p: [number, number], p1: [number, number], p2: [number, number]) {
  let x = p1[0];
  let y = p1[1];
  let dx = p2[0] - x;
  let dy = p2[1] - y;
  if (dx !== 0 || dy !== 0) {
    const t = ((p[0] - x) * dx + (p[1] - y) * dy) / (dx * dx + dy * dy);
    if (t > 1) {
      x = p2[0];
      y = p2[1];
    } else if (t > 0) {
      x += dx * t;
      y += dy * t;
    }
  }
  dx = p[0] - x;
  dy = p[1] - y;
  return dx * dx + dy * dy;
}
function simplifyDPStep(points: [number, number][], first: number, last: number, sqTolerance: number, simplified: [number, number][]) {
  let maxSqDist = sqTolerance;
  let index = -1;
  for (let i = first + 1; i < last; i++) {
    const sqDist = getSqSegDist(points[i], points[first], points[last]);
    if (sqDist > maxSqDist) {
      index = i;
      maxSqDist = sqDist;
    }
  }
  if (maxSqDist > sqTolerance) {
    if (index - first > 1) simplifyDPStep(points, first, index, sqTolerance, simplified);
    simplified.push(points[index]);
    if (last - index > 1) simplifyDPStep(points, index, last, sqTolerance, simplified);
  }
}
function simplifyPolygon(points: [number, number][], tolerance: number = 0.00005): [number, number][] {
  if (points.length <= 4) return points;
  const sqTolerance = tolerance * tolerance;
  const last = points.length - 1;
  const simplified = [points[0]];
  simplifyDPStep(points, 0, last, sqTolerance, simplified);
  simplified.push(points[last]);
  return simplified;
}

export function FarmMap({
  layers, onSelect, selectedId, basemap = "satellite", blocks = [],
}: {
  layers: MapLayer[];
  onSelect: (b: Block) => void;
  selectedId?: string;
  basemap?: Basemap;
  blocks?: Block[];
  currentTileUrl?: string | null;
  zarrBounds?: any;
  primaryLayer?: string;
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
      {currentTileUrl && (
        <TileLayer
          key={currentTileUrl}
          url={currentTileUrl}
          opacity={0.8}
          bounds={zarrBounds || undefined}
          maxZoom={22}
          maxNativeZoom={18}
          zIndex={300}
        />
      )}
      <FitBounds blocks={blocks} />
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
        
        const isRasterVisible = currentTileUrl && enabled(primaryLayer || "");
        if (isRasterVisible) {
          fill = "transparent";
          fillOpacity = 0;
        }
        
        // Apply Ramer-Douglas-Peucker simplification to improve rendering performance and minimize lag
        const simplifiedPolygon = simplifyPolygon(b.polygon as [number, number][]);

        return (
          <Polygon
            key={b.id}
            positions={simplifiedPolygon}
            pathOptions={{
              color: isRasterVisible ? "#ffffff" : (isSel ? "#fef08a" : stroke),
              weight: isSel ? 3 : (isRasterVisible ? 1.5 : 2),
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
