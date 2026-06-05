from ninja import Router
from typing import Dict, Any, List

router = Router(tags=["Dashboard"])

@router.get("/stats", response=Dict[str, Any])
def get_dashboard_stats(request):
    """
    Returns executive metrics for the landing dashboard.
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
    1. NDVI Vigor Trend (6 months line chart)
    2. NDMI Moisture Comparison (bar chart)
    3. Nutrient Profiling (radar chart)
    4. Land Classification (doughnut chart)
    """
    # 1. 6-Month NDVI trends (24 weekly data points)
    ndvi_trends = []
    base_ndvi = 0.65
    for i in range(24, 0, -1):
        # Add some pseudo-random but clean growth trend
        date_str = f"W-{i}"
        ndvi_val = round(base_ndvi + (0.008 * (24 - i)) + (0.02 * (1 if i % 2 == 0 else -1)), 2)
        ndvi_trends.append({"label": date_str, "ndvi": min(ndvi_val, 0.95)})

    # 2. NDMI moisture bar comparison
    moisture_comparison = [
        {"plot_id": "PLOT-ALPHA", "name": "West Valley Plot", "ndmi": 0.42, "status": "Adequate"},
        {"plot_id": "PLOT-BETA", "name": "East Valley Plot", "ndmi": 0.28, "status": "Mild Stress"},
        {"plot_id": "PLOT-GAMMA", "name": "North Ridge Plot", "ndmi": 0.58, "status": "Waterlogged"}
    ]

    # 3. Nutrient radar profiling
    nutrient_profile = {
        "labels": ["Nitrogen (N)", "Phosphorus (P)", "Potassium (K)", "Organic Matter", "Soil pH", "Micro-Moisture"],
        "values": [82, 75, 90, 68, 62, 74],  # out of 100 benchmark
        "baselines": [80, 80, 80, 70, 60, 70]
    }

    # 4. Land use doughnut classification
    land_use = [
        {"segment": "Cash Crop (Oil Palm / Cocoa)", "area_ha": 21.4, "pct": 60},
        {"segment": "Restoration Zone (Canopy)", "area_ha": 7.1, "pct": 20},
        {"segment": "Forest Buffer Zone", "area_ha": 5.4, "pct": 15},
        {"segment": "Infrastructure / Facilities", "area_ha": 1.8, "pct": 5}
    ]

    return {
        "ndvi_vigor_trends": ndvi_trends,
        "moisture_comparison": moisture_comparison,
        "nutrient_profile": nutrient_profile,
        "land_use_classification": land_use
    }
