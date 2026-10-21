import logging
import time
from typing import Optional, Dict, Any
from supabase import create_client, Client
from app.config import settings

logger = logging.getLogger(__name__)

class DatabaseManager:
    _instance: Optional['DatabaseManager'] = None
    _client: Optional[Client] = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(DatabaseManager, cls).__new__(cls)
        return cls._instance

    def get_client(self) -> Optional[Client]:
        """
        Returns an initialized server-side Supabase client.
        Uses the service_role key for privileged server operations if available,
        falling back to the standard API key.
        """
        if not settings.is_supabase_configured:
            return None

        if self._client is None:
            try:
                # Prefer service role key for backend operations (RLS bypass for admin/logging)
                api_key = settings.SUPABASE_SERVICE_ROLE_KEY or settings.SUPABASE_KEY
                self._client = create_client(settings.SUPABASE_URL, api_key)
                logger.info("Supabase client initialized successfully.")
            except Exception as e:
                logger.error(f"Failed to initialize Supabase client: {e}")
                self._client = None

        return self._client

    def check_health(self) -> Dict[str, Any]:
        """
        Performs an operational health check on the Supabase database.
        Returns connection status, provider information, and query latency.
        """
        if not settings.is_supabase_configured:
            return {
                "status": "unconfigured",
                "configured": False,
                "provider": "Supabase PostgreSQL",
                "message": (
                    "Supabase credentials not configured in backend/.env. "
                    "Copy backend/.env.example to backend/.env and provide SUPABASE_URL and SUPABASE_KEY."
                )
            }

        client = self.get_client()
        if not client:
            return {
                "status": "initialization_failed",
                "configured": True,
                "provider": "Supabase PostgreSQL",
                "message": "Client initialization failed. Verify credentials in backend/.env."
            }

        start_time = time.time()
        try:
            # Query dataset_metadata or model_versions to verify live connectivity
            response = client.table("dataset_metadata").select("id").limit(1).execute()
            latency = round((time.time() - start_time) * 1000, 2)
            return {
                "status": "connected",
                "configured": True,
                "provider": "Supabase PostgreSQL",
                "latency_ms": latency,
                "message": "Database connection verified successfully."
            }
        except Exception as e:
            latency = round((time.time() - start_time) * 1000, 2)
            logger.warning(f"Database health check query failed: {e}")
            return {
                "status": "connection_error",
                "configured": True,
                "provider": "Supabase PostgreSQL",
                "latency_ms": latency,
                "error": str(e),
                "message": "Connected to endpoint but query failed. Verify table migrations."
            }

db_manager = DatabaseManager()

def get_db_client() -> Optional[Client]:
    return db_manager.get_client()
