from ninja import Schema
from typing import List, Dict, Any, Optional


# ── Boundary ──────────────────────────────────────────────────────────────────
# GeoJSON Polygon coordinates are 3-dimensional:
#   coordinates[ring_idx][point_idx][coord_idx]
# i.e.  List[ring]  →  List[point]  →  List[float]
# The frontend helper geoJsonToLeaflet() expects this shape and swaps
# [lng, lat] → [lat, lng] for Leaflet.

class Boundary(Schema):
    type: str
    coordinates: List[List[List[float]]]


# ── Intelligence Layers ───────────────────────────────────────────────────────

class PlotIndices(Schema):
    ndvi: float
    ndmi: float
    chlorophyll: float
    uas_anomaly_score: float


class PlotIntelligence(Schema):
    plot_id: str
    name: str
    estate: str
    area_ha: float                        # added – displayed in popup cards
    boundary: Dict[str, Any]
    indices: PlotIndices


# ── Crop Health Analytics ─────────────────────────────────────────────────────

class HealthIndices(Schema):
    ndvi: float
    chlorophyll: float
    water_stress: float
    pest_risk: str                        # "Low Risk" | "Moderate Risk" | "High Risk"


class PlotHealthResponse(Schema):
    plot_id: str
    name: str                             # added – used in sidebar cards
    area_ha: float                        # added – displayed in popup cards
    indices: HealthIndices


# ── Crop Yield Forecasting ────────────────────────────────────────────────────

class PlotYieldResponse(Schema):
    plot_id: str
    name: str                             # added
    area_ha: float                        # added
    yield_rate_ton_ha: float
    projected_yield_tons: float
    biomass_index: float
    harvest_readiness_pct: int
    confidence_accuracy: str


# ── Climate & Sensor Telemetry ────────────────────────────────────────────────

class PlotTelemetryResponse(Schema):
    plot_id: str
    name: str                             # added
    area_ha: float                        # added
    rainfall_mm: float
    soil_temp_celsius: float
    surface_lst_celsius: float
    vpd_kpa: float
