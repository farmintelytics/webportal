import time
from ninja import Router
from typing import List
from ..schemas.alert import AlertsResponse, AcknowledgeResponse, AlertItem, AlertsStats

router = Router(tags=["Alerts Command Center"])

# In-memory database for alerts simulation
ALERTS_DB = [
    {
        "alert_id": "ALT-001",
        "plot_id": "PLOT-BETA",
        "type": "Moisture Deficit Warning",
        "severity": "Warning",
        "message": "NDMI moisture levels dropped below 0.30 in West Valley Estate - East Plot.",
        "timestamp": "2026-06-04 08:32:00 GMT",
        "acknowledged": False,
        "acknowledged_by": None,
        "acknowledged_at": None
    },
    {
        "alert_id": "ALT-002",
        "plot_id": "PLOT-GAMMA",
        "type": "Canopy Loss Anomaly",
        "severity": "Critical",
        "message": "EUDR compliance threat: 14.5% forest canopy clearing detected relative to 2020 baseline.",
        "timestamp": "2026-06-03 14:15:00 GMT",
        "acknowledged": False,
        "acknowledged_by": None,
        "acknowledged_at": None
    },
    {
        "alert_id": "ALT-003",
        "plot_id": "PLOT-ALPHA",
        "type": "Pest Risk Warning",
        "severity": "Warning",
        "message": "Borer pest index flagged as High Risk due to high vegetative density and canopy moisture.",
        "timestamp": "2026-06-05 00:05:00 GMT",
        "acknowledged": False,
        "acknowledged_by": None,
        "acknowledged_at": None
    }
]

@router.get("/", response=AlertsResponse)
def get_alerts(request):
    """
    Returns incident log feeds and alerts counts.
    """
    total = len(ALERTS_DB)
    critical = sum(1 for a in ALERTS_DB if a["severity"] == "Critical")
    warnings = sum(1 for a in ALERTS_DB if a["severity"] == "Warning")
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
    Acknowledges an active alert and records user identity.
    """
    for alert in ALERTS_DB:
        if alert["alert_id"] == alert_id:
            alert["acknowledged"] = True
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
