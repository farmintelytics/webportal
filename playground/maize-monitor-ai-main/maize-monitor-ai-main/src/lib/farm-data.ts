export type Plot = {
  id: string;
  name: string;
  area: number;
  ndvi: number;
  gcvi: number;
  ndre: number;
  vhi: number;
  rainfall: number;
  rainfallExpected: number;
  predictedYield: number;
  lastSeasonYield: number;
  stage: "Emergence" | "Vegetative" | "Tasselling" | "Grain Fill" | "Senescence";
  status: "Healthy" | "Nitrogen Risk" | "Drought Risk" | "Heat Stress";
  lat: number;
  lng: number;
};

export const PLOTS: Plot[] = [
  { id: "P-01", name: "North Field A", area: 12.4, ndvi: 0.78, gcvi: 5.1, ndre: 0.42, vhi: 72, rainfall: 312, rainfallExpected: 320, predictedYield: 4.8, lastSeasonYield: 4.2, stage: "Tasselling", status: "Healthy", lat: -0.52, lng: 35.27 },
  { id: "P-02", name: "North Field B", area: 8.1, ndvi: 0.74, gcvi: 4.6, ndre: 0.38, vhi: 65, rainfall: 298, rainfallExpected: 320, predictedYield: 4.3, lastSeasonYield: 3.9, stage: "Tasselling", status: "Healthy", lat: -0.51, lng: 35.28 },
  { id: "P-03", name: "Hillside East", area: 15.6, ndvi: 0.61, gcvi: 3.2, ndre: 0.27, vhi: 48, rainfall: 240, rainfallExpected: 320, predictedYield: 3.1, lastSeasonYield: 3.6, stage: "Tasselling", status: "Nitrogen Risk", lat: -0.53, lng: 35.30 },
  { id: "P-04", name: "Riverside South", area: 22.0, ndvi: 0.81, gcvi: 5.7, ndre: 0.45, vhi: 78, rainfall: 340, rainfallExpected: 320, predictedYield: 5.2, lastSeasonYield: 4.7, stage: "Grain Fill", status: "Healthy", lat: -0.55, lng: 35.26 },
  { id: "P-05", name: "West Ridge", area: 9.3, ndvi: 0.55, gcvi: 2.8, ndre: 0.22, vhi: 38, rainfall: 195, rainfallExpected: 320, predictedYield: 2.4, lastSeasonYield: 3.4, stage: "Tasselling", status: "Drought Risk", lat: -0.50, lng: 35.24 },
  { id: "P-06", name: "Lower Plain", area: 18.7, ndvi: 0.72, gcvi: 4.4, ndre: 0.36, vhi: 62, rainfall: 305, rainfallExpected: 320, predictedYield: 4.1, lastSeasonYield: 4.0, stage: "Tasselling", status: "Healthy", lat: -0.54, lng: 35.29 },
  { id: "P-07", name: "Eastgate", area: 11.2, ndvi: 0.68, gcvi: 3.9, ndre: 0.31, vhi: 55, rainfall: 278, rainfallExpected: 320, predictedYield: 3.7, lastSeasonYield: 3.8, stage: "Tasselling", status: "Heat Stress", lat: -0.52, lng: 35.31 },
  { id: "P-08", name: "Southwest Block", area: 14.5, ndvi: 0.76, gcvi: 4.8, ndre: 0.40, vhi: 68, rainfall: 318, rainfallExpected: 320, predictedYield: 4.5, lastSeasonYield: 4.1, stage: "Tasselling", status: "Healthy", lat: -0.56, lng: 35.25 },
];

export const NDVI_TIMESERIES = [
  { week: 1, ndvi: 0.18, expected: 0.20 },
  { week: 2, ndvi: 0.32, expected: 0.34 },
  { week: 3, ndvi: 0.48, expected: 0.50 },
  { week: 4, ndvi: 0.62, expected: 0.64 },
  { week: 5, ndvi: 0.71, expected: 0.72 },
  { week: 6, ndvi: 0.76, expected: 0.78 },
  { week: 7, ndvi: 0.74, expected: 0.79 },
  { week: 8, ndvi: 0.71, expected: 0.77 },
];

export const RAINFALL_DATA = [
  { week: 1, mm: 18, expected: 25 },
  { week: 2, mm: 42, expected: 35 },
  { week: 3, mm: 56, expected: 45 },
  { week: 4, mm: 38, expected: 50 },
  { week: 5, mm: 28, expected: 48 },
  { week: 6, mm: 22, expected: 45 },
  { week: 7, mm: 15, expected: 42 },
  { week: 8, mm: 18, expected: 40 },
];

export const farmTotal = {
  totalArea: PLOTS.reduce((a, p) => a + p.area, 0),
  expectedTonnes: PLOTS.reduce((a, p) => a + p.area * p.predictedYield, 0),
  lastSeasonTonnes: PLOTS.reduce((a, p) => a + p.area * p.lastSeasonYield, 0),
  avgYield:
    PLOTS.reduce((a, p) => a + p.predictedYield * p.area, 0) /
    PLOTS.reduce((a, p) => a + p.area, 0),
  riskCount: PLOTS.filter((p) => p.status !== "Healthy").length,
};

export const statusColor: Record<Plot["status"], string> = {
  Healthy: "oklch(0.55 0.16 145)",
  "Nitrogen Risk": "oklch(0.7 0.16 75)",
  "Drought Risk": "oklch(0.62 0.22 28)",
  "Heat Stress": "oklch(0.6 0.2 30)",
};
