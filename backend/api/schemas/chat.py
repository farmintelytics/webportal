from ninja import Schema
from typing import List, Optional

class ChatRequest(Schema):
    message: str
    scenario: Optional[str] = None

class ChatResponse(Schema):
    response: str
    sources: List[str]
