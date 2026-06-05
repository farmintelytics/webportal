from ninja import Schema
from typing import List, Optional

class AlertItem(Schema):
    alert_id: str
    plot_id: str
    type: str
    severity: str
    message: str
    timestamp: str
    acknowledged: bool
    acknowledged_by: Optional[str] = None
    acknowledged_at: Optional[str] = None

class AlertsStats(Schema):
    total: int
    critical: int
    warnings: int
    acknowledged: int

class AlertsResponse(Schema):
    stats: AlertsStats
    feed: List[AlertItem]

class AcknowledgeResponse(Schema):
    status: str
    alert_id: str
    acknowledged_by: str
    acknowledged_at: str
