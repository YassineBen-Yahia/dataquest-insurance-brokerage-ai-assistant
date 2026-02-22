from pydantic import BaseModel


# ── Auth ────────────────────────────────────────────────────────────
class UserCreate(BaseModel):
    email: str
    name: str
    password: str
    role: str = "broker"


class UserLogin(BaseModel):
    email: str
    password: str


class UserOut(BaseModel):
    id: int
    email: str
    name: str
    role: str
    is_active: bool

    model_config = {"from_attributes": True}


class Token(BaseModel):
    access_token: str
    user: UserOut


# ── Clients ─────────────────────────────────────────────────────────
class ClientOut(BaseModel):
    id: int
    user_id: str | None = None
    policy_cancelled: int | None = None
    policy_start_year: int | None = None
    policy_start_week: int | None = None
    policy_start_day: int | None = None
    grace_period_extensions: int | None = None
    previous_policy_duration_months: int | None = None
    adult_dependents: int | None = None
    child_dependents: float | None = None
    infant_dependents: int | None = None
    region_code: str | None = None
    existing_policyholder: int | None = None
    previous_claims_filed: int | None = None
    years_without_claims: int | None = None
    policy_amendments_count: int | None = None
    broker_id: float | None = None
    employer_id: float | None = None
    underwriting_processing_days: int | None = None
    vehicles_on_policy: int | None = None
    custom_riders_requested: int | None = None
    broker_agency_type: str | None = None
    deductible_tier: str | None = None
    acquisition_channel: str | None = None
    payment_schedule: str | None = None
    employment_status: str | None = None
    estimated_annual_income: float | None = None
    days_since_quote: int | None = None
    policy_start_month: str | None = None
    purchased_coverage_bundle: str | None = None

    model_config = {"from_attributes": True}


# ── Dashboard ───────────────────────────────────────────────────────
class DashboardStats(BaseModel):
    total_clients: int
    total_cancelled: int
    total_active: int
    cancellation_rate: float
    avg_income: float
    bundle_distribution: dict[str, int]
    region_distribution: dict[str, int]
    employment_distribution: dict[str, int]
    agency_type_distribution: dict[str, int]
    monthly_distribution: dict[str, int]
    channel_distribution: dict[str, int]
    deductible_distribution: dict[str, int]


# ── Policies ────────────────────────────────────────────────────────
class BundlePolicyOut(BaseModel):
    id: int
    bundle_name: str
    description: str

    model_config = {"from_attributes": True}
