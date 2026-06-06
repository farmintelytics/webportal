#!/usr/bin/env python3
"""
generate_geospatial_data.py
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
Generates ALL simulated geospatial data files for the Farmintelytics backend.
Run once to build the full dataset; routes then read from filesâ€”no inline dicts.

Output layout inside backend/api/data/:
  plots.geojson                  â†’ GeoJSON FeatureCollection of farm plots
  restoration_zones.geojson      â†’ GeoJSON FeatureCollection of resto zones
  lulc.geojson                   â†’ LULC classification polygons
  alerts.json                    â†’ Incident log database
  eudr_compliance.json           â†’ EUDR deforestation records per plot
  remote_sensing.zar/            â†’ Geospatial Zarr â€” NDVI/NDMI timeseries
      .zgroup / .zattrs
      farm_ndvi/  farm_ndmi/     â†’ farm-wide 24-week arrays
      PLOT-ALPHA/ndvi/  ndmi/    â†’ per-plot 24-week arrays
      PLOT-BETA/ndvi/   ndmi/
      PLOT-GAMMA/ndvi/  ndmi/
  sentinel_bands.zar/            â†’ Geospatial Zarr â€” current Sentinel-2 bands
      .zgroup / .zattrs
      PLOT-ALPHA/blue/ red/ nir/ swir1/ swir2/
      PLOT-BETA/  â€¦
      PLOT-GAMMA/ â€¦
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
"""
import os, json, struct, math

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')
os.makedirs(DATA_DIR, exist_ok=True)

# â”€â”€â”€ helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
def write_zarr_array(base_dir, values, dtype="<f4", long_name="", units="1"):
    """Write a Zarr v2 array: .zarray, .zattrs, and chunk file '0'."""
    os.makedirs(base_dir, exist_ok=True)
    n = len(values)
    with open(os.path.join(base_dir, '.zarray'), 'w') as f:
        json.dump({
            "zarr_format": 2,
            "shape": [n],
            "chunks": [n],
            "dtype": dtype,
            "compressor": None,
            "fill_value": 0.0,
            "order": "C",
            "filters": None
        }, f, indent=2)
    with open(os.path.join(base_dir, '.zattrs'), 'w') as f:
        json.dump({"long_name": long_name, "units": units}, f, indent=2)
    with open(os.path.join(base_dir, '0'), 'wb') as f:
        f.write(struct.pack(f"<{n}f", *values))

def read_zarr_array(base_dir):
    """Read a Zarr v2 float32 array from a directory."""
    with open(os.path.join(base_dir, '.zarray')) as f:
        meta = json.load(f)
    n = meta["shape"][0]
    with open(os.path.join(base_dir, '0'), 'rb') as f:
        return list(struct.unpack(f"<{n}f", f.read()))

# â”€â”€â”€ 1. PLOTS.GEOJSON â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
PLOTS_DATA = [
    {
        "plot_id": "PLOT-ALPHA",
        "name": "West Valley Plot",
        "estate": "West Valley Estate",
        "area_ha": 12.5,
        "historical_yield_base": 18.5,
        "sentinel_bands": {
            "blue": 0.05, "red": 0.08, "nir": 0.65, "swir1": 0.20, "swir2": 0.12
        },
        "coordinates": [[
            [3.355, 7.145], [3.355, 7.150], [3.360, 7.150],
            [3.360, 7.145], [3.355, 7.145]
        ]]
    },
    {
        "plot_id": "PLOT-BETA",
        "name": "East Ridge Plot",
        "estate": "West Valley Estate",
        "area_ha": 8.2,
        "historical_yield_base": 14.2,
        "sentinel_bands": {
            "blue": 0.06, "red": 0.14, "nir": 0.40, "swir1": 0.22, "swir2": 0.16
        },
        "coordinates": [[
            [3.362, 7.145], [3.362, 7.150], [3.367, 7.150],
            [3.367, 7.145], [3.362, 7.145]
        ]]
    },
    {
        "plot_id": "PLOT-GAMMA",
        "name": "South Slope Plot",
        "estate": "North Ridge Estate",
        "area_ha": 15.0,
        "historical_yield_base": 16.0,
        "sentinel_bands": {
            "blue": 0.04, "red": 0.07, "nir": 0.68, "swir1": 0.18, "swir2": 0.10
        },
        "coordinates": [[
            [3.355, 7.138], [3.355, 7.143], [3.360, 7.143],
            [3.360, 7.138], [3.355, 7.138]
        ]]
    }
]

