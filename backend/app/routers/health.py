from datetime import datetime
from fastapi import APIRouter
from app.schemas import HealthCheckResponse
from app.config import settings
from app.database import db_manager

router = APIRouter(tags=["Health"])

@router.get("/health", response_model=HealthCheckResponse)
def health_check():
    """Health check endpoint verifying backend and database operational readiness."""
    db_health = db_manager.check_health()
    
    # API overall status remains operational
    return HealthCheckResponse(
        status="healthy",
        timestamp=datetime.utcnow().isoformat() + "Z",
        version=settings.VERSION,
        service=settings.PROJECT_NAME,
        database=db_health
    )
