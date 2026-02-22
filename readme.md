# 🛡️ Insurance Brokerage AI Assistant

A full-stack AI-powered platform for insurance brokers. It combines a *Next.js* frontend, two *FastAPI* backends, and an *XGBoost ML pipeline* to predict coverage bundle recommendations, explain predictions with SHAP, and provide real-time MLOps observability.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [1. Backend (Auth + Data API)](#1-backend-auth--data-api)
  - [2. ML Inference Service](#2-ml-inference-service)
  - [3. Frontend (Next.js)](#3-frontend-nextjs)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
  - [Auth & Data API](#auth--data-api-port-8000---backend)
  - [ML Inference API](#ml-inference-api-port-8000---frontend-src)
- [ML Pipeline](#ml-pipeline)
  - [Feature Engineering](#feature-engineering)
  - [Running Batch Inference](#running-batch-inference)
  - [Data Validation](#data-validation)
- [Frontend Pages](#frontend-pages)
- [Tech Stack](#tech-stack)

---

## Architecture Overview

┌─────────────────────────────┐
│       Next.js Frontend      │  :3000
│  (React, Tailwind, Recharts)│
└────────────┬────────────────┘
             │
     ┌───────┴────────┐
     │                │
     ▼                ▼
┌─────────┐    ┌──────────────────┐
│  Auth & │    │  ML Inference &  │
│ Data API│    │  Explainability  │
│(FastAPI)│    │    (FastAPI)     │
│  :8000  │    │     :8000        │
│ backend/│    │ front-end/src/   │
└────┬────┘    └────────┬─────────┘
     │                  │
     ▼                  ▼
┌─────────┐    ┌──────────────────┐
│SQLite DB│    │  XGBoost Model   │
│broker.db│    │  (model.joblib)  │
└─────────┘    └──────────────────┘

There are *two FastAPI services*:

| Service | Location | Purpose |
|---|---|---|
| Auth & Data API | backend/ | User auth (JWT), client CRUD, dashboard stats |
| ML Inference API | front-end/src/main.py | Predictions, SHAP explanations, MLOps metrics |

---

## Project Structure

.
├── backend/                    # Auth & data API
│   ├── app/
│   │   ├── main.py             # FastAPI app + CORS + router registration
│   │   ├── models.py           # SQLAlchemy models (User, Client, BundlePolicy)
│   │   ├── schemas.py          # Pydantic schemas
│   │   ├── auth.py             # JWT + bcrypt password hashing
│   │   ├── database.py         # Async SQLite via aiosqlite
│   │   ├── seed.py             # DB seeder
│   │   └── routers/
│   │       ├── auth.py         # /api/auth — register, login, me
│   │       ├── clients.py      # /api/clients — paginated, filtered client list
│   │       ├── dashboard.py    # /api/dashboard/stats — aggregated KPIs
│   │       └── data.py         # /api/policies — bundle policy list
│   ├── broker.db               # SQLite database (auto-created on startup)
│   └── pyproject.toml
│
├── front-end/                  # Next.js app
│   ├── app/
│   │   └── dashboard/
│   │       ├── ai-classification/   # Coverage bundle classifier UI
│   │       ├── ai-recommendation/   # Policy recommendation UI
│   │       ├── clients/             # Client list & management
│   │       ├── policies/            # Policy browser
│   │       ├── work-tracker/        # Broker work tracker
│   │       ├── settings/            # Settings page
│   │       └── admin/               # Admin panel
│   ├── components/
│   │   ├── classification/     # SHAP waterfall, probability bars, feature importance
│   │   ├── recommendation/     # Policy radar chart, company cards, what-if analysis
│   │   ├── dashboard/          # KPI cards, performance charts, distribution charts
│   │   └── landing/            # Marketing landing page
│   ├── src/
│   │   ├── main.py             # ML Inference FastAPI service
│   │   ├── model.joblib        # Trained XGBoost model
│   │   └── requirements.txt
│   └── data/
│       └── train.csv           # Training dataset
│
└── ml/                         # Standalone ML pipeline
    ├── configs/config.yaml     # Central pipeline config
    ├── pipelines/
    │   ├── inference_pipeline.py   # CSV → validate → features → predict → output CSV
    │   └── batch_pipeline.py       # Chunked batch inference
    ├── src/
    │   ├── model/predictor.py      # Model loading and predict()
    │   └── preprocessing/
    │       ├── feature_engineering.py  # Full feature engineering (~30 derived features)
    │       └── validation.py           # Schema + data quality checks
    └── test/
        └── test_preprocessing.py

---

## Getting Started

### Prerequisites

- *Python* 3.12+ (backend), 3.10+ (ML service)
- *Node.js* 18+ and *pnpm* (or npm)
- *uv* (recommended for backend) — pip install uv

---

### 1. Backend (Auth + Data API)

cd backend

# Install dependencies with uv
uv sync

# Seed the database (loads train.csv into SQLite)
uv run python -m app.seed

# Start the server
uv run uvicorn app.main:app --reload --port 8001

The API will be available at http://localhost:8001. Tables are auto-created on startup.

*Alternatively with pip:*

pip install -r requirements.txt   # or pip install .
uvicorn app.main:app --reload --port 8001

---

### 2. ML Inference Service

cd front-end/src

pip install -r requirements.txt

# MODEL_PATH defaults to ./model.joblib
# If model.joblib is missing, the service runs in mock mode
uvicorn main:app --reload --port 8000

**Note:** If `model.joblib` is not present, all prediction and explanation endpoints return mock/fallback data so the frontend remains fully functional for development.


---

### 3. Frontend (Next.js)

cd front-end

pnpm install        # or npm install

pnpm dev            # starts on http://localhost:3000

---

## Environment Variables

| Variable | Service | Default | Description |
|---|---|---|---|
| MODEL_PATH | ML Service | ./model.joblib | Path to the trained XGBoost model |
| SECRET_KEY | Backend | (see config.py) | JWT signing secret |
| DATABASE_URL | Backend | sqlite+aiosqlite:///./broker.db | Async SQLite connection string |

---

## API Reference

### Auth & Data API (Port 8001 — backend/)

#### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Register a new user (admin or broker role) |
| POST | /api/auth/login | Login — returns JWT access token |
| GET | /api/auth/me | Get current authenticated user |

All protected routes require the header: Authorization: Bearer <token>

#### Clients

| Method | Endpoint | Query Params | Description |
|---|---|---|---|
| GET | /api/clients | skip, limit, region, bundle, employment | Paginated, filtered client list |
| GET | /api/clients/count | — | Total client count |
| GET | /api/clients/{id} | — | Single client by ID |

#### Dashboard

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/dashboard/stats | Aggregated KPIs: total clients, cancellation rate, avg income, and distributions by bundle, region, employment, channel, deductible tier, agency type, and month |

#### Policies

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/policies | List all bundle policies (0–9) |

---

### ML Inference API (Port 8000 — front-end/src/)

#### Prediction

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/predict | Predict coverage bundle (0–9) with class probabilities, confidence %, SHAP values, and latency |
| POST | /api/explain/local | Full SHAP waterfall for a single prediction |
| GET | /api/explain/global | Global feature importance (XGBoost gain/weight/cover) |

**Example /api/predict request body:**

{
  "Estimated_Annual_Income": 75000,
  "Adult_Dependents": 2,
  "Child_Dependents": 1,
  "Infant_Dependents": 0,
  "Previous_Policy_Duration_Months": 24,
  "Days_Since_Quote": 14,
  "Grace_Period_Extensions": 0,
  "Custom_Riders_Requested": 1,
  "Vehicles_on_Policy": 2,
  "Policy_Amendments_Count": 1,
  "Previous_Claims_Filed": 0,
  "Years_Without_Claims": 5,
  "Underwriting_Processing_Days": 3,
  "Region_Code": "R01",
  "Broker_Agency_Type": "Independent",
  "Deductible_Tier": "Tier_2",
  "Acquisition_Channel": "Online",
  "Payment_Schedule": "Monthly",
  "Employment_Status": "Employed",
  "Policy_Start_Month": "March",
  "Broker_ID": null,
  "Employer_ID": 100.0
}

#### Model Info & MLOps

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/model/info | Model type, feature count, parameters, SHAP availability |
| GET | /api/mlops/health | Uptime, model loaded status, avg latency, request count |
| GET | /api/mlops/metrics | Full metrics: latency (avg/min/max/p95), prediction distribution, feedback count |
| POST | /api/mlops/feedback | Submit broker feedback (predicted vs actual bundle, rating 1–5, notes) |

---

## ML Pipeline

### Feature Engineering

The preprocessing pipeline (ml/src/preprocessing/feature_engineering.py) engineers approximately *30 derived features* on top of the 23 raw inputs:

| Category | Features |
|---|---|
| *Family* | Total_Dependents, Has_Children, Family_Size |
| *Income* | Income_Per_Family, Income_Bracket (decile) |
| *Policy history* | Is_New_Policy, Duration_Bucket, Has_Amendments, Has_Grace_Ext |
| *Purchase timing* | Quick_Purchase (≤7 days), Delayed_Purchase (>90 days), Quote_Delay_Bucket |
| *Claims* | Has_Claims, Claims_Per_Year |
| *Policy complexity* | Riders_Plus_Vehicles, Has_Riders, Has_Vehicles |
| *Interactions* | Grace_X_Duration, Amendments_X_Duration |
| *IDs* | Has_Broker, Has_Employer, Broker_ID_freq, Employer_ID_freq |
| *Business rule* | rule_renter_premium → forces bundle class 9 when triggered |

All categorical columns are label-encoded. The same preprocessing logic runs in both the ML service and the standalone pipeline.

### Running Batch Inference

cd ml

python pipelines/inference_pipeline.py \
  --input  data/raw/test.csv \
  --output data/predictions/output.csv \
  --model  path/to/model.joblib

Options:

| Flag | Description |
|---|---|
| --input | Path to raw input CSV (required) |
| --output | Path for predictions output CSV (required) |
| --model | Path to model.joblib (optional, falls back to MODEL_PATH env var) |
| --skip-validation | Bypass schema checks (not recommended in production) |

### Data Validation

The validator (ml/src/preprocessing/validation.py) runs before feature engineering and checks:

- All 23 required columns are present
- DataFrame is not empty
- No duplicate User_ID values (warning)
- No negative values in numeric columns (warning)
- Null rates are within acceptable thresholds for non-nullable columns

A ValidationReport is returned with passed, errors, and warnings. Errors raise a ValueError by default; pass raise_on_error=False to collect errors without raising.

---

## Frontend Pages

| Route | Description |
|---|---|
| / | Landing page with features and demo preview |
| /login | JWT login |
| /signup | User registration |
| /dashboard | KPI overview with charts (bundle distribution, performance, compliance) |
| /dashboard/clients | Paginated client table with region/bundle/employment filters |
| /dashboard/policies | Browse all 10 coverage bundle policies |
| /dashboard/ai-classification | Interactive coverage bundle classifier — input customer data, get prediction with SHAP waterfall and probability distribution |
| /dashboard/ai-recommendation | AI policy recommendation engine with radar chart, what-if analysis, and company cards |
| /dashboard/work-tracker | Broker work and task tracker |
| /dashboard/admin | Admin panel (admin role only) |
| /dashboard/settings | User settings |

---

## Tech Stack

### Backend

| Layer | Technology |
|---|---|
| API framework | FastAPI + Uvicorn |
| ORM | SQLAlchemy 2.0 (async) |
| Database | SQLite via aiosqlite |
| Auth | JWT (python-jose) + bcrypt (passlib) |
| Package manager | uv |

### ML Service

| Layer | Technology |
|---|---|
| API framework | FastAPI + Uvicorn |
| Model | XGBoost (XGBClassifier) |
| Explainability | SHAP (TreeExplainer) |
| Data | Pandas, NumPy, scikit-learn |
| Serialization | joblib |

### Frontend

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| UI components | shadcn/ui + Radix UI |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Animations | Framer Motion |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |