import { Search, Bell, Calendar, Filter, LogOut } from "lucide-react";

export function Topbar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="flex items-center justify-between gap-4 px-6 lg:px-8 py-4 border-b border-border bg-background/70 backdrop-blur sticky top-0 z-20">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold text-foreground truncate">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-0.5 truncate">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-md bg-muted border border-border w-56">
          <Search className="size-4 text-muted-foreground" />
          <input
            placeholder="Search plot, alert..."
            className="bg-transparent outline-none text-sm flex-1 placeholder:text-muted-foreground"
          />
        </div>
        <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-card text-sm">
          <Calendar className="size-4 text-muted-foreground"/>
          <select className="bg-transparent outline-none text-sm">
            <option>Last 30 days</option>
            <option>Last 7 days</option>
            <option>Last 90 days</option>
            <option>This season</option>
            <option>Custom…</option>
          </select>
        </div>
        <div className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-card text-sm">
          <Filter className="size-4 text-muted-foreground"/>
          <select className="bg-transparent outline-none text-sm">
            <option>All plots (14)</option>
            <option>Critical only</option>
            <option>Stressed only</option>
            <option>Healthy only</option>
            <option>Heading stage</option>
          </select>
        </div>
        <button className="p-2 rounded-md border border-border hover:bg-accent transition relative">
          <Bell className="size-4" />
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-destructive" />
        </button>
        <button title="Sign out" className="p-2 rounded-md border border-border hover:bg-accent transition">
          <LogOut className="size-4"/>
        </button>
      </div>
    </header>
  );
}
