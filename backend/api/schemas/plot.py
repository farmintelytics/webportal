from ninja import Schema
from typing import List, Dict, Any, Optional

class Boundary(Schema):
    type: str
    coordinates: List[List[List[List[float]]]]

class PlotIndices(Schema):
    ndvi: float
    ndmi: float
    chlorophyll: float
    uas_anomaly_score: float

class PlotIntelligence(Schema):
    plot_id: str
    name: str
    estate: str
    boundary: Dict[str, Any]
    indices: PlotIndices

class HealthIndices(Schema):
    ndvi: float
    chlorophyll: float
    water_stress: float
    pest_risk: str

class PlotHealthResponse(Schema):
    plot_id: str
    indices: HealthIndices

class PlotYieldResponse(Schema):
    plot_id: str
    yield_rate_ton_ha: float
    projected_yield_tons: float
    biomass_index: float
    harvest_readiness_pct: int
    confidence_accuracy: str

class PlotTelemetryResponse(Schema):
    plot_id: str
    rainfall_mm: float
    soil_temp_celsius: float
    surface_lst_celsius: float
    vpd_kpa: float
