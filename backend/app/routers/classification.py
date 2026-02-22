"""
classification router
---------------------
POST /api/classify/single   – predict one client
POST /api/classify/batch    – upload CSV, predict all rows
GET  /api/classify/metadata – class names, feature list, model status
"""

from __future__ import annotations

import io
import logging
from typing import Any

import pandas as pd
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from pydantic import BaseModel

from app.auth import get_current_user
from app.ml_pipeline import classification_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/classify", tags=["classification"])


# ── Pydantic models ──────────────────────────────────────────────────────────

class SinglePredictionRequest(BaseModel):
    """Raw column values for one client – keys must match train.csv columns."""
    User_ID: str = "SINGLE_INPUT"
    Estimated_Annual_Income: float = 0
    Adult_Dependents: int = 0
    Child_Dependents: float | None = None
    Infant_Dependents: int = 0
    Previous_Policy_Duration_Months: int = 0
    Days_Since_Quote: int = 0
    Grace_Period_Extensions: int = 0
    Custom_Riders_Requested: int = 0
    Vehicles_on_Policy: int = 0
    Policy_Amendments_Count: int = 0
    Previous_Claims_Filed: int = 0
    Years_Without_Claims: int = 0
    Underwriting_Processing_Days: int = 0
    Region_Code: str = "USA"
    Broker_Agency_Type: str = "Urban_Boutique"
    Deductible_Tier: str = "Tier_2_Mid_Ded"
    Acquisition_Channel: str = "Direct_Website"
    Payment_Schedule: str = "Monthly_EFT"
    Employment_Status: str = "Employed_FullTime"
    Policy_Start_Month: str = "January"
    Broker_ID: float | None = None
    Employer_ID: float | None = None
    # Optional extra columns the pipeline won't choke on
    Policy_Cancelled_Post_Purchase: int = 0
    Policy_Start_Year: int = 2024
    Policy_Start_Week: int = 1
    Policy_Start_Day: int = 1
    Existing_Policyholder: int = 0


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.get("/metadata")
async def get_metadata(user=Depends(get_current_user)):
    """Return model status, class names, required columns, and global importances."""
    if not classification_service.is_ready:
        raise HTTPException(503, "Model not loaded yet.")
    return {
        "ready": True,
        "classes": classification_service.class_names,
        "n_classes": len(classification_service.class_names),
        "global_importances": classification_service.global_importances,
    }


@router.post("/single")
async def classify_single(
    req: SinglePredictionRequest,
    user=Depends(get_current_user),
):
    """Predict coverage bundle for a single client."""
    if not classification_service.is_ready:
        raise HTTPException(503, "Model not loaded yet.")

    try:
        row = req.model_dump()
        result = classification_service.predict_single(row)
        return result
    except ValueError as exc:
        raise HTTPException(422, detail=str(exc))
    except Exception as exc:
        logger.exception("Single prediction failed")
        raise HTTPException(500, detail=str(exc))


@router.post("/batch")
async def classify_batch(
    file: UploadFile = File(...),
    user=Depends(get_current_user),
):
    """Upload a CSV and predict bundles for every row."""
    if not classification_service.is_ready:
        raise HTTPException(503, "Model not loaded yet.")

    if not file.filename or not file.filename.endswith(".csv"):
        raise HTTPException(422, "Only .csv files are accepted.")

    try:
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))
        logger.info("Batch upload: %d rows, %d cols", *df.shape)
        result = classification_service.predict_batch(df)
        return result
    except ValueError as exc:
        raise HTTPException(422, detail=str(exc))
    except Exception as exc:
        logger.exception("Batch prediction failed")
        raise HTTPException(500, detail=str(exc))
