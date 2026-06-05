from ninja import Schema
from typing import Dict, Any, Optional

class RestorationZoneResponse(Schema):
    zone_id: str
    name: str
    project_type: str
    progress_pct: int
    survival_rate_pct: int
    tree_count: int
    carbon_offset_tco2e: float
    biodiversity_score: str
    manager: str
    boundary: Optional[Dict[str, Any]] = None
