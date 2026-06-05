from ninja import Router
from typing import List, Optional
from ..utils.gis import MOCK_PLOTS
from ..utils.calculations import calculate_ndvi, calculate_evi, model_yield_rate
from ..schemas.plot import PlotYieldResponse

router = Router(tags=["Crop Yield Forecasting"])

@router.get("/", response=List[PlotYieldResponse])
def get_plots_yield_forecast(request, date: Optional[str] = None, plot_id: Optional[str] = None):
    """
    Returns harvest yield forecasts and canopy biomass estimations:
    - Estimated Yield Rate (t/HA)
    - Projected Season Output (Tonnes)
    - Dry Biomass index (EVI)
    - Harvest Readiness Percentage
    - Forecasting Confidence Accuracy
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
        evi = calculate_evi(bands["nir"], bands["red"], bands["blue"])
        
        # Calculate yield rate using regression model
        yield_rate = model_yield_rate(ndvi, pdata["historical_yield_base"])
        projected_yield = round(yield_rate * pdata["area_ha"], 1)
        
        # Define readiness profiles
        readiness_pct = 92
        confidence = "95.4%"
        
        if pid == "PLOT-BETA":
            readiness_pct = 76
            confidence = "91.2%"
        elif pid == "PLOT-GAMMA":
            readiness_pct = 84
            confidence = "94.8%"

        results.append(
            PlotYieldResponse(
                plot_id=pid,
                yield_rate_ton_ha=yield_rate,
                projected_yield_tons=projected_yield,
                biomass_index=round(evi, 2),
                harvest_readiness_pct=readiness_pct,
                confidence_accuracy=confidence
            )
        )
    return results
