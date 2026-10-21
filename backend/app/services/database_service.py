import logging
from typing import Optional, Dict, Any, List
from datetime import datetime
from app.database import get_db_client

logger = logging.getLogger(__name__)

class DatabaseService:
    def __init__(self):
        pass

    def save_prediction(
        self,
        airline: str,
        origin: str,
        destination: str,
        flight_date: str,
        scheduled_departure_time: str,
        predicted_delay: bool,
        delay_probability: float,
        model_version_id: Optional[str] = None,
        user_id: Optional[str] = None
    ) -> Optional[Dict[str, Any]]:
        """
        Saves a genuine ML prediction result to Supabase prediction_history table.
        Strictly executed only after real model inference succeeds.
        """
        client = get_db_client()
        if not client:
            logger.info("Supabase not configured; skipping prediction record persistence.")
            return None

        payload = {
            "airline": airline.strip().upper(),
            "origin": origin.strip().upper(),
            "destination": destination.strip().upper(),
            "flight_date": flight_date,
            "scheduled_departure_time": scheduled_departure_time,
            "predicted_delay": bool(predicted_delay),
            "delay_probability": round(float(delay_probability), 4),
            "model_version_id": model_version_id,
            "user_id": user_id,
            "created_at": datetime.utcnow().isoformat() + "Z"
        }

        try:
            res = client.table("prediction_history").insert(payload).execute()
            if res.data and len(res.data) > 0:
                logger.info(f"Prediction saved to database: ID {res.data[0].get('id')}")
                return res.data[0]
            return None
        except Exception as e:
            logger.error(f"Failed to persist prediction history: {e}")
            return None

    def get_prediction_history(
        self,
        user_id: str,
        airline: Optional[str] = None,
        origin: Optional[str] = None,
        destination: Optional[str] = None,
        flight_date: Optional[str] = None,
        limit: int = 50
    ) -> List[Dict[str, Any]]:
        """
        Retrieves prediction history filtered by user_id and optional parameters.
        Enforces user ownership.
        """
        client = get_db_client()
        if not client:
            return []

        try:
            query = client.table("prediction_history").select("*").eq("user_id", user_id)
            
            if airline:
                query = query.eq("airline", airline.strip().upper())
            if origin:
                query = query.eq("origin", origin.strip().upper())
            if destination:
                query = query.eq("destination", destination.strip().upper())
            if flight_date:
                query = query.eq("flight_date", flight_date)

            query = query.order("created_at", desc=True).limit(limit)
            res = query.execute()
            return res.data or []
        except Exception as e:
            logger.error(f"Error querying prediction history: {e}")
            return []

    def register_dataset_metadata(
        self,
        dataset_name: str,
        source: str,
        total_records: int,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
        delayed_count: int = 0,
        on_time_count: int = 0
    ) -> Optional[Dict[str, Any]]:
        """
        Registers historical BTS flight dataset metadata into Supabase dataset_metadata table.
        """
        client = get_db_client()
        if not client:
            return None

        payload = {
            "dataset_name": dataset_name,
            "source": source,
            "total_records": total_records,
            "start_date": start_date,
            "end_date": end_date,
            "delayed_count": delayed_count,
            "on_time_count": on_time_count,
            "created_at": datetime.utcnow().isoformat() + "Z"
        }

        try:
            res = client.table("dataset_metadata").insert(payload).execute()
            return res.data[0] if res.data else None
        except Exception as e:
            logger.error(f"Failed to register dataset metadata: {e}")
            return None

    def register_model_version(
        self,
        model_name: str,
        version: str,
        dataset_id: Optional[str] = None,
        status: str = "active"
    ) -> Optional[Dict[str, Any]]:
        """
        Registers a new validated model artifact version into model_versions table.
        """
        client = get_db_client()
        if not client:
            return None

        payload = {
            "model_name": model_name,
            "version": version,
            "dataset_id": dataset_id,
            "status": status,
            "trained_at": datetime.utcnow().isoformat() + "Z"
        }

        try:
            res = client.table("model_versions").upsert(payload, on_conflict="version").execute()
            return res.data[0] if res.data else None
        except Exception as e:
            logger.error(f"Failed to register model version: {e}")
            return None

    def save_model_metrics(
        self,
        model_version_id: str,
        resampling_method: str,
        accuracy: float,
        precision: float,
        recall: float,
        f1_score: float,
        pr_auc: float,
        roc_auc: float,
        confusion_matrix: Optional[List[List[int]]] = None
    ) -> Optional[Dict[str, Any]]:
        """
        Stores empirical validation metrics in model_metrics table.
        """
        client = get_db_client()
        if not client:
            return None

        payload = {
            "model_version_id": model_version_id,
            "resampling_method": resampling_method,
            "accuracy": round(float(accuracy), 4),
            "precision": round(float(precision), 4),
            "recall": round(float(recall), 4),
            "f1_score": round(float(f1_score), 4),
            "pr_auc": round(float(pr_auc), 4),
            "roc_auc": round(float(roc_auc), 4),
            "confusion_matrix": confusion_matrix,
            "created_at": datetime.utcnow().isoformat() + "Z"
        }

        try:
            res = client.table("model_metrics").insert(payload).execute()
            return res.data[0] if res.data else None
        except Exception as e:
            logger.error(f"Failed to save model metrics: {e}")
            return None

    def get_model_benchmarks(self) -> List[Dict[str, Any]]:
        """
        Retrieves real model benchmark metrics joined with model versions.
        """
        client = get_db_client()
        if not client:
            return []

        try:
            res = client.table("model_metrics").select(
                "*, model_versions(model_name, version, status)"
            ).order("pr_auc", desc=True).execute()
            return res.data or []
        except Exception as e:
            logger.error(f"Error fetching model benchmarks: {e}")
            return []

database_service = DatabaseService()
