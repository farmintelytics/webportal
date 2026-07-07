import { createFileRoute } from "@tanstack/react-router";
import { DataManagement } from "./DataManagementPage";

export const Route = createFileRoute("/data")({
  head: () => ({ meta: [{ title: "Data Management — PalmSense" }, { name: "description", content: "Manage block boundaries, planting records, and remote sensing data sources." }] }),
  component: DataManagement,
});
