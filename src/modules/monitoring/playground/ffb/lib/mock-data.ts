// PalmSense mock data — 12 oil palm blocks across 2 estates near Edo State, Nigeria
export type AgeClass = "immature" | "young" | "peak" | "aging" | "declining";
export type RiskLevel = "low" | "medium" | "high";

export interface Block {
  id: string;
  estate: string;
  plantingYear: number;
  age: number;
  areaHa: number;
  palmCount: number;
  ageClass: AgeClass;
  ndvi: number;
  ndviTrend: number[]; // 24 months
  cire: number;
  lswi: number;
  bsrRisk: RiskLevel;
  ffbYield: number; // t/ha
  lastHarvest: string;
  nextHarvestWeeks: number;
  overdue?: boolean;
  // simple polygon — array of [x,y] in 0..1000 SVG space
  polygon: [number, number][];
  centroid: [number, number];
}

const seasonalNdvi = (base: number, decline = 0, anomaly = false): number[] => {
  const arr: number[] = [];
  for (let i = 0; i < 24; i++) {
    const month = i % 12;
    // wet season Apr–Oct boost
    const seasonal = month >= 3 && month <= 9 ? 0.04 : -0.02;
    const drift = -decline * (i / 23);
    let v = base + seasonal + drift + (Math.sin(i * 0.6) * 0.015);
    if (anomaly && i >= 20) v -= (i - 19) * 0.05;
    arr.push(Math.max(0.2, Math.min(0.95, +v.toFixed(3))));
  }
  return arr;
};

const ageClassFor = (age: number): AgeClass => {
  if (age < 5) return "immature";
  if (age < 11) return "young";
  if (age < 16) return "peak";
  if (age < 25) return "aging";
  return "declining";
};

const ffbCurve = (age: number) => {
  if (age < 4) return 0;
  if (age <= 8) return 8 + (age - 4) * 2.5;
  if (age <= 13) return 18 + (age - 8) * 1.2;
  if (age <= 16) return 24 - (age - 13) * 0.7;
  if (age <= 22) return 22 - (age - 16);
  return Math.max(8, 16 - (age - 22) * 1.25);
};

const mkPoly = (cx: number, cy: number, size: number): [number, number][] => {
  const pts: [number, number][] = [];
  const n = 6;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const r = size * (0.8 + Math.random() * 0.4);
    pts.push([+(cx + Math.cos(a) * r).toFixed(1), +(cy + Math.sin(a) * r).toFixed(1)]);
  }
  return pts;
};

// deterministic pseudo-random for stable polygons
let seed = 42;
const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
Math.random = rand as any;

const defs = [
  { id: "B01", estate: "Ondo Alpha", year: 2022, area: 22, cx: 220, cy: 280 },
  { id: "B02", estate: "Ondo Alpha", year: 2022, area: 18, cx: 290, cy: 250 },
  { id: "B03", estate: "Ondo Alpha", year: 2017, area: 30, cx: 360, cy: 290 },
  { id: "B04", estate: "Ondo Alpha", year: 2017, area: 28, cx: 270, cy: 360 },
  { id: "B05", estate: "Ondo Alpha", year: 2012, area: 35, cx: 350, cy: 410 },
  { id: "B06", estate: "Ondo Alpha", year: 2012, area: 40, cx: 230, cy: 450 },
  { id: "B07", estate: "Cross River Beta", year: 2009, area: 25, cx: 600, cy: 270 },
  { id: "B08", estate: "Cross River Beta", year: 2009, area: 33, cx: 680, cy: 320 },
  { id: "B09", estate: "Cross River Beta", year: 2003, area: 38, cx: 600, cy: 400 },
  { id: "B10", estate: "Cross River Beta", year: 2003, area: 42, cx: 700, cy: 440 },
  { id: "B11", estate: "Cross River Beta", year: 1999, area: 30, cx: 770, cy: 370 },
  { id: "B12", estate: "Cross River Beta", year: 1999, area: 28, cx: 780, cy: 280 },
];

const CURRENT_YEAR = 2025;

