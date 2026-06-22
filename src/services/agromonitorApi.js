/**
 * agromonitorApi.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Frontend API client for the Farmintelytics Django Ninja backend.
 *
 * Usage: import { fetchDashboardStats, fetchPlotsIntelligence, … } from '../api/agromonitorApi';
 *
 * The backend runs at http://127.0.0.1:8000 (Django dev server).
 * Base path: /farmintelytics-engine/agromonitoring
 * Every function is async and returns the parsed JSON response.
 *
 * NOTE: The frontend currently uses hardcoded mock data. These functions are
 * ready to be wired in as drop-in replacements once the backend is deployed.
 *
 * VERIFICATION PAGE: The /api/verification/audit endpoint intentionally returns
 * empty checks and logs — the verification page is left blank for now.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000/farmintelytics-engine/agromonitoring';

/** Generic fetch helper with JSON parsing and error handling */
async function apiFetch(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const token = localStorage.getItem('fi_token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(url, {
    ...options,
    headers,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status} – ${path}: ${text}`);
  }
  return res.json();
}

// ─── Authentication ─────────────────────────────────────────────────────────

/**
 * POST /api/auth/login
 * @param {string} email
 * @param {string} accessCode
 * @returns {{ token, email, status, message }}
 */
export async function login(email, accessCode) {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, access_code: accessCode }),
  });
}

/**
 * POST /api/auth/verify
 * @param {string} token
 * @returns {{ valid: boolean, user_info }}
 */
export async function verifyToken(token) {
  return apiFetch('/auth/verify', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
}

// ─── Dashboard ──────────────────────────────────────────────────────────────

/**
 * GET /api/dashboard/stats
 * Returns executive KPI cards:
 *   total_area_ha, active_imagery_source, average_carbon_density_tco2e_ha,
 *   active_alerts_count, audit_status
 */
export async function fetchDashboardStats() {
  return apiFetch('/dashboard/stats');
}

/**
 * GET /api/dashboard/trends
 * Returns charting datasets:
 *   ndvi_vigor_trends[]   → for the 6-month NDVI line chart
 *   moisture_comparison[] → NDMI bar chart (matches plotsData field ndmi)
 *   nutrient_profile      → radar chart labels + values
 *   land_use_classification[] → doughnut chart segments
 */
export async function fetchDashboardTrends() {
  return apiFetch('/dashboard/trends');
}

// ─── Intelligence Layers ────────────────────────────────────────────────────

/**
 * GET /api/plots/intelligence/
 * Returns plot boundaries + composite indices for the Intelligence Layers map.
 * Each item: { plot_id, name, estate, boundary, indices: { ndvi, ndmi, chlorophyll, uas_anomaly_score } }
 *
 * Frontend field mapping:
 *   plot_id              → id  (PLOT-ALPHA / PLOT-BETA / PLOT-GAMMA)
 *   name                 → name
 *   indices.ndvi         → ndvi
 *   indices.ndmi         → ndmi
 *   indices.chlorophyll  → chlorophyll
 *   indices.uas_anomaly_score → uas_anomaly_score
 *   boundary.coordinates → coords (after lat/lng swap – see note below)
 */
export async function fetchPlotsIntelligence() {
  return apiFetch('/plots/intelligence/');
}

// ─── Crop Health Analytics ──────────────────────────────────────────────────

/**
 * GET /api/plots/health/?date={date}&plot_id={plot_id}
 * Returns health indices per plot.
 * Each item: { plot_id, indices: { ndvi, chlorophyll, water_stress, pest_risk } }
 *
 * Frontend field mapping:
 *   indices.ndvi         → ndvi
 *   indices.chlorophyll  → chlorophyll
 *   indices.water_stress → waterStress
 *   indices.pest_risk    → pestRisk  ("Low Risk" | "Moderate Risk" | "High Risk")
 *
 * @param {string} [date]    ISO date string e.g. "2026-06-01"
 * @param {string} [plotId]  e.g. "PLOT-ALPHA"
 */
export async function fetchPlotsHealth({ date, plotId } = {}) {
  const params = new URLSearchParams();
  if (date)   params.set('date', date);
  if (plotId) params.set('plot_id', plotId);
  const qs = params.toString() ? `?${params}` : '';
  return apiFetch(`/plots/health/${qs}`);
}

// ─── Crop Yield Forecasting ─────────────────────────────────────────────────

/**
 * GET /api/plots/yield/forecast/?date={date}&plot_id={plot_id}
 * Returns yield forecasts per plot.
 * Each item: { plot_id, yield_rate_ton_ha, projected_yield_tons, biomass_index,
 *              harvest_readiness_pct, confidence_accuracy }
 *
 * Frontend field mapping:
 *   yield_rate_ton_ha    → yieldValue
 *   projected_yield_tons → predictedYield
 *   biomass_index        → biomass (EVI-derived)
 *   harvest_readiness_pct → readiness
 *   confidence_accuracy  → predAccuracy
 *
 * @param {string} [date]
 * @param {string} [plotId]
 */
export async function fetchPlotsYieldForecast({ date, plotId } = {}) {
  const params = new URLSearchParams();
  if (date)   params.set('date', date);
  if (plotId) params.set('plot_id', plotId);
  const qs = params.toString() ? `?${params}` : '';
  return apiFetch(`/plots/yield/forecast/${qs}`);
}

// ─── Climate & Sensor Telemetry ─────────────────────────────────────────────

/**
 * GET /api/plots/telemetry/?date={date}&plot_id={plot_id}
 * Returns microclimate sensor data per plot.
 * Each item: { plot_id, rainfall_mm, soil_temp_celsius, surface_lst_celsius, vpd_kpa }
 *
 * Frontend field mapping:
 *   rainfall_mm          → rainfall
 *   soil_temp_celsius    → soilTemp
 *   surface_lst_celsius  → lst
 *   vpd_kpa              → vpd
 *
 * @param {string} [date]
 * @param {string} [plotId]
 */
export async function fetchPlotsTelemetry({ date, plotId } = {}) {
  const params = new URLSearchParams();
  if (date)   params.set('date', date);
  if (plotId) params.set('plot_id', plotId);
  const qs = params.toString() ? `?${params}` : '';
  return apiFetch(`/plots/telemetry/${qs}`);
}

// ─── Land Restoration & Agroforestry ────────────────────────────────────────

/**
 * GET /api/restoration/zones/
 * Returns restoration zone data.
 * Each item: { zone_id, name, project_type, progress_pct, survival_rate_pct,
 *              tree_count, carbon_offset_tco2e, biodiversity_score, manager, boundary }
 *
 * Frontend field mapping:
 *   zone_id              → id
 *   progress_pct         → progress
 *   survival_rate_pct    → survivalNum
 *   tree_count           → trees
 *   carbon_offset_tco2e  → carbon
 *   biodiversity_score   → biodiversity_score
 *   manager              → manager
 */
export async function fetchRestorationZones() {
  return apiFetch('/restoration/zones/');
}

// ─── Alerts Command Center ──────────────────────────────────────────────────

/**
 * GET /api/alerts/
 * Returns incident feed and KPI counts.
 * { stats: { total, critical, warnings, acknowledged }, feed: AlertItem[] }
 *
 * AlertItem: { alert_id, plot_id, type, severity, message, timestamp,
 *              acknowledged, acknowledged_by, acknowledged_at }
 */
export async function fetchAlerts() {
  return apiFetch('/alerts/');
}

/**
 * POST /api/alerts/{alert_id}/acknowledge
 * Acknowledges an active alert and records the user.
 * @param {string} alertId  e.g. "ALT-001"
 * @returns {{ status, alert_id, acknowledged_by, acknowledged_at }}
 */
export async function acknowledgeAlert(alertId) {
  return apiFetch(`/alerts/${alertId}/acknowledge`, { method: 'POST' });
}

// ─── Verification (Intentionally blank for now) ─────────────────────────────

/**
 * GET /api/verification/audit/?plot_id={plot_id}
 * NOTE: The verification page is intentionally left blank/empty.
 * This endpoint returns { overall_compliance: true, checks: [], logs: [] }.
 * Wire this in later when the page is implemented.
 *
 * @param {string} [plotId]
 */
export async function fetchVerificationAudit(plotId = 'PLOT-ALPHA') {
  return apiFetch(`/verification/audit?plot_id=${plotId}`);
}

// ─── Certificate & Reports ──────────────────────────────────────────────────

/**
 * POST /api/reports/certificate
 * Generates a cryptographic MRV certificate with SHA-256 hash.
 * @param {{ scope: string, metric: string, plot_id?: string }} payload
 *   scope:   "Whole Farm (Aggregate)" | "Plot-Level"
 *   metric:  "NDVI" | "NDMI" | "NDWI" | "SOC" | "AGB"
 *   plot_id: optional, e.g. "PLOT-ALPHA"
 * @returns {{ certificate_id, hash, blockchain_status, data_points, diagnostic_summary, … }}
 */
export async function generateCertificate(payload) {
  return apiFetch('/reports/certificate', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * GET /api/reports/list
 * Returns list of pre-compiled environmental reports.
 * Each item: { report_id, title, metric, scope, plot_id, generated_at, download_url }
 */
export async function fetchReportsList() {
  return apiFetch('/reports/list');
}

// ─── AI Assistant ────────────────────────────────────────────────────────────

/**
 * POST /api/chat/ask
 * Sends a message to the AI assistant and returns a contextual response.
 * @param {{ message: string, scenario?: string }} payload
 *   scenario: "Climate-Smart Agriculture" | "Land Restoration" |
 *             "Carbon Registry" | "Traceability"
 * @returns {{ response: string, sources: string[] }}
 */
export async function askAiAssistant(payload) {
  return apiFetch('/chat/ask', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// ─── Coordinate Helper ───────────────────────────────────────────────────────

/**
 * Converts GeoJSON [lng, lat] pairs from the backend into
 * Leaflet-compatible [lat, lng] pairs used by the frontend Polygon component.
 *
 * Usage:
 *   const coords = geoJsonToLeaflet(plot.boundary.coordinates[0]);
 *
 * @param {Array<[number, number]>} geoJsonRing  Array of [lng, lat] from GeoJSON
 * @returns {Array<[number, number]>}             Array of [lat, lng] for Leaflet
 */
export function geoJsonToLeaflet(geoJsonRing) {
  return geoJsonRing.map(([lng, lat]) => [lat, lng]);
}
