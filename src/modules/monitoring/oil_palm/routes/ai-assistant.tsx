import { createFileRoute } from "@tanstack/react-router";
import { AIAssistant } from "./AIAssistantPage";

export const Route = createFileRoute("/ai-assistant")({
  head: () => ({ meta: [{ title: "AI Assistant — PalmSense" }, { name: "description", content: "AI scenario modeling for FFB yield, disease risk, and replanting decisions." }] }),
  component: AIAssistant,
});