plot_features = []
for p in PLOTS_DATA:
    bands = p["sentinel_bands"]
    props = {
        "plot_id":               p["plot_id"],
        "name":                  p["name"],
        "estate":                p["estate"],
        "area_ha":               p["area_ha"],
        "historical_yield_base": p["historical_yield_base"],
        "sentinel_blue":         bands["blue"],
        "sentinel_red":          bands["red"],
        "sentinel_nir":          bands["nir"],
        "sentinel_swir1":        bands["swir1"],
        "sentinel_swir2":        bands["swir2"]
    }
    plot_features.append({
        "type": "Feature",
        "properties": props,
        "geometry": {"type": "Polygon", "coordinates": p["coordinates"]}
    })

with open(os.path.join(DATA_DIR, 'plots.geojson'), 'w') as f:
    json.dump({
        "type": "FeatureCollection",
        "name": "farmintelytics_plots",
        "crs": {"type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84"}},
        "features": plot_features
    }, f, indent=2)
print("âœ“  plots.geojson")

# â”€â”€â”€ 2. RESTORATION_ZONES.GEOJSON â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
ZONES_DATA = [
    {
        "zone_id": "ZONE-ALPHA",
        "name": "Canopy Reforestation",
        "area": "6.4 HA",
        "project_type": "Canopy Density",
        "progress_pct": 88,
        "survival_rate_pct": 94, "survival_display": "94%",
        "tree_count": 1200, "tree_count_display": "1,200",
        "carbon_offset_tco2e": 45.2, "carbon_display": "45.2 tCO2e",
        "biodiversity_score": "92%", "biodiversity_score_num": 92,
        "status": "Optimal Growth",
        "manager": "John Musa",
        "coordinates": [[
            [3.350, 7.141], [3.350, 7.144], [3.354, 7.144],
            [3.354, 7.141], [3.350, 7.141]
        ]]
    },
    {
        "zone_id": "ZONE-BETA",
        "name": "Agroforestry Zone",
        "area": "5.8 HA",
        "project_type": "Species Diversification",
        "progress_pct": 74,
        "survival_rate_pct": 89, "survival_display": "89%",
        "tree_count": 980, "tree_count_display": "980",
        "carbon_offset_tco2e": 32.8, "carbon_display": "32.8 tCO2e",
        "biodiversity_score": "88%", "biodiversity_score_num": 88,
        "status": "Active Care",
        "manager": "Alice Peters",
        "coordinates": [[
            [3.356, 7.141], [3.356, 7.144], [3.361, 7.144],
            [3.361, 7.141], [3.356, 7.141]
        ]]
    },
    {
        "zone_id": "ZONE-GAMMA",
        "name": "Riparian Buffer Zone",
        "area": "8.1 HA",
        "project_type": "Soil Stabilization",
        "progress_pct": 62,
        "survival_rate_pct": 81, "survival_display": "81%",
        "tree_count": 1550, "tree_count_display": "1,550",
        "carbon_offset_tco2e": 21.5, "carbon_display": "21.5 tCO2e",
        "biodiversity_score": "81%", "biodiversity_score_num": 81,
        "status": "Initial Phase",
        "manager": "David Kalu",
        "coordinates": [[
            [3.350, 7.135], [3.350, 7.139], [3.355, 7.139],
            [3.355, 7.135], [3.350, 7.135]
        ]]
    }
]

zone_features = []
for z in ZONES_DATA:
    coords = z.pop("coordinates")
    zone_features.append({
        "type": "Feature",
        "properties": {k: v for k, v in z.items()},
        "geometry": {"type": "Polygon", "coordinates": coords}
    })
    z["coordinates"] = coords  # restore for later use

with open(os.path.join(DATA_DIR, 'restoration_zones.geojson'), 'w') as f:
    json.dump({
        "type": "FeatureCollection",
        "name": "farmintelytics_restoration_zones",
        "crs": {"type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84"}},
        "features": zone_features
    }, f, indent=2)
print("âœ“  restoration_zones.geojson")

