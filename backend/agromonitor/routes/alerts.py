"""
alerts.py — Alerts Command Center route
──────────────────────────────────────────────────────────────────────────────
Alert data is loaded from:  backend/api/data/alerts.json

The JSON file is parsed once at module import time into ALERTS_DB (a list).
Acknowledge mutations are held in memory for the duration of the server
process (in a real system this would write back to the file or a DB).
──────────────────────────────────────────────────────────────────────────────
"""
import os, json, time
from ninja import Router
from typing import List
from ..schemas.alert import AlertsResponse, AcknowledgeResponse, AlertItem, AlertsStats

router = Router(tags=["Alerts Command Center"])

# ─── Load alerts from geospatial data store ───────────────────────────────────
_ALERTS_FILE = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'data', 'alerts.json'
)

with open(_ALERTS_FILE) as _f:
    _raw = json.load(_f)

# Mutable in-memory list (mirrors alerts.json on startup)
ALERTS_DB: list = _raw['alerts']


@router.get("/", response=AlertsResponse)
def get_alerts(request):
    """
    Returns incident log feeds and KPI alert counts.

    Frontend field mapping (from agromonitorApi.js):
      stats.total        → total alert count badge
      stats.critical     → critical count badge
      stats.warnings     → warnings count badge
      stats.acknowledged → acknowledged count
      feed[].alert_id    → alert_id (used for acknowledge action)
      feed[].plot_id     → plot badge
      feed[].type        → alert category
      feed[].severity    → severity badge color
      feed[].message     → alert description text
      feed[].timestamp   → time display
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
    Mutates the in-memory ALERTS_DB store (loaded from alerts.json).
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
