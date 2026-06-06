from ninja import Router
from typing import List, Optional
from ..utils.gis import MOCK_PLOTS
from ..utils.calculations import calculate_ndvi, calculate_ndmi, classify_pest_risk
from ..schemas.plot import PlotHealthResponse, HealthIndices

router = Router(tags=["Crop Health Analytics"])

@router.get("/", response=List[PlotHealthResponse])
def get_plots_health(request, date: Optional[str] = None, plot_id: Optional[str] = None):
    """
    Returns zonal statistics for vegetative crop health indices:
    - NDVI (Vegetative Vigor)              → indices.ndvi
    - Chlorophyll RECI index               → indices.chlorophyll
    - Water Stress index (1.0 - NDMI)      → indices.water_stress
    - Pest Risk Level (ML classifier)      → indices.pest_risk

    Frontend field mapping (from agromonitorApi.js):
      indices.ndvi         → ndvi
      indices.chlorophyll  → chlorophyll
      indices.water_stress → waterStress
      indices.pest_risk    → pestRisk  ("Low Risk" | "Moderate Risk" | "High Risk")
    """
    results = []

    # Filter plots
    target_plots = MOCK_PLOTS
    if plot_id:
        if plot_id in MOCK_PLOTS:
            target_plots = {plot_id: MOCK_PLOTS[plot_id]}
        else:
            return []

    for pid, pdata in target_plots.items():
        bands = pdata["sentinel_bands"]

        ndvi = calculate_ndvi(bands["nir"], bands["red"])
        ndmi = calculate_ndmi(bands["nir"], bands["swir1"])

        # RECI Red Edge Chlorophyll Index mock calculation
        reci = round(ndvi * 0.88, 2)

        # Crop water stress level (inverse of NDMI)
        water_stress = round(1.0 - ndmi, 2)

        # Local soil temperature / weather parameters mock for pest classifier
        temp_c = 28.5 if pid == "PLOT-BETA" else 22.0
        pest_risk = classify_pest_risk(ndvi, ndmi, temp_c)

        results.append(
            PlotHealthResponse(
                plot_id=pid,
                name=pdata["name"],
                area_ha=pdata["area_ha"],
                indices=HealthIndices(
                    ndvi=round(ndvi, 2),
                    chlorophyll=reci,
                    water_stress=water_stress,
                    pest_risk=pest_risk
                )
            )
        )
    return results
