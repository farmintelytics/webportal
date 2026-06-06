from ninja import Schema
from typing import Dict, Any, Optional


class RestorationZoneResponse(Schema):
    zone_id: str
    name: str
    area: str                             # e.g. "6.4 HA" — displayed in frontend zone cards
    project_type: str
    progress_pct: int
    survival_rate_pct: int
    survival_display: str                 # e.g. "94%" — formatted string used in popup
    tree_count: int
    tree_count_display: str              # e.g. "1,200" — comma-formatted for display
    carbon_offset_tco2e: float
    carbon_display: str                  # e.g. "45.2 tCO2e" — display string
    biodiversity_score: str              # e.g. "92%" — display string
    biodiversity_score_num: int          # numeric value for coloring logic
    status: str                          # e.g. "Optimal Growth"
    manager: str
    boundary: Optional[Dict[str, Any]] = None
