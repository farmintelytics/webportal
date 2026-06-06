import time
from ninja import Router
from typing import Optional
from ..utils.gis import MOCK_PLOTS, verify_boundary_integrity, run_eudr_forest_check
from ..utils.calculations import calculate_ndvi, calculate_ndmi
from ..schemas.verification import AuditResponse, VerificationItem

router = Router(tags=["MRV Verification Portal"])


@router.get("/audit", response=AuditResponse)
def run_mrv_audit(request, plot_id: Optional[str] = "PLOT-ALPHA"):
    """
    Evaluates regulatory and voluntary carbon standard checklists for a selected plot.
    Runs 4 verification checks:
      1. Boundary Integrity Check (PostGIS overlap check)
      2. Deforestation Compliance Check (EUDR Dec-2020 cutoff)
      3. Canopy Density Standard (NDVI >= 0.45 threshold)
      4. Soil Water Index Target (NDMI >= 0.35 threshold)

    Frontend field mapping:
      overall_compliance → compliance status banner
      checks[]           → each verification step card
      logs[]             → audit log textarea
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
                    details=f"Plot ID '{plot_id}' not found in the PostGIS registry.",
                    description="Validates that the requested plot exists in the spatial boundary database."
                )
            ],
            logs=[f"[ERROR] Invalid plot_id '{plot_id}' requested.", "[ERROR] Audit aborted."]
        )

    bands  = plot["sentinel_bands"]
    ndvi   = calculate_ndvi(bands["nir"], bands["red"])
    ndmi   = calculate_ndmi(bands["nir"], bands["swir1"])
    checks = []
    logs   = []
    ts     = time.strftime("%Y-%m-%d %H:%M:%S GMT")

    # ── Check 1: Boundary Integrity ────────────────────────────────────────
    coords          = plot["boundary"]["coordinates"]
    boundary_ok     = verify_boundary_integrity(coords)
    boundary_status = "Pass" if boundary_ok else "Failed"
    checks.append(VerificationItem(
        name="Boundary Integrity Check",
        status=boundary_status,
        details=(
            f"Plot boundary verified against cadastral registry. "
            f"{'No spatial overlap disputes detected.' if boundary_ok else 'Boundary collision detected with protected zone.'}"
        ),
        description="Validates polygon shape match with official cadastral (land registry) coordinates using PostGIS ST_Overlaps."
    ))
    logs.append(f"[{boundary_status.upper()}] Boundary integrity check completed at {ts}.")

    # ── Check 2: EUDR Deforestation Compliance ─────────────────────────────
    eudr           = run_eudr_forest_check(plot_id)
    eudr_status    = "Pass" if eudr["complies"] else "Failed"
    checks.append(VerificationItem(
        name="Deforestation Compliance Check (EUDR)",
        status=eudr_status,
        details=(
            f"Baseline canopy cover 2020: {eudr['baseline_canopy_2020']}%. "
            f"Current canopy cover: {eudr['current_canopy_pct']}%. "
            f"Canopy loss since cutoff: {eudr['canopy_loss_pct']}%. "
            f"{'Compliant with EUDR Dec-2020 cutoff.' if eudr['complies'] else 'NON-COMPLIANT: Significant canopy loss detected post-2020.'}"
        ),
        description="Scans for forest canopy loss anomalies since the EU Deforestation Regulation cutoff date of December 31, 2020."
    ))
    logs.append(
        f"[{'PASS' if eudr['complies'] else 'FAIL'}] EUDR deforestation compliance check completed. "
        f"Canopy loss: {eudr['canopy_loss_pct']}%."
    )

    # ── Check 3: Canopy Density Standard ───────────────────────────────────
    ndvi_threshold  = 0.45
    ndvi_ok         = ndvi >= ndvi_threshold
    ndvi_status     = "Pass" if ndvi_ok else "Warning"
    checks.append(VerificationItem(
        name="Canopy Density Standard (NDVI)",
        status=ndvi_status,
        details=(
            f"Measured NDVI: {round(ndvi, 3)}. "
            f"Required threshold: ≥ {ndvi_threshold}. "
            f"{'Photosynthetic canopy coverage meets standard.' if ndvi_ok else 'Canopy density below acceptable threshold — possible crop stress.'}"
        ),
        description="Measures active photosynthetic activity coverage using Sentinel-2 NDVI (NIR−Red)/(NIR+Red)."
    ))
    logs.append(f"[{'PASS' if ndvi_ok else 'WARN'}] Canopy density NDVI check: {round(ndvi, 3)} vs threshold {ndvi_threshold}.")

    # ── Check 4: Soil Water Index Target ───────────────────────────────────
    ndmi_threshold  = 0.35
    ndmi_ok         = ndmi >= ndmi_threshold
    ndmi_status     = "Pass" if ndmi_ok else "Warning"
    checks.append(VerificationItem(
        name="Soil Water Index Target (NDMI)",
        status=ndmi_status,
        details=(
            f"Measured NDMI: {round(ndmi, 3)}. "
            f"Required threshold: ≥ {ndmi_threshold}. "
            f"{'Root-zone moisture within acceptable range.' if ndmi_ok else 'Soil moisture below target — irrigation deficit likely.'}"
        ),
        description="Assesses root-zone moisture anomalies using Sentinel-2 NDMI (NIR−SWIR)/(NIR+SWIR)."
    ))
    logs.append(f"[{'PASS' if ndmi_ok else 'WARN'}] Soil water NDMI check: {round(ndmi, 3)} vs threshold {ndmi_threshold}.")
    logs.append(f"[INFO] Full MRV audit for {plot_id} ({plot['name']}) completed at {ts}.")

    # Overall compliance: all checks must pass or warn (no failures)
    overall = all(c.status in ("Pass", "Warning") for c in checks)

    return AuditResponse(
        timestamp=ts,
        overall_compliance=overall,
        checks=checks,
        logs=logs
    )
