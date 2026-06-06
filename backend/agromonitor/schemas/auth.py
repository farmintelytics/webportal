from ninja import Schema
from typing import Optional, Dict, Any

class LoginRequest(Schema):
    email: str
    access_code: str

class LoginResponse(Schema):
    token: str
    email: str
    status: str
    message: str

class VerifyRequest(Schema):
    token: str

class VerifyResponse(Schema):
    valid: bool
    user_info: Optional[Dict[str, Any]] = None
