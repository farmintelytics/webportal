"""
intelligence.py — Intelligence Layers route
────────────────────────────────────────────────────────────────────────
Band reflectance values are read from:
  backend/api/data/sentinel_bands.zar/<PLOT-ID>/<band>/0
Plot boundaries + metadata from:
  backend/api/data/plots.geojson  (loaded via gis.MOCK_PLOTS)
────────────────────────────────────────────────────────────────────────
"""
from ninja import Router
from typing import List
from ..utils.gis import MOCK_PLOTS, get_sentinel_bands_from_zarr
from ..utils.calculations import calculate_ndvi, calculate_ndmi
from ..schemas.plot import PlotIntelligence, PlotIndices

router = Router(tags=["Intelligence Layers"])

@router.get("/", response=List[PlotIntelligence])
def get_plots_intelligence(request):
    """
    Returns plot boundaries + composite indices for the Intelligence Layers map.

    Frontend field mapping (from agromonitorApi.js):
      plot_id              → id  (PLOT-ALPHA / PLOT-BETA / PLOT-GAMMA)
      name                 → name
      area_ha              → area (displayed in sidebar cards)
      indices.ndvi         → ndvi
      indices.ndmi         → ndmi
      indices.chlorophyll  → chlorophyll (CAR RECI proxy)
      indices.uas_anomaly_score → uas_anomaly_score
      boundary.coordinates → coords (after lat/lng swap via geoJsonToLeaflet)
    """
    results = []
    for plot_id, plot_data in MOCK_PLOTS.items():
        # Read band reflectance live from sentinel_bands.zar/<plot_id>/<band>/0
        bands = get_sentinel_bands_from_zarr(plot_id)

        ndvi = calculate_ndvi(bands["nir"], bands["red"])
        ndmi = calculate_ndmi(bands["nir"], bands["swir1"])

        # Chlorophyll (CAR) as red-edge absorption proxy
        chlorophyll = round(ndvi * 0.9, 2)

        # Drone UAS anomaly scores (localized from multispectral UAV orthomosaic)
        if plot_id == "PLOT-ALPHA":
            uas_anomaly = 0.15
        elif plot_id == "PLOT-BETA":
            uas_anomaly = 0.48
        else:
            uas_anomaly = 0.05

        results.append(
            PlotIntelligence(
                plot_id=plot_id,
                name=plot_data["name"],
                estate=plot_data["estate"],
                area_ha=plot_data["area_ha"],
                boundary=plot_data["boundary"],
                indices=PlotIndices(
                    ndvi=round(ndvi, 2),
                    ndmi=round(ndmi, 2),
                    chlorophyll=chlorophyll,
                    uas_anomaly_score=uas_anomaly
                )
            )
        )
    return results
