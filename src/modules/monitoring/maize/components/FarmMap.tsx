import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const statusColor: Record<string, string> = {
  Healthy: "oklch(0.55 0.16 145)",
  "Nitrogen Risk": "oklch(0.7 0.16 75)",
  "Drought Risk": "oklch(0.62 0.22 28)",
  "Heat Stress": "oklch(0.6 0.2 30)",
};

type Props = {
  selected: any;
  onSelect: (p: any) => void;
  showBoundaries: boolean;
  showNDVI: boolean;
  showVHI: boolean;
  opacity: number;
  basemap?: "satellite" | "terrain" | "streets";
  source?: "sentinel" | "landsat";
  date?: string;
  plots: any[];
  currentTileUrl?: string | null;
  zarrBounds?: any;
};

export function FarmMap({
  selected,
  onSelect,
  showBoundaries,
  showNDVI,
  showVHI,
  opacity,
  basemap = "satellite",
  source = "sentinel",
  date,
  plots,
  currentTileUrl,
  zarrBounds,
}: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const layersRef = useRef<L.Layer[]>([]);
  const ndviRef = useRef<L.TileLayer | null>(null);
  const vhiRef = useRef<L.LayerGroup | null>(null);
  const basemapRef = useRef<L.TileLayer | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: [-0.53, 35.275],
      zoom: 14,
      zoomControl: false,
    });
    mapInstance.current = map;

    const base = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      { maxZoom: 19 },
    ).addTo(map);
    basemapRef.current = base;

    L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
      { maxZoom: 18, opacity: 0.6 },
    ).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  // Real Zarr Raster Tile Overlay
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;
    if (ndviRef.current) {
      map.removeLayer(ndviRef.current);
      ndviRef.current = null;
    }
    if (showNDVI && currentTileUrl) {
      const layer = L.tileLayer(currentTileUrl, {
        opacity: (opacity / 100) * 0.9,
        bounds: zarrBounds || undefined,
        maxZoom: 22,
        maxNativeZoom: 18,
        zIndex: 300,
      }).addTo(map);
      ndviRef.current = layer;
    }
  }, [showNDVI, currentTileUrl, zarrBounds, opacity]);

  // Plot polygons
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;
    layersRef.current.forEach((l) => map.removeLayer(l));
    layersRef.current = [];

    if (!showBoundaries || !plots || plots.length === 0) return;

    plots.forEach((p) => {
      // approximate polygon if geometry coordinates not fully populated
      const d = Math.sqrt(p.area) * 0.0008;
      const bounds: [number, number][] = p.lat && p.lng ? [
        [p.lat - d, p.lng - d],
        [p.lat - d, p.lng + d],
        [p.lat + d, p.lng + d],
        [p.lat + d, p.lng - d],
      ] : [
        [-0.53 - d, 35.275 - d],
        [-0.53 - d, 35.275 + d],
        [-0.53 + d, 35.275 + d],
        [-0.53 + d, 35.275 - d],
      ];

      const hasRaster = showNDVI && currentTileUrl;
      const fillColor = hasRaster ? "transparent" : (statusColor[p.status] ?? "oklch(0.55 0.16 145)");
      const fillOpacity = hasRaster ? 0 : 0.45;
      const strokeColor = hasRaster ? "#ffffff" : (statusColor[p.status] ?? "oklch(0.55 0.16 145)");

      const isSel = selected && selected.id === p.id;

      const poly = L.polygon(bounds, {
        color: isSel ? "#fef08a" : strokeColor,
        weight: isSel ? 4 : (hasRaster ? 1.5 : 2),
        fillColor,
        fillOpacity,
      }).addTo(map);
      
      poly.on("click", () => onSelect(p));
      poly.bindTooltip(`<b>${p.id}</b> · ${p.name}`, {
        direction: "top",
        offset: [0, -8],
      });
      layersRef.current.push(poly);
    });
  }, [showBoundaries, plots, showNDVI, currentTileUrl, selected, onSelect]);

  // VHI heat circles (as fallback/operational stress overlay)
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;
    if (vhiRef.current) {
      map.removeLayer(vhiRef.current);
      vhiRef.current = null;
    }
    if (showVHI && plots && plots.length > 0) {
      const group = L.layerGroup();
      plots.forEach((p) => {
        if (p.lat && p.lng) {
          const intensity = (100 - p.vhi) / 100;
          L.circle([p.lat, p.lng], {
            radius: 280,
            color: `oklch(0.62 ${0.05 + intensity * 0.2} ${30 + (1 - intensity) * 90})`,
            fillColor: `oklch(0.62 ${0.05 + intensity * 0.2} ${30 + (1 - intensity) * 90})`,
            fillOpacity: 0.4,
            weight: 0,
          }).addTo(group);
        }
      });
      group.addTo(map);
      vhiRef.current = group;
    }
  }, [showVHI, plots]);

  // Update Basemap
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;
    if (basemapRef.current) {
      map.removeLayer(basemapRef.current);
    }
    
    const url =
      basemap === "streets"
        ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        : basemap === "terrain"
        ? "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
        : "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
        
    const attribution = 
      basemap === "streets" ? "© OpenStreetMap" : 
      basemap === "terrain" ? "© OpenTopoMap" : 
      "© Esri World Imagery";

    basemapRef.current = L.tileLayer(url, { 
      maxZoom: 19,
      attribution
    }).addTo(map);
    basemapRef.current.bringToBack();
  }, [basemap]);

  // Pan to selected
  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !selected || !selected.lat || !selected.lng) return;
    map.flyTo([selected.lat, selected.lng], 15, { duration: 0.6 });
  }, [selected]);

  return (
    <>
      <style>{`
        .leaflet-container { background: #0d1f0d; font-family: inherit; }
      `}</style>
      <div ref={mapRef} className="absolute inset-0" />
    </>
  );
}
