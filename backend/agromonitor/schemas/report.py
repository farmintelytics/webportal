from ninja import Schema
from typing import Optional, Dict, Any, List

class CertificateRequest(Schema):
    scope: str
    metric: str
    plot_id: Optional[str] = None

class CertificateResponse(Schema):
    certificate_id: str
    scope: str
    metric: str
    plot_id: Optional[str] = None
    generated_at: str
    hash: str
    blockchain_status: Dict[str, Any]
    data_points: List[Dict[str, Any]]
    diagnostic_summary: str

class ReportItem(Schema):
    report_id: str
    title: str
    metric: str
    scope: str
    plot_id: Optional[str] = None
    generated_at: str
    download_url: str
