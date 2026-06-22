export type PlotStatus = "healthy" | "stress" | "alert" | "harvest";

export interface Plot {
  id: string;
  farmId: string;
  batchId: string;
  size: number;
  soil: string;
  slope: string;
  plantingDate: string;
  ageMonths: number;
  ndvi: number;
  lswi: number;
  vhi: number;
  predictedYield: number;
  status: PlotStatus;
  harvestWindow: string;
  polygon: [number, number][];
  center: [number, number];
}

export interface Farm {
  id: string;
  name: string;
  location: string;
  area: number;
}

export interface Batch {
  id: string;
  name: string;
  farmId: string;
  plantingDate: string;
  ageMonths: number;
  ndvi: number;
  vhi: number;
  predictedYield: number;
  status: string;
  ndviSeries: number[];
}

export interface Alert {
  id: string;
  plotId: string;
  batchId: string;
  type: string;
  severity: "high" | "medium" | "info";
  date: string;
  message: string;
}

export const farms: Farm[] = [
  { id: "F1", name: "Ondo Farm A", location: "Ondo State, Nigeria", area: 14.2 },
  { id: "F2", name: "Kwara Farm B", location: "Kwara State, Nigeria", area: 11.7 },
];

export const batches: Batch[] = [
  {
    id: "B1", name: "Batch 1", farmId: "F1",
    plantingDate: "2023-10-15", ageMonths: 9,
    ndvi: 0.72, vhi: 58, predictedYield: 22, status: "Harvest Ready",
    ndviSeries: [0.16, 0.22, 0.31, 0.44, 0.58, 0.68, 0.74, 0.76, 0.72, 0.68, 0.62, 0.55],
  },
  {
    id: "B2", name: "Batch 2", farmId: "F1",
    plantingDate: "2024-01-20", ageMonths: 6,
    ndvi: 0.61, vhi: 44, predictedYield: 17, status: "Full Canopy",
    ndviSeries: [0.15, 0.21, 0.30, 0.42, 0.55, 0.61, 0.65, 0.62, 0.58, 0.5, 0.42, 0.35],
  },
  {
    id: "B3", name: "Batch 3", farmId: "F2",
    plantingDate: "2024-03-10", ageMonths: 4,
    ndvi: 0.38, vhi: 31, predictedYield: 12, status: "Stress Alert",
    ndviSeries: [0.14, 0.19, 0.28, 0.35, 0.38, 0.36, 0.32, 0.28, 0.25, 0.22, 0.2, 0.18],
  },
  {
    id: "B4", name: "Batch 4", farmId: "F2",
    plantingDate: "2024-02-05", ageMonths: 5,
    ndvi: 0.55, vhi: 49, predictedYield: 16, status: "Growing",
    ndviSeries: [0.15, 0.22, 0.32, 0.45, 0.55, 0.58, 0.6, 0.55, 0.5, 0.42, 0.36, 0.3],
  },
];

function makePoly(lat: number, lng: number, size = 0.008): [number, number][] {
  return [
    [lng - size, lat - size],
    [lng + size, lat - size],
    [lng + size, lat + size],
    [lng - size, lat + size],
    [lng - size, lat - size],
  ];
}

