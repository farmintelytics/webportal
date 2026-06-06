import { MapContainer, TileLayer, Polygon, Tooltip, LayerGroup, Pane } from "react-leaflet";
import { plots, alertColors, stageColors, Plot } from "../lib/mockData";

export type LayerId = "alert" | "stage" | "yield" | "ndvi" | "suitability" | "lswi";

const colorFor = (p: Plot, mode: LayerId) => {
  if (mode === "alert") return alertColors[p.alert];
  if (mode === "stage") return stageColors[p.stage];
  if (mode === "yield") {
    const y = p.predictedYield;
    return y > 5 ? "#15803d" : y > 4 ? "#84cc16" : y > 3 ? "#f59e0b" : "#dc2626";
  }
  if (mode === "ndvi") {
    const v = p.ndvi;
    return v > 0.7 ? "#15803d" : v > 0.5 ? "#84cc16" : v > 0.35 ? "#f59e0b" : "#a16207";
  }
  if (mode === "lswi") {
    const v = p.lswi;
    return v > 0.4 ? "#1e40af" : v > 0.25 ? "#3b82f6" : v > 0.15 ? "#93c5fd" : "#fde68a";
  }
  return p.suitability === "High" ? "#15803d" : p.suitability === "Moderate" ? "#f59e0b" : "#dc2626";
};

export type ActiveLayers = Partial<Record<LayerId, number>>; // id -> opacity 0..1

export function MapView({
  layers,
  basemap = "satellite",
  onSelect,
  selectedId,
  height = "100%",
}: {
  layers: ActiveLayers;
  basemap?: "satellite" | "street" | "terrain";
  onSelect?: (p: Plot) => void;
  selectedId?: string;
  height?: string | number;
}) {
  const baseUrl =
    basemap === "street"
      ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      : basemap === "terrain"
      ? "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
      : "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";

  const order: LayerId[] = ["suitability", "yield", "ndvi", "lswi", "stage", "alert"];
  const active = order.filter((id) => layers[id] !== undefined && (layers[id] as number) > 0);

  return (
    <MapContainer
      center={[10.49, 105.66]}
      zoom={13}
      style={{ height, width: "100%" }}
      scrollWheelZoom
    >
      <TileLayer
        attribution={
          basemap === "street"
            ? "© OpenStreetMap"
            : basemap === "terrain"
            ? "© OpenTopoMap"
            : "© Esri World Imagery"
        }
        url={baseUrl}
      />
      <TileLayer 
        attribution="&copy; Esri Boundaries"
        url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
        opacity={0.6}
      />
      {active.map((id, idx) => (
        <Pane key={id} name={`pane-${id}`} style={{ zIndex: 400 + idx * 10 }}>
          <LayerGroup>
            {plots.map((p) => {
              const c = colorFor(p, id);
              const isSel = selectedId === p.id;
              const op = layers[id] ?? 0.6;
              return (
                <Polygon
                  key={p.id + id}
                  positions={p.polygon}
                  pathOptions={{
                    color: isSel ? "#0f172a" : c,
                    weight: isSel ? 2.5 : 1,
                    fillColor: c,
                    fillOpacity: op * 0.8,
                    opacity: op,
                  }}
                  eventHandlers={{ click: () => onSelect?.(p) }}
                >
                  {idx === active.length - 1 && (
                    <Tooltip direction="top" offset={[0, -4]} opacity={1}>
                      <div className="text-xs">
                        <div className="font-semibold">{p.name} · {p.id}</div>
                        <div>NDVI {p.ndvi} · VHI {p.vhi}</div>
                        <div>Yield {p.predictedYield} t/ha · {p.stage}</div>
                      </div>
                    </Tooltip>
                  )}
                </Polygon>
              );
            })}
          </LayerGroup>
        </Pane>
      ))}
    </MapContainer>
  );
}
