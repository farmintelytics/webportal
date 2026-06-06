"""
Quick smoke-test for all backend endpoints.
Run with: python test_endpoints.py
"""
import os, sys, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
sys.path.insert(0, '.')
django.setup()

from api.routes.intelligence import get_plots_intelligence
from api.routes.health import get_plots_health
from api.routes.yield_forecast import get_plots_yield_forecast
from api.routes.telemetry import get_plots_telemetry
from api.routes.restoration import get_restoration_zones
from api.routes.alerts import get_alerts
from api.routes.dashboard import get_dashboard_stats, get_dashboard_trends
from api.routes.verification import run_mrv_audit
from api.routes.reports import list_precompiled_reports

class MockRequest: pass
req = MockRequest()

PASS = 0
FAIL = 0

def check(name, condition, detail=""):
    global PASS, FAIL
    if condition:
        print(f"  [PASS] {name}")
        PASS += 1
    else:
        print(f"  [FAIL] {name}: {detail}")
        FAIL += 1

print("\n=== Farmintelytics Backend Endpoint Tests ===\n")

# ── Intelligence Layers ───────────────────────────────────────────────────────
print("GET /api/plots/intelligence/")
intel = get_plots_intelligence(req)
check("Returns 3 plots", len(intel) == 3)
check("Has area_ha field", all(hasattr(p, 'area_ha') for p in intel))
check("Has name field", all(hasattr(p, 'name') for p in intel))
check("Has boundary", all(hasattr(p, 'boundary') for p in intel))
check("NDVI is float", all(isinstance(p.indices.ndvi, float) for p in intel))
check("NDMI is float", all(isinstance(p.indices.ndmi, float) for p in intel))
check("Coords are 3D not 4D", isinstance(intel[0].boundary['coordinates'][0][0], list))
check("Coord inner values are floats", isinstance(intel[0].boundary['coordinates'][0][0][0], float))

# ── Crop Health ───────────────────────────────────────────────────────────────
print("\nGET /api/plots/health/")
health = get_plots_health(req)
check("Returns 3 plots", len(health) == 3)
check("Has name field", all(hasattr(p, 'name') for p in health))
check("Has area_ha field", all(hasattr(p, 'area_ha') for p in health))
check("pest_risk is string", all(isinstance(p.indices.pest_risk, str) for p in health))
check("water_stress is float", all(isinstance(p.indices.water_stress, float) for p in health))
# Test filtering
health_alpha = get_plots_health(req, plot_id="PLOT-ALPHA")
check("Filter by plot_id works", len(health_alpha) == 1 and health_alpha[0].plot_id == "PLOT-ALPHA")
health_bad = get_plots_health(req, plot_id="PLOT-NONEXISTENT")
check("Invalid plot_id returns []", health_bad == [])

# ── Crop Yield Forecast ───────────────────────────────────────────────────────
print("\nGET /api/plots/yield/forecast/")
yields = get_plots_yield_forecast(req)
check("Returns 3 plots", len(yields) == 3)
check("Has name field", all(hasattr(p, 'name') for p in yields))
check("Has area_ha field", all(hasattr(p, 'area_ha') for p in yields))
check("yield_rate_ton_ha is float", all(isinstance(p.yield_rate_ton_ha, float) for p in yields))
check("harvest_readiness_pct is int", all(isinstance(p.harvest_readiness_pct, int) for p in yields))

# ── Telemetry ─────────────────────────────────────────────────────────────────
print("\nGET /api/plots/telemetry/")
telem = get_plots_telemetry(req)
check("Returns 3 plots", len(telem) == 3)
check("Has name field", all(hasattr(p, 'name') for p in telem))
check("Has area_ha field", all(hasattr(p, 'area_ha') for p in telem))
check("vpd_kpa is float", all(isinstance(p.vpd_kpa, float) for p in telem))
check("rainfall_mm is float", all(isinstance(p.rainfall_mm, float) for p in telem))

