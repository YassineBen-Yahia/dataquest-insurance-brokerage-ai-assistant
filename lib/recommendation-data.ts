export interface Client {
  id: string
  type: 'individual' | 'company'
  name: string
  income: number
  employmentStatus?: string
  vehicleType?: string
  riskCategory: string
  coveragePreference: string
  companySize?: number
}

export interface InsuranceCompany {
  id: string
  name: string
  matchScore: number
  riskAlignment: number
  confidenceLevel: number
  rank: number
}

export interface Policy {
  id: string
  name: string
  company: string
  premium: number
  deductible: number
  coverageType: string
  score: number
  rank: number
  coverageStrength: number
  costEfficiency: number
}

export interface DetailedPolicy extends Policy {
  explanation: string
  comparisonVs: {
    policyName: string
    difference: string
  }
  confidenceLevel: number
  riskMatch: number
}

// Mock insurance companies
export const MOCK_COMPANIES: InsuranceCompany[] = [
  { id: '1', name: 'SafeGuard Insurance', matchScore: 95, riskAlignment: 92, confidenceLevel: 98, rank: 1 },
  { id: '2', name: 'ProtectMax', matchScore: 88, riskAlignment: 85, confidenceLevel: 94, rank: 2 },
  { id: '3', name: 'SecureLife', matchScore: 82, riskAlignment: 80, confidenceLevel: 89, rank: 3 },
  { id: '4', name: 'Guardian Plus', matchScore: 78, riskAlignment: 75, confidenceLevel: 85, rank: 4 },
  { id: '5', name: 'Horizon Insurance', matchScore: 72, riskAlignment: 68, confidenceLevel: 80, rank: 5 },
]

// Mock policies
export const MOCK_POLICIES: DetailedPolicy[] = [
  {
    id: '1',
    name: 'Comprehensive Home Shield',
    company: 'SafeGuard Insurance',
    premium: 145,
    deductible: 500,
    coverageType: 'Home',
    score: 96,
    rank: 1,
    coverageStrength: 94,
    costEfficiency: 92,
    explanation: 'This policy offers the best balance between comprehensive coverage and competitive pricing. SafeGuard\'s track record with similar risk profiles shows 99% claim satisfaction rate.',
    comparisonVs: { policyName: 'ProtectMax Home Pro', difference: 'SafeGuard saves $18/month with 5% higher coverage strength' },
    confidenceLevel: 97,
    riskMatch: 95,
  },
  {
    id: '2',
    name: 'Home Pro Plus',
    company: 'ProtectMax',
    premium: 163,
    deductible: 750,
    coverageType: 'Home',
    score: 89,
    rank: 2,
    coverageStrength: 88,
    costEfficiency: 85,
    explanation: 'Strong alternative with excellent coverage limits and 24/7 claims support. Slightly higher premium but includes additional living expenses.',
    comparisonVs: { policyName: 'SecureLife HomeGuard', difference: 'ProtectMax includes emergency accommodation; SecureLife is $35/month cheaper' },
    confidenceLevel: 91,
    riskMatch: 87,
  },
  {
    id: '3',
    name: 'HomeGuard Essential',
    company: 'SecureLife',
    premium: 128,
    deductible: 1000,
    coverageType: 'Home',
    score: 82,
    rank: 3,
    coverageStrength: 78,
    costEfficiency: 88,
    explanation: 'Budget-friendly option with solid core coverage. Best for cost-conscious clients. Lower deductible would improve score significantly.',
    comparisonVs: { policyName: 'Comprehensive Home Shield', difference: 'SecureLife saves $17/month but has lower coverage limits' },
    confidenceLevel: 85,
    riskMatch: 80,
  },
  {
    id: '4',
    name: 'Complete Coverage Plan',
    company: 'Guardian Plus',
    premium: 156,
    deductible: 600,
    coverageType: 'Home + Auto',
    score: 79,
    rank: 4,
    coverageStrength: 82,
    costEfficiency: 76,
    explanation: 'Multi-policy discount opportunity if you need auto coverage. Bundling could provide additional 12% savings.',
    comparisonVs: { policyName: 'Comprehensive Home Shield', difference: 'Guardian Plus bundle potential saves up to $156/year if auto added' },
    confidenceLevel: 82,
    riskMatch: 77,
  },
  {
    id: '5',
    name: 'Value Protection Pack',
    company: 'Horizon Insurance',
    premium: 119,
    deductible: 1500,
    coverageType: 'Home',
    score: 71,
    rank: 5,
    coverageStrength: 68,
    costEfficiency: 85,
    explanation: 'Lowest cost option suitable for specific risk profiles. Requires careful evaluation of deductible impact on actual protection.',
    comparisonVs: { policyName: 'Comprehensive Home Shield', difference: 'Horizon saves $26/month but coverage is 26% lower' },
    confidenceLevel: 76,
    riskMatch: 70,
  },
]

// Sample clients for dropdown
export const SAMPLE_CLIENTS: Client[] = [
  {
    id: 'c1',
    type: 'individual',
    name: 'John Doe',
    income: 75000,
    employmentStatus: 'Employed',
    vehicleType: 'SUV',
    riskCategory: 'Medium',
    coveragePreference: 'Comprehensive',
    companySize: undefined,
  },
  {
    id: 'c2',
    type: 'individual',
    name: 'Jane Smith',
    income: 125000,
    employmentStatus: 'Self-Employed',
    vehicleType: 'Sedan',
    riskCategory: 'Low',
    coveragePreference: 'Full Coverage',
    companySize: undefined,
  },
  {
    id: 'c3',
    type: 'company',
    name: 'Tech Solutions Inc.',
    income: 500000,
    companySize: 25,
    riskCategory: 'Low',
    coveragePreference: 'Comprehensive',
  },
]
