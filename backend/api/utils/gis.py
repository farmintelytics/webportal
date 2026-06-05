# Mock GIS Utility simulating PostGIS and remote sensing ingest pipelines.
#
# ── FRONTEND ALIGNMENT NOTE ──────────────────────────────────────────────────
# Plot names, IDs, area_ha and estate fields exactly match AgroMonitor.jsx:
#   PLOT-ALPHA  → "West Valley Plot"   12.5 HA   West Valley Estate
#   PLOT-BETA   → "East Ridge Plot"     8.2 HA   West Valley Estate
#   PLOT-GAMMA  → "South Slope Plot"   15.0 HA   North Ridge Estate
#
# Restoration zones match RESTORATION_ZONES constant in AgroMonitor.jsx:
#   ZONE-ALPHA  → "Canopy Reforestation"          6.4 HA   John Musa
#   ZONE-BETA   → "Agroforestry Zone"             5.8 HA   Alice Peters
#   ZONE-GAMMA  → "Riparian Buffer Restoration"   8.1 HA   David Kalu
#
# Boundary coordinates are GeoJSON [lng, lat] order.
# The frontend helper geoJsonToLeaflet() in src/api/agromonitorApi.js
# converts them to Leaflet [lat, lng] before passing to <Polygon>.
# ─────────────────────────────────────────────────────────────────────────────

MOCK_PLOTS = {
    "PLOT-ALPHA": {
        "plot_id": "PLOT-ALPHA",
        "name": "West Valley Plot",       # matches frontend plotsData name
        "estate": "West Valley Estate",
        "area_ha": 12.5,
        "historical_yield_base": 18.5,
        # Coordinates match PLOT_ALPHA_COORDS in AgroMonitor.jsx (lng/lat order)
        "boundary": {
            "type": "Polygon",
            "coordinates": [[[3.355, 7.145], [3.355, 7.150], [3.360, 7.150], [3.360, 7.145], [3.355, 7.145]]]
        },
        "sentinel_bands": {"blue": 0.05, "red": 0.08, "nir": 0.65, "swir1": 0.20, "swir2": 0.12}
    },
    "PLOT-BETA": {
        "plot_id": "PLOT-BETA",
        "name": "East Ridge Plot",        # matches frontend plotsData name
        "estate": "West Valley Estate",
        "area_ha": 8.2,
        "historical_yield_base": 14.2,
        # Coordinates match PLOT_BETA_COORDS in AgroMonitor.jsx (lng/lat order)
        "boundary": {
            "type": "Polygon",
            "coordinates": [[[3.362, 7.145], [3.362, 7.150], [3.367, 7.150], [3.367, 7.145], [3.362, 7.145]]]
        },
        "sentinel_bands": {"blue": 0.06, "red": 0.14, "nir": 0.40, "swir1": 0.22, "swir2": 0.16}
    },
    "PLOT-GAMMA": {
        "plot_id": "PLOT-GAMMA",
        "name": "South Slope Plot",       # matches frontend plotsData name
        "estate": "North Ridge Estate",
        "area_ha": 15.0,
        "historical_yield_base": 16.0,
        # Coordinates match PLOT_GAMMA_COORDS in AgroMonitor.jsx (lng/lat order)
        "boundary": {
            "type": "Polygon",
            "coordinates": [[[3.355, 7.138], [3.355, 7.143], [3.360, 7.143], [3.360, 7.138], [3.355, 7.138]]]
        },
        "sentinel_bands": {"blue": 0.04, "red": 0.07, "nir": 0.68, "swir1": 0.18, "swir2": 0.10}
    }
}

# ── Restoration zones ────────────────────────────────────────────────────────
# Names, managers, area labels and progress values match RESTORATION_ZONES
# and restorationPlotsDataA in AgroMonitor.jsx.
MOCK_RESTORATION_ZONES = {
    "ZONE-ALPHA": {
        "zone_id": "ZONE-ALPHA",
        "name": "Canopy Reforestation",
        "area": "6.4 HA",
        "project_type": "Canopy Density",
        "progress_pct": 88,
        "survival_rate_pct": 94,
        "tree_count": 1200,
        "carbon_offset_tco2e": 45.2,
        "biodiversity_score": "92%",
        "status": "Optimal Growth",
        "manager": "John Musa",           # matches frontend manager field
        # GeoJSON [lng, lat] — matches RESTORE_ZONE_A_COORDS swapped
        "boundary": {
            "type": "Polygon",
            "coordinates": [[[3.350, 7.141], [3.350, 7.144], [3.354, 7.144], [3.354, 7.141], [3.350, 7.141]]]
        }
    },
    "ZONE-BETA": {
        "zone_id": "ZONE-BETA",
        "name": "Agroforestry Zone",
        "area": "5.8 HA",
        "project_type": "Species Diversification",
        "progress_pct": 74,
        "survival_rate_pct": 89,
        "tree_count": 980,
        "carbon_offset_tco2e": 32.8,
        "biodiversity_score": "88%",
        "status": "Active Care",
        "manager": "Alice Peters",        # matches frontend manager field
        "boundary": {
            "type": "Polygon",
            "coordinates": [[[3.356, 7.141], [3.356, 7.144], [3.361, 7.144], [3.361, 7.141], [3.356, 7.141]]]
        }
    },
    "ZONE-GAMMA": {
        "zone_id": "ZONE-GAMMA",
        "name": "Riparian Buffer Restoration",
        "area": "8.1 HA",
        "project_type": "Soil Stabilization",
        "progress_pct": 62,
        "survival_rate_pct": 81,
        "tree_count": 1550,
        "carbon_offset_tco2e": 21.5,
        "biodiversity_score": "81%",
        "status": "Initial Phase",
        "manager": "David Kalu",          # matches frontend manager field
        "boundary": {
            "type": "Polygon",
            "coordinates": [[[3.350, 7.135], [3.350, 7.139], [3.355, 7.139], [3.355, 7.135], [3.350, 7.135]]]
        }
    }
}

def verify_boundary_integrity(coordinates) -> bool:
    """
    Simulates a PostGIS ST_Overlaps or ST_Contains check.
    Returns True if the boundary is clear of spatial disputes (collisions),
    False if it collides with another protected boundary.
    For this mock: coordinates near [7.12, 3.32] represent overlapping registry disputes.
    """
    if not coordinates or len(coordinates) == 0:
        return False
    # Simple check on coordinates to mock boundary collision
    first_pt = coordinates[0][0]
    # If coordinate x value is close to 7.12, flag an overlap dispute
    if abs(first_pt[0] - 7.12) < 0.005:
        return False
    return True

def run_eudr_forest_check(plot_id: str) -> dict:
    """
    Checks the plot's temporal canopy cover change since the Dec 31, 2020 cutoff.
    Returns:
      - complies (bool)
      - canopy_loss_pct (float)
      - baseline_canopy_2020 (float)
      - current_canopy_pct (float)
    """
    if plot_id == "PLOT-ALPHA":
        return {
            "complies": True,
            "canopy_loss_pct": 0.8,
            "baseline_canopy_2020": 42.5,
            "current_canopy_pct": 41.7
        }
    elif plot_id == "PLOT-BETA":
        return {
            "complies": True,
            "canopy_loss_pct": 0.2,
            "baseline_canopy_2020": 30.1,
            "current_canopy_pct": 29.9
        }
    else:  # PLOT-GAMMA
        # Simulate a minor deforestation event
        return {
            "complies": False,
            "canopy_loss_pct": 14.5,
            "baseline_canopy_2020": 78.0,
            "current_canopy_pct": 63.5
        }
