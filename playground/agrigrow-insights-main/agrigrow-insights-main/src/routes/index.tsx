import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { MapView } from "@/components/map/MapView";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Map View — FarmSense" }] }),
  component: Page,
});

function Page() {
  return (
    <AppShell>
      <TopBar title="Map View" />
      <div className="flex-1 relative overflow-hidden">
        <MapView />
      </div>
    </AppShell>
  );
}
