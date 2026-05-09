import { blocks, type HealthClass } from "./lib/cocoa-data";

const colorFor = (h: HealthClass) => {
  switch (h) {
    case "Excellent": return "var(--success)";
    case "Good": return "var(--leaf)";
    case "Stressed": return "var(--warning)";
    case "Severely Stressed": return "var(--danger)";
  }
};

// Hand-laid block polygons on a 100x60 viewBox — schematic farm map
const polygons: Record<string, string> = {
  B1: "6,8 26,6 30,22 24,30 8,28",
  B2: "26,6 48,8 50,22 30,22",
  B3: "48,8 72,10 74,28 50,22",
  B4: "72,10 92,12 94,30 74,28",
  B5: "8,28 24,30 28,46 30,56 10,54",
  B6: "30,22 50,22 52,38 30,46",
  B7: "50,22 74,28 72,44 52,38",
  B8: "72,44 94,30 96,52 74,54",
};

interface Props {
  selected?: string;
  onSelect?: (id: string) => void;
}

export function FarmMap({ selected, onSelect }: Props) {
  return (
    <div className="rounded-xl border border-border bg-gradient-to-br from-secondary/40 to-accent/20 p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Farm Health Map</div>
          <div className="text-sm text-foreground font-medium">NDRE-based canopy classification</div>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          {(["Excellent", "Good", "Stressed", "Severely Stressed"] as HealthClass[]).map((h) => (
            <div key={h} className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm" style={{ background: colorFor(h) }} />
              <span className="text-muted-foreground">{h}</span>
            </div>
          ))}
        </div>
      </div>
      <svg viewBox="0 0 100 60" className="w-full h-auto rounded-lg bg-card/60">
        <defs>
          <pattern id="grid" width="5" height="5" patternUnits="userSpaceOnUse">
            <path d="M 5 0 L 0 0 0 5" fill="none" stroke="oklch(0.9 0.018 100)" strokeWidth="0.1" />
          </pattern>
        </defs>
        <rect width="100" height="60" fill="url(#grid)" />
        {blocks.map((b) => {
          const isSel = selected === b.id;
          return (
            <g key={b.id} onClick={() => onSelect?.(b.id)} className="cursor-pointer">
              <polygon
                points={polygons[b.id]}
                fill={colorFor(b.health)}
                fillOpacity={isSel ? 0.85 : 0.6}
                stroke={isSel ? "var(--foreground)" : "var(--card)"}
                strokeWidth={isSel ? 0.6 : 0.3}
              />
              <text
                x={polygons[b.id].split(" ").reduce((s, p) => s + parseFloat(p.split(",")[0]), 0) / polygons[b.id].split(" ").length}
                y={polygons[b.id].split(" ").reduce((s, p) => s + parseFloat(p.split(",")[1]), 0) / polygons[b.id].split(" ").length + 1}
                textAnchor="middle"
                fontSize="2.4"
                fontWeight="600"
                fill="white"
                style={{ pointerEvents: "none" }}
              >
                {b.id}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
