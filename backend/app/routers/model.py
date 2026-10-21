from fastapi import APIRouter
from app.schemas import (
    ModelStatusResponse,
    FlightPredictionRequest,
    PredictionResultResponse
)
from app.services.model_service import model_service

router = APIRouter(tags=["Machine Learning Model"])

@router.get("/model-status", response_model=ModelStatusResponse)
def get_model_status():
    """
    Check the current status of the machine learning model.
    Returns whether a validated model pipeline exists on disk and its metadata.
    """
    return model_service.get_model_status()

@router.post("/predict", response_model=PredictionResultResponse)
def predict_flight_delay(request: FlightPredictionRequest):
    """
    Predict flight delay status (On-Time vs Delayed >= 15 mins).
    Guards against ungrounded predictions by rejecting requests if no trained model exists.
    """
    return model_service.predict(request)
