import datetime
from ninja import Router
from typing import Dict, Any, List

router = Router(tags=["Dashboard"])

@router.get("/stats", response=Dict[str, Any])
def get_dashboard_stats(request):
    """
    Returns executive KPI metrics for the landing dashboard.

    Frontend field mapping (from agromonitorApi.js):
      total_area_ha                  → total area display card
      active_imagery_source          → imagery source badge
      average_carbon_density_tco2e_ha → carbon density card
      active_alerts_count            → alerts count badge
      audit_status                   → compliance status badge
    """
    return {
        "total_area_ha": 35.7,
        "active_imagery_source": "Sentinel-2 L2A (ESA)",
        "average_carbon_density_tco2e_ha": 58.2,
        "active_alerts_count": 3,
        "audit_status": "All Clear (EUDR Compliant)"
    }


@router.get("/trends", response=Dict[str, Any])
def get_dashboard_trends(request):
    """
    Returns chart-compatible telemetry trends:
    1. NDVI Vigor Trend (24-week line chart)        → ndvi_vigor_trends[]
    2. NDMI Moisture Comparison (bar chart)          → moisture_comparison[]
    3. Nutrient Profiling (radar chart)              → nutrient_profile
    4. Land Classification (doughnut chart)          → land_use_classification[]

    Each ndvi_vigor_trends item: { label, ndvi }
    Each moisture_comparison item: { plot_id, name, ndmi, status }
    nutrient_profile: { labels[], values[], baselines[] }
    Each land_use_classification item: { segment, area_ha, pct }
    """
    # 1. 24-week NDVI trends — parsed from the simulated Geospatial Zarr Dataset (.zar)
    import json
    import os
    import struct
    
    today = datetime.date.today()
    ndvi_trends = []
    
    zarr_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'remote_sensing.zar')
    ndvi_chunk_path = os.path.join(zarr_dir, 'ndvi', '0')
    ndvi_zarray_path = os.path.join(zarr_dir, 'ndvi', '.zarray')
    
    try:
        # Load shape from metadata
        with open(ndvi_zarray_path, 'r') as f:
            zarray = json.load(f)
            shape = zarray.get("shape", [24])[0]
            
        # Unpack binary float32 values from the chunk file
        with open(ndvi_chunk_path, 'rb') as f:
            binary_data = f.read()
            # Unpack float32 '<f' values
            ndvi_values = list(struct.unpack(f"<{shape}f", binary_data))
            
        # Construct ISO week labels chronologically (weeks_ago descending)
        for idx, ndvi_val in enumerate(ndvi_values):
            # idx runs from 0 to 23. Let's make index 0 correspond to weeks_ago = 24 and index 23 to weeks_ago = 1
            weeks_ago = 24 - idx
            week_date = today - datetime.timedelta(weeks=weeks_ago)
            iso_year, iso_week, _ = week_date.isocalendar()
            label = f"W{iso_week:02d}/{str(iso_year)[-2:]}"
            ndvi_trends.append({"label": label, "ndvi": round(ndvi_val, 2)})
            
    except Exception as e:
        # Fallback to local simulation if .zar dataset is not readable
        base_ndvi = 0.65
        for i in range(24, 0, -1):
            week_date = today - datetime.timedelta(weeks=i)
            iso_year, iso_week, _ = week_date.isocalendar()
            label = f"W{iso_week:02d}/{str(iso_year)[-2:]}"
            ndvi_val = round(
                base_ndvi + (0.008 * (24 - i)) + (0.02 * (1 if i % 2 == 0 else -1)),
                2
            )
            ndvi_trends.append({"label": label, "ndvi": min(ndvi_val, 0.95)})


    # 2. NDMI moisture bar comparison (matches plotsData field ndmi)
    moisture_comparison = [
        {"plot_id": "PLOT-ALPHA", "name": "West Valley Plot", "ndmi": 0.53, "status": "Adequate"},
        {"plot_id": "PLOT-BETA",  "name": "East Ridge Plot",  "ndmi": 0.27, "status": "Mild Stress"},
        {"plot_id": "PLOT-GAMMA", "name": "South Slope Plot", "ndmi": 0.60, "status": "Waterlogged"}
    ]

    # 3. Nutrient radar profiling (radar chart: labels + actual values + baselines)
    nutrient_profile = {
        "labels":    ["Nitrogen (N)", "Phosphorus (P)", "Potassium (K)",
                      "Organic Matter", "Soil pH", "Micro-Moisture"],
        "values":    [82, 75, 90, 68, 62, 74],   # actual scores out of 100
        "baselines": [80, 80, 80, 70, 60, 70]     # benchmark targets
    }

    # 4. Land use doughnut classification
    land_use = [
        {"segment": "Cash Crop (Oil Palm / Cocoa)", "area_ha": 21.4, "pct": 60},
        {"segment": "Restoration Zone (Canopy)",    "area_ha":  7.1, "pct": 20},
        {"segment": "Forest Buffer Zone",            "area_ha":  5.4, "pct": 15},
        {"segment": "Infrastructure / Facilities",  "area_ha":  1.8, "pct":  5}
    ]

    return {
        "ndvi_vigor_trends":       ndvi_trends,
        "moisture_comparison":     moisture_comparison,
        "nutrient_profile":        nutrient_profile,
        "land_use_classification": land_use
    }
