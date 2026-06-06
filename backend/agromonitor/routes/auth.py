import jwt
import datetime
from django.conf import settings
from ninja import Router
from ..schemas.auth import LoginRequest, LoginResponse, VerifyRequest, VerifyResponse

router = Router(tags=["Authentication"])

@router.post("/login", response=LoginResponse)
def login(request, data: LoginRequest):
    # Verify specifications: admin@farmintelytics.com / admin123
    if data.email == "admin@farmintelytics.com" and data.access_code == "admin123":
        payload = {
            "email": data.email,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24),
            "role": "admin"
        }
        token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")
        return {
            "token": token,
            "email": data.email,
            "status": "success",
            "message": "Authentication successful"
        }
    else:
        # Return 401 response or error details (Django Ninja handles JSON return)
        return LoginResponse(
            token="",
            email=data.email,
            status="error",
            message="Invalid credentials. Use admin@farmintelytics.com and admin123."
        )

@router.post("/verify", response=VerifyResponse)
def verify_token(request, data: VerifyRequest):
    try:
        decoded = jwt.decode(data.token, settings.SECRET_KEY, algorithms=["HS256"])
        return {
            "valid": True,
            "user_info": {
                "email": decoded.get("email"),
                "role": decoded.get("role")
            }
        }
    except jwt.ExpiredSignatureError:
        return {"valid": False, "user_info": None}
    except jwt.InvalidTokenError:
        return {"valid": False, "user_info": None}
