import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { PLOTS, statusColor, type Plot } from "../lib/farm-data";

type Props = {
  selected: Plot;
  onSelect: (p: Plot) => void;
  showBoundaries: boolean;
  showNDVI: boolean;
  showVHI: boolean;
  opacity: number;
  basemap?: "satellite" | "terrain" | "streets";
  source?: "sentinel" | "landsat";
  date?: string;
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

  // Plot polygons + markers
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;
    layersRef.current.forEach((l) => map.removeLayer(l));
    layersRef.current = [];

    if (!showBoundaries) return;

    PLOTS.forEach((p) => {
      // approximate polygon
      const d = Math.sqrt(p.area) * 0.0008;
      const bounds: [number, number][] = [
        [p.lat - d, p.lng - d],
        [p.lat - d, p.lng + d],
        [p.lat + d, p.lng + d],
        [p.lat + d, p.lng - d],
      ];
      const color = statusColor[p.status];
      const poly = L.polygon(bounds, {
        color,
        weight: selected.id === p.id ? 4 : 2,
        fillColor: color,
        fillOpacity: (opacity / 100) * 0.45,
      }).addTo(map);
      poly.on("click", () => onSelect(p));
      poly.bindTooltip(`<b>${p.id}</b> · ${p.name}`, {
        direction: "top",
        offset: [0, -8],
      });
      layersRef.current.push(poly);
    });
  }, [showBoundaries, opacity, selected, onSelect]);

  // NDVI fake overlay (color tint)
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;
    if (ndviRef.current) {
      map.removeLayer(ndviRef.current);
      ndviRef.current = null;
    }
    if (showNDVI) {
      const isSentinel = source === "sentinel";
      const layer = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        { 
          opacity: (opacity / 100) * 0.55, 
          className: isSentinel ? "ndvi-sentinel" : "ndvi-landsat" 
        },
      ).addTo(map);
      ndviRef.current = layer;
    }
  }, [showNDVI, opacity, source]);

  // VHI heat circles
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;
    if (vhiRef.current) {
      map.removeLayer(vhiRef.current);
      vhiRef.current = null;
    }
    if (showVHI) {
      const group = L.layerGroup();
      PLOTS.forEach((p) => {
        const intensity = (100 - p.vhi) / 100;
        L.circle([p.lat, p.lng], {
          radius: 280,
          color: `oklch(0.62 ${0.05 + intensity * 0.2} ${30 + (1 - intensity) * 90})`,
          fillColor: `oklch(0.62 ${0.05 + intensity * 0.2} ${30 + (1 - intensity) * 90})`,
          fillOpacity: (opacity / 100) * 0.4,
          weight: 0,
        }).addTo(group);
      });
      group.addTo(map);
      vhiRef.current = group;
    }
  }, [showVHI, opacity]);

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
    if (!map) return;
    map.flyTo([selected.lat, selected.lng], 15, { duration: 0.6 });
  }, [selected]);

  return (
    <>
      <style>{`
        .ndvi-sentinel { filter: hue-rotate(65deg) saturate(2.4) brightness(0.9); mix-blend-mode: multiply; }
        .ndvi-landsat { filter: hue-rotate(45deg) saturate(1.8) brightness(1.0); mix-blend-mode: multiply; }
        .leaflet-container { background: #0d1f0d; font-family: inherit; }
      `}</style>
      <div ref={mapRef} className="absolute inset-0" />
    </>
  );
}
