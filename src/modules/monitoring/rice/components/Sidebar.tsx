import { Link, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, Map, Sprout, Bell, Leaf, LogOut } from "lucide-react";
import { useMonitoring } from "../../shared/MonitoringContext";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/dashboard", label: "Map View", icon: Map },
  { to: "/plots", label: "Plots", icon: Sprout },
  { to: "/alerts", label: "Alerts", icon: Bell },
];

export function Sidebar() {
  const loc = useLocation();
  const { onBack, onSignOut } = useMonitoring();

  return (
    <aside className="sticky top-0 h-screen flex w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
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
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-sidebar-border">
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

        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-full bg-sidebar-primary text-sidebar-primary-foreground grid place-items-center text-xs font-semibold">RA</div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold truncate">Rice Agronomist</div>
            <div className="text-[10px] text-sidebar-foreground/60 truncate">agro@paddylens.io</div>
          </div>
          <button onClick={onSignOut} title="Sign out" className="p-1.5 rounded-md hover:bg-sidebar-accent text-sidebar-foreground/70 hover:text-sidebar-foreground transition">
            <LogOut className="size-4"/>
          </button>
        </div>
      </div>
    </aside>
  );
}
