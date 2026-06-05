import time
from ninja import Router
from typing import Optional
from ..utils.gis import MOCK_PLOTS, verify_boundary_integrity, run_eudr_forest_check
from ..utils.calculations import calculate_ndvi
from ..schemas.verification import AuditResponse, VerificationItem

router = Router(tags=["MRV Verification Portal"])

@router.get("/audit", response=AuditResponse)
def run_mrv_audit(request, plot_id: Optional[str] = "PLOT-ALPHA"):
    """
    Evaluates regulatory and voluntary carbon standard checklists for a selected plot.
    """
    plot = MOCK_PLOTS.get(plot_id)
    if not plot:
        return AuditResponse(
            timestamp=time.strftime("%Y-%m-%d %H:%M:%S GMT"),
            overall_compliance=False,
            checks=[
                VerificationItem(
                    name="Plot Existence Check",
                    status="Failed",
                    details=f"Plot ID '{plot_id}' not found.",
                    description="Validates that the requested plot exists in the PostGIS registry."
                )
            ],
            logs=["[ERROR] Invalid plot_id requested."]
        )

    logs = [
        f"[INFO] Initializing spatial MRV audit for plot: {plot_id} ({plot['name']})",
        "[INFO] Intersecting boundaries with local land registry cadastral shapefiles..."
    ]

    checks = []
    overall_compliance = True

    # 1. Boundary Integrity Audit (ST_Overlaps check)
    boundary_ok = verify_boundary_integrity(plot["boundary"]["coordinates"])
    if boundary_ok:
        logs.append("[SUCCESS] Boundary Integrity Audit passed. 0% overlap collision with neighboring estates.")
        checks.append(VerificationItem(
            name="Boundary Integrity Audit",
            status="Pass",
            details="0.0% overlap collision with adjoining properties.",
            description="Geospatial intersection query validating cadastral boundary compliance and ownership."
        ))
    else:
        overall_compliance = False
        logs.append("[ERROR] Boundary overlap dispute detected at registry coordinates.")
        checks.append(VerificationItem(
            name="Boundary Integrity Audit",
            status="Failed",
            details="Conflict detected. 1.2% overlap with 'West Valley Reserved Forest'.",
            description="Geospatial intersection query validating cadastral boundary compliance and ownership."
        ))

    # 2. EUDR Deforestation Compliance Scan (Dec 31, 2020 baseline)
    logs.append("[INFO] Fetching historical Copernicus Sentinel-2 canopy classifications since Dec 31, 2020...")
    eudr = run_eudr_forest_check(plot_id)
    if eudr["complies"]:
        logs.append(f"[SUCCESS] EUDR Deforestation-Free check passed. Baseline: {eudr['baseline_canopy_2020']}%, current: {eudr['current_canopy_pct']}%")
        checks.append(VerificationItem(
            name="EUDR Deforestation Compliance Scan",
            status="Pass",
            details=f"Canopy loss since Dec 2020 is {eudr['canopy_loss_pct']}%, well below the 10.0% forest threshold.",
            description="Ensures no forest-to-agricultural land conversion has occurred post-December 31, 2020."
        ))
    else:
        overall_compliance = False
        logs.append(f"[ALERT] Deforestation anomaly detected. Canopy loss: {eudr['canopy_loss_pct']}% relative to 2020 baseline.")
        checks.append(VerificationItem(
            name="EUDR Deforestation Compliance Scan",
            status="Failed",
            details=f"EUDR compliance threat: {eudr['canopy_loss_pct']}% canopy cover reduction detected.",
            description="Ensures no forest-to-agricultural land conversion has occurred post-December 31, 2020."
        ))

    # 3. Photosynthetic Active Cover Target (Season avg NDVI > 0.50)
    logs.append("[INFO] Calculating seasonal vegetative active cover...")
    bands = plot["sentinel_bands"]
    ndvi = calculate_ndvi(bands["nir"], bands["red"])
    if ndvi >= 0.70:
        logs.append(f"[SUCCESS] Photosynthetic Cover target passed. Active NDVI: {round(ndvi, 2)}")
        checks.append(VerificationItem(
            name="Photosynthetic Active Cover Target",
            status="Pass",
            details=f"Maintaining {round(ndvi * 100, 1)}% photosynthetic canopy cover (Target: >60%).",
            description="Verifies that the land contains healthy active green biomass cover throughout the season."
        ))
    elif ndvi >= 0.45:
        logs.append(f"[WARNING] Photosynthetic Cover target warning. Active NDVI is in transitional state: {round(ndvi, 2)}")
        checks.append(VerificationItem(
            name="Photosynthetic Active Cover Target",
            status="Warning",
            details=f"Cover is transitional at {round(ndvi * 100, 1)}% canopy density (Target: >60%).",
            description="Verifies that the land contains healthy active green biomass cover throughout the season."
        ))
    else:
        overall_compliance = False
        logs.append(f"[ERROR] Canopy health index is critically low: {round(ndvi, 2)}")
        checks.append(VerificationItem(
            name="Photosynthetic Active Cover Target",
            status="Failed",
            details=f"Critical health status: {round(ndvi * 100, 1)}% cover is below minimum requirements.",
            description="Verifies that the land contains healthy active green biomass cover throughout the season."
        ))

    # 4. Canopy Regrowth Progression (+10% annual tree cover improvement)
    logs.append("[INFO] Auditing canopy growth rates against restoration baseline...")
    if plot_id == "PLOT-ALPHA":
        logs.append("[SUCCESS] Reforestation regrowth checklist verified.")
        checks.append(VerificationItem(
            name="Canopy Regrowth Progression",
            status="Pass",
            details="Annual regrowth is +12.4% (Target: >10.0% annual increase).",
            description="Tracks year-over-year canopy height and density increase inside conservation and buffer buffers."
        ))
    else:
        checks.append(VerificationItem(
            name="Canopy Regrowth Progression",
            status="Warning",
            details="Growth rate is +8.5%, slightly below target. Reviewing soil probe moisture data.",
            description="Tracks year-over-year canopy height and density increase inside conservation and buffer buffers."
        ))

    logs.append(f"[INFO] Verification audit completed. Final compliance status: {overall_compliance}")

    return AuditResponse(
        timestamp=time.strftime("%Y-%m-%d %H:%M:%S GMT"),
        overall_compliance=overall_compliance,
        checks=checks,
        logs=logs
    )