# â”€â”€â”€ 3. LULC.GEOJSON â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
# Land-Use / Land-Cover polygons (matches dashboard land_use_classification)
LULC_DATA = [
    {
        "class_id": "LULC-001",
        "segment": "Cash Crop (Oil Palm / Cocoa)",
        "lulc_code": "AGR_CASH",
        "area_ha": 21.4,
        "pct": 60,
        "fill_color": "#16A34A",
        "coordinates": [[
            [3.355, 7.143], [3.355, 7.152], [3.367, 7.152],
            [3.367, 7.143], [3.355, 7.143]
        ]]
    },
    {
        "class_id": "LULC-002",
        "segment": "Restoration Zone (Canopy)",
        "lulc_code": "FOREST_RESTORE",
        "area_ha": 7.1,
        "pct": 20,
        "fill_color": "#15803D",
        "coordinates": [[
            [3.349, 7.140], [3.349, 7.145], [3.354, 7.145],
            [3.354, 7.140], [3.349, 7.140]
        ]]
    },
    {
        "class_id": "LULC-003",
        "segment": "Forest Buffer Zone",
        "lulc_code": "FOREST_BUFFER",
        "area_ha": 5.4,
        "pct": 15,
        "fill_color": "#166534",
        "coordinates": [[
            [3.355, 7.133], [3.355, 7.138], [3.362, 7.138],
            [3.362, 7.133], [3.355, 7.133]
        ]]
    },
    {
        "class_id": "LULC-004",
        "segment": "Infrastructure / Facilities",
        "lulc_code": "BUILT_UP",
        "area_ha": 1.8,
        "pct": 5,
        "fill_color": "#94A3B8",
        "coordinates": [[
            [3.361, 7.140], [3.361, 7.143], [3.365, 7.143],
            [3.365, 7.140], [3.361, 7.140]
        ]]
    }
]

lulc_features = []
for l in LULC_DATA:
    coords = l.pop("coordinates")
    lulc_features.append({
        "type": "Feature",
        "properties": {k: v for k, v in l.items()},
        "geometry": {"type": "Polygon", "coordinates": coords}
    })
    l["coordinates"] = coords

with open(os.path.join(DATA_DIR, 'lulc.geojson'), 'w') as f:
    json.dump({
        "type": "FeatureCollection",
        "name": "farmintelytics_lulc",
        "crs": {"type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84"}},
        "features": lulc_features
    }, f, indent=2)
print("âœ“  lulc.geojson")

# â”€â”€â”€ 4. ALERTS.JSON â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
alerts_data = {
    "description": "Farmintelytics Incident Alert Feed â€” simulated operational telemetry",
    "source": "Sentinel-2 NDVI/LSWI anomaly detection + EUDR compliance engine",
    "alerts": [
        {
            "alert_id": "ALT-001", "plot_id": "PLOT-BETA",
            "type": "Water Stress", "severity": "Critical",
            "message": "LSWI moisture index dropped below 0.30 target in East Ridge Plot. Root-zone dry spell requires immediate +30% irrigation flow.",
            "timestamp": "2026-06-04 14:22:00 GMT",
            "acknowledged": False, "acknowledged_by": None, "acknowledged_at": None
        },
        {
            "alert_id": "ALT-002", "plot_id": "PLOT-BETA",
            "type": "Pest Infestation", "severity": "Critical",
            "message": "Stem borer outbreak warning near East Ridge boundary. Recommended insecticide spray buffer zone of 150m.",
            "timestamp": "2026-06-03 09:45:00 GMT",
            "acknowledged": False, "acknowledged_by": None, "acknowledged_at": None
        },
        {
            "alert_id": "ALT-003", "plot_id": "PLOT-GAMMA",
            "type": "Canopy Loss Anomaly", "severity": "Critical",
            "message": "EUDR compliance threat: 14.5% forest canopy clearing detected relative to 2020 baseline in South Slope Plot.",
            "timestamp": "2026-06-03 14:15:00 GMT",
            "acknowledged": False, "acknowledged_by": None, "acknowledged_at": None
        },
        {
            "alert_id": "ALT-004", "plot_id": "PLOT-GAMMA",
            "type": "Growth Deficit", "severity": "Warning",
            "message": "NDVI vegetation vigor index showing abnormal 3-week plateau during Grand Growth phase in South Slope Plot.",
            "timestamp": "2026-06-02 11:15:00 GMT",
            "acknowledged": False, "acknowledged_by": None, "acknowledged_at": None
        },
        {
            "alert_id": "ALT-005", "plot_id": "PLOT-ALPHA",
            "type": "Pest Risk Warning", "severity": "Warning",
            "message": "Borer pest index flagged as High Risk in West Valley Plot due to high vegetative density and canopy moisture.",
            "timestamp": "2026-06-05 00:05:00 GMT",
            "acknowledged": False, "acknowledged_by": None, "acknowledged_at": None
        },
        {
            "alert_id": "ALT-006", "plot_id": "PLOT-BETA",
            "type": "Water Stress", "severity": "Critical",
            "message": "Evapotranspiration deficit detected in East Ridge Plot. Actual transpiration (ETa) is 45% below demand (ETc).",
            "timestamp": "2026-06-04 10:12:00 GMT",
            "acknowledged": False, "acknowledged_by": None, "acknowledged_at": None
        },
        {
            "alert_id": "ALT-007", "plot_id": "PLOT-ALPHA",
            "type": "Water Stress", "severity": "Warning",
            "message": "WDI thermal-optical crop water stress index exceeds 0.60 warning threshold in West Valley Plot.",
            "timestamp": "2026-06-03 13:50:00 GMT",
            "acknowledged": False, "acknowledged_by": None, "acknowledged_at": None
        },
        {
            "alert_id": "ALT-008", "plot_id": "PLOT-ALPHA",
            "type": "Cloud Cover", "severity": "Info",
            "message": "Sentinel-2 imagery shows 12% localized cloud cover over West Valley Plot. Index computations adjusted.",
            "timestamp": "2026-05-30 16:05:00 GMT",
            "acknowledged": True,
            "acknowledged_by": "admin@farmintelytics.com",
            "acknowledged_at": "2026-05-30 17:00:00 GMT"
        }
    ]
}

