export type GrowthStage = "Flooded" | "Vegetative" | "Heading" | "Ripening" | "Fallow";
export type AlertLevel = "healthy" | "stressed" | "critical";

export interface Plot {
  id: string;
  name: string;
  area: number; // ha
  // simple polygon (lat,lng) around farm in Mekong Delta-ish area
  polygon: [number, number][];
  centroid: [number, number];
  suitability: "High" | "Moderate" | "Low";
  suitabilityScore: number;
  ndvi: number;
  ndre: number;
  lswi: number;
  vhi: number;
  stage: GrowthStage;
  daysSincePlanting: number;
  predictedYield: number; // t/ha
  lastSeasonYield: number;
  alert: AlertLevel;
  recommendedPlanting: string;
  soilScore: number;
  waterScore: number;
  climateScore: number;
}

// Generate plots around a center
const center: [number, number] = [10.45, 105.63]; // Mekong-ish

// Pseudo-random but deterministic per seed for stable irregular polygons
function rand(seed: number) {
  let s = seed * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function makePolygon(lat: number, lng: number, seed: number, size = 0.009): [number, number][] {
  const r = rand(seed);
  const sides = 6 + Math.floor(r() * 3); // 6-8 sides for organic field shapes
  const pts: [number, number][] = [];
  for (let i = 0; i < sides; i++) {
    const angle = (i / sides) * Math.PI * 2 + r() * 0.4;
    const radius = size * (0.55 + r() * 0.7);
    const aspect = 1.4; // lng stretched (degrees)
    pts.push([
      +(lat + Math.sin(angle) * radius).toFixed(6),
      +(lng + Math.cos(angle) * radius * aspect).toFixed(6),
    ]);
  }
  return pts;
}

const stageOptions: GrowthStage[] = ["Flooded", "Vegetative", "Heading", "Ripening"];

export const plots: Plot[] = Array.from({ length: 14 }).map((_, i) => {
  const row = Math.floor(i / 5);
  const col = i % 5;
  const lat = center[0] + row * 0.012;
  const lng = center[1] + col * 0.014;
  const ndvi = +(0.35 + Math.random() * 0.5).toFixed(2);
  const vhi = Math.round(25 + Math.random() * 70);
  const alert: AlertLevel = vhi < 40 ? "critical" : vhi < 55 ? "stressed" : "healthy";
  const stage = stageOptions[i % stageOptions.length];
  const yieldPred = +(2.8 + Math.random() * 3.4).toFixed(2);
  const score = Math.round(55 + Math.random() * 42);
  const suitability = score > 80 ? "High" : score > 65 ? "Moderate" : "Low";
  return {
    id: `RP-${String(i + 1).padStart(3, "0")}`,
    name: `Plot ${String.fromCharCode(65 + i)}`,
    area: +(1.2 + Math.random() * 4.8).toFixed(1),
    polygon: makePolygon(lat, lng, i + 1),
    centroid: [lat + 0.004, lng + 0.0056],
    suitability,
    suitabilityScore: score,
    ndvi,
    ndre: +(ndvi * 0.7).toFixed(2),
    lswi: +(0.1 + Math.random() * 0.5).toFixed(2),
    vhi,
    stage,
    daysSincePlanting: Math.round(15 + Math.random() * 110),
    predictedYield: yieldPred,
    lastSeasonYield: +(yieldPred * (0.85 + Math.random() * 0.25)).toFixed(2),
    alert,
    recommendedPlanting: ["April", "May", "June", "July"][i % 4],
    soilScore: Math.round(60 + Math.random() * 35),
    waterScore: Math.round(60 + Math.random() * 35),
    climateScore: Math.round(60 + Math.random() * 35),
  };
});

export const ndviTimeSeries = Array.from({ length: 16 }).map((_, i) => ({
  week: `W${i + 1}`,
  ndvi: +(0.25 + Math.sin(i / 3) * 0.15 + i * 0.025 + Math.random() * 0.05).toFixed(2),
  evi: +(0.2 + Math.sin(i / 3) * 0.12 + i * 0.022 + Math.random() * 0.04).toFixed(2),
  ndre: +(0.18 + Math.sin(i / 3) * 0.1 + i * 0.018 + Math.random() * 0.03).toFixed(2),
}));

export const yieldByStage = [
  { stage: "Flooded", plots: plots.filter(p => p.stage === "Flooded").length },
  { stage: "Vegetative", plots: plots.filter(p => p.stage === "Vegetative").length },
  { stage: "Heading", plots: plots.filter(p => p.stage === "Heading").length },
  { stage: "Ripening", plots: plots.filter(p => p.stage === "Ripening").length },
];

export const rainfallData = Array.from({ length: 12 }).map((_, i) => ({
  month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
  rainfall: Math.round(40 + Math.random() * 220),
  temp: Math.round(22 + Math.random() * 10),
}));

export const stageColors: Record<GrowthStage, string> = {
  Flooded: "#3b82f6",
  Vegetative: "#a3d459",
  Heading: "#15803d",
  Ripening: "#b45309",
  Fallow: "#78716c",
};

export const alertColors: Record<AlertLevel, string> = {
  healthy: "#16a34a",
  stressed: "#f59e0b",
  critical: "#dc2626",
};
