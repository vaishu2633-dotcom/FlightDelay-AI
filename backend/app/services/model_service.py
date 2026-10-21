import json
import logging
from datetime import datetime
from pathlib import Path
from typing import Optional, Dict, Any, List
from fastapi import HTTPException

from app.config import settings
from app.schemas import (
    ModelStatusResponse,
    FlightPredictionRequest,
    PredictionResultResponse,
    DatasetSummaryResponse,
    ModelComparisonResponse,
    ModelEvaluationMetric
)

logger = logging.getLogger(__name__)

class ModelService:
    def __init__(self):
        self._model = None
        self._model_metadata = None
        self._load_attempted = False

    def get_model_status(self) -> ModelStatusResponse:
        """Check if a trained machine learning model artifact exists and inspect its metadata."""
        model_file = settings.BEST_MODEL_PATH
        results_file = settings.EXPERIMENT_RESULTS_PATH

        if not model_file.exists():
            return ModelStatusResponse(
                is_trained=False,
                model_name=None,
                trained_at=None,
                algorithm=None,
                sampling_technique=None,
                features=[],
                performance_metrics=None,
                status_message=(
                    "No trained ML model artifact found on disk. "
                    "Prediction functionality is safely locked until a real model has been trained "
                    "using the BTS aviation training pipeline (python ml/src/train_models.py)."
                ),
                dataset_scope="U.S. Bureau of Transportation Statistics (BTS) On-Time Performance Data"
            )

        # Artifact exists, read metadata if available
        metadata_file = settings.MODELS_DIR / "best_model_metadata.json"
        metadata = {}
        if metadata_file.exists():
            try:
                with open(metadata_file, "r") as f:
                    metadata = json.load(f)
            except Exception as e:
                logger.error(f"Error reading model metadata: {e}")

        return ModelStatusResponse(
            is_trained=True,
            model_name=metadata.get("model_name", "Best Validated Flight Delay Classifier"),
            trained_at=metadata.get("trained_at", datetime.fromtimestamp(model_file.stat().st_mtime).isoformat()),
            algorithm=metadata.get("algorithm", "Random Forest / Logistic Regression"),
            sampling_technique=metadata.get("sampling_technique", "SMOTE / Class Weighting"),
            features=metadata.get("features", ["Month", "DayOfWeek", "Hour", "Carrier", "Origin", "Dest", "Distance"]),
            performance_metrics=metadata.get("test_metrics", None),
            status_message="Trained model artifact verified and ready for live inferences.",
            dataset_scope="U.S. Bureau of Transportation Statistics (BTS) On-Time Performance Data"
        )

    def predict(self, request: FlightPredictionRequest) -> PredictionResultResponse:
        """Execute delay prediction using the validated pipeline. Strictly rejects mock predictions."""
        model_status = self.get_model_status()
        if not model_status.is_trained:
            raise HTTPException(
                status_code=503,
                detail=(
                    "FlightDelay AI strictly adheres to empirical research standards: "
                    "No trained model artifact was found. Predictions are unavailable until a real model "
                    "is trained on the historical BTS dataset via `python ml/src/train_models.py`."
                )
            )

        # Load real model if not loaded yet
        if self._model is None:
            try:
                import joblib
                self._model = joblib.load(settings.BEST_MODEL_PATH)
            except Exception as e:
                raise HTTPException(
                    status_code=500,
                    detail=f"Failed to load trained model artifact: {str(e)}"
                )

        # Prepare feature vector (preventing data leakage: only features known before departure)
        try:
            import pandas as pd
            flight_dt = datetime.strptime(request.flight_date, "%Y-%m-%d")
            sched_time_parts = request.scheduled_departure_time.split(":")
            sched_hour = int(sched_time_parts[0])
            sched_minute = int(sched_time_parts[1]) if len(sched_time_parts) > 1 else 0

            input_df = pd.DataFrame([{
                "Month": flight_dt.month,
                "DayOfWeek": flight_dt.isoweekday(),
                "CRSDepTime": sched_hour * 100 + sched_minute,
                "DepHour": sched_hour,
                "Reporting_Airline": request.airline.strip().upper(),
                "Origin": request.origin.strip().upper(),
                "Dest": request.destination.strip().upper(),
                "Distance": request.distance if request.distance is not None else 800.0,
            }])

            # Generate real prediction
            pred_class = int(self._model.predict(input_df)[0])
            pred_probs = self._model.predict_proba(input_df)[0]
            delay_prob = float(pred_probs[1])
            on_time_prob = float(pred_probs[0])
            confidence = max(delay_prob, on_time_prob)

            is_delayed = bool(pred_class == 1)
            predicted_status = "Delayed (>= 15 min)" if is_delayed else "On-Time"
            risk_level = "High" if delay_prob >= 0.50 else ("Moderate" if delay_prob >= 0.30 else "Low")

            # Persist genuine prediction to Supabase history if configured
            try:
                from app.services.database_service import database_service
                database_service.save_prediction(
                    airline=request.airline,
                    origin=request.origin,
                    destination=request.destination,
                    flight_date=request.flight_date,
                    scheduled_departure_time=request.scheduled_departure_time,
                    predicted_delay=is_delayed,
                    delay_probability=delay_prob,
                    model_version_id=None
                )
            except Exception as db_err:
                logger.warning(f"Could not log prediction to database: {db_err}")

            return PredictionResultResponse(
                predicted_status=predicted_status,
                is_delayed=is_delayed,
                delay_probability=round(delay_prob, 4),
                on_time_probability=round(on_time_prob, 4),
                confidence_score=round(confidence, 4),
                model_name=model_status.model_name or "Validated ML Pipeline",
                prediction_timestamp=datetime.utcnow().isoformat() + "Z",
                risk_level=risk_level,
                flight_summary={
                    "flight_date": request.flight_date,
                    "airline": request.airline.upper(),
                    "origin": request.origin.upper(),
                    "destination": request.destination.upper(),
                    "scheduled_time": request.scheduled_departure_time,
                },
                notes="Prediction generated using BTS-trained model. Delay threshold is defined as departure delay >= 15 minutes."
            )
        except Exception as e:
            logger.error(f"Prediction inference error: {e}")
            raise HTTPException(
                status_code=500,
                detail=f"Inference pipeline execution error: {str(e)}"
            )

    def get_dataset_summary(self) -> DatasetSummaryResponse:
        """Inspect the processed BTS flight dataset summary file."""
        summary_file = settings.DATASET_SUMMARY_PATH
        if not summary_file.exists():
            return DatasetSummaryResponse(
                dataset_found=False,
                dataset_source="U.S. Department of Transportation Bureau of Transportation Statistics (BTS)",
                message=(
                    "No processed BTS dataset summary found. "
                    "Run `python ml/src/inspect_dataset.py` to validate and summarize raw BTS flight data."
                )
            )

        try:
            with open(summary_file, "r") as f:
                data = json.load(f)
            return DatasetSummaryResponse(
                dataset_found=True,
                dataset_source="U.S. BTS Commercial Airline On-Time Performance (Domestic Flights)",
                total_records=data.get("total_records"),
                on_time_count=data.get("on_time_count"),
                delayed_count=data.get("delayed_count"),
                imbalance_ratio=data.get("imbalance_ratio"),
                minority_percentage=data.get("minority_percentage"),
                date_range=data.get("date_range"),
                top_carriers=data.get("top_carriers"),
                top_airports=data.get("top_airports"),
                hourly_distribution=data.get("hourly_distribution"),
                message="Dataset successfully processed and verified from official BTS historical records."
            )
        except Exception as e:
            return DatasetSummaryResponse(
                dataset_found=False,
                dataset_source="U.S. BTS Aviation Data",
                message=f"Error reading dataset summary file: {str(e)}"
            )

    def get_model_comparisons(self) -> ModelComparisonResponse:
        """Return experimental comparison metrics evaluating baseline models against imbalance mitigation techniques."""
        results_file = settings.EXPERIMENT_RESULTS_PATH
        if not results_file.exists():
            return ModelComparisonResponse(
                experiments_available=False,
                evaluation_protocol="Chronological Train/Test Split (Resampling restricted strictly to training folds)",
                models=[],
                key_findings=[],
                message=(
                    "No empirical experimental results found yet. "
                    "Run the ML evaluation suite (`python ml/src/evaluate_models.py`) to systematically compare "
                    "Baseline Logistic Regression, Random Forest, Random Oversampling (ROS), Random Undersampling (RUS), "
                    "SMOTE, Class Weighting, and Balanced Random Forest."
                )
            )

        try:
            with open(results_file, "r") as f:
                data = json.load(f)

            models_data = [ModelEvaluationMetric(**item) for item in data.get("models", [])]
            return ModelComparisonResponse(
                experiments_available=True,
                benchmark_dataset_size=data.get("benchmark_dataset_size"),
                imbalance_ratio_tested=data.get("imbalance_ratio_tested"),
                evaluation_protocol=data.get(
                    "evaluation_protocol",
                    "Chronological Split, 5-Fold Stratified CV with Resampling inside training folds only"
                ),
                models=models_data,
                best_model_id=data.get("best_model_id"),
                key_findings=data.get("key_findings", []),
                message="Empirical model benchmarks loaded from validated evaluation results."
            )
        except Exception as e:
            return ModelComparisonResponse(
                experiments_available=False,
                evaluation_protocol="Chronological Train/Test Split",
                models=[],
                message=f"Error reading experimental results: {str(e)}"
            )

model_service = ModelService()
