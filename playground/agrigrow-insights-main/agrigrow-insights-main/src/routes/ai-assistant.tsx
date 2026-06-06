import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { AIAssistantPage } from "@/components/ai/AIAssistantPage";

export const Route = createFileRoute("/ai-assistant")({
  head: () => ({ meta: [{ title: "AI Assistant — FarmSense" }] }),
  component: () => (
    <AppShell>
      <TopBar title="AI Assistant" />
      <div className="flex-1 overflow-hidden"><AIAssistantPage /></div>
    </AppShell>
  ),
});
