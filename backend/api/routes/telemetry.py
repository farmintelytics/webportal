from ninja import Router
from typing import List, Optional
from ..utils.gis import MOCK_PLOTS
from ..utils.calculations import calculate_vpd
from ..schemas.plot import PlotTelemetryResponse

router = Router(tags=["Climate & Sensor Telemetry"])

@router.get("/", response=List[PlotTelemetryResponse])
def get_plots_telemetry(request, date: Optional[str] = None, plot_id: Optional[str] = None):
    """
    Returns localized climate telemetry and land surface temperatures:
    - Cumulative Rainfall (mm)
    - Soil Temperature (celsius)
    - Land Surface Temperature / LST (celsius)
    - Vapor Pressure Deficit / VPD (kPa)
    """
    results = []
    
    # Filter plots
    target_plots = MOCK_PLOTS
    if plot_id:
        if plot_id in MOCK_PLOTS:
            target_plots = {plot_id: MOCK_PLOTS[plot_id]}
        else:
            return []

    # Mock parameters for temperature and humidity
    telemetry_profiles = {
        "PLOT-ALPHA": {"rainfall": 12.4, "soil_temp": 24.5, "lst": 28.2, "humidity": 65.0},
        "PLOT-BETA": {"rainfall": 19.5, "soil_temp": 26.8, "lst": 31.2, "humidity": 55.0},
        "PLOT-GAMMA": {"rainfall": 8.0, "soil_temp": 23.2, "lst": 27.0, "humidity": 70.0}
    }

    for pid in target_plots.keys():
        profile = telemetry_profiles.get(pid, {"rainfall": 10.0, "soil_temp": 25.0, "lst": 29.0, "humidity": 60.0})
        
        # Calculate VPD dynamically using temperature and relative humidity
        vpd = calculate_vpd(profile["lst"], profile["humidity"])
        
        results.append(
            PlotTelemetryResponse(
                plot_id=pid,
                rainfall_mm=profile["rainfall"],
                soil_temp_celsius=profile["soil_temp"],
                surface_lst_celsius=profile["lst"],
                vpd_kpa=vpd
            )
        )
    return results
