"""
gis.py — Geospatial data loader
──────────────────────────────────────────────────────────────────────────────
Loads all spatial data from the pre-generated geospatial files in api/data/:
  plots.geojson               → MOCK_PLOTS dict (keyed by plot_id)
  restoration_zones.geojson   → MOCK_RESTORATION_ZONES dict (keyed by zone_id)
  lulc.geojson                → LULC_FEATURES list
  eudr_compliance.json        → EUDR_RECORDS dict
  sentinel_bands.zar/         → band reflectance values read via Zarr helpers
  remote_sensing.zar/         → NDVI/NDMI timeseries read via Zarr helpers

All downstream route handlers import from here — no inline hardcoded dicts.
──────────────────────────────────────────────────────────────────────────────
"""
import os, json, struct

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')


# ─── Zarr helpers ──────────────────────────────────────────────────────────────
def _zarr_read(array_dir: str) -> list:
    """Read a float32 Zarr array from a directory (no external zarr library needed)."""
    with open(os.path.join(array_dir, '.zarray')) as f:
        meta = json.load(f)
    n = meta['shape'][0]
    with open(os.path.join(array_dir, '0'), 'rb') as f:
        return [round(v, 4) for v in struct.unpack(f'<{n}f', f.read())]


# ─── Load plots.geojson ────────────────────────────────────────────────────────
def _load_plots() -> dict:
    with open(os.path.join(DATA_DIR, 'plots.geojson')) as f:
        fc = json.load(f)
    plots = {}
    for feat in fc['features']:
        p   = feat['properties']
        pid = p['plot_id']
        # Reconstruct sentinel_bands from flat GeoJSON properties
        plots[pid] = {
            'plot_id':               pid,
            'name':                  p['name'],
            'estate':                p['estate'],
            'area_ha':               p['area_ha'],
            'historical_yield_base': p['historical_yield_base'],
            'boundary':              feat['geometry'],
            'sentinel_bands': {
                'blue':  p['sentinel_blue'],
                'red':   p['sentinel_red'],
                'nir':   p['sentinel_nir'],
                'swir1': p['sentinel_swir1'],
                'swir2': p['sentinel_swir2'],
            }
        }
    return plots


# ─── Load restoration_zones.geojson ───────────────────────────────────────────
def _load_zones() -> dict:
    with open(os.path.join(DATA_DIR, 'restoration_zones.geojson')) as f:
        fc = json.load(f)
    zones = {}
    for feat in fc['features']:
        p  = feat['properties']
        zid = p['zone_id']
        zones[zid] = {**p, 'boundary': feat['geometry']}
    return zones


# ─── Load lulc.geojson ────────────────────────────────────────────────────────
def _load_lulc() -> list:
    with open(os.path.join(DATA_DIR, 'lulc.geojson')) as f:
        fc = json.load(f)
    return [
        {**feat['properties'], 'geometry': feat['geometry']}
        for feat in fc['features']
    ]


# ─── Load eudr_compliance.json ────────────────────────────────────────────────
def _load_eudr() -> dict:
    with open(os.path.join(DATA_DIR, 'eudr_compliance.json')) as f:
        return json.load(f)


# ─── Public module-level caches (loaded once at import time) ──────────────────
MOCK_PLOTS              = _load_plots()
MOCK_RESTORATION_ZONES  = _load_zones()
LULC_FEATURES           = _load_lulc()
EUDR_DATA               = _load_eudr()


# ─── Zarr-backed Sentinel-2 band lookup ───────────────────────────────────────
def get_sentinel_bands_from_zarr(plot_id: str) -> dict:
    """
    Read the current-snapshot Sentinel-2 band reflectance for a plot
    from sentinel_bands.zar/<plot_id>/<band>/0.
    Returns a dict matching the legacy sentinel_bands schema.
    """
    zarr_dir = os.path.join(DATA_DIR, 'sentinel_bands.zar', plot_id)
    return {
        band: _zarr_read(os.path.join(zarr_dir, band))[0]
        for band in ('blue', 'red', 'nir', 'swir1', 'swir2')
    }


# ─── Zarr-backed NDVI/NDMI timeseries lookup ──────────────────────────────────
def get_ndvi_timeseries(plot_id: str = None) -> list:
    """
    Return 24-week NDVI float list.
    If plot_id is None returns farm-wide average; else returns per-plot series.
    """
    if plot_id and plot_id in MOCK_PLOTS:
        return _zarr_read(os.path.join(DATA_DIR, 'remote_sensing.zar', plot_id, 'ndvi'))
    return _zarr_read(os.path.join(DATA_DIR, 'remote_sensing.zar', 'farm_ndvi'))


def get_ndmi_timeseries(plot_id: str = None) -> list:
    """
    Return 24-week NDMI float list.
    If plot_id is None returns farm-wide average; else returns per-plot series.
    """
    if plot_id and plot_id in MOCK_PLOTS:
        return _zarr_read(os.path.join(DATA_DIR, 'remote_sensing.zar', plot_id, 'ndmi'))
    return _zarr_read(os.path.join(DATA_DIR, 'remote_sensing.zar', 'farm_ndmi'))


# ─── EUDR forest-check helper ─────────────────────────────────────────────────
def run_eudr_forest_check(plot_id: str) -> dict:
    """
    Returns EUDR compliance record for a plot, loaded from eudr_compliance.json.
    Falls back to a non-compliant result for unknown plot IDs.
    """
    records = EUDR_DATA.get('records', {})
    rec = records.get(plot_id)
    if rec:
        return {
            'complies':             rec['complies'],
            'canopy_loss_pct':      rec['canopy_loss_pct'],
            'baseline_canopy_2020': rec['baseline_canopy_2020'],
            'current_canopy_pct':   rec['current_canopy_pct'],
        }
    return {
        'complies': False,
        'canopy_loss_pct': 100.0,
        'baseline_canopy_2020': 0.0,
        'current_canopy_pct': 0.0,
    }


# ─── Boundary integrity check (PostGIS ST_Overlaps simulation) ────────────────
def verify_boundary_integrity(coordinates) -> bool:
    """
    Simulates a PostGIS ST_Overlaps / ST_Contains check.
    Returns False for coordinates near the disputed zone at lng≈7.12.
    """
    if not coordinates or len(coordinates) == 0:
        return False
    first_pt = coordinates[0][0]
    if abs(first_pt[0] - 7.12) < 0.005:
        return False
    return True
