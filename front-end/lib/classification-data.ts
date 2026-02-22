// ─── Types matching the real ML API response ─────────────────────────────────

export interface FeatureExplanation {
  feature: string
  shap_value: number
}

export interface SinglePredictionResult {
  predicted_bundle: string
  predicted_index: number
  confidence: number                             // 0–100
  class_probabilities: Record<string, number>    // class → probability (0–100)
  feature_explanations: FeatureExplanation[]
  base_value: number
}

export interface BatchPredictionRow {
  row_index: number
  user_id: string
  predicted_bundle: string
  confidence: number
  class_probabilities: Record<string, number>
}

export interface BatchPredictionResult {
  total_rows: number
  predictions: BatchPredictionRow[]
  summary: {
    bundle_distribution: Record<string, number>
    avg_confidence: number
    min_confidence: number
    max_confidence: number
  }
  global_importances?: Record<string, number>
}

// ─── Single prediction input (raw column values for train.csv schema) ────────

export interface SinglePredictionInput {
  User_ID: string
  Policy_Cancelled_Post_Purchase: number
  Policy_Start_Year: number
  Policy_Start_Week: number
  Policy_Start_Day: number
  Grace_Period_Extensions: number
  Previous_Policy_Duration_Months: number
  Adult_Dependents: number
  Child_Dependents: number | null
  Infant_Dependents: number
  Region_Code: string
  Existing_Policyholder: number
  Previous_Claims_Filed: number
  Years_Without_Claims: number
  Policy_Amendments_Count: number
  Broker_ID: number | null
  Employer_ID: number | null
  Underwriting_Processing_Days: number
  Vehicles_on_Policy: number
  Custom_Riders_Requested: number
  Broker_Agency_Type: string
  Deductible_Tier: string
  Acquisition_Channel: string
  Payment_Schedule: string
  Employment_Status: string
  Estimated_Annual_Income: number
  Days_Since_Quote: number
  Policy_Start_Month: string
}

// ─── Bundle display metadata ─────────────────────────────────────────────────

export interface BundleDisplayInfo {
  name: string
  color: string
  icon: string
}

export const BUNDLE_DISPLAY: Record<string, BundleDisplayInfo> = {
  Auto_Comprehensive:    { name: 'Auto Comprehensive',    color: '#3b82f6', icon: '🚗' },
  Auto_Liability_Basic:  { name: 'Auto Liability Basic',  color: '#6366f1', icon: '🛡️' },
  Basic_Health:          { name: 'Basic Health',           color: '#10b981', icon: '💊' },
  Family_Comprehensive:  { name: 'Family Comprehensive',  color: '#8b5cf6', icon: '👨‍👩‍👧‍👦' },
  Health_Dental_Vision:  { name: 'Health Dental Vision',   color: '#14b8a6', icon: '🦷' },
  Home_Premium:          { name: 'Home Premium',           color: '#f59e0b', icon: '🏠' },
  Home_Standard:         { name: 'Home Standard',          color: '#f97316', icon: '🏡' },
  Premium_Health_Life:   { name: 'Premium Health + Life',  color: '#ec4899', icon: '❤️' },
  Renter_Basic:          { name: 'Renter Basic',           color: '#64748b', icon: '🏢' },
  Renter_Premium:        { name: 'Renter Premium',         color: '#06b6d4', icon: '🏙️' },
}

export const CLASS_ORDER = [
  'Auto_Comprehensive',
  'Auto_Liability_Basic',
  'Basic_Health',
  'Family_Comprehensive',
  'Health_Dental_Vision',
  'Home_Premium',
  'Home_Standard',
  'Premium_Health_Life',
  'Renter_Basic',
  'Renter_Premium',
]

// Dropdown options matching train.csv categorical values
export const CATEGORICAL_OPTIONS = {
  Region_Code: ['USA', 'GBR', 'FRA', 'DEU', 'ESP', 'ITA', 'AUS', 'BRA', 'IND', 'CHN', 'JPN', 'KOR', 'AUT', 'PRT', 'IRL', 'BEL', 'COL', 'ECU', 'SWE', 'AGO', 'NLD', 'DNK', 'MAR', 'CHE', 'ARG', 'CHL'],
  Broker_Agency_Type: ['Urban_Boutique', 'National_Corporate'],
  Deductible_Tier: ['Tier_1_High_Ded', 'Tier_2_Mid_Ded', 'Tier_3_Low_Ded', 'Tier_4_Zero_Ded'],
  Acquisition_Channel: ['Direct_Website', 'Aggregator_Site', 'Local_Broker', 'Corporate_Partner', 'Affiliate_Group'],
  Payment_Schedule: ['Monthly_EFT', 'Annual_Upfront', 'Quarterly_Invoice'],
  Employment_Status: ['Employed_FullTime', 'Self_Employed', 'Contractor', 'Unemployed'],
  Policy_Start_Month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
}

export function getDefaultSingleInput(): SinglePredictionInput {
  return {
    User_ID: 'SINGLE_INPUT',
    Policy_Cancelled_Post_Purchase: 0,
    Policy_Start_Year: 2024,
    Policy_Start_Week: 1,
    Policy_Start_Day: 1,
    Grace_Period_Extensions: 0,
    Previous_Policy_Duration_Months: 12,
    Adult_Dependents: 1,
    Child_Dependents: 0,
    Infant_Dependents: 0,
    Region_Code: 'USA',
    Existing_Policyholder: 0,
    Previous_Claims_Filed: 0,
    Years_Without_Claims: 2,
    Policy_Amendments_Count: 0,
    Broker_ID: null,
    Employer_ID: null,
    Underwriting_Processing_Days: 5,
    Vehicles_on_Policy: 1,
    Custom_Riders_Requested: 0,
    Broker_Agency_Type: 'Urban_Boutique',
    Deductible_Tier: 'Tier_2_Mid_Ded',
    Acquisition_Channel: 'Direct_Website',
    Payment_Schedule: 'Monthly_EFT',
    Employment_Status: 'Employed_FullTime',
    Estimated_Annual_Income: 60000,
    Days_Since_Quote: 14,
    Policy_Start_Month: 'January',
  }
}
