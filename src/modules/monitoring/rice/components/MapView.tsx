import { MapContainer, TileLayer, Polygon, Tooltip, LayerGroup, Pane } from "react-leaflet";
import { alertColors, stageColors, Plot } from "../lib/fallbackData";
import { SATELLITE_TILE_URL, BOUNDARIES_TILE_URL, BASE_MAP_ATTRIBUTION } from "../../../../constants/map";

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
  if (mode === "suitability") return p.suitability === "High" ? "#16a34a" : p.suitability === "Medium" ? "#f59e0b" : "#dc2626";
  const w = p.lswi;
  return w > 0.4 ? "#0284c7" : w > 0.2 ? "#bae6fd" : "#fca5a5";
};

export function MapView({
  plots = [],
  layers = {},
  basemap = "satellite",
  onSelect,
  selectedId,
  height = "400px",
}: {
  plots?: Plot[];
  layers?: Record<LayerId, number> | any;
  basemap?: "street" | "terrain" | "satellite";
  onSelect?: (p: Plot) => void;
  selectedId?: string;
  height?: string;
}) {
  const baseUrl =
    basemap === "street"
      ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      : basemap === "terrain"
      ? "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
      : SATELLITE_TILE_URL;

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
            : BASE_MAP_ATTRIBUTION
        }
        url={baseUrl}
      />
      <TileLayer 
        attribution="&copy; Esri Boundaries"
        url={BOUNDARIES_TILE_URL}
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
