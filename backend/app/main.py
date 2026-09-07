from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.core.config import settings
from app.core.database import engine
from app.core.limiter import limiter
from app.api.v1.auth import router as auth_router
from app.api.v1.trades import router as trades_router
from app.api.v1.imports import router as imports_router
from app.api.v1.analytics import router as analytics_router
from app.api.v1.behavior import router as behavior_router
from app.api.v1.risk import router as risk_router
from app.api.v1.ai import router as ai_router
from app.api.v1.signal import router as signal_router

app = FastAPI(title="TradeMind API", version="0.1.0")

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)


@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    if settings.environment == "production":
        response.headers["Strict-Transport-Security"] = "max-age=63072000; includeSubDomains"
    return response


app.include_router(auth_router)
app.include_router(trades_router)
app.include_router(imports_router)
app.include_router(analytics_router)
app.include_router(behavior_router)
app.include_router(risk_router)
app.include_router(ai_router)
app.include_router(signal_router)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/ready")
def ready():
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return {"status": "ready", "database": "connected"}
    except Exception:
        return {"status": "not ready", "database": "unreachable"}