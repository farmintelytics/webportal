interface Props {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, eyebrow, actions }: Props) {
  return (
    <div className="border-b border-border bg-white sticky top-0 z-10">
      <div className="px-6 lg:px-10 py-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          {eyebrow && (
            <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-medium mb-1.5">
              {eyebrow}
            </div>
          )}
          <h1 className="text-2xl lg:text-[28px] font-semibold tracking-tight text-foreground">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
