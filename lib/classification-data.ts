// ─── Customer profile used as model input ─────────────────────────────────────

export interface CustomerProfile {
  id: string
  name: string
  age: number
  gender: 'Male' | 'Female' | 'Other'
  maritalStatus: 'Single' | 'Married' | 'Divorced' | 'Widowed'
  annualIncome: number
  employmentStatus: 'Employed' | 'Self-Employed' | 'Unemployed' | 'Retired'
  numDependents: number
  educationLevel: 'High School' | "Bachelor's" | "Master's" | 'PhD'
  propertyOwnership: 'Renter' | 'Homeowner'
  vehicleType: 'None' | 'Sedan' | 'SUV' | 'Truck' | 'Luxury'
  priorClaimsCount: number
  region: 'North' | 'South' | 'East' | 'West'
}

// ─── Classification output ─────────────────────────────────────────────────────

export interface PredictionResult {
  predictedBundle: number                   // 0–9
  confidence: number                        // 0–100
  classProbabilities: number[]              // length 10, values 0–100
  bundleInfo: BundleInfo
}

// ─── Bundle catalogue ──────────────────────────────────────────────────────────

export interface BundleInfo {
  id: number
  name: string
  tier: 'Basic' | 'Standard' | 'Premium' | 'Enterprise'
  description: string
  typicalProfile: string
  coverages: string[]
  monthlyPremiumRange: [number, number]     // [min, max] in USD
  color: string                             // Tailwind color token for accents
}

export const BUNDLE_INFO: BundleInfo[] = [
  {
    id: 0,
    name: 'Liability Only',
    tier: 'Basic',
    description: 'Minimum legally required coverage — ideal for low-risk, cost-aware customers.',
    typicalProfile: 'Young renter, entry-level income, no dependents',
    coverages: ['Third-Party Liability'],
    monthlyPremiumRange: [18, 35],
    color: 'slate',
  },
  {
    id: 1,
    name: 'Essential Auto',
    tier: 'Basic',
    description: 'Core personal auto protection covering own-damage and liability.',
    typicalProfile: 'Single driver, moderate income, urban area',
    coverages: ['Auto Liability', 'Collision', 'Uninsured Motorist'],
    monthlyPremiumRange: [45, 80],
    color: 'blue',
  },
  {
    id: 2,
    name: 'Home + Auto Starter',
    tier: 'Standard',
    description: 'Entry-level bundled home and auto — popular with first-time homeowners.',
    typicalProfile: 'Married couple, new homeowner, one vehicle',
    coverages: ['Dwelling Protection', 'Auto Liability', 'Collision', 'Personal Property'],
    monthlyPremiumRange: [95, 150],
    color: 'cyan',
  },
  {
    id: 3,
    name: 'Comprehensive Home',
    tier: 'Standard',
    description: 'Broad home coverage with liability extension — no auto component.',
    typicalProfile: 'Homeowner, low vehicle usage, suburban',
    coverages: ['Dwelling Protection', 'Personal Liability', 'Loss of Use', 'Personal Property'],
    monthlyPremiumRange: [85, 140],
    color: 'teal',
  },
  {
    id: 4,
    name: 'Life + Health Basic',
    tier: 'Standard',
    description: 'Term life and basic health coverage packaged for individuals and small families.',
    typicalProfile: 'Married with dependents, age 30–45, employee benefits gap',
    coverages: ['Term Life ($250k)', 'Major Medical', 'Prescription Coverage'],
    monthlyPremiumRange: [110, 190],
    color: 'violet',
  },
  {
    id: 5,
    name: 'Full Auto + Home',
    tier: 'Premium',
    description: 'Comprehensive bundled coverage for property and vehicles with roadside assistance.',
    typicalProfile: 'Homeowner with 2 vehicles, families, mid-to-high income',
    coverages: ['Full Collision & Comp', 'Dwelling + Contents', 'Roadside Assist', 'Rental Reimbursement'],
    monthlyPremiumRange: [180, 280],
    color: 'indigo',
  },
  {
    id: 6,
    name: 'Business Protection Basic',
    tier: 'Standard',
    description: 'Starter commercial coverage for small business owners and freelancers.',
    typicalProfile: 'Self-employed, 1–10 employees, home-based or small office',
    coverages: ['General Liability', 'BOP Property', 'Professional Liability'],
    monthlyPremiumRange: [160, 260],
    color: 'amber',
  },
  {
    id: 7,
    name: 'Premium All-Coverage',
    tier: 'Premium',
    description: 'Holistic personal protection: home, auto, life, and health in one plan.',
    typicalProfile: 'High-income family, homeowner, multiple vehicles',
    coverages: ['Full Auto', 'Home Comprehensive', 'Term Life ($500k)', 'Major Medical', 'Umbrella Liability'],
    monthlyPremiumRange: [320, 480],
    color: 'purple',
  },
  {
    id: 8,
    name: 'Enterprise Protection Suite',
    tier: 'Enterprise',
    description: 'Mid-to-large business coverage with cyber, D&O, and commercial property.',
    typicalProfile: 'Business owner 10–100 employees, high-value assets',
    coverages: ['Commercial General Liability', 'Directors & Officers', 'Cyber Liability', 'Commercial Property', 'Workers Comp'],
    monthlyPremiumRange: [500, 900],
    color: 'rose',
  },
  {
    id: 9,
    name: 'Ultra-Premium Complete',
    tier: 'Enterprise',
    description: 'Market-leading blanket coverage for high-net-worth individuals and large enterprises.',
    typicalProfile: 'Ultra-high-net-worth individual or Fortune-500-adjacent business',
    coverages: ['Whole Life ($2M+)', 'Excess Liability', 'Fine Art & Collectibles', 'Private Aviation', 'Global Health', 'Commercial Fleet'],
    monthlyPremiumRange: [1200, 3500],
    color: 'emerald',
  },
]

