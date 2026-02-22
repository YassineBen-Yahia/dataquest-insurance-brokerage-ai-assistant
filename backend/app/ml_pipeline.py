"""
ml_pipeline.py
--------------
Thin wrapper that integrates the project's ``ml/`` pipeline
(validation → feature engineering → prediction) into the FastAPI backend.

Loaded once at startup; exposes ``predict_single`` and ``predict_batch``.
"""

from __future__ import annotations

import sys
import logging
from pathlib import Path

import numpy as np
import pandas as pd
import xgboost as xgb

# Add the ml/ project root so we can import its modules
_ML_ROOT = str(Path(__file__).resolve().parent.parent.parent / "ml")
if _ML_ROOT not in sys.path:
    sys.path.insert(0, _ML_ROOT)

from src.preprocessing.validation import validate        # noqa: E402
from src.preprocessing.feature_engineering import preprocess  # noqa: E402
from src.model.predictor import load_model                # noqa: E402

logger = logging.getLogger(__name__)

# Path to the trained model
_MODEL_PATH = str(
    Path(__file__).resolve().parent.parent.parent / "front-end" / "src" / "model.joblib"
)

# The LabelEncoder sorted the target alphabetically → this is the mapping
CLASS_NAMES = [
    "Auto_Comprehensive",
    "Auto_Liability_Basic",
    "Basic_Health",
    "Family_Comprehensive",
    "Health_Dental_Vision",
    "Home_Premium",
    "Home_Standard",
    "Premium_Health_Life",
    "Renter_Basic",
    "Renter_Premium",
]