with open(os.path.join(DATA_DIR, 'alerts.json'), 'w') as f:
    json.dump(alerts_data, f, indent=2)
print("âœ“  alerts.json")

# â”€â”€â”€ 5. EUDR_COMPLIANCE.JSON â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
eudr_data = {
    "description": "EUDR Deforestation Compliance Records â€” Sentinel-2 canopy change detection",
    "cutoff_date": "2020-12-31",
    "threshold_loss_pct": 5.0,
    "records": {
        "PLOT-ALPHA": {
            "complies": True,
            "canopy_loss_pct": 0.8,
            "baseline_canopy_2020": 42.5,
            "current_canopy_pct": 41.7,
            "last_audited": "2026-06-01"
        },
        "PLOT-BETA": {
            "complies": True,
            "canopy_loss_pct": 0.2,
            "baseline_canopy_2020": 30.1,
            "current_canopy_pct": 29.9,
            "last_audited": "2026-06-01"
        },
        "PLOT-GAMMA": {
            "complies": False,
            "canopy_loss_pct": 14.5,
            "baseline_canopy_2020": 78.0,
            "current_canopy_pct": 63.5,
            "last_audited": "2026-06-01"
        }
    }
}

with open(os.path.join(DATA_DIR, 'eudr_compliance.json'), 'w') as f:
    json.dump(eudr_data, f, indent=2)
print("âœ“  eudr_compliance.json")

# â”€â”€â”€ 6. REMOTE_SENSING.ZAR â€” EXPANDED â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
# Per-plot and farm-wide NDVI + NDMI 24-week timeseries stored as float32 chunks.
# Each plot has its own NDVI/NDMI trajectory based on Sentinel-2 band ratios.
zarr_rs = os.path.join(DATA_DIR, 'remote_sensing.zar')
os.makedirs(zarr_rs, exist_ok=True)

with open(os.path.join(zarr_rs, '.zgroup'), 'w') as f:
    json.dump({"zarr_format": 2}, f, indent=2)

with open(os.path.join(zarr_rs, '.zattrs'), 'w') as f:
    json.dump({
        "description": "Farmintelytics Remote Sensing Timeseries â€” Geospatial Zarr v2",
        "sensor": "Sentinel-2 L2A (ESA Copernicus)",
        "temporal_resolution": "Weekly (ISO weeks, 24-week rolling window)",
        "variables": ["ndvi", "ndmi"],
        "plots": ["PLOT-ALPHA", "PLOT-BETA", "PLOT-GAMMA"],
        "dimensions": ["time"],
        "units": "dimensionless (scaled reflectance ratio)"
    }, f, indent=2)

# Farm-wide timeseries (simple arithmetic mean of 3 plots)
def sinusoidal_ndvi(offset_weeks, base=0.65, amplitude=0.10, phase=0.0):
    """Generate a realistic sinusoidal NDVI trajectory over 24 weeks."""
    return [
        round(base + amplitude * math.sin(2 * math.pi * (w + phase) / 24) +
              0.008 * (24 - (24 - w)), 2)
        for w in range(24)
    ]

# Per-plot NDVI characteristics
PLOT_NDVI = {
    "PLOT-ALPHA": sinusoidal_ndvi(0, base=0.68, amplitude=0.09, phase=2),
    "PLOT-BETA":  sinusoidal_ndvi(0, base=0.44, amplitude=0.07, phase=5),
    "PLOT-GAMMA": sinusoidal_ndvi(0, base=0.62, amplitude=0.08, phase=1),
}

