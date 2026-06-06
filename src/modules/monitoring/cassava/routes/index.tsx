import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "../components/layout/AppShell";
import { TopBar } from "../components/layout/TopBar";

import { DashboardPage } from "../components/dashboard/DashboardPage";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Dashboard — FarmSense" }] }),
  component: () => (
    <>
      <TopBar title="Dashboard" />
      <div className="flex-1 overflow-y-auto"><DashboardPage /></div>
    </>
  ),
});
