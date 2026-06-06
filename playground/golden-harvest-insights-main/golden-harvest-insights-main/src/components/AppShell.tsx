import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import {
  Map, LayoutDashboard, Sparkles, FileText, Database,
  Bell, Search, ChevronLeft, ChevronRight, LogOut, Trees,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Map View", icon: Map },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/ai-assistant", label: "AI Assistant", icon: Sparkles },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/data", label: "Data Management", icon: Database },
] as const;

const titles: Record<string, string> = {
  "/": "Plantation Map",
  "/dashboard": "Operations Dashboard",
  "/ai-assistant": "AI Agronomy Assistant",
  "/reports": "Reports",
  "/data": "Data Management",
};

export function AppShell() {
  const [collapsed, setCollapsed] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const title = titles[path] ?? "PalmSense";

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <aside
        className={cn(
          "flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-200",
          collapsed ? "w-16" : "w-60"
        )}
      >
        <div className="flex items-center gap-2 px-4 h-16 border-b border-sidebar-border">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Trees className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="text-base font-semibold">PalmSense</span>
              <span className="text-[10px] uppercase tracking-wider text-sidebar-foreground/60">Oil Palm Intelligence</span>
            </div>
          )}
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1">
          {nav.map((item) => {
            const active = path === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-accent text-white"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-white"
                )}
              >
                {active && <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r bg-primary" />}
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-3 space-y-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center rounded-md py-1.5 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-white"
            aria-label="Toggle sidebar"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
          <div className={cn("flex items-center gap-3 rounded-md px-2 py-2", !collapsed && "bg-sidebar-accent/40")}>
            <div className="h-8 w-8 rounded-full bg-primary/80 flex items-center justify-center text-xs font-semibold text-primary-foreground">AO</div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium truncate">Adaeze Okafor</div>
                <div className="text-[10px] text-sidebar-foreground/60">Estate Manager</div>
              </div>
            )}
            {!collapsed && <LogOut className="h-4 w-4 text-sidebar-foreground/60 hover:text-white cursor-pointer" />}
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border bg-card flex items-center gap-4 px-6 shrink-0">
          <h1 className="text-lg font-semibold">{title}</h1>
          <div className="flex-1 max-w-md ml-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search blocks, harvests, planting years…"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-md bg-muted border border-transparent focus:bg-card focus:border-border focus:outline-none focus:ring-2 focus:ring-ring/40"
              />
            </div>
          </div>
          <button className="relative p-2 rounded-md hover:bg-muted" aria-label="Notifications">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground flex items-center justify-center">5</span>
          </button>
          <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-xs font-semibold text-secondary-foreground">AO</div>
        </header>
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
