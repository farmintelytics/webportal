export type GrowthStage = "Tillering" | "Grand Growth" | "Maturation" | "Harvest Ready";
export type SuitabilityClass = "Suitable" | "Marginal" | "Unsuitable";

export interface Block {
  id: string;
  name: string;
  hectares: number;
  polygon: [number, number][];
  cropAgeMonths: number;
  growthStage: GrowthStage;
  ndvi: number;
  evi: number;
  lai: number;
  lswi: number;
  vhi: number;
  sar: number;
  stressAlert: "None" | "Water Stress" | "Heat Stress" | "Waterlogging";
  predictedYield: number;
  harvestReady: boolean;
  harvestWindow: string;
  suitability: SuitabilityClass;
  soilScore: number;
  thermalScore: number;
  rainfallScore: number;
  waterAvailability: "Rainfed" | "Irrigated";
  landUseStatus: "Cleared" | "Vegetated" | "Tilled";
}

const center: [number, number] = [9.115, 4.93];

function makePoly(cx: number, cy: number, size: number): [number, number][] {
  return [
    [cx - size, cy - size],
    [cx + size, cy - size],
    [cx + size, cy + size],
    [cx - size, cy + size],
  ];
}

export const blocks: Block[] = [
  {
    id: "B-01", name: "Block 1 — North Field", hectares: 48,
    polygon: makePoly(center[0] + 0.012, center[1] - 0.018, 0.008),
    cropAgeMonths: 4, growthStage: "Grand Growth",
    ndvi: 0.78, evi: 0.62, lai: 4.1, lswi: 0.32, vhi: 68, sar: -8.4,
    stressAlert: "None", predictedYield: 78, harvestReady: false, harvestWindow: "Sep 2026",
    suitability: "Suitable", soilScore: 86, thermalScore: 92, rainfallScore: 80, waterAvailability: "Irrigated", landUseStatus: "Vegetated",
  },
  {
    id: "B-02", name: "Block 2 — East Plot", hectares: 35,
    polygon: makePoly(center[0] + 0.012, center[1] + 0.002, 0.008),
    cropAgeMonths: 6, growthStage: "Grand Growth",
    ndvi: 0.82, evi: 0.71, lai: 5.0, lswi: 0.38, vhi: 74, sar: -7.9,
    stressAlert: "None", predictedYield: 84, harvestReady: false, harvestWindow: "Jul 2026",
    suitability: "Suitable", soilScore: 90, thermalScore: 88, rainfallScore: 84, waterAvailability: "Irrigated", landUseStatus: "Vegetated",
  },
  {
    id: "B-03", name: "Block 3 — Central", hectares: 52,
    polygon: makePoly(center[0] - 0.004, center[1] - 0.018, 0.008),
    cropAgeMonths: 9, growthStage: "Maturation",
    ndvi: 0.74, evi: 0.66, lai: 4.6, lswi: 0.30, vhi: 70, sar: -8.0,
    stressAlert: "None", predictedYield: 85, harvestReady: false, harvestWindow: "May 2026",
    suitability: "Suitable", soilScore: 92, thermalScore: 90, rainfallScore: 86, waterAvailability: "Irrigated", landUseStatus: "Vegetated",
  },
  {
    id: "B-04", name: "Block 4 — South Ridge", hectares: 41,
    polygon: makePoly(center[0] - 0.004, center[1] + 0.002, 0.008),
    cropAgeMonths: 11, growthStage: "Harvest Ready",
    ndvi: 0.55, evi: 0.42, lai: 3.0, lswi: 0.18, vhi: 62, sar: -9.2,
    stressAlert: "None", predictedYield: 92, harvestReady: true, harvestWindow: "End of month",
    suitability: "Suitable", soilScore: 88, thermalScore: 86, rainfallScore: 82, waterAvailability: "Irrigated", landUseStatus: "Vegetated",
  },
  {
    id: "B-05", name: "Block 5 — West Bend", hectares: 30,
    polygon: makePoly(center[0] - 0.020, center[1] - 0.018, 0.008),
    cropAgeMonths: 2, growthStage: "Tillering",
    ndvi: 0.41, evi: 0.32, lai: 1.6, lswi: 0.22, vhi: 58, sar: -10.1,
    stressAlert: "None", predictedYield: 70, harvestReady: false, harvestWindow: "Nov 2026",
    suitability: "Marginal", soilScore: 70, thermalScore: 84, rainfallScore: 65, waterAvailability: "Rainfed", landUseStatus: "Tilled",
  },
  {
    id: "B-06", name: "Block 6 — Lowland", hectares: 38,
    polygon: makePoly(center[0] - 0.020, center[1] + 0.002, 0.008),
    cropAgeMonths: 7, growthStage: "Grand Growth",
    ndvi: 0.62, evi: 0.48, lai: 3.4, lswi: 0.10, vhi: 31, sar: -11.5,
    stressAlert: "Water Stress", predictedYield: 58, harvestReady: false, harvestWindow: "Aug 2026",
    suitability: "Marginal", soilScore: 78, thermalScore: 90, rainfallScore: 55, waterAvailability: "Rainfed", landUseStatus: "Vegetated",
  },
  {
    id: "B-07", name: "Block 7 — Far East", hectares: 26,
    polygon: makePoly(center[0] + 0.012, center[1] + 0.022, 0.008),
    cropAgeMonths: 8, growthStage: "Maturation",
    ndvi: 0.71, evi: 0.58, lai: 4.0, lswi: 0.40, vhi: 72, sar: -8.6,
    stressAlert: "Waterlogging", predictedYield: 76, harvestReady: false, harvestWindow: "Jun 2026",
    suitability: "Suitable", soilScore: 82, thermalScore: 88, rainfallScore: 90, waterAvailability: "Irrigated", landUseStatus: "Vegetated",
  },
  {
    id: "B-08", name: "Block 8 — New Expansion", hectares: 44,
    polygon: makePoly(center[0] - 0.020, center[1] + 0.022, 0.008),
    cropAgeMonths: 0, growthStage: "Tillering",
    ndvi: 0.18, evi: 0.12, lai: 0.3, lswi: 0.15, vhi: 55, sar: -12.4,
    stressAlert: "None", predictedYield: 0, harvestReady: false, harvestWindow: "—",
    suitability: "Suitable", soilScore: 84, thermalScore: 90, rainfallScore: 78, waterAvailability: "Irrigated", landUseStatus: "Cleared",
  },
];

