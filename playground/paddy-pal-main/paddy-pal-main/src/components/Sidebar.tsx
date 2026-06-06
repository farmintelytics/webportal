import { Link, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, Map, Sprout, FileText, MessageSquare, Bell, Leaf, LogOut } from "lucide-react";

const nav = [
  { to: "/", label: "Map View", icon: Map },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/plots", label: "Plots", icon: Sprout },
  { to: "/alerts", label: "Alerts", icon: Bell },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/assistant", label: "AI Assistant", icon: MessageSquare },
];

export function Sidebar() {
  const loc = useLocation();
  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <div className="px-6 py-6 border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="size-9 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground grid place-items-center shadow-glow">
            <Leaf className="size-5" />
          </div>
          <div>
            <div className="font-display font-semibold text-base leading-none">PaddyLens</div>
            <div className="text-[10px] uppercase tracking-widest text-sidebar-foreground/60 mt-1">GeoAI Rice Intel</div>
          </div>
        </Link>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map(({ to, label, icon: Icon }) => {
          const active = loc.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all ${
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-soft"
                  : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              }`}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-sidebar-border space-y-3">
        <div className="rounded-lg bg-sidebar-accent p-3">
          <div className="text-xs text-sidebar-foreground/70">Season</div>
          <div className="text-sm font-semibold mt-0.5">Wet Season 2026</div>
          <div className="text-[10px] text-sidebar-foreground/60 mt-1">Sentinel-1 / Sentinel-2 · MODIS</div>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-full bg-sidebar-primary text-sidebar-primary-foreground grid place-items-center text-xs font-semibold">RA</div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold truncate">Rice Agronomist</div>
            <div className="text-[10px] text-sidebar-foreground/60 truncate">agro@paddylens.io</div>
          </div>
          <button title="Sign out" className="p-1.5 rounded-md hover:bg-sidebar-accent text-sidebar-foreground/70 hover:text-sidebar-foreground transition">
            <LogOut className="size-4"/>
          </button>
        </div>
      </div>
    </aside>
  );
}
