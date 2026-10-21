from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class HealthCheckResponse(BaseModel):
    status: str = Field(..., example="healthy")
    timestamp: str = Field(..., example="2026-10-18T17:30:00Z")
    version: str = Field(..., example="1.0.0")
    service: str = Field(..., example="FlightDelay AI API")
    database: Optional[Dict[str, Any]] = None

class ModelStatusResponse(BaseModel):
    is_trained: bool
    model_name: Optional[str] = None
    trained_at: Optional[str] = None
    algorithm: Optional[str] = None
    sampling_technique: Optional[str] = None
    features: List[str] = []
    performance_metrics: Optional[Dict[str, Any]] = None
    status_message: str
    dataset_scope: str = "US BTS Commercial Aviation Data (Domestic)"

class FlightPredictionRequest(BaseModel):
    flight_date: str = Field(
        ...,
        description="Flight date in YYYY-MM-DD format",
        example="2024-11-20"
    )
    airline: str = Field(
        ...,
        description="Two-letter IATA airline code (e.g. DL, AA, UA, WN)",
        example="DL"
    )
    origin: str = Field(
        ...,
        description="Three-letter IATA origin airport code (e.g. ATL, ORD, JFK)",
        example="ATL"
    )
    destination: str = Field(
        ...,
        description="Three-letter IATA destination airport code (e.g. LAX, DFW, SFO)",
        example="LAX"
    )
    scheduled_departure_time: str = Field(
        ...,
        description="Scheduled departure time in HH:MM (24-hour) format",
        example="14:30"
    )
    distance: Optional[float] = Field(
        None,
        description="Flight distance in miles (optional, computed if missing)",
        example=1946.0
    )

class PredictionResultResponse(BaseModel):
    predicted_status: str  # "Delayed" or "On-Time"
    is_delayed: bool
    delay_probability: float  # e.g. 0.34
    on_time_probability: float  # e.g. 0.66
    confidence_score: float
    model_name: str
    prediction_timestamp: str
    risk_level: str  # "Low", "Moderate", "High"
    flight_summary: Dict[str, Any]
    feature_contributions: Optional[Dict[str, Any]] = None
    notes: str

class DatasetSummaryResponse(BaseModel):
    dataset_found: bool
    dataset_source: str
    total_records: Optional[int] = None
    on_time_count: Optional[int] = None
    delayed_count: Optional[int] = None
    imbalance_ratio: Optional[str] = None
    minority_percentage: Optional[float] = None
    date_range: Optional[Dict[str, str]] = None
    top_carriers: Optional[List[Dict[str, Any]]] = None
    top_airports: Optional[List[Dict[str, Any]]] = None
    hourly_distribution: Optional[List[Dict[str, Any]]] = None
    message: str

class ModelEvaluationMetric(BaseModel):
    model_id: str
    model_name: str
    resampling_method: str
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    roc_auc: float
    pr_auc: float
    confusion_matrix: List[List[int]]
    training_time_seconds: Optional[float] = None

class ModelComparisonResponse(BaseModel):
    experiments_available: bool
    benchmark_dataset_size: Optional[int] = None
    imbalance_ratio_tested: Optional[str] = None
    evaluation_protocol: str
    models: List[ModelEvaluationMetric] = []
    best_model_id: Optional[str] = None
    key_findings: List[str] = []
    message: str

class PredictionHistoryItem(BaseModel):
    id: str
    user_id: Optional[str] = None
    airline: str
    origin: str
    destination: str
    flight_date: str
    scheduled_departure_time: str
    predicted_delay: bool
    delay_probability: float
    model_version_id: Optional[str] = None
    created_at: str

class PredictionHistoryResponse(BaseModel):
    items: List[PredictionHistoryItem] = []
    total: int = 0
    message: str
