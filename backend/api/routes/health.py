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
    - NDVI (Vegetative Vigor)
    - Chlorophyll (RECI - Red Edge Chlorophyll Index)
    - Water Stress index (1.0 - NDMI)
    - Pest Risk Level (Calculated via ML classification model)
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
                indices=HealthIndices(
                    ndvi=round(ndvi, 2),
                    chlorophyll=reci,
                    water_stress=water_stress,
                    pest_risk=pest_risk
                )
            )
        )
    return results
