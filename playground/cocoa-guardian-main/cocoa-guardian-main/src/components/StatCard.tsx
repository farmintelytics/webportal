import { type LucideIcon } from "lucide-react";

interface Props {
  label: string;
  value: string | number;
  unit?: string;
  hint?: string;
  icon?: LucideIcon;
  tone?: "default" | "success" | "warning" | "danger";
}

const toneMap = {
  default: "text-primary bg-primary/10",
  success: "text-success bg-success/15",
  warning: "text-warning-foreground bg-warning/20",
  danger: "text-danger bg-danger/15",
};

export function StatCard({ label, value, unit, hint, icon: Icon, tone = "default" }: Props) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</div>
        {Icon && (
          <div className={`size-8 rounded-md flex items-center justify-center ${toneMap[tone]}`}>
            <Icon className="size-4" />
          </div>
        )}
      </div>
      <div className="mt-3 flex items-baseline gap-1.5">
        <div className="text-2xl font-semibold tracking-tight text-foreground">{value}</div>
        {unit && <div className="text-sm text-muted-foreground">{unit}</div>}
      </div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}
