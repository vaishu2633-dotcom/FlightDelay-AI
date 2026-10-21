from typing import Optional
from fastapi import APIRouter, HTTPException, Depends, Header, Query
from app.schemas import PredictionHistoryResponse, PredictionHistoryItem
from app.services.database_service import database_service
from app.database import get_db_client

router = APIRouter(prefix="/predictions", tags=["Prediction History"])

async def get_current_user_id(authorization: Optional[str] = Header(None)) -> str:
    """
    Enforces authentication and extracts the verified user_id from Supabase JWT.
    Strictly forbids trusting an unverified user_id supplied in query parameters or payload.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail=(
                "Authentication required. Prediction history access is strictly restricted "
                "to authenticated users. Please provide a valid Bearer token."
            )
        )

    token = authorization.split("Bearer ")[1].strip()
    client = get_db_client()
    if not client:
        raise HTTPException(
            status_code=503,
            detail="Database service is not configured. Prediction history unavailable."
        )

    try:
        user_res = client.auth.get_user(token)
        if not user_res or not user_res.user:
            raise HTTPException(status_code=401, detail="Invalid or expired authentication session.")
        return str(user_res.user.id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Authentication verification failed: {str(e)}")

@router.get("/history", response_model=PredictionHistoryResponse)
def get_prediction_history(
    airline: Optional[str] = Query(None, description="Filter by 2-letter carrier code (e.g. DL, AA)"),
    origin: Optional[str] = Query(None, description="Filter by origin airport IATA code (e.g. ATL)"),
    destination: Optional[str] = Query(None, description="Filter by destination airport IATA code (e.g. LAX)"),
    flight_date: Optional[str] = Query(None, description="Filter by flight date (YYYY-MM-DD)"),
    limit: int = Query(50, ge=1, le=100),
    user_id: str = Depends(get_current_user_id)
):
    """
    Retrieve authenticated user's prediction history.
    Enforces authorization: user_id is extracted cryptographically from the verified token.
    """
    records = database_service.get_prediction_history(
        user_id=user_id,
        airline=airline,
        origin=origin,
        destination=destination,
        flight_date=flight_date,
        limit=limit
    )

    items = [
        PredictionHistoryItem(
            id=str(r["id"]),
            user_id=r.get("user_id"),
            airline=r["airline"],
            origin=r["origin"],
            destination=r["destination"],
            flight_date=str(r["flight_date"]),
            scheduled_departure_time=r["scheduled_departure_time"],
            predicted_delay=bool(r["predicted_delay"]),
            delay_probability=float(r["delay_probability"]),
            model_version_id=r.get("model_version_id"),
            created_at=str(r["created_at"])
        )
        for r in records
    ]

    return PredictionHistoryResponse(
        items=items,
        total=len(items),
        message=f"Retrieved {len(items)} prediction record(s) for authenticated user."
    )
