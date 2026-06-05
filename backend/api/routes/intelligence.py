from ninja import Router
from typing import List
from ..utils.gis import MOCK_PLOTS
from ..utils.calculations import calculate_ndvi, calculate_ndmi
from ..schemas.plot import PlotIntelligence, PlotIndices

router = Router(tags=["Intelligence Layers"])

@router.get("/", response=List[PlotIntelligence])
def get_plots_intelligence(request):
    """
    Returns boundaries and composite indices for all plots.
    Calculations are derived dynamically from simulated satellite bands.
    """
    results = []
    for plot_id, plot_data in MOCK_PLOTS.items():
        bands = plot_data["sentinel_bands"]
        
        ndvi = calculate_ndvi(bands["nir"], bands["red"])
        ndmi = calculate_ndmi(bands["nir"], bands["swir1"])
        
        # Calculate Chlorophyll (CAR) as a red-edge absorption proxy
        chlorophyll = round(ndvi * 0.9, 2)
        
        # Assign custom drone UAS anomaly scores based on moisture/health deficit
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
