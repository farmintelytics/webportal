import { Link, useRouterState } from "@tanstack/react-router";
import { Map, LayoutDashboard, Sparkles, FileText, Database, ChevronLeft, LogOut, Sprout } from "lucide-react";
import { useState } from "react";
import { cn } from "@monitoring-shared/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@monitoring-shared/ui/tooltip";
import { Avatar, AvatarFallback } from "@monitoring-shared/ui/avatar";

const items = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/dashboard", label: "Map View", icon: Map },
  { to: "/ai-assistant", label: "AI Assistant", icon: Sparkles },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/data", label: "Data Management", icon: Database },
];

import { useMonitoring } from "../../../shared/MonitoringContext";

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const path = useRouterState({ select: s => s.location.pathname });
  const { onBack, onSignOut } = useMonitoring();

  return (
    <TooltipProvider delayDuration={100}>
      <aside
        className={cn(
          "sticky top-0 h-screen flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-200 shrink-0",
          collapsed ? "w-16" : "w-60"
        )}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="size-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
              <Sprout className="size-5 text-primary-foreground" />
            </div>
            {!collapsed && <span className="font-semibold text-base text-white">FarmSense</span>}
          </div>
          <button
            onClick={() => setCollapsed(c => !c)}
            className="text-sidebar-foreground/60 hover:text-white shrink-0"
          >
            <ChevronLeft className={cn("size-4 transition-transform", collapsed && "rotate-180")} />
          </button>
        </div>

        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {items.map(item => {
            const active = item.to === "/" ? path === "/" : path.startsWith(item.to);
            const Icon = item.icon;
            const link = (
              <Link
                to={item.to}
                className={cn(
                  "relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-white"
                )}
              >
                {active && <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-primary" />}
                <Icon className="size-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
            return collapsed ? (
              <Tooltip key={item.to}>
                <TooltipTrigger asChild>{link}</TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            ) : (
              <div key={item.to}>{link}</div>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-3 space-y-3">
          {!collapsed && (
             <button onClick={onSignOut} className="flex w-full items-center gap-3 px-3 py-2 text-xs font-semibold text-sidebar-foreground/70 hover:text-white hover:bg-sidebar-accent rounded-md transition border border-sidebar-border/50 shadow-sm">
                <LogOut className="size-4" /> Sign Out
             </button>
          )}
          <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
            <Avatar className="size-9">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">AO</AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">Adaeze O.</div>
                <button onClick={onSignOut} className="text-xs text-sidebar-foreground/70 hover:text-white flex items-center gap-1">
                  <LogOut className="size-3" /> Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </TooltipProvider>
  );
}
