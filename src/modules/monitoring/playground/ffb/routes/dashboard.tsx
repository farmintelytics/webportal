import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "./pages/Dashboard";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — PalmSense" }, { name: "description", content: "Plantation operations dashboard with NDVI trends, FFB forecasts, and disease alerts." }] }),
  component: Dashboard,
});
