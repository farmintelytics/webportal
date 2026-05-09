import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "../components/layout/AppShell";
import { TopBar } from "../components/layout/TopBar";
import { DashboardPage } from "../components/dashboard/DashboardPage";

import { MapView } from "../components/map/MapView";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Map View — FarmSense" }] }),
  component: () => (
    <>
      <TopBar title="Map View" />
      <div className="flex-1 relative overflow-hidden">
        <MapView />
      </div>
    </>
  ),
});