const plotConfigs = [
  { id: "P001", farmId: "F1", batchId: "B1", lat: 7.510, lng: 5.000, size: 2.4, status: "harvest" as PlotStatus },
  { id: "P002", farmId: "F1", batchId: "B1", lat: 7.512, lng: 5.012, size: 1.8, status: "harvest" as PlotStatus },
  { id: "P003", farmId: "F1", batchId: "B2", lat: 7.502, lng: 5.005, size: 3.5, status: "healthy" as PlotStatus },
  { id: "P004", farmId: "F1", batchId: "B2", lat: 7.498, lng: 5.018, size: 1.2, status: "healthy" as PlotStatus },
  { id: "P005", farmId: "F1", batchId: "B2", lat: 7.490, lng: 5.008, size: 2.0, status: "stress" as PlotStatus },
  { id: "P006", farmId: "F2", batchId: "B3", lat: 7.530, lng: 5.030, size: 2.8, status: "alert" as PlotStatus },
  { id: "P007", farmId: "F2", batchId: "B3", lat: 7.535, lng: 5.042, size: 1.5, status: "alert" as PlotStatus },
  { id: "P008", farmId: "F2", batchId: "B4", lat: 7.522, lng: 5.038, size: 0.8, status: "healthy" as PlotStatus },
  { id: "P009", farmId: "F2", batchId: "B4", lat: 7.518, lng: 5.050, size: 3.1, status: "stress" as PlotStatus },
];

export const plots: Plot[] = plotConfigs.map((p, i) => {
  const batch = batches.find(b => b.id === p.batchId)!;
  return {
    id: p.id,
    farmId: p.farmId,
    batchId: p.batchId,
    size: p.size,
    soil: i % 2 === 0 ? "Sandy loam" : "Loam",
    slope: i % 3 === 0 ? "5–10°" : "0–5°",
    plantingDate: batch.plantingDate,
    ageMonths: batch.ageMonths,
    ndvi: batch.ndvi + (Math.random() * 0.1 - 0.05),
    lswi: 0.3 + Math.random() * 0.3,
    vhi: batch.vhi + Math.floor(Math.random() * 10 - 5),
    predictedYield: batch.predictedYield + Math.floor(Math.random() * 4 - 2),
    status: p.status,
    harvestWindow: p.status === "harvest" ? "Now – 4 weeks" : `${10 - batch.ageMonths}–${12 - batch.ageMonths} months`,
    polygon: makePoly(p.lat, p.lng, 0.005 + p.size * 0.001),
    center: [p.lat, p.lng],
  };
});

export const rainfall = [
  { month: "Jan", rainfall: 12, expected: 20 },
  { month: "Feb", rainfall: 28, expected: 35 },
  { month: "Mar", rainfall: 65, expected: 70 },
  { month: "Apr", rainfall: 110, expected: 115 },
  { month: "May", rainfall: 180, expected: 175 },
  { month: "Jun", rainfall: 220, expected: 210 },
  { month: "Jul", rainfall: 145, expected: 200 },
  { month: "Aug", rainfall: 95, expected: 180 },
  { month: "Sep", rainfall: 165, expected: 170 },
  { month: "Oct", rainfall: 120, expected: 125 },
  { month: "Nov", rainfall: 35, expected: 50 },
  { month: "Dec", rainfall: 15, expected: 25 },
];

export const alerts: Alert[] = [
  { id: "A1", plotId: "P004", batchId: "B3", type: "VHI Drought Stress", severity: "high", date: "2024-07-12", message: "VHI dropped to 31 — severe drought stress" },
  { id: "A2", plotId: "P006", batchId: "B3", type: "NDVI Below Expected", severity: "medium", date: "2024-07-10", message: "NDVI 0.38 vs expected 0.55 at month 4" },
  { id: "A3", plotId: "P002", batchId: "B1", type: "Harvest Window NOW", severity: "info", date: "2024-07-08", message: "Optimal harvest window has opened" },
  { id: "A4", plotId: "P007", batchId: "B3", type: "Rainfall Deficit > 30%", severity: "medium", date: "2024-07-05", message: "Cumulative rainfall 38% below normal" },
];

export const totalArea = plots.reduce((s, p) => s + p.size, 0);
export const totalYield = plots.reduce((s, p) => s + p.size * p.predictedYield, 0);
export const stressCount = plots.filter(p => p.status === "alert" || p.status === "stress").length;

export const statusColors: Record<PlotStatus, string> = {
  healthy: "#16A34A",
  stress: "#D97706",
  alert: "#DC2626",
  harvest: "#0EA5E9",
};