PLOT_NDMI = {
    "PLOT-ALPHA": [round(v * 0.80, 2) for v in PLOT_NDVI["PLOT-ALPHA"]],
    "PLOT-BETA":  [round(v * 0.65, 2) for v in PLOT_NDVI["PLOT-BETA"]],
    "PLOT-GAMMA": [round(v * 0.76, 2) for v in PLOT_NDVI["PLOT-GAMMA"]],
}

# Farm-wide = mean of per-plot values
farm_ndvi = [round(sum(PLOT_NDVI[p][w] for p in PLOT_NDVI) / 3, 2) for w in range(24)]
farm_ndmi = [round(sum(PLOT_NDMI[p][w] for p in PLOT_NDMI) / 3, 2) for w in range(24)]

write_zarr_array(os.path.join(zarr_rs, 'farm_ndvi'), farm_ndvi,
                 long_name="Farm-wide mean NDVI (Sentinel-2 B8/B4)", units="1")
write_zarr_array(os.path.join(zarr_rs, 'farm_ndmi'), farm_ndmi,
                 long_name="Farm-wide mean NDMI (Sentinel-2 B8/B11)", units="1")

for plot_id in ["PLOT-ALPHA", "PLOT-BETA", "PLOT-GAMMA"]:
    key = plot_id.replace("-", "_").lower()
    write_zarr_array(os.path.join(zarr_rs, plot_id, 'ndvi'), PLOT_NDVI[plot_id],
                     long_name=f"{plot_id} weekly NDVI", units="1")
    write_zarr_array(os.path.join(zarr_rs, plot_id, 'ndmi'), PLOT_NDMI[plot_id],
                     long_name=f"{plot_id} weekly NDMI", units="1")
    # Per-plot Zarr group metadata
    with open(os.path.join(zarr_rs, plot_id, '.zgroup'), 'w') as f:
        json.dump({"zarr_format": 2}, f, indent=2)
    with open(os.path.join(zarr_rs, plot_id, '.zattrs'), 'w') as f:
        json.dump({"plot_id": plot_id, "variables": ["ndvi", "ndmi"]}, f, indent=2)

print("âœ“  remote_sensing.zar  (farm-wide + PLOT-ALPHA/BETA/GAMMA NDVI & NDMI)")

# â”€â”€â”€ 7. SENTINEL_BANDS.ZAR â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
# Current-snapshot Sentinel-2 band reflectance values per plot (scalar float32)
zarr_sb = os.path.join(DATA_DIR, 'sentinel_bands.zar')
os.makedirs(zarr_sb, exist_ok=True)

with open(os.path.join(zarr_sb, '.zgroup'), 'w') as f:
    json.dump({"zarr_format": 2}, f, indent=2)

with open(os.path.join(zarr_sb, '.zattrs'), 'w') as f:
    json.dump({
        "description": "Sentinel-2 L2A Band Reflectance Snapshot â€” Geospatial Zarr v2",
        "sensor": "Sentinel-2",
        "processing_level": "L2A Surface Reflectance",
        "bands": {"blue": "B2", "red": "B4", "nir": "B8", "swir1": "B11", "swir2": "B12"},
        "units": "surface reflectance (0â€“1 scaled)"
    }, f, indent=2)

BAND_META = {
    "blue":  {"long_name": "Blue (B2, 490nm)",          "units": "sr"},
    "red":   {"long_name": "Red (B4, 665nm)",            "units": "sr"},
    "nir":   {"long_name": "Near-Infrared (B8, 842nm)",  "units": "sr"},
    "swir1": {"long_name": "SWIR-1 (B11, 1610nm)",       "units": "sr"},
    "swir2": {"long_name": "SWIR-2 (B12, 2190nm)",       "units": "sr"},
}

for p in PLOTS_DATA:
    plot_id = p["plot_id"]
    plot_dir = os.path.join(zarr_sb, plot_id)
    os.makedirs(plot_dir, exist_ok=True)
    with open(os.path.join(plot_dir, '.zgroup'), 'w') as f:
        json.dump({"zarr_format": 2}, f, indent=2)
    with open(os.path.join(plot_dir, '.zattrs'), 'w') as f:
        json.dump({"plot_id": plot_id, "bands": list(BAND_META.keys())}, f, indent=2)

    for band, val in p["sentinel_bands"].items():
        write_zarr_array(
            os.path.join(plot_dir, band),
            [val],                                  # single scalar per snapshot
            long_name=BAND_META[band]["long_name"],
            units=BAND_META[band]["units"]
        )

print("[OK] sentinel_bands.zar  (PLOT-ALPHA/BETA/GAMMA x blue/red/nir/swir1/swir2)")

# â”€â”€ Summary â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
print()
print("All geospatial data files generated successfully.")
print(f"Location: {DATA_DIR}")


