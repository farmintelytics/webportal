from ninja import Schema
from typing import List

class VerificationItem(Schema):
    name: str
    status: str  # Pass, Failed, Warning
    details: str
    description: str

class AuditResponse(Schema):
    timestamp: str
    overall_compliance: bool
    checks: List[VerificationItem]
    logs: List[str]
