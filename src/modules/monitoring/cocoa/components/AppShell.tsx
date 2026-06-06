import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, Map, FileText, Bell, Leaf, FileDown, Activity, Sparkles, MapPin, TrendingUp, Search, Bell as BellIcon, User } from "lucide-react";

const primaryNav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/dashboard", label: "Map View", icon: Map },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/assistant", label: "AI Assistant", icon: Sparkles },
];

const secondaryNav = [
  { to: "/planning", label: "Planning", icon: MapPin },
  { to: "/monitoring", label: "Monitoring", icon: Activity },
  { to: "/yield", label: "Yield Forecast", icon: TrendingUp },
  { to: "/alerts", label: "Alerts", icon: Bell },
  { to: "/exports", label: "Data Exports", icon: FileDown },
];

import { useMonitoring } from "../../shared/MonitoringContext";
import { LogOut } from "lucide-react";

export function AppShell() {
  const { pathname } = useLocation();
  const { onBack, onSignOut } = useMonitoring();

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 h-screen flex w-60 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
        <div className="px-5 py-5 flex items-center gap-2.5 border-b border-sidebar-border">
          <div className="size-9 rounded-lg bg-sidebar-primary/20 flex items-center justify-center">
            <Leaf className="size-5 text-sidebar-primary" />
          </div>
          <div>
            <div className="font-semibold text-sm tracking-tight">CocoaSense</div>
            <div className="text-[11px] text-sidebar-foreground/60">Geospatial Farm Intel</div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto">
          <div>
            <div className="px-3 pb-2 text-[10px] uppercase tracking-wider text-sidebar-foreground/40 font-semibold">Workspace</div>
            <div className="space-y-0.5">
              {primaryNav.map((item) => <NavLink key={item.to} item={item} active={pathname === item.to} />)}
            </div>
          </div>
          <div>
            <div className="px-3 pb-2 text-[10px] uppercase tracking-wider text-sidebar-foreground/40 font-semibold">Modules</div>
            <div className="space-y-0.5">
              {secondaryNav.map((item) => <NavLink key={item.to} item={item} active={pathname === item.to} />)}
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-sidebar-border space-y-4">
          <button onClick={onSignOut} className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-sidebar-foreground/60 hover:text-white hover:bg-sidebar-accent rounded-md transition-colors border border-sidebar-border/50 shadow-sm">
             <LogOut className="size-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 flex flex-col">
        <div className="h-12 border-b border-border bg-white flex items-center gap-3 px-4 lg:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search farms, plots, locations…"
                className="w-full h-8 pl-8 pr-3 text-xs bg-secondary/60 border border-transparent rounded-md focus:outline-none focus:border-primary/40 focus:bg-card"
              />
            </div>
          </div>
          <button className="size-8 rounded-md hover:bg-secondary flex items-center justify-center text-muted-foreground"><BellIcon className="size-4" /></button>
          <button className="size-8 rounded-md bg-primary/10 text-primary flex items-center justify-center"><User className="size-4" /></button>
        </div>
        <div className="flex-1 min-h-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function NavLink({ item, active }: { item: { to: string; label: string; icon: React.ComponentType<{ className?: string }> }; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      to={item.to}
      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
        active
          ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-sm"
          : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
      }`}
    >
      <Icon className="size-4" />
      {item.label}
    </Link>
  );
}
