"""Seed the clients table from train.csv."""

import asyncio
import csv
import math
from pathlib import Path

from sqlalchemy import select, func
from app.database import engine, Base, async_session
from app.models import Client

CSV_PATH = Path(__file__).resolve().parents[2] / "front-end" / "data" / "train.csv"

# Map CSV header → Client model field
COLUMN_MAP = {
    "User_ID": "user_id",
    "Policy_Cancelled_Post_Purchase": "policy_cancelled",
    "Policy_Start_Year": "policy_start_year",
    "Policy_Start_Week": "policy_start_week",
    "Policy_Start_Day": "policy_start_day",
    "Grace_Period_Extensions": "grace_period_extensions",
    "Previous_Policy_Duration_Months": "previous_policy_duration_months",
    "Adult_Dependents": "adult_dependents",
    "Child_Dependents": "child_dependents",
    "Infant_Dependents": "infant_dependents",
    "Region_Code": "region_code",
    "Existing_Policyholder": "existing_policyholder",
    "Previous_Claims_Filed": "previous_claims_filed",
    "Years_Without_Claims": "years_without_claims",
    "Policy_Amendments_Count": "policy_amendments_count",
    "Broker_ID": "broker_id",
    "Employer_ID": "employer_id",
    "Underwriting_Processing_Days": "underwriting_processing_days",
    "Vehicles_on_Policy": "vehicles_on_policy",
    "Custom_Riders_Requested": "custom_riders_requested",
    "Broker_Agency_Type": "broker_agency_type",
    "Deductible_Tier": "deductible_tier",
    "Acquisition_Channel": "acquisition_channel",
    "Payment_Schedule": "payment_schedule",
    "Employment_Status": "employment_status",
    "Estimated_Annual_Income": "estimated_annual_income",
    "Days_Since_Quote": "days_since_quote",
    "Policy_Start_Month": "policy_start_month",
    "Purchased_Coverage_Bundle": "purchased_coverage_bundle",
}

INT_FIELDS = {
    "policy_cancelled", "policy_start_year", "policy_start_week",
    "policy_start_day", "grace_period_extensions",
    "previous_policy_duration_months", "adult_dependents",
    "infant_dependents", "existing_policyholder",
    "previous_claims_filed", "years_without_claims",
    "policy_amendments_count", "underwriting_processing_days",
    "vehicles_on_policy", "custom_riders_requested", "days_since_quote",
}

FLOAT_FIELDS = {
    "child_dependents", "broker_id", "employer_id",
    "estimated_annual_income",
}


def _parse_value(field: str, raw: str):
    """Convert a raw CSV string to the correct Python type."""
    if raw == "" or raw is None:
        return None
    if field in INT_FIELDS:
        try:
            return int(float(raw))
        except (ValueError, TypeError):
            return None
    if field in FLOAT_FIELDS:
        try:
            v = float(raw)
            return None if math.isnan(v) else v
        except (ValueError, TypeError):
            return None
    return raw  # string fields


async def seed_clients():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as session:
        count = (await session.execute(select(func.count(Client.id)))).scalar()
        if count and count > 0:
            print(f"Clients table already has {count} rows – skipping.")
            return

        with open(CSV_PATH, newline="", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            batch: list[Client] = []
            total = 0

            for row in reader:
                kwargs = {}
                for csv_col, model_field in COLUMN_MAP.items():
                    kwargs[model_field] = _parse_value(model_field, row.get(csv_col, ""))
                batch.append(Client(**kwargs))
                total += 1

                # flush every 5 000 rows to keep memory low
                if len(batch) >= 5000:
                    session.add_all(batch)
                    await session.flush()
                    batch.clear()
                    print(f"  ... flushed {total} rows")

            if batch:
                session.add_all(batch)

            await session.commit()
            print(f"Seeded {total} clients from train.csv.")


if __name__ == "__main__":
    asyncio.run(seed_clients())
