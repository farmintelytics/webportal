"""
yield_forecast.py — Crop Yield Forecasting route
──────────────────────────────────────────────────────────────────────────────
Band reflectance values are read from:
  backend/api/data/sentinel_bands.zar/<PLOT-ID>/<band>/0
Plot metadata (name, area, yield base) from:
  backend/api/data/plots.geojson  (loaded via gis.MOCK_PLOTS)
──────────────────────────────────────────────────────────────────────────────
"""
from ninja import Router
from typing import List, Optional
from ..utils.gis import MOCK_PLOTS, get_sentinel_bands_from_zarr
from ..utils.calculations import calculate_ndvi, calculate_evi, model_yield_rate
from ..schemas.plot import PlotYieldResponse


router = Router(tags=["Crop Yield Forecasting"])

@router.get("/", response=List[PlotYieldResponse])
def get_plots_yield_forecast(request, date: Optional[str] = None, plot_id: Optional[str] = None):
    """
    Returns harvest yield forecasts and canopy biomass estimations:
    - Estimated Yield Rate (t/HA)          → yield_rate_ton_ha
    - Projected Season Output (Tonnes)     → projected_yield_tons
    - Dry Biomass index (EVI)              → biomass_index
    - Harvest Readiness Percentage         → harvest_readiness_pct
    - Forecasting Confidence Accuracy      → confidence_accuracy

    Frontend field mapping (from agromonitorApi.js):
      yield_rate_ton_ha    → yieldValue
      projected_yield_tons → predictedYield
      biomass_index        → biomass (EVI-derived)
      harvest_readiness_pct → readiness
      confidence_accuracy  → predAccuracy
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
        # Read band reflectance live from sentinel_bands.zar/<pid>/<band>/0
        bands = get_sentinel_bands_from_zarr(pid)

        ndvi = calculate_ndvi(bands["nir"], bands["red"])
        evi = calculate_evi(bands["nir"], bands["red"], bands["blue"])

        # Calculate yield rate using regression model
        yield_rate = model_yield_rate(ndvi, pdata["historical_yield_base"])
        projected_yield = round(yield_rate * pdata["area_ha"], 1)

        # Define readiness profiles per plot
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
                name=pdata["name"],
                area_ha=pdata["area_ha"],
                yield_rate_ton_ha=yield_rate,
                projected_yield_tons=projected_yield,
                biomass_index=round(evi, 2),
                harvest_readiness_pct=readiness_pct,
                confidence_accuracy=confidence
            )
        )
    return results
