from ninja import NinjaAPI
from .routes.auth import router as auth_router
from .routes.dashboard import router as dashboard_router
from .routes.intelligence import router as intelligence_router
from .routes.health import router as health_router
from .routes.yield_forecast import router as yield_router
from .routes.telemetry import router as telemetry_router
from .routes.restoration import router as restoration_router
from .routes.alerts import router as alerts_router
from .routes.verification import router as verification_router
from .routes.reports import router as reports_router
from .routes.chat import router as chat_router

api = NinjaAPI(
    title="Farmintelytics Engine — Agro Monitoring API",
    version="1.0.0",
    description="Skeletal backend containing all endpoints, calculations, and simulation models for remote sensing, carbon tracking, and alerts."
)

api.add_router("/auth", auth_router)
api.add_router("/dashboard", dashboard_router)
api.add_router("/plots/intelligence", intelligence_router)
api.add_router("/plots/health", health_router)
api.add_router("/plots/yield/forecast", yield_router)
api.add_router("/plots/telemetry", telemetry_router)
api.add_router("/restoration/zones", restoration_router)
api.add_router("/alerts", alerts_router)
api.add_router("/verification", verification_router)
api.add_router("/reports", reports_router)
api.add_router("/chat", chat_router)
