'use client'

import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { DetailedPolicy } from '@/lib/recommendation-data'
import { adjustPoliciesForClient, generateWhatIfMessage } from '@/lib/recommendation-utils'

interface WhatIfAnalysisProps {
  originalPolicies: DetailedPolicy[]
  onPoliciesChange: (policies: DetailedPolicy[]) => void
}

export function WhatIfAnalysis({ originalPolicies, onPoliciesChange }: WhatIfAnalysisProps) {
  const [incomeAdjustment, setIncomeAdjustment] = useState(0)
  const [companySizeAdjustment, setCompanySizeAdjustment] = useState(0)
  const [claimFrequencyAdjustment, setClaimFrequencyAdjustment] = useState(0)

  const handleAdjustment = useCallback(() => {
    const incomeMultiplier = 1 + incomeAdjustment / 100
    const companySizeMultiplier = 1 + companySizeAdjustment / 100
    const claimFrequencyMultiplier = 1 + claimFrequencyAdjustment / 100

    const adjustments = {
      incomeMultiplier,
      companySizeMultiplier,
      claimFrequencyMultiplier,
    }

    // For demo purposes, we'll just update the scores based on multipliers
    const adjustedPolicies = originalPolicies
      .map((policy) => {
        let scoreAdjustment = 0

        // Income adjustment affects cost efficiency
        scoreAdjustment += incomeAdjustment * 0.3

        // Company size affects coverage needs
        scoreAdjustment += companySizeAdjustment * 0.2

        // Claim frequency affects risk alignment
        scoreAdjustment -= claimFrequencyAdjustment * 0.4

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

    onPoliciesChange(adjustedPolicies)
  }, [incomeAdjustment, companySizeAdjustment, claimFrequencyAdjustment, originalPolicies, onPoliciesChange])

  // Call adjustment when any slider changes
  React.useEffect(() => {
    handleAdjustment()
  }, [incomeAdjustment, companySizeAdjustment, claimFrequencyAdjustment])

  const getAdjustmentMessage = (adjustment: number, label: string): string => {
    if (adjustment === 0) return `${label} stays the same`
    if (adjustment > 0) return `${label} increases by ${Math.abs(adjustment)}%`
    return `${label} decreases by ${Math.abs(adjustment)}%`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-card border border-border rounded-lg p-8"
    >
      <div className="mb-8">
        <h3 className="text-xl font-bold text-foreground mb-2">What If Analysis</h3>
        <p className="text-sm text-muted-foreground">Adjust parameters to see how rankings change in real-time</p>
      </div>

      <div className="space-y-8">
        {/* Income Adjustment */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-accent/5 rounded-lg p-6 border border-border"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-semibold text-foreground text-sm">Income Adjustment</h4>
              <p className="text-xs text-muted-foreground mt-1">Affects cost efficiency and coverage options</p>
            </div>
            <motion.div
              animate={{ scale: incomeAdjustment !== 0 ? 1.05 : 1 }}
              className="bg-primary/10 border border-primary/20 rounded px-3 py-1"
            >
              <span className="text-sm font-bold text-primary">{incomeAdjustment > 0 ? '+' : ''}{incomeAdjustment}%</span>
            </motion.div>
          </div>
          <input
            type="range"
            min="-10"
            max="10"
            value={incomeAdjustment}
            onChange={(e) => setIncomeAdjustment(Number(e.target.value))}
            className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <p className="text-xs text-muted-foreground mt-3">{getAdjustmentMessage(incomeAdjustment, 'Income')}</p>
        </motion.div>

        {/* Company Size Adjustment */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-accent/5 rounded-lg p-6 border border-border"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-semibold text-foreground text-sm">Company Size Adjustment</h4>
              <p className="text-xs text-muted-foreground mt-1">Impacts coverage scope and premium rates</p>
            </div>
            <motion.div
              animate={{ scale: companySizeAdjustment !== 0 ? 1.05 : 1 }}
              className="bg-accent/10 border border-accent/20 rounded px-3 py-1"
            >
              <span className="text-sm font-bold text-accent">
                {companySizeAdjustment > 0 ? '+' : ''}
                {companySizeAdjustment}%
              </span>
            </motion.div>
          </div>
          <input
            type="range"
            min="-5"
            max="5"
            value={companySizeAdjustment}
            onChange={(e) => setCompanySizeAdjustment(Number(e.target.value))}
            className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-accent"
          />
          <p className="text-xs text-muted-foreground mt-3">{getAdjustmentMessage(companySizeAdjustment, 'Company size')}</p>
        </motion.div>

        {/* Claim Frequency Adjustment */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-accent/5 rounded-lg p-6 border border-border"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-semibold text-foreground text-sm">Claim Frequency Adjustment</h4>
              <p className="text-xs text-muted-foreground mt-1">Affects risk profile and premium calculations</p>
            </div>
            <motion.div
              animate={{ scale: claimFrequencyAdjustment !== 0 ? 1.05 : 1 }}
              className="bg-emerald-500/10 border border-emerald-500/20 rounded px-3 py-1"
            >
              <span className="text-sm font-bold text-emerald-500">
                {claimFrequencyAdjustment > 0 ? '+' : ''}
                {claimFrequencyAdjustment}%
              </span>
            </motion.div>
          </div>
          <input
            type="range"
            min="-10"
            max="10"
            value={claimFrequencyAdjustment}
            onChange={(e) => setClaimFrequencyAdjustment(Number(e.target.value))}
            className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <p className="text-xs text-muted-foreground mt-3">
            {getAdjustmentMessage(claimFrequencyAdjustment, 'Claim frequency')}
          </p>
        </motion.div>
      </div>

      {/* Active Adjustments Summary */}
      {(incomeAdjustment !== 0 || companySizeAdjustment !== 0 || claimFrequencyAdjustment !== 0) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-4 bg-primary/10 border border-primary/20 rounded-lg"
        >
          <p className="text-sm text-primary">
            <span className="font-semibold text-foreground">Active Adjustments:</span> The recommendations above have been recalculated
            based on your scenario changes.
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}