export const mapCenter = center;

export const eviTimeSeries = [
  { month: "M1", "Block 1": 0.18, "Block 2": 0.20, "Block 3": 0.22, "Block 4": 0.25, "Block 6": 0.20 },
  { month: "M2", "Block 1": 0.28, "Block 2": 0.32, "Block 3": 0.35, "Block 4": 0.38, "Block 6": 0.30 },
  { month: "M3", "Block 1": 0.42, "Block 2": 0.48, "Block 3": 0.52, "Block 4": 0.55, "Block 6": 0.40 },
  { month: "M4", "Block 1": 0.58, "Block 2": 0.62, "Block 3": 0.65, "Block 4": 0.68, "Block 6": 0.46 },
  { month: "M5", "Block 1": 0.62, "Block 2": 0.68, "Block 3": 0.70, "Block 4": 0.66, "Block 6": 0.48 },
  { month: "M6", "Block 1": 0.62, "Block 2": 0.71, "Block 3": 0.69, "Block 4": 0.60, "Block 6": 0.48 },
  { month: "M7", "Block 1": 0.60, "Block 2": 0.70, "Block 3": 0.68, "Block 4": 0.55, "Block 6": 0.46 },
  { month: "M8", "Block 1": 0.58, "Block 2": 0.66, "Block 3": 0.66, "Block 4": 0.50, "Block 6": 0.44 },
];

export const rainfallSeries = [
  { month: "Jan", rainfall: 5, lst: 26 },
  { month: "Feb", rainfall: 12, lst: 28 },
  { month: "Mar", rainfall: 38, lst: 30 },
  { month: "Apr", rainfall: 95, lst: 29 },
  { month: "May", rainfall: 168, lst: 27 },
  { month: "Jun", rainfall: 220, lst: 26 },
  { month: "Jul", rainfall: 245, lst: 25 },
  { month: "Aug", rainfall: 260, lst: 25 },
  { month: "Sep", rainfall: 210, lst: 26 },
  { month: "Oct", rainfall: 110, lst: 27 },
  { month: "Nov", rainfall: 28, lst: 28 },
  { month: "Dec", rainfall: 8, lst: 27 },
];

export const seasonComparison = [
  { season: "2022/23", tonnage: 3200 },
  { season: "2023/24", tonnage: 3500 },
  { season: "2024/25", tonnage: 3800 },
  { season: "2025/26 (forecast)", tonnage: 4200 },
];

export interface MapLayer {
  id: string;
  name: string;
  category: "Operational" | "Biophysical" | "Monitoring";
  enabled: boolean;
  opacity: number;
  legend: { color: string; label: string }[];
}

export const defaultLayers: MapLayer[] = [
  {
    id: "boundaries", name: "Farm Boundaries", category: "Operational", enabled: true, opacity: 1,
    legend: [{ color: "var(--primary)", label: "Block boundary" }],
  },
  {
    id: "growth-stage", name: "Growth Stage", category: "Operational", enabled: true, opacity: 0.7,
    legend: [
      { color: "#a7d1a3", label: "Tillering" },
      { color: "#2f7d3a", label: "Grand Growth" },
      { color: "#d6a64a", label: "Maturation" },
      { color: "#c46a18", label: "Harvest Ready" },
    ],
  },
  {
    id: "evi", name: "EVI (Vegetation Vigor)", category: "Biophysical", enabled: false, opacity: 0.6,
    legend: [
      { color: "#fde68a", label: "Low (0.1–0.3)" },
      { color: "#84cc16", label: "Mid (0.3–0.5)" },
      { color: "#15803d", label: "High (0.5–0.8)" },
    ],
  },
  {
    id: "lswi", name: "LSWI (Water Status)", category: "Biophysical", enabled: false, opacity: 0.6,
    legend: [
      { color: "#fca5a5", label: "Stress" },
      { color: "#bae6fd", label: "Adequate" },
      { color: "#0284c7", label: "Waterlogged" },
    ],
  },
  {
    id: "vhi", name: "VHI (Stress)", category: "Monitoring", enabled: false, opacity: 0.7,
    legend: [
      { color: "#dc2626", label: "Severe < 35" },
      { color: "#f59e0b", label: "Moderate 35–60" },
      { color: "#16a34a", label: "Healthy > 60" },
    ],
  },
  {
    id: "suitability", name: "Planting Suitability", category: "Monitoring", enabled: false, opacity: 0.6,
    legend: [
      { color: "#16a34a", label: "Suitable" },
      { color: "#f59e0b", label: "Marginal" },
      { color: "#dc2626", label: "Unsuitable" },
    ],
  },
];
