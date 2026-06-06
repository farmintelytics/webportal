import { createFileRoute } from "@tanstack/react-router";
import { MapView } from "@/pages/MapView";

export const Route = createFileRoute("/")({
  component: MapView,
});
