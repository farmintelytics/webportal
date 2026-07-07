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
  ndviTrend: number[];
  cire: number;
  lswi: number;
  bsrRisk: RiskLevel;
  ffbYield: number;
  lastHarvest: string;
  nextHarvestWeeks: number;
  overdue?: boolean;
  polygon: [number, number][];
  centroid: [number, number];
}

export const blocks: Block[] = [];
export const mapCenter: [number, number] = [6.35, 5.68];
export const estates: string[] = [];
export const rainfall: { month: string; rainfall: number; requirement: number }[] = [];
export const alerts: { id: number; blockId: string; age: number; type: string; severity: "low" | "medium" | "high" | "harvest"; date: string; msg: string }[] = [];

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
  area: 0,
  blocks: 0,
  ffbQuarter: 0,
  alertBlocks: 0,
};
