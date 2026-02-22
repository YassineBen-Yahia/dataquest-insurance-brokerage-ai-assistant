import { Client, Policy, DetailedPolicy } from './recommendation-data'

// Adjust policy rankings based on client profile
export const adjustPoliciesForClient = (
  policies: DetailedPolicy[],
  client: Client,
  adjustments: { incomeMultiplier: number; companySizeMultiplier: number; claimFrequencyMultiplier: number } = {
    incomeMultiplier: 1,
    companySizeMultiplier: 1,
    claimFrequencyMultiplier: 1,
  }
): DetailedPolicy[] => {
  return policies
    .map((policy) => {
      let scoreAdjustment = 0

      // Income-based adjustment
      if (client.type === 'individual') {
        if (client.income < 50000 && policy.premium > 150) {
          scoreAdjustment -= 5 * adjustments.incomeMultiplier
        } else if (client.income > 150000 && policy.coverageStrength < 85) {
          scoreAdjustment -= 3 * adjustments.incomeMultiplier
        }
      }

      // Company size adjustment
      if (client.type === 'company' && client.companySize) {
        if (client.companySize > 50 && policy.coverageType === 'Home') {
          scoreAdjustment -= 10 * adjustments.companySizeMultiplier
        }
      }

      // Coverage preference alignment
      if (client.coveragePreference === 'Full Coverage' && policy.coverageStrength < 85) {
        scoreAdjustment -= 5
      }

      const newScore = Math.max(0, Math.min(100, policy.score + scoreAdjustment))

      return {
        ...policy,
        score: newScore,
      }
    })
    .sort((a, b) => b.score - a.score)
    .map((policy, index) => ({
      ...policy,
      rank: index + 1,
    }))
}

// Generate What If analysis message
export const generateWhatIfMessage = (
  originalRank: number,
  newRank: number,
  policyName: string,
  adjustmentType: string,
  adjustmentValue: number
): string => {
  if (newRank === originalRank) {
    return `${policyName} remains at rank #${newRank}`
  }

  if (newRank < originalRank) {
    return `If ${adjustmentType} increases by ${adjustmentValue}%, ${policyName} moves up to rank #${newRank}`
  } else {
    return `If ${adjustmentType} increases by ${adjustmentValue}%, ${policyName} moves down to rank #${newRank}`
  }
}

// Calculate percentage change
export const calculatePercentageChange = (original: number, adjusted: number): number => {
  return ((adjusted - original) / original) * 100
}

// Format currency
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

// Format percentage
export const formatPercentage = (value: number): string => {
  return `${Math.round(value)}%`
}
