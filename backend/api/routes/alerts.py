import time
from ninja import Router
from typing import List
from ..schemas.alert import AlertsResponse, AcknowledgeResponse, AlertItem, AlertsStats

router = Router(tags=["Alerts Command Center"])

# ── In-memory alert store ─────────────────────────────────────────────────────
# Aligned with the frontend Alerts Command Center alert feed.
# Fields: alert_id, plot_id, type, severity, message, timestamp,
#         acknowledged, acknowledged_by, acknowledged_at
# severity values: "Critical" | "Warning" | "Info"
# ─────────────────────────────────────────────────────────────────────────────
ALERTS_DB = [
    {
        "alert_id":        "ALT-001",
        "plot_id":         "PLOT-BETA",
        "type":            "Water Stress",
        "severity":        "Critical",
        "message":         "LSWI moisture index dropped below 0.30 target in East Ridge Plot. Root-zone dry spell requires immediate +30% irrigation flow.",
        "timestamp":       "2026-06-04 14:22:00 GMT",
        "acknowledged":    False,
        "acknowledged_by": None,
        "acknowledged_at": None
    },
    {
        "alert_id":        "ALT-002",
        "plot_id":         "PLOT-BETA",
        "type":            "Pest Infestation",
        "severity":        "Critical",
        "message":         "Stem borer outbreak warning near East Ridge boundary. Recommended insecticide spray buffer zone of 150m.",
        "timestamp":       "2026-06-03 09:45:00 GMT",
        "acknowledged":    False,
        "acknowledged_by": None,
        "acknowledged_at": None
    },
    {
        "alert_id":        "ALT-003",
        "plot_id":         "PLOT-GAMMA",
        "type":            "Canopy Loss Anomaly",
        "severity":        "Critical",
        "message":         "EUDR compliance threat: 14.5% forest canopy clearing detected relative to 2020 baseline in South Slope Plot.",
        "timestamp":       "2026-06-03 14:15:00 GMT",
        "acknowledged":    False,
        "acknowledged_by": None,
        "acknowledged_at": None
    },
    {
        "alert_id":        "ALT-004",
        "plot_id":         "PLOT-GAMMA",
        "type":            "Growth Deficit",
        "severity":        "Warning",
        "message":         "NDVI vegetation vigor index showing abnormal 3-week plateau during Grand Growth phase in South Slope Plot.",
        "timestamp":       "2026-06-02 11:15:00 GMT",
        "acknowledged":    False,
        "acknowledged_by": None,
        "acknowledged_at": None
    },
    {
        "alert_id":        "ALT-005",
        "plot_id":         "PLOT-ALPHA",
        "type":            "Pest Risk Warning",
        "severity":        "Warning",
        "message":         "Borer pest index flagged as High Risk in West Valley Plot due to high vegetative density and canopy moisture.",
        "timestamp":       "2026-06-05 00:05:00 GMT",
        "acknowledged":    False,
        "acknowledged_by": None,
        "acknowledged_at": None
    },
    {
        "alert_id":        "ALT-006",
        "plot_id":         "PLOT-BETA",
        "type":            "Water Stress",
        "severity":        "Critical",
        "message":         "Evapotranspiration deficit detected in East Ridge Plot. Actual transpiration (ETa) is 45% below demand (ETc).",
        "timestamp":       "2026-06-04 10:12:00 GMT",
        "acknowledged":    False,
        "acknowledged_by": None,
        "acknowledged_at": None
    },
    {
        "alert_id":        "ALT-007",
        "plot_id":         "PLOT-ALPHA",
        "type":            "Water Stress",
        "severity":        "Warning",
        "message":         "WDI thermal-optical crop water stress index exceeds 0.60 warning threshold in West Valley Plot.",
        "timestamp":       "2026-06-03 13:50:00 GMT",
        "acknowledged":    False,
        "acknowledged_by": None,
        "acknowledged_at": None
    },
    {
        "alert_id":        "ALT-008",
        "plot_id":         "PLOT-ALPHA",
        "type":            "Cloud Cover",
        "severity":        "Info",
        "message":         "Sentinel-2 imagery shows 12% localized cloud cover over West Valley Plot. Index computations adjusted.",
        "timestamp":       "2026-05-30 16:05:00 GMT",
        "acknowledged":    True,
        "acknowledged_by": "admin@farmintelytics.com",
        "acknowledged_at": "2026-05-30 17:00:00 GMT"
    }
]


@router.get("/", response=AlertsResponse)
def get_alerts(request):
    """
    Returns incident log feeds and KPI alert counts.

    Frontend field mapping (from agromonitorApi.js):
      stats.total       → total alert count badge
      stats.critical    → critical count badge
      stats.warnings    → warnings count badge
      stats.acknowledged → acknowledged count
      feed[].alert_id   → alert_id (used for acknowledge action)
      feed[].plot_id    → plot badge
      feed[].type       → alert category
      feed[].severity   → severity badge color
      feed[].message    → alert description text
      feed[].timestamp  → time display
      feed[].acknowledged → acknowledgement state
    """
    total        = len(ALERTS_DB)
    critical     = sum(1 for a in ALERTS_DB if a["severity"] == "Critical")
    warnings     = sum(1 for a in ALERTS_DB if a["severity"] == "Warning")
    acknowledged = sum(1 for a in ALERTS_DB if a["acknowledged"])

    feed = [AlertItem(**a) for a in ALERTS_DB]

    return AlertsResponse(
        stats=AlertsStats(
            total=total,
            critical=critical,
            warnings=warnings,
            acknowledged=acknowledged
        ),
        feed=feed
    )


@router.post("/{alert_id}/acknowledge", response=AcknowledgeResponse)
def acknowledge_alert(request, alert_id: str):
    """
    Acknowledges an active alert and records the user identity.
    Mutates the in-memory ALERTS_DB store.
    """
    for alert in ALERTS_DB:
        if alert["alert_id"] == alert_id:
            alert["acknowledged"]    = True
            alert["acknowledged_by"] = "admin@farmintelytics.com"
            alert["acknowledged_at"] = time.strftime("%Y-%m-%d %H:%M:%S GMT")
            return AcknowledgeResponse(
                status="success",
                alert_id=alert_id,
                acknowledged_by=alert["acknowledged_by"],
                acknowledged_at=alert["acknowledged_at"]
            )

    return AcknowledgeResponse(
        status="error",
        alert_id=alert_id,
        acknowledged_by="",
        acknowledged_at=""
    )