class ClassificationService:
    """Singleton service wrapping the ML pipeline."""

    def __init__(self):
        self.model = None
        self.class_names: list[str] = CLASS_NAMES
        self.feature_names: list[str] = []
        self.global_importances: dict[str, float] = {}

    # ── startup ───────────────────────────────────────────────────────────

    def load(self) -> None:
        """Load model. Call once at app startup."""
        logger.info("Loading model from %s …", _MODEL_PATH)
        self.model = load_model(_MODEL_PATH)

        if hasattr(self.model, "feature_names_in_"):
            self.feature_names = [str(f) for f in self.model.feature_names_in_]
        else:
            self.feature_names = []

        # Pre-compute global feature importances
        if hasattr(self.model, "feature_importances_"):
            imp = self.model.feature_importances_
            self.global_importances = {
                fname: round(float(v), 5)
                for fname, v in zip(self.feature_names, imp)
            }

        logger.info("ClassificationService ready — %d features, %d classes.",
                     len(self.feature_names), len(self.class_names))

    @property
    def is_ready(self) -> bool:
        return self.model is not None

    # ── helpers ───────────────────────────────────────────────────────────

    def _run_pipeline(self, df_raw: pd.DataFrame) -> pd.DataFrame:
        """Validate → feature-engineer → return feature DataFrame."""
        validate(df_raw, raise_on_error=True)
        return preprocess(df_raw)

    def _get_feature_matrix(self, df_feat: pd.DataFrame) -> pd.DataFrame:
        """Drop ID / target columns and return the feature matrix.

        Also coerces every column to a numeric dtype as a safety net and
        reorders columns to match the model's training order.
        """
        drop_cols = [c for c in ["User_ID", "Purchased_Coverage_Bundle"]
                     if c in df_feat.columns]
        X = df_feat.drop(columns=drop_cols)
        # Ensure all columns are numeric (XGBoost requires int/float/bool)
        obj_cols = X.select_dtypes(include=["object"]).columns
        if len(obj_cols):
            logger.debug("Coercing object columns to numeric: %s", list(obj_cols))
            X[obj_cols] = X[obj_cols].apply(pd.to_numeric, errors="coerce").fillna(0)
        # Reorder columns to match model training order
        if self.feature_names:
            X = X[self.feature_names]
        return X

    def _compute_shap(self, X: pd.DataFrame, pred_idx: int) -> list[dict]:
        """Use XGBoost native SHAP (pred_contribs) for the predicted class."""
        try:
            booster = self.model.get_booster()
            dm = xgb.DMatrix(X, feature_names=list(X.columns))
            # pred_contribs returns shape (n_samples, n_features+1) for binary
            # or (n_samples, n_classes * (n_features+1)) for multiclass
            contribs = booster.predict(dm, pred_contribs=True)

            n_features = X.shape[1]
            n_classes = len(self.class_names)

            if contribs.ndim == 2 and contribs.shape[1] == n_classes * (n_features + 1):
                # Multi-class: reshape to (n_samples, n_classes, n_features+1)
                contribs = contribs.reshape(-1, n_classes, n_features + 1)
                sv = contribs[0, pred_idx, :-1]  # drop bias term
                base_value = float(contribs[0, pred_idx, -1])
            elif contribs.ndim == 3:
                sv = contribs[0, pred_idx, :-1]
                base_value = float(contribs[0, pred_idx, -1])
            else:
                sv = contribs[0, :-1]
                base_value = float(contribs[0, -1])

            feature_names = list(X.columns)
            explanations = [
                {"feature": fname, "shap_value": round(float(v), 5)}
                for fname, v in zip(feature_names, sv)
            ]
            explanations.sort(key=lambda x: abs(x["shap_value"]), reverse=True)
            return explanations, round(base_value, 5)
        except Exception as exc:
            logger.warning("SHAP computation failed, using feature importances: %s", exc)
            # Fallback: return global feature importances as proxy
            explanations = [
                {"feature": k, "shap_value": v}
                for k, v in sorted(
                    self.global_importances.items(),
                    key=lambda x: abs(x[1]), reverse=True
                )
            ]
            return explanations, 0.0

    # ── single prediction ─────────────────────────────────────────────────

    def predict_single(self, row: dict) -> dict:
        """
        Full pipeline for **one** client row (raw column values).
        Returns prediction, probabilities and SHAP explanations.
        """
        df_raw = pd.DataFrame([row])
        df_feat = self._run_pipeline(df_raw)
        X = self._get_feature_matrix(df_feat)

        proba = self.model.predict_proba(X)[0]
        pred_idx = int(np.argmax(proba))
        pred_label = self.class_names[pred_idx]

        # SHAP explanations
        explanations, base_value = self._compute_shap(X, pred_idx)

        return {
            "predicted_bundle": pred_label,
            "predicted_index": pred_idx,
            "confidence": round(float(proba[pred_idx]) * 100, 2),
            "class_probabilities": {
                cls: round(float(p) * 100, 2)
                for cls, p in zip(self.class_names, proba)
            },
            "feature_explanations": explanations,
            "base_value": base_value,
        }

    # ── batch prediction ──────────────────────────────────────────────────

    def predict_batch(self, df_raw: pd.DataFrame) -> dict:
        """
        Full pipeline for a CSV batch.
        Returns per-row predictions + aggregate summary.
        """
        df_feat = self._run_pipeline(df_raw)
        X = self._get_feature_matrix(df_feat)
        user_ids = (
            df_raw["User_ID"].tolist()
            if "User_ID" in df_raw.columns
            else list(range(len(df_raw)))
        )

        proba = self.model.predict_proba(X)
        preds = np.argmax(proba, axis=1)
        confidences = np.max(proba, axis=1) * 100

        results = []
        for i in range(len(df_raw)):
            pred_label = self.class_names[int(preds[i])]
            row_proba = {
                cls: round(float(p) * 100, 2)
                for cls, p in zip(self.class_names, proba[i])
            }
            results.append({
                "row_index": i,
                "user_id": str(user_ids[i]),
                "predicted_bundle": pred_label,
                "confidence": round(float(confidences[i]), 2),
                "class_probabilities": row_proba,
            })

        # aggregate
        bundle_counts: dict[str, int] = {}
        for r in results:
            b = r["predicted_bundle"]
            bundle_counts[b] = bundle_counts.get(b, 0) + 1

        return {
            "total_rows": len(results),
            "predictions": results,
            "summary": {
                "bundle_distribution": bundle_counts,
                "avg_confidence": round(float(np.mean(confidences)), 2),
                "min_confidence": round(float(np.min(confidences)), 2),
                "max_confidence": round(float(np.max(confidences)), 2),
            },
            "global_importances": self.global_importances,
        }


# ── Module-level singleton ────────────────────────────────────────────────────
classification_service = ClassificationService()
