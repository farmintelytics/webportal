# Mock GIS Utility simulating PostGIS and remote sensing ingest pipelines.

MOCK_PLOTS = {
    "PLOT-ALPHA": {
        "plot_id": "PLOT-ALPHA",
        "name": "West Valley Plot",
        "estate": "West Valley Estate",
        "area_ha": 12.5,
        "historical_yield_base": 18.5,
        "boundary": {
            "type": "Polygon",
            "coordinates": [[[7.145, 3.355], [7.150, 3.355], [7.150, 3.360], [7.145, 3.360], [7.145, 3.355]]]
        },
        "sentinel_bands": {"blue": 0.05, "red": 0.08, "nir": 0.65, "swir1": 0.20, "swir2": 0.12}
    },
    "PLOT-BETA": {
        "plot_id": "PLOT-BETA",
        "name": "East Valley Plot",
        "estate": "West Valley Estate",
        "area_ha": 8.2,
        "historical_yield_base": 14.2,
        "boundary": {
            "type": "Polygon",
            "coordinates": [[[7.150, 3.350], [7.155, 3.350], [7.155, 3.355], [7.150, 3.355], [7.150, 3.350]]]
        },
        "sentinel_bands": {"blue": 0.06, "red": 0.14, "nir": 0.40, "swir1": 0.22, "swir2": 0.16}
    },
    "PLOT-GAMMA": {
        "plot_id": "PLOT-GAMMA",
        "name": "North Ridge Plot",
        "estate": "North Ridge Estate",
        "area_ha": 15.0,
        "historical_yield_base": 16.0,
        "boundary": {
            "type": "Polygon",
            "coordinates": [[[7.140, 3.360], [7.145, 3.360], [7.145, 3.365], [7.140, 3.365], [7.140, 3.360]]]
        },
        "sentinel_bands": {"blue": 0.04, "red": 0.07, "nir": 0.68, "swir1": 0.18, "swir2": 0.10}
    }
}

MOCK_RESTORATION_ZONES = {
    "ZONE-ALPHA": {
        "zone_id": "ZONE-ALPHA",
        "name": "Canopy Reforestation",
        "project_type": "Canopy Density",
        "progress_pct": 88,
        "survival_rate_pct": 94,
        "tree_count": 1200,
        "carbon_offset_tco2e": 45.2,
        "biodiversity_score": "92%",
        "manager": "John Musa",
        "boundary": {
            "type": "Polygon",
            "coordinates": [[[7.135, 3.365], [7.140, 3.365], [7.140, 3.370], [7.135, 3.370], [7.135, 3.365]]]
        }
    },
    "ZONE-BETA": {
        "zone_id": "ZONE-BETA",
        "name": "Native Species Agroforestry",
        "project_type": "Species Diversification",
        "progress_pct": 72,
        "survival_rate_pct": 86,
        "tree_count": 850,
        "carbon_offset_tco2e": 31.8,
        "biodiversity_score": "88%",
        "manager": "Sarah Adams",
        "boundary": {
            "type": "Polygon",
            "coordinates": [[[7.145, 3.345], [7.150, 3.345], [7.150, 3.350], [7.145, 3.350], [7.145, 3.345]]]
        }
    },
    "ZONE-GAMMA": {
        "zone_id": "ZONE-GAMMA",
        "name": "Riparian Buffer Zone",
        "project_type": "Riparian Buffer",
        "progress_pct": 95,
        "survival_rate_pct": 98,
        "tree_count": 2100,
        "carbon_offset_tco2e": 68.4,
        "biodiversity_score": "96%",
        "manager": "John Musa",
        "boundary": {
            "type": "Polygon",
            "coordinates": [[[7.155, 3.340], [7.160, 3.340], [7.160, 3.345], [7.155, 3.345], [7.155, 3.340]]]
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
