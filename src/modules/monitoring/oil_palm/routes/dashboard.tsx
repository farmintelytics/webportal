import { createFileRoute } from "@tanstack/react-router";
import { MapView } from "./MapViewPage";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Map View — PalmSense" }, { name: "description", content: "Plantation operations dashboard with NDVI trends, FFB forecasts, and disease alerts." }] }),
  component: MapView,
});
