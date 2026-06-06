import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

export function KpiCard({
  label, value, unit, icon: Icon, trend, accent = "primary",
}: {
  label: string; value: string | number; unit?: string; icon: LucideIcon;
  trend?: { value: number; direction: "up" | "down" };
  accent?: "primary" | "water" | "soil" | "stress";
}) {
  const accentMap = {
    primary: "bg-primary/10 text-primary",
    water: "bg-water/10 text-water",
    soil: "bg-soil/10 text-soil",
    stress: "bg-stress/10 text-stress",
  };
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-soft hover:shadow-glow transition-shadow">
      <div className="flex items-start justify-between">
        <div className={`size-10 rounded-lg grid place-items-center ${accentMap[accent]}`}>
          <Icon className="size-5" />
        </div>
        {trend && (
          <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
            trend.direction === "up" ? "bg-healthy/10 text-healthy" : "bg-destructive/10 text-destructive"
          }`}>
            {trend.direction === "up" ? <TrendingUp className="size-3"/> : <TrendingDown className="size-3"/>}
            {trend.value}%
          </span>
        )}
      </div>
      <div className="mt-4 text-xs uppercase tracking-wider text-muted-foreground font-medium">{label}</div>
      <div className="mt-1 flex items-baseline gap-1">
        <span className="text-3xl font-display font-semibold text-foreground">{value}</span>
        {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
      </div>
    </div>
  );
}