export const blocks: Block[] = defs.map((d, i) => {
  const age = CURRENT_YEAR - d.year;
  const ac = ageClassFor(age);
  const palms = Math.round(d.area * 143);
  const baseNdvi = ac === "immature" ? 0.45 : ac === "young" ? 0.66 : ac === "peak" ? 0.74 : ac === "aging" ? 0.62 : 0.55;
  const decline = ac === "aging" || ac === "declining" ? 0.07 : 0;
  const isDisease = d.id === "B07";
  const ndviSeries = seasonalNdvi(baseNdvi, decline, isDisease);
  const ndvi = ndviSeries[ndviSeries.length - 1];
  let cire = 1.6;
  if (d.id === "B05" || d.id === "B06") cire = 1.8;
  if (d.id === "B08") cire = 1.1;
  if (d.id === "B10") cire = 0.8;
  let bsr: RiskLevel = "low";
  if (d.id === "B07") bsr = "high";
  else if (d.id === "B09") bsr = "medium";
  const ffb = +ffbCurve(age).toFixed(1);
  const size = Math.sqrt(d.area) * 6;
  return {
    id: d.id,
    estate: d.estate,
    plantingYear: d.year,
    age,
    areaHa: d.area,
    palmCount: palms,
    ageClass: ac,
    ndvi,
    ndviTrend: ndviSeries,
    cire,
    lswi: +(0.35 + (i % 3) * 0.05 - (d.id === "B09" || d.id === "B10" ? 0.12 : 0)).toFixed(2),
    bsrRisk: bsr,
    ffbYield: ffb,
    lastHarvest: ["12 days ago", "8 days ago", "21 days ago", "—", "5 days ago", "10 days ago"][i % 6],
    nextHarvestWeeks: d.id === "B07" ? -3 : (i % 5),
    overdue: d.id === "B07",
    polygon: mkPoly(d.cx, d.cy, size),
    centroid: [d.cx, d.cy],
  };
});

export const estates = ["Ondo Alpha", "Cross River Beta"];

export const rainfall = Array.from({ length: 24 }, (_, i) => {
  const month = i % 12;
  const wet = month >= 3 && month <= 9;
  let mm = wet ? 220 + Math.sin(i) * 60 : 50 + Math.cos(i) * 25;
  if (i === 8 || i === 14 || i === 20) mm *= 0.45; // deficit months
  return {
    month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][month] + " " + (i < 12 ? "'24" : "'25"),
    rainfall: Math.round(mm),
    requirement: 175,
  };
});

export const alerts = [
  { id: 1, blockId: "B07", age: 16, type: "BSR Disease Risk", severity: "high" as const, date: "2 days ago", msg: "NDVI anomaly −0.19 + red-edge decline detected" },
  { id: 2, blockId: "B10", age: 22, type: "Nutrient Deficiency", severity: "high" as const, date: "1 day ago", msg: "CIre 0.8 — severe K/N deficiency" },
  { id: 3, blockId: "B08", age: 16, type: "Nutrient Deficiency", severity: "medium" as const, date: "4 days ago", msg: "CIre 1.1 — possible K deficiency" },
  { id: 4, blockId: "B07", age: 16, type: "Harvest Overdue", severity: "harvest" as const, date: "Today", msg: "3 weeks past optimal harvest window" },
  { id: 5, blockId: "B09–B10", age: 22, type: "Rainfall Deficit", severity: "medium" as const, date: "5 days ago", msg: "−58mm vs 10-yr average over 2 months" },
];

export const ageClassColor: Record<AgeClass, string> = {
  immature: "var(--color-immature)",
  young: "var(--color-peak)",
  peak: "var(--color-canopy)",
  aging: "var(--color-aging)",
  declining: "var(--color-replant)",
};

export const ageClassLabel: Record<AgeClass, string> = {
  immature: "Immature (1–4y)",
  young: "Young Mature (5–10y)",
  peak: "Peak (11–15y)",
  aging: "Aging (16–24y)",
  declining: "Replanting (25y+)",
};

export const totals = {
  area: blocks.reduce((s, b) => s + b.areaHa, 0),
  blocks: blocks.length,
  ffbQuarter: Math.round(blocks.reduce((s, b) => s + b.ffbYield * b.areaHa, 0) / 4),
  alertBlocks: new Set(alerts.filter(a => a.severity === "high").map(a => a.blockId)).size,
};
