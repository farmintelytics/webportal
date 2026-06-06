import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  high: "bg-destructive/10 text-destructive border-destructive/30",
  medium: "bg-primary/10 text-primary border-primary/30",
  low: "bg-[var(--color-peak)]/10 text-[var(--color-peak)] border-[var(--color-peak)]/30",
  harvest: "bg-[var(--color-harvest)]/15 text-[var(--color-drought)] border-[var(--color-harvest)]/40",
  immature: "bg-[var(--color-immature)]/15 text-[var(--color-canopy)] border-[var(--color-immature)]/40",
  young: "bg-[var(--color-peak)]/15 text-[var(--color-canopy)] border-[var(--color-peak)]/40",
  peak: "bg-[var(--color-canopy)]/15 text-[var(--color-canopy)] border-[var(--color-canopy)]/40",
  aging: "bg-primary/10 text-primary border-primary/30",
  declining: "bg-muted text-muted-foreground border-border",
};

export function StatusBadge({ variant, children, className }: { variant: keyof typeof styles | string; children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border", styles[variant] ?? styles.low, className)}>
      {children}
    </span>
  );
}
