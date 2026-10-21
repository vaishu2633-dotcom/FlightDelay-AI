import os
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parent.parent.parent
ML_DIR = BASE_DIR / "ml"
DATA_DIR = ML_DIR / "data"
RAW_DATA_DIR = DATA_DIR / "raw"
PROCESSED_DATA_DIR = DATA_DIR / "processed"
MODELS_DIR = ML_DIR / "models"

# Ensure directories exist
RAW_DATA_DIR.mkdir(parents=True, exist_ok=True)
PROCESSED_DATA_DIR.mkdir(parents=True, exist_ok=True)
MODELS_DIR.mkdir(parents=True, exist_ok=True)

# Problem Formulation
DELAY_THRESHOLD_MINUTES = 15  # FAA standard: Departure delay >= 15 min is Delayed (1), else On-Time (0)

# Features available STRICTLY at prediction time (NO LEAKAGE)
PREDICTION_TIME_FEATURES = [
    "Month",
    "DayOfWeek",
    "CRSDepTime",       # Scheduled Departure Time (HHMM format)
    "DepHour",          # Extracted hour (0-23)
    "Reporting_Airline",# Operating carrier (e.g., AA, DL, UA, WN)
    "Origin",           # Origin Airport IATA code (e.g., ATL, ORD)
    "Dest",             # Destination Airport IATA code (e.g., LAX, DFW)
    "Distance",         # Flight distance in miles
]

# Leakage columns that MUST be strictly excluded from model training features
DATA_LEAKAGE_COLUMNS = [
    "DepTime",            # Actual departure time (contains delay info)
    "DepDelay",           # Target origin
    "DepDelayMinutes",    # Target origin
    "ArrTime",            # Arrival time
    "ArrDelay",           # Arrival delay
    "ArrDelayMinutes",    # Arrival delay
    "TaxiOut",            # Taxi out time
    "WheelsOff",          # Wheels off time
    "WheelsOn",           # Wheels on time
    "TaxiIn",             # Taxi in time
    "ActualElapsedTime",  # Actual flight time
    "AirTime",            # Actual air time
    "CancellationCode",   # Post-schedule info
    "Diverted",           # Post-schedule info
    "CarrierDelay",       # Delay breakdown (post-hoc)
    "WeatherDelay",       # Delay breakdown (post-hoc)
    "NASDelay",           # Delay breakdown (post-hoc)
    "SecurityDelay",      # Delay breakdown (post-hoc)
    "LateAircraftDelay"   # Delay breakdown (post-hoc)
]

# Random State for Reproducibility
RANDOM_STATE = 42
