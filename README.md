# FlightDelay AI ✈️

**Research Topic:** Class Imbalance in Commercial Flight Delay Prediction: Evaluation and Mitigation Techniques  
**Academic Level:** Third-Year Engineering Machine Learning Research Project  
**Target Definition:** Binary Classification — On-Time (0) vs Delayed (1) with departure delay $\ge 15$ minutes (FAA Standard).  
**Data Scope:** U.S. Bureau of Transportation Statistics (BTS) Airline On-Time Performance (Domestic Commercial Flights).

---

## 📁 Project Architecture

```
flight-delay-ai/
├── frontend/                     # React (Vite) + Tailwind CSS + Recharts
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Aviation navigation with dynamic model status badge
│   │   │   ├── Footer.jsx        # Scope disclosure and research citations
│   │   │   └── ModelStatusBanner.jsx # Live warning preventing ungrounded predictions
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Aviation landing page & class imbalance motivation
│   │   │   ├── PredictFlight.jsx # Passenger itinerary input (locked until trained)
│   │   │   ├── PredictionResults.jsx # Probability gauge and risk classification
│   │   │   ├── Analytics.jsx     # BTS data distribution & delay trend charts
│   │   │   ├── ModelComparison.jsx # Benchmark table (Baseline vs ROS/RUS/SMOTE/Weights)
│   │   │   └── About.jsx         # Research methodology & leakage prevention policy
│   │   ├── services/
│   │   │   └── api.js            # FastAPI client services
│   │   ├── App.jsx               # Router & status state provider
│   │   └── index.css             # Tailwind setup and aviation gradients
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/                      # Python FastAPI REST API
│   ├── app/
│   │   ├── config.py             # Settings, paths, and CORS
│   │   ├── schemas.py            # Pydantic request/response validation schemas
│   │   ├── main.py               # FastAPI application setup
│   │   ├── routers/
│   │   │   ├── health.py         # GET /api/v1/health
│   │   │   ├── model.py          # GET /api/v1/model-status, POST /api/v1/predict
│   │   │   └── analytics.py      # GET /api/v1/dataset-summary, GET /api/v1/model-comparison
│   │   └── services/
│   │       └── model_service.py  # Model lifecycle, disk inspection, and inference guard
│   └── requirements.txt
│
└── ml/                           # ML Pipeline & Dataset Inspection
    ├── data/
    │   ├── raw/                  # Place raw BTS CSV downloads here
    │   └── processed/            # Processed JSON summaries and datasets
    ├── models/                   # Saved .joblib model artifacts & experiment results
    └── src/
        ├── config.py             # Feature definitions, delay threshold & leakage list
        └── inspect_dataset.py    # BTS dataset validator, leakage auditor, and imbalance profiler
```

---

## 🛡️ Research Integrity & Anti-Leakage Safeguards

1. **Zero Mock Predictions**: If no verified model artifact is found on disk (`ml/models/best_flight_delay_model.joblib`), the prediction endpoint returns `HTTP 503` and the UI marks the form as locked.
2. **Leakage Quarantine**: Features are strictly limited to pre-departure schedules (`Month`, `DayOfWeek`, `CRSDepTime`, `DepHour`, `Reporting_Airline`, `Origin`, `Dest`, `Distance`). Post-departure data like `DepTime`, `TaxiOut`, and `WheelsOff` are strictly forbidden.
3. **In-Fold Resampling**: Synthetic oversampling (SMOTE/ROS) and undersampling (RUS) are only applied inside training folds to prevent validation leakage.
4. **Geographic Scope**: Models are explicitly scoped to U.S. domestic commercial flights (FAA reporting standard).

---

## 🚀 Running the Project

### 1. Backend Server (FastAPI)
```powershell
cd C:\Users\vaish\.gemini\antigravity\scratch\flight-delay-ai\backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
- API Documentation: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- Health Endpoint: [http://127.0.0.1:8000/api/v1/health](http://127.0.0.1:8000/api/v1/health)
- Model Status: [http://127.0.0.1:8000/api/v1/model-status](http://127.0.0.1:8000/api/v1/model-status)

### 2. Frontend Application (React + Vite)
```powershell
cd C:\Users\vaish\.gemini\antigravity\scratch\flight-delay-ai\frontend
npm run dev
```
- Local URL: [http://127.0.0.1:5173/](http://127.0.0.1:5173/)

### 3. Dataset Validation
```powershell
cd C:\Users\vaish\.gemini\antigravity\scratch\flight-delay-ai
python ml/src/inspect_dataset.py
```
