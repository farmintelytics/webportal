// Mock data for cocoa monitoring platform

export type HealthClass = "Excellent" | "Good" | "Stressed" | "Severely Stressed";
export type SuitabilityClass = "Highly Suitable" | "Suitable" | "Marginal" | "Unsuitable";

export interface Block {
  id: string;
  name: string;
  area: number; // ha
  ndvi: number;
  ndre: number;
  evi: number;
  lswi: number;
  vhi: number;
  health: HealthClass;
  alert: string | null;
  predictedYield: number; // kg/ha
  rainfall3mo: number; // mm
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

const healthFor = (ndre: number): HealthClass => {
  if (ndre >= 0.35) return "Excellent";
  if (ndre >= 0.22) return "Good";
  if (ndre >= 0.15) return "Stressed";
  return "Severely Stressed";
};

const alertFor = (b: Omit<Block, "alert" | "health" | "predictedYield">): string | null => {
  if (b.ndre < 0.15) return "Severe chlorophyll decline — inspect for black pod / drought";
  if (b.lswi < 0.2) return "Water deficit detected at canopy";
  if (b.vhi < 35) return "Combined stress index critical";
  return null;
};

const yieldFor = (ndre: number, lswi: number, rain: number): number => {
  // Simple proxy: scaled NDRE × LSWI × rainfall factor
  const base = 420;
  const ndreFactor = Math.min(1.2, ndre / 0.3);
  const lswiFactor = Math.min(1.15, lswi / 0.3);
  const rainFactor = Math.max(0.6, Math.min(1.15, rain / 450));
  return Math.round(base * ndreFactor * lswiFactor * rainFactor);
};

const raw = [
  { id: "B1", name: "Block 1 — Riverside",  area: 4.2, ndvi: 0.78, ndre: 0.41, evi: 0.62, lswi: 0.38, vhi: 72, rainfall3mo: 510 },
  { id: "B2", name: "Block 2 — Hillside",   area: 3.6, ndvi: 0.74, ndre: 0.34, evi: 0.58, lswi: 0.31, vhi: 65, rainfall3mo: 480 },
  { id: "B3", name: "Block 3 — Mid-Field",  area: 5.1, ndvi: 0.71, ndre: 0.28, evi: 0.55, lswi: 0.27, vhi: 58, rainfall3mo: 470 },
  { id: "B4", name: "Block 4 — Old Stand",  area: 2.8, ndvi: 0.66, ndre: 0.24, evi: 0.49, lswi: 0.24, vhi: 50, rainfall3mo: 430 },
  { id: "B5", name: "Block 5 — South Edge", area: 3.9, ndvi: 0.55, ndre: 0.13, evi: 0.38, lswi: 0.18, vhi: 32, rainfall3mo: 360 },
  { id: "B6", name: "Block 6 — North Plot", area: 4.5, ndvi: 0.69, ndre: 0.26, evi: 0.52, lswi: 0.22, vhi: 48, rainfall3mo: 440 },
  { id: "B7", name: "Block 7 — Shade Grove",area: 3.2, ndvi: 0.76, ndre: 0.37, evi: 0.6,  lswi: 0.34, vhi: 68, rainfall3mo: 495 },
  { id: "B8", name: "Block 8 — West Slope", area: 2.5, ndvi: 0.6,  ndre: 0.17, evi: 0.42, lswi: 0.19, vhi: 38, rainfall3mo: 390 },
];

export const blocks: Block[] = raw.map((b) => {
  const predictedYield = yieldFor(b.ndre, b.lswi, b.rainfall3mo);
  const health = healthFor(b.ndre);
  const alert = alertFor(b);
  return { ...b, health, alert, predictedYield };
});

export const farmSummary = {
  totalArea: blocks.reduce((a, b) => a + b.area, 0),
  avgNdre: blocks.reduce((a, b) => a + b.ndre, 0) / blocks.length,
  avgHealth: blocks.reduce((a, b) => a + b.vhi, 0) / blocks.length,
  totalPredictedKg: blocks.reduce((a, b) => a + b.predictedYield * b.area, 0),
  totalBags: Math.round(blocks.reduce((a, b) => a + b.predictedYield * b.area, 0) / 64), // 64kg/bag
  healthyBlocks: blocks.filter((b) => b.health === "Excellent" || b.health === "Good").length,
  stressedBlocks: blocks.filter((b) => b.health === "Stressed").length,
  criticalBlocks: blocks.filter((b) => b.health === "Severely Stressed").length,
  alerts: blocks.filter((b) => b.alert).length,
};

// Seasonal NDRE / NDVI / LSWI trend (12 months)
export const seasonalTrend = [
  { month: "Jan", ndvi: 0.62, ndre: 0.24, lswi: 0.22, rainfall: 45 },
  { month: "Feb", ndvi: 0.6,  ndre: 0.22, lswi: 0.2,  rainfall: 60 },
  { month: "Mar", ndvi: 0.65, ndre: 0.26, lswi: 0.25, rainfall: 110 },
  { month: "Apr", ndvi: 0.7,  ndre: 0.3,  lswi: 0.29, rainfall: 165 },
  { month: "May", ndvi: 0.74, ndre: 0.33, lswi: 0.32, rainfall: 190 },
  { month: "Jun", ndvi: 0.77, ndre: 0.36, lswi: 0.35, rainfall: 210 },
  { month: "Jul", ndvi: 0.78, ndre: 0.38, lswi: 0.36, rainfall: 175 },
  { month: "Aug", ndvi: 0.76, ndre: 0.35, lswi: 0.33, rainfall: 140 },
  { month: "Sep", ndvi: 0.75, ndre: 0.34, lswi: 0.31, rainfall: 160 },
  { month: "Oct", ndvi: 0.73, ndre: 0.32, lswi: 0.3,  rainfall: 180 },
  { month: "Nov", ndvi: 0.7,  ndre: 0.29, lswi: 0.27, rainfall: 120 },
  { month: "Dec", ndvi: 0.66, ndre: 0.25, lswi: 0.23, rainfall: 75 },
];

export const suitabilityZones: SuitabilityZone[] = [
  { id: "Z1", name: "Northern Lowland",   existingCover: "Mixed cropland",   rainfallScore: 92, tempScore: 88, humidityScore: 90, soilScore: 85, suitability: "Highly Suitable", notes: "Ideal pH and rainfall window" },
  { id: "Z2", name: "Eastern Forest Edge",existingCover: "Secondary forest", rainfallScore: 95, tempScore: 86, humidityScore: 92, soilScore: 80, suitability: "Highly Suitable", notes: "Avoid clearing primary canopy" },
  { id: "Z3", name: "Central Plateau",    existingCover: "Cassava/maize",    rainfallScore: 78, tempScore: 82, humidityScore: 75, soilScore: 70, suitability: "Suitable",        notes: "Requires irrigation in dry months" },
  { id: "Z4", name: "Western Hills",      existingCover: "Open grassland",   rainfallScore: 65, tempScore: 80, humidityScore: 68, soilScore: 60, suitability: "Marginal",        notes: "Slope > 20°, soil shallow" },
  { id: "Z5", name: "Southern Drylands",  existingCover: "Sparse shrub",     rainfallScore: 38, tempScore: 60, humidityScore: 45, soilScore: 50, suitability: "Unsuitable",      notes: "Rainfall < 1,200 mm" },
  { id: "Z6", name: "Riverine Belt",      existingCover: "Existing cocoa",   rainfallScore: 96, tempScore: 90, humidityScore: 94, soilScore: 88, suitability: "Highly Suitable", notes: "Already in production" },
];

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
