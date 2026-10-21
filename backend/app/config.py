import os
from pathlib import Path
from typing import Optional, List
from dotenv import load_dotenv

# Load environment variables from .env if present
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

class Settings:
    PROJECT_NAME: str = "FlightDelay AI API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    APP_ENV: str = os.getenv("APP_ENV", "development")
    
    # Base Directories
    BASE_DIR: Path = Path(__file__).resolve().parent.parent.parent
    ML_DIR: Path = BASE_DIR / "ml"
    MODELS_DIR: Path = ML_DIR / "models"
    DATA_DIR: Path = ML_DIR / "data"
    
    BEST_MODEL_PATH: Path = MODELS_DIR / "best_flight_delay_model.joblib"
    EXPERIMENT_RESULTS_PATH: Path = MODELS_DIR / "experiment_results.json"
    DATASET_SUMMARY_PATH: Path = DATA_DIR / "processed" / "dataset_summary.json"
    
    # Supabase Configuration
    SUPABASE_URL: Optional[str] = os.getenv("SUPABASE_URL")
    SUPABASE_KEY: Optional[str] = os.getenv("SUPABASE_KEY")
    SUPABASE_SERVICE_ROLE_KEY: Optional[str] = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

    @property
    def is_supabase_configured(self) -> bool:
        """Returns True only if valid non-placeholder Supabase credentials are provided."""
        if not self.SUPABASE_URL or not (self.SUPABASE_KEY or self.SUPABASE_SERVICE_ROLE_KEY):
            return False
        if "your-project-id" in self.SUPABASE_URL or "your-supabase" in (self.SUPABASE_KEY or ""):
            return False
        return True

    # CORS Configuration
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ]

settings = Settings()
