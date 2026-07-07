export type HealthClass = "Excellent" | "Good" | "Stressed" | "Severely Stressed";
export type SuitabilityClass = "Highly Suitable" | "Suitable" | "Marginal" | "Unsuitable";

export interface Block {
  id: string;
  name: string;
  area: number;
  ndvi: number;
  ndre: number;
  evi: number;
  lswi: number;
  vhi: number;
  health: HealthClass;
  alert: string | null;
  predictedYield: number;
  rainfall3mo: number;
}

export interface SuitabilityZone {
  id: string;
  name: string;
  existingCover: string;
  rainfallScore: number;
  tempScore: number;
  humidityScore: number;
  soilScore: number;
  suitability: SuitabilityClass;
  notes: string;
}

export const blocks: Block[] = [];

export const farmSummary = {
  totalArea: 0,
  avgNdre: 0,
  avgHealth: 0,
  totalPredictedKg: 0,
  totalBags: 0,
  healthyBlocks: 0,
  stressedBlocks: 0,
  criticalBlocks: 0,
  alerts: 0,
};

export const seasonalTrend: { month: string; ndvi: number; ndre: number; lswi: number; rainfall: number }[] = [];

export const suitabilityZones: SuitabilityZone[] = [];

export const healthColor = (h: HealthClass) => {
  switch (h) {
    case "Excellent": return "text-success";
    case "Good": return "text-leaf";
    case "Stressed": return "text-warning";
    case "Severely Stressed": return "text-danger";
  }
};

export const healthBg = (h: HealthClass) => {
  switch (h) {
    case "Excellent": return "bg-success/15 text-success border-success/30";
    case "Good": return "bg-leaf/15 text-leaf border-leaf/30";
    case "Stressed": return "bg-warning/20 text-warning-foreground border-warning/40";
    case "Severely Stressed": return "bg-danger/15 text-danger border-danger/30";
  }
};

export const suitabilityBg = (s: SuitabilityClass) => {
  switch (s) {
    case "Highly Suitable": return "bg-success/15 text-success border-success/30";
    case "Suitable": return "bg-leaf/15 text-leaf border-leaf/30";
    case "Marginal": return "bg-warning/20 text-warning-foreground border-warning/40";
    case "Unsuitable": return "bg-danger/15 text-danger border-danger/30";
  }
};
