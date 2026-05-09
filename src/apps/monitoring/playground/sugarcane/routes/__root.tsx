import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { SidebarProvider } from "@monitoring-shared/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";
import { Toaster } from "@monitoring-shared/ui/sonner";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">Go home</Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "CaneSense — Sugarcane Remote Sensing Platform" },
      { name: "description", content: "Geospatial sugarcane monitoring: planting suitability, growth tracking and yield forecasting." },
      { property: "og:title", content: "CaneSense — Sugarcane Remote Sensing Platform" },
      { name: "twitter:title", content: "CaneSense — Sugarcane Remote Sensing Platform" },
      { property: "og:description", content: "Geospatial sugarcane monitoring: planting suitability, growth tracking and yield forecasting." },
      { name: "twitter:description", content: "Geospatial sugarcane monitoring: planting suitability, growth tracking and yield forecasting." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/3745396b-04d9-45a5-85b2-5238d53de114/id-preview-80316f65--32c28c69-6203-4587-8387-491fe312cb94.FarmIntelytics.app-1777939852639.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/3745396b-04d9-45a5-85b2-5238d53de114/id-preview-80316f65--32c28c69-6203-4587-8387-491fe312cb94.FarmIntelytics.app-1777939852639.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex h-screen flex-1 flex-col overflow-hidden">
          <Outlet />
        </div>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}
