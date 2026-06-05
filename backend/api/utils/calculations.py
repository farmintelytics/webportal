import math

def calculate_ndvi(nir: float, red: float) -> float:
    """
    Normalized Difference Vegetation Index (NDVI)
    Formula: (NIR - Red) / (NIR + Red)
    Typical range: -1.0 to 1.0. Vegetated areas: 0.2 to 1.0.
    """
    denominator = nir + red
    if denominator == 0:
        return 0.0
    return (nir - red) / denominator

def calculate_ndmi(nir: float, swir1: float) -> float:
    """
    Normalized Difference Moisture Index (NDMI) / LSWI (B11 SWIR)
    Formula: (NIR - SWIR1) / (NIR + SWIR1)
    Typical range: -1.0 to 1.0. Optimal: 0.0 to 0.8.
    """
    denominator = nir + swir1
    if denominator == 0:
        return 0.0
    return (nir - swir1) / denominator

def calculate_evi(nir: float, red: float, blue: float) -> float:
    """
    Enhanced Vegetation Index (EVI)
    Formula: 2.5 * (NIR - Red) / (NIR + 6 * Red - 7.5 * Blue + 1.0)
    Optimized for high biomass regions.
    """
    denominator = nir + (6.0 * red) - (7.5 * blue) + 1.0
    if denominator == 0:
        return 0.0
    return 2.5 * (nir - red) / denominator

def calculate_lswi(nir: float, swir2: float) -> float:
    """
    Land Surface Water Index (LSWI)
    Formula: (NIR - SWIR2) / (NIR + SWIR2)
    """
    denominator = nir + swir2
    if denominator == 0:
        return 0.0
    return (nir - swir2) / denominator

def calculate_vpd(temperature_c: float, relative_humidity_pct: float) -> float:
    """
    Vapor Pressure Deficit (VPD) in kPa.
    Formulas:
      Saturated VP (e_s) = 0.61078 * exp(17.27 * T / (T + 237.3))
      Actual VP (e_a) = e_s * (RH / 100)
      VPD = e_s - e_a
    """
    if temperature_c is None or relative_humidity_pct is None:
        return 0.0
    # Saturated vapor pressure (e_s) in kPa
    e_s = 0.61078 * math.exp((17.27 * temperature_c) / (temperature_c + 237.3))
    # Actual vapor pressure (e_a) in kPa
    e_a = e_s * (relative_humidity_pct / 100.0)
    # Vapor Pressure Deficit
    vpd = e_s - e_a
    return round(vpd, 2)

def estimate_agb_carbon_offset(evi: float, canopy_cover_pct: float, plot_area_ha: float) -> float:
    """
    Carbon sequestration model: estimates Aboveground Biomass (AGB) in tonnes,
    then converts to tCO2e carbon offsets.
    Formula:
      AGB (t/HA) = (120 * EVI) + (0.8 * Canopy Cover %)
      Carbon Stock (tC/HA) = AGB * 0.5 (biomass is ~50% carbon)
      CO2 Equivalent (tCO2e/HA) = Carbon Stock * 3.67
      Total tCO2e = tCO2e/HA * Plot Area
    """
    if evi <= 0:
        return 0.0
    agb_per_ha = (120.0 * evi) + (0.8 * canopy_cover_pct)
    carbon_stock_per_ha = agb_per_ha * 0.5
    tco2e_per_ha = carbon_stock_per_ha * 3.67
    total_tco2e = tco2e_per_ha * plot_area_ha
    return round(total_tco2e, 1)

def model_yield_rate(ndvi: float, historical_base_ton_ha: float) -> float:
    """
    Predictive modeling of crop yield rate (t/HA) based on NDVI.
    Formula:
      yield_rate = historical_base_ton_ha * (ndvi / 0.70) ^ 1.2
    """
    if ndvi <= 0:
        return 0.0
    factor = math.pow((ndvi / 0.70), 1.2)
    predicted = historical_base_ton_ha * factor
    return round(predicted, 1)

def classify_pest_risk(ndvi: float, ndmi: float, temp_c: float) -> str:
    """
    Pest Risk Classifier model.
    High NDVI (dense canopy) + High NDMI (moist environments) + Warm Temp (24-32 C)
    results in High Risk. Dry/bare or cold results in Low Risk.
    """
    if ndvi < 0.45:
        return "Low Risk"
    
    score = 0
    if ndvi > 0.70:
        score += 2
    if ndmi > 0.40:
        score += 2
    if 24.0 <= temp_c <= 32.0:
        score += 2
    
    if score >= 5:
        return "High Risk"
    elif score >= 3:
        return "Moderate Risk"
    else:
        return "Low Risk"

def get_ndvi_class(ndvi: float) -> dict:
    """
    NDVI Value Range Visual Classification.
    Returns class name, hex color, and agronomic interpretation.
    """
    if ndvi > 0.80:
        return {"class": "Exceptional", "color": "#14532D", "desc": "Maximum canopy closure, optimal health"}
    elif ndvi >= 0.70:
        return {"class": "Optimal", "color": "#16A34A", "desc": "Healthy vegetative activity"}
    elif ndvi >= 0.55:
        return {"class": "Moderate", "color": "#86EFAC", "desc": "Moderate canopy density, minor stress"}
    elif ndvi >= 0.45:
        return {"class": "Transition", "color": "#EAB308", "desc": "Early stress anomaly, cover-crop transition"}
    else:
        return {"class": "Deficit", "color": "#EF4444", "desc": "Severe canopy stress, bare soil, or crop loss"}

def get_yield_class(yield_rate: float) -> dict:
    """
    Yield Classification.
    """
    if yield_rate > 18.0:
        return {"class": "Exceptional", "color": "#15803d", "status": "Optimal soil conditions & solar conversion"}
    elif yield_rate >= 12.0:
        return {"class": "Good", "color": "#22c55e", "status": "Consistent growth trajectory"}
    elif yield_rate >= 8.0:
        return {"class": "Fair", "color": "#eab308", "status": "Minor soil or moisture constraint"}
    elif yield_rate >= 4.0:
        return {"class": "Suboptimal", "color": "#f97316", "status": "Stress during flowering stage"}
    else:
        return {"class": "Failed / Bare", "color": "#ef4444", "status": "Critical lodging or pest destruction"}

def get_moisture_class(ndmi: float) -> dict:
    """
    Moisture Classification.
    """
    if ndmi > 0.50:
        return {"class": "Waterlogged", "color": "#1E3A8A", "desc": "Soil saturation, pooling risk"}
    elif ndmi >= 0.42:
        return {"class": "Adequate", "color": "#2563EB", "desc": "Optimal root zone transpiration"}
    elif ndmi >= 0.35:
        return {"class": "Moderate", "color": "#60A5FA", "desc": "Under control, steady evaporation"}
    elif ndmi >= 0.28:
        return {"class": "Mild Stress", "color": "#F59E0B", "desc": "Evaporative deficit, beginning irrigation need"}
    else:
        return {"class": "Severe Stress", "color": "#DC2626", "desc": "Plant wilting, stomatal closure"}
