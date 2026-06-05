from ninja import Router
from typing import List
from ..utils.gis import MOCK_RESTORATION_ZONES
from ..schemas.restoration import RestorationZoneResponse

router = Router(tags=["Land Restoration & Agroforestry"])

@router.get("/", response=List[RestorationZoneResponse])
def get_restoration_zones(request):
    """
    Returns spatial boundaries and verification parameters for active restoration zones:
    - Canopy Regrowth Progress (%)
    - Tree Survival Rate (%)
    - Tree/Sapling counts
    - Estimated Carbon Sequestered (tCO2e)
    - Biodiversity Score (%)
    - Active Manager
    """
    results = []
    for zone_id, zone_data in MOCK_RESTORATION_ZONES.items():
        results.append(
            RestorationZoneResponse(
                zone_id=zone_id,
                name=zone_data["name"],
                project_type=zone_data["project_type"],
                progress_pct=zone_data["progress_pct"],
                survival_rate_pct=zone_data["survival_rate_pct"],
                tree_count=zone_data["tree_count"],
                carbon_offset_tco2e=zone_data["carbon_offset_tco2e"],
                biodiversity_score=zone_data["biodiversity_score"],
                manager=zone_data["manager"],
                boundary=zone_data["boundary"]
            )
        )
    return results
