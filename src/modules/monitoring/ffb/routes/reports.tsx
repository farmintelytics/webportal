import { createFileRoute } from "@tanstack/react-router";
import { Reports } from "../pages/Reports";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [{ title: "Reports — PalmSense" }, { name: "description", content: "Generate estate, block, FFB yield, and disease risk reports." }] }),
  component: Reports,
});
