import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "./DashboardPage";


export const Route = createFileRoute("/")({
  component: Dashboard,
});
