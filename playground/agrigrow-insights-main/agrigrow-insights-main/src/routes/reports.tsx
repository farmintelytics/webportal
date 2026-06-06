import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { ReportsPage } from "@/components/reports/ReportsPage";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [{ title: "Reports — FarmSense" }] }),
  component: () => (
    <AppShell>
      <TopBar title="Reports" />
      <div className="flex-1 overflow-y-auto"><ReportsPage /></div>
    </AppShell>
  ),
});
