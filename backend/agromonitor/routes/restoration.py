"""
restoration.py — Land Restoration & Agroforestry route
──────────────────────────────────────────────────────────────────────────────
Spatial data is loaded from:  backend/api/data/restoration_zones.geojson

The gis.py utility parses the GeoJSON FeatureCollection at import time and
exposes MOCK_RESTORATION_ZONES as a dict keyed by zone_id.
──────────────────────────────────────────────────────────────────────────────
"""
from ninja import Router
from typing import List
from ..utils.gis import MOCK_RESTORATION_ZONES
from ..schemas.restoration import RestorationZoneResponse

router = Router(tags=["Land Restoration & Agroforestry"])


@router.get("/", response=List[RestorationZoneResponse])
def get_restoration_zones(request):
    """
    Returns spatial boundaries and verification parameters for active
    restoration zones, sourced from restoration_zones.geojson.

    Frontend field mapping (from agromonitorApi.js):
      zone_id              → id
      name                 → name
      area                 → area (display string, e.g. "6.4 HA")
      project_type         → type
      progress_pct         → progress
      survival_rate_pct    → survivalNum  (numeric, used for fill color logic)
      survival_display     → survival     (display string, e.g. "94%")
      tree_count           → (numeric count)
      tree_count_display   → trees        (comma-formatted string, e.g. "1,200")
      carbon_offset_tco2e  → (numeric value)
      carbon_display       → carbon       (display string, e.g. "45.2 tCO2e")
      biodiversity_score   → biodiversity_score (display string)
      biodiversity_score_num → (numeric, used for coloring logic)
      status               → status
      manager              → manager
      boundary             → boundary (GeoJSON coords, converted to Leaflet by frontend)
    """
    results = []
    for zone_id, zone_data in MOCK_RESTORATION_ZONES.items():
        results.append(
            RestorationZoneResponse(
                zone_id=zone_id,
                name=zone_data["name"],
                area=zone_data["area"],
                project_type=zone_data["project_type"],
                progress_pct=zone_data["progress_pct"],
                survival_rate_pct=zone_data["survival_rate_pct"],
                survival_display=zone_data["survival_display"],
                tree_count=zone_data["tree_count"],
                tree_count_display=zone_data["tree_count_display"],
                carbon_offset_tco2e=zone_data["carbon_offset_tco2e"],
                carbon_display=zone_data["carbon_display"],
                biodiversity_score=zone_data["biodiversity_score"],
                biodiversity_score_num=zone_data["biodiversity_score_num"],
                status=zone_data["status"],
                manager=zone_data["manager"],
                boundary=zone_data["boundary"]
            )
        )
    return results
