from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import math
import os

app = FastAPI()

# Allow CORS for Next.js app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")

def clean_data(df):
    """Convert float NaN to None for JSON serialization compatibility."""
    # Replace NaN with explicitly None
    df = df.replace({float("nan"): None})
    return df.to_dict(orient="records")

@app.get("/api/clients")
def get_clients():
    file_path = os.path.join(DATA_DIR, "CLIENTS.csv")
    try:
        df = pd.read_csv(file_path)
        return clean_data(df)
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/policies")
def get_policies():
    file_path = os.path.join(DATA_DIR, "POLICIES.csv")
    try:
        df = pd.read_csv(file_path)
        return clean_data(df)
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/insurance-companies")
def get_insurance_companies():
    file_path = os.path.join(DATA_DIR, "INSURANCE_COMPANIES.csv")
    try:
        df = pd.read_csv(file_path)
        return clean_data(df)
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