# ── Restoration Zones ─────────────────────────────────────────────────────────
print("\nGET /api/restoration/zones/")
zones = get_restoration_zones(req)
check("Returns 3 zones", len(zones) == 3)
check("Has area field", all(hasattr(z, 'area') for z in zones))
check("Has survival_display", all(hasattr(z, 'survival_display') for z in zones))
check("Has tree_count_display", all(hasattr(z, 'tree_count_display') for z in zones))
check("Has carbon_display", all(hasattr(z, 'carbon_display') for z in zones))
check("Has biodiversity_score_num", all(hasattr(z, 'biodiversity_score_num') for z in zones))
check("Has status", all(hasattr(z, 'status') for z in zones))
names = [z.name for z in zones]
check("Zone names match frontend", "Canopy Reforestation" in names and "Riparian Buffer Zone" in names)

# ── Alerts ────────────────────────────────────────────────────────────────────
print("\nGET /api/alerts/")
alerts_resp = get_alerts(req)
check("Returns >= 8 alerts", alerts_resp.stats.total >= 8)
check("Critical count > 0", alerts_resp.stats.critical > 0)
check("Warnings count > 0", alerts_resp.stats.warnings > 0)
check("Feed matches stats", len(alerts_resp.feed) == alerts_resp.stats.total)

# ── Dashboard ─────────────────────────────────────────────────────────────────
print("\nGET /api/dashboard/stats")
stats = get_dashboard_stats(req)
check("Has total_area_ha", 'total_area_ha' in stats)
check("Has active_imagery_source", 'active_imagery_source' in stats)
check("Has average_carbon_density_tco2e_ha", 'average_carbon_density_tco2e_ha' in stats)
check("Has active_alerts_count", 'active_alerts_count' in stats)
check("Has audit_status", 'audit_status' in stats)

print("\nGET /api/dashboard/trends")
trends = get_dashboard_trends(req)
check("Has ndvi_vigor_trends", 'ndvi_vigor_trends' in trends)
check("Has 24 NDVI data points", len(trends['ndvi_vigor_trends']) == 24)
check("NDVI labels have real weeks (W format)", trends['ndvi_vigor_trends'][0]['label'].startswith('W'))
check("Has moisture_comparison", 'moisture_comparison' in trends)
check("moisture_comparison has 3 plots", len(trends['moisture_comparison']) == 3)
check("Has nutrient_profile", 'nutrient_profile' in trends)
check("Has land_use_classification", 'land_use_classification' in trends)

# ── Verification ──────────────────────────────────────────────────────────────
print("\nGET /api/verification/audit")
audit = run_mrv_audit(req, plot_id="PLOT-ALPHA")
check("Returns 4 checks", len(audit.checks) == 4)
check("Has timestamp", bool(audit.timestamp))
check("Has logs", len(audit.logs) > 0)
check("Check statuses are valid", all(c.status in ("Pass", "Failed", "Warning") for c in audit.checks))
audit_bad = run_mrv_audit(req, plot_id="PLOT-INVALID")
check("Invalid plot returns failed", not audit_bad.overall_compliance)

audit_gamma = run_mrv_audit(req, plot_id="PLOT-GAMMA")
eudr_check = next((c for c in audit_gamma.checks if "EUDR" in c.name), None)
check("PLOT-GAMMA EUDR fails (14.5% loss)", eudr_check is not None and eudr_check.status == "Failed")

# ── Reports ───────────────────────────────────────────────────────────────────
print("\nGET /api/reports/list")
reports = list_precompiled_reports(req)
check("Returns 5 reports", len(reports) == 5)
check("All have report_id", all(bool(r.report_id) for r in reports))
check("All have download_url", all(bool(r.download_url) for r in reports))

# ── Summary ───────────────────────────────────────────────────────────────────
print(f"\n{'='*50}")
print(f"Results: {PASS} PASSED, {FAIL} FAILED")
if FAIL == 0:
    print("All tests passed!")
else:
    print(f"WARNING: {FAIL} test(s) failed.")
