import { Link, useLocation } from "@tanstack/react-router";
import { ReactNode } from "react";
import {
  BarChart3,
  Map as MapIcon,
  FileText,
  Bot,
  Sprout,
  Bell,
  Search,
  User,
  Database,
  LogOut,
} from "lucide-react";
import { Input } from "@monitoring-shared/ui/input";
import { Button } from "@monitoring-shared/ui/button";

const NAV = [
  { to: "/", label: "Dashboard", icon: BarChart3 },
  { to: "/map", label: "Map View", icon: MapIcon },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/data", label: "Data", icon: Database },
  { to: "/ai-assistant", label: "AI Assistant", icon: Bot },
];

import { useMonitoring } from "../../shared/MonitoringContext";

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { onSignOut } = useMonitoring();

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="sticky top-0 h-screen flex w-60 flex-col border-r bg-sidebar">
        <div className="px-5 py-5 flex items-center gap-2 border-b">
          <div className="h-9 w-9 rounded-lg bg-primary text-primary-foreground grid place-items-center">
            <Sprout className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold tracking-tight">MaizeRS</p>
            <p className="text-[11px] text-muted-foreground">
              Geospatial Farm OS
            </p>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV.map((n) => {
            const Icon = n.icon;
            const active =
              n.to === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition ${
                  active
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-accent/40 hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-4 py-2 border-t">
          <button onClick={onSignOut} className="flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-accent/40 rounded-md transition border border-border/50">
             <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b bg-card/40 backdrop-blur flex items-center px-4 md:px-6 gap-3 sticky top-0 z-20">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search farms, plots, locations…"
              className="pl-9 h-9 bg-background"
            />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <User className="h-4 w-4" />
            </Button>
          </div>
        </header>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
