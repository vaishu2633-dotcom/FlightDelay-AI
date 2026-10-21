from fastapi import APIRouter
from app.schemas import DatasetSummaryResponse, ModelComparisonResponse
from app.services.model_service import model_service

router = APIRouter(tags=["Analytics & Research Benchmarks"])

@router.get("/dataset-summary", response_model=DatasetSummaryResponse)
def get_dataset_summary():
    """
    Retrieve statistics and class distribution from the historical BTS dataset.
    """
    return model_service.get_dataset_summary()

@router.get("/model-comparison", response_model=ModelComparisonResponse)
def get_model_comparison():
    """
    Retrieve empirical benchmark metrics comparing baseline models with resampling techniques
    (Random Oversampling, Random Undersampling, SMOTE, Class Weighting, Balanced Ensembles).
    """
    return model_service.get_model_comparisons()