// ─── Sample customer profiles for demo ────────────────────────────────────────

export const SAMPLE_CUSTOMERS: CustomerProfile[] = [
  {
    id: 'c1',
    name: 'Alex Rivera',
    age: 28,
    gender: 'Male',
    maritalStatus: 'Single',
    annualIncome: 48000,
    employmentStatus: 'Employed',
    numDependents: 0,
    educationLevel: "Bachelor's",
    propertyOwnership: 'Renter',
    vehicleType: 'Sedan',
    priorClaimsCount: 0,
    region: 'West',
  },
  {
    id: 'c2',
    name: 'Sarah Chen',
    age: 38,
    gender: 'Female',
    maritalStatus: 'Married',
    annualIncome: 112000,
    employmentStatus: 'Employed',
    numDependents: 2,
    educationLevel: "Master's",
    propertyOwnership: 'Homeowner',
    vehicleType: 'SUV',
    priorClaimsCount: 1,
    region: 'East',
  },
  {
    id: 'c3',
    name: 'Marcus Johnson',
    age: 52,
    gender: 'Male',
    maritalStatus: 'Married',
    annualIncome: 240000,
    employmentStatus: 'Self-Employed',
    numDependents: 3,
    educationLevel: "Master's",
    propertyOwnership: 'Homeowner',
    vehicleType: 'Luxury',
    priorClaimsCount: 2,
    region: 'South',
  },
  {
    id: 'c4',
    name: 'Priya Patel',
    age: 44,
    gender: 'Female',
    maritalStatus: 'Divorced',
    annualIncome: 78000,
    employmentStatus: 'Employed',
    numDependents: 1,
    educationLevel: "Bachelor's",
    propertyOwnership: 'Homeowner',
    vehicleType: 'Sedan',
    priorClaimsCount: 0,
    region: 'North',
  },
]

// ─── Deterministic mock prediction engine ─────────────────────────────────────
// In production this calls your ML model API endpoint.

export function predictBundle(customer: CustomerProfile): PredictionResult {
  // Heuristic scoring per bundle (sum → normalize to probabilities)
  const raw = Array(10).fill(0) as number[]

  // Rough feature-driven signal
  const incomeScore = Math.log10(Math.max(customer.annualIncome, 1000)) / Math.log10(300000)
  const ageScore = customer.age / 65
  const dependentsBoost = customer.numDependents > 0 ? 1.2 : 1.0
  const isHomeowner = customer.propertyOwnership === 'Homeowner'
  const hasCar = customer.vehicleType !== 'None'
  const isBusiness = customer.employmentStatus === 'Self-Employed'
  const isHighIncome = customer.annualIncome > 150000
  const isVeryHighIncome = customer.annualIncome > 300000

  raw[0] += (1 - incomeScore) * 2 + (customer.priorClaimsCount === 0 ? 0.5 : 0)
  raw[1] += hasCar ? 1.5 * (1 - incomeScore * 0.5) : 0
  raw[2] += isHomeowner && hasCar && !isHighIncome ? 2.0 * dependentsBoost : 0
  raw[3] += isHomeowner && !hasCar ? 1.8 : 0
  raw[4] += customer.numDependents >= 1 && ageScore > 0.4 && ageScore < 0.75 ? 2.0 : 0
  raw[5] += isHomeowner && hasCar && incomeScore > 0.5 ? 2.5 * dependentsBoost : 0
  raw[6] += isBusiness && !isHighIncome ? 2.2 : 0
  raw[7] += isHighIncome && isHomeowner && hasCar ? 2.8 * (customer.numDependents > 0 ? 1.3 : 1.0) : 0
  raw[8] += isBusiness && isHighIncome ? 2.5 : 0
  raw[9] += isVeryHighIncome ? 3.0 : 0

  // Add slight noise for realism
  const noisy = raw.map((v, i) => Math.max(0.05, v + (i % 3 === 0 ? 0.1 : 0.05)))

  const total = noisy.reduce((a, b) => a + b, 0)
  const probabilities = noisy.map((v) => Math.round((v / total) * 100))

  // Fix rounding so sum = 100
  const sum = probabilities.reduce((a, b) => a + b, 0)
  probabilities[probabilities.indexOf(Math.max(...probabilities))] += 100 - sum

  const predictedBundle = probabilities.indexOf(Math.max(...probabilities))
  const confidence = probabilities[predictedBundle]

  return {
    predictedBundle,
    confidence,
    classProbabilities: probabilities,
    bundleInfo: BUNDLE_INFO[predictedBundle],
  }
}
