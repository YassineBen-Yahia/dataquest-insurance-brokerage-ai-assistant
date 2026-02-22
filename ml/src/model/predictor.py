"""
predictor.py
------------
Load a trained model and run predictions on feature-engineered DataFrames.
"""

import os
import logging
from pathlib import Path
from typing import Optional

import joblib
import numpy as np
import pandas as pd

logger = logging.getLogger(__name__)

# Default model path: <project_root>/front-end/src/model.joblib
_DEFAULT_MODEL_PATH = str(
    Path(__file__).parent.parent.parent.parent / "front-end" / "src" / "model.joblib"
)


def load_model(model_path: Optional[str] = None):
    """
    Load a trained model from disk.

    Parameters
    ----------
    model_path : path to .joblib model file.  Falls back to
                 MODEL_PATH env-var → default project location.

    Returns
    -------
    sklearn estimator (fitted)
    """
    path = model_path or os.environ.get("MODEL_PATH", _DEFAULT_MODEL_PATH)
    logger.info("Loading model from %s", path)
    if not os.path.exists(path):
        raise FileNotFoundError(f"Model file not found: {path}")
    model = joblib.load(path)
    logger.info("Model loaded: %s", type(model).__name__)
    return model


def predict(df_features: pd.DataFrame, model) -> pd.DataFrame:
    """
    Run predictions using a fitted model on a feature-engineered DataFrame.

    Parameters
    ----------
    df_features : DataFrame output of ``preprocess()`` (includes User_ID).
    model       : fitted sklearn estimator with ``predict`` and ``predict_proba``.

    Returns
    -------
    DataFrame with columns:
      - User_ID
      - Predicted_Bundle        (class label)
      - Predicted_Bundle_Index  (integer index)
      - Confidence              (max probability × 100)
      - one column per class with probability × 100
    """
    id_col = "User_ID"
    user_ids = df_features[id_col] if id_col in df_features.columns else None

    # Drop non-feature columns
    drop_cols = [c for c in [id_col, "Purchased_Coverage_Bundle"] if c in df_features.columns]
    X = df_features.drop(columns=drop_cols)

    # Predictions
    preds = model.predict(X)
    classes = list(model.classes_)

    result = pd.DataFrame()
    if user_ids is not None:
        result["User_ID"] = user_ids.values

    result["Predicted_Bundle"] = preds

    # Map to integer index
    class_to_idx = {c: i for i, c in enumerate(classes)}
    result["Predicted_Bundle_Index"] = result["Predicted_Bundle"].map(class_to_idx)

    # Probabilities
    if hasattr(model, "predict_proba"):
        proba = model.predict_proba(X)
        result["Confidence"] = np.max(proba, axis=1) * 100
        for i, cls in enumerate(classes):
            result[f"prob_{cls}"] = proba[:, i] * 100
    else:
        result["Confidence"] = 100.0  # deterministic models

    logger.info("Predictions complete: %d rows, %d classes", len(result), len(classes))
    return result