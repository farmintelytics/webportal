import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "../components/layout/AppShell";
import { TopBar } from "../components/layout/TopBar";
import { DataPage } from "../components/data/DataPage";

export const Route = createFileRoute("/data")({
  head: () => ({ meta: [{ title: "Data Management — FarmSense" }] }),
  component: () => (
    <AppShell>
      <TopBar title="Data Management" />
      <div className="flex-1 overflow-y-auto"><DataPage /></div>
    </AppShell>
  ),
});
