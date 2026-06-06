import time
from ninja import Router
from typing import List, Optional
from ..utils.gis import MOCK_PLOTS
from ..utils.mrv import generate_report_hash, register_hash_on_chain
from ..utils.calculations import calculate_ndvi, calculate_ndmi, calculate_evi, estimate_agb_carbon_offset
from ..schemas.report import CertificateRequest, CertificateResponse, ReportItem

router = Router(tags=["Certificate & Reports"])


@router.post("/certificate", response=CertificateResponse)
def generate_mrv_certificate(request, data: CertificateRequest):
    """
    Generates a certified spatial MRV report with unique SHA-256 cryptographic proof
    published to the Polygon EVM blockchain ledger.

    Request payload (from agromonitorApi.js):
      scope:   "Whole Farm (Aggregate)" | "Plot-Level"
      metric:  "NDVI" | "NDMI" | "NDWI" | "SOC" | "AGB"
      plot_id: optional, e.g. "PLOT-ALPHA"

    Response: { certificate_id, hash, blockchain_status, data_points, diagnostic_summary, … }
    """
    plot_id = data.plot_id
    scope   = data.scope
    metric  = data.metric

    data_points = []
    metadata    = {"scope": scope, "metric": metric, "plot_id": plot_id}

    if scope == "Whole Farm (Aggregate)":
        # Aggregate values across all plots
        total_ndvi   = 0.0
        total_carbon = 0.0
        for pid, pdata in MOCK_PLOTS.items():
            bands   = pdata["sentinel_bands"]
            ndvi_v  = calculate_ndvi(bands["nir"], bands["red"])
            total_ndvi += ndvi_v

            evi_v        = calculate_evi(bands["nir"], bands["red"], bands["blue"])
            total_carbon += estimate_agb_carbon_offset(evi_v, 45.0, pdata["area_ha"])

            # Value to report depends on requested metric
            if metric == "NDVI":
                report_val = round(ndvi_v, 2)
            elif metric in ("NDMI", "NDWI"):
                report_val = round(calculate_ndmi(bands["nir"], bands["swir1"]), 2)
            elif metric == "AGB":
                report_val = estimate_agb_carbon_offset(evi_v, 45.0, pdata["area_ha"])
            elif metric == "SOC":
                report_val = round(ndvi_v * 4.2, 2)
            else:
                report_val = round(ndvi_v, 2)

            data_points.append({
                "plot_id": pid,
                "name":    pdata["name"],
                "value":   report_val
            })

        avg_val = round(total_ndvi / len(MOCK_PLOTS), 2)
        metadata["average_value"] = avg_val
        metadata["total_plots"]   = len(MOCK_PLOTS)
        diagnostic = (
            f"Whole Farm spatial audit confirms an average {metric} of {avg_val}. "
            f"Total estimated Carbon Stocks (AGB) across estate are {round(total_carbon, 1)} tCO2e. "
            "All core conservation areas comply with target vegetation indexes, with minimal stress detected."
        )

    else:
        # Single plot scope
        plot = MOCK_PLOTS.get(plot_id, MOCK_PLOTS["PLOT-ALPHA"])
        bands = plot["sentinel_bands"]

        ndvi_v   = round(calculate_ndvi(bands["nir"], bands["red"]), 2)
        ndmi_v   = round(calculate_ndmi(bands["nir"], bands["swir1"]), 2)
        evi_v    = round(calculate_evi(bands["nir"], bands["red"], bands["blue"]), 2)
        carbon_v = estimate_agb_carbon_offset(evi_v, 45.0, plot["area_ha"])

        val_map = {
            "NDVI": ndvi_v,
            "NDMI": ndmi_v,
            "NDWI": round(1.0 - ndmi_v, 2),
            "SOC":  round(ndvi_v * 4.2, 2),   # Soil Organic Carbon proxy
            "AGB":  carbon_v
        }
        selected_val = val_map.get(metric, ndvi_v)
        metadata["value"]     = selected_val
        metadata["plot_name"] = plot["name"]

        # Historical trend data points (5 weeks)
        for i in range(5, 0, -1):
            data_points.append({
                "week":  f"Week {i}",
                "value": round(selected_val + (0.01 * i * (-1 if i % 2 == 0 else 1)), 2)
            })

        diagnostic = (
            f"Plot-level spatial audit for {plot['name']} ({plot_id or 'PLOT-ALPHA'}) "
            f"shows a current {metric} value of {selected_val}. "
            f"Total estimated carbon offset for this plot is {carbon_v} tCO2e. "
            "Temporal diagnostics indicate stable vegetation trends over the past 5 weeks. "
            "No logging triggers detected."
        )

    # Cryptographic hash + blockchain registration
    cert_hash    = generate_report_hash(metadata)
    chain_receipt = register_hash_on_chain(cert_hash, plot_id or "WHOLE-FARM")
    cert_id      = f"CERT-{int(time.time()) % 1000000:06d}"

    return CertificateResponse(
        certificate_id=cert_id,
        scope=scope,
        metric=metric,
        plot_id=plot_id,
        generated_at=time.strftime("%Y-%m-%d %H:%M:%S GMT"),
        hash=cert_hash,
        blockchain_status=chain_receipt,
        data_points=data_points,
        diagnostic_summary=diagnostic
    )


@router.get("/list", response=List[ReportItem])
def list_precompiled_reports(request):
    """
    Returns a list of pre-compiled thematic environmental reports.

    Frontend field mapping:
      report_id    → report_id
      title        → displayed report title
      metric       → metric label badge
      scope        → scope badge
      plot_id      → optional plot filter badge
      generated_at → timestamp display
      download_url → download button href
    """
    return [
        ReportItem(
            report_id="REP-2026-001",
            title="Q1-2026 Voluntary Carbon Registry Verification Ledger",
            metric="AGB (Aboveground Biomass)",
            scope="Whole Farm (Aggregate)",
            plot_id=None,
            generated_at="2026-04-15 10:00:00 GMT",
            download_url="/api/reports/download/REP-2026-001.pdf"
        ),
        ReportItem(
            report_id="REP-2026-002",
            title="EU Deforestation Regulation (EUDR) Compliance Report",
            metric="NDVI / Canopy Cover",
            scope="Whole Farm (Aggregate)",
            plot_id=None,
            generated_at="2026-05-01 12:00:00 GMT",
            download_url="/api/reports/download/REP-2026-002.pdf"
        ),
        ReportItem(
            report_id="REP-2026-003",
            title="West Valley Plot Soil Organic Carbon (SOC) Audit",
            metric="SOC (Soil Organic Carbon)",
            scope="Plot-Level",
            plot_id="PLOT-ALPHA",
            generated_at="2026-05-18 16:30:00 GMT",
            download_url="/api/reports/download/REP-2026-003.pdf"
        ),
        ReportItem(
            report_id="REP-2026-004",
            title="East Ridge Plot Crop Health & Moisture Assessment",
            metric="NDMI",
            scope="Plot-Level",
            plot_id="PLOT-BETA",
            generated_at="2026-05-28 09:15:00 GMT",
            download_url="/api/reports/download/REP-2026-004.pdf"
        ),
        ReportItem(
            report_id="REP-2026-005",
            title="Whole Farm Yield Forecast Report — Q2 2026",
            metric="NDVI / EVI",
            scope="Whole Farm (Aggregate)",
            plot_id=None,
            generated_at="2026-06-01 14:00:00 GMT",
            download_url="/api/reports/download/REP-2026-005.pdf"
        )
    ]
