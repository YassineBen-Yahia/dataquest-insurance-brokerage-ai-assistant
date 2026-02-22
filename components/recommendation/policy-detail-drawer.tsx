'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { DetailedPolicy } from '@/lib/recommendation-data'
import { formatCurrency, formatPercentage } from '@/lib/recommendation-utils'
import { ScoreBar } from './score-bar'
import { ConfidenceIndicator } from './confidence-indicator'
import { PolicyRadarChart } from './policy-radar-chart'

interface PolicyDetailDrawerProps {
  policy: DetailedPolicy | null
  isOpen: boolean
  onClose: () => void
}

export function PolicyDetailDrawer({ policy, isOpen, onClose }: PolicyDetailDrawerProps) {
  if (!policy) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-card border-l border-border overflow-y-auto z-50 shadow-xl"
          >
            {/* Header */}
            <div className="sticky top-0 bg-card/95 backdrop-blur border-b border-border px-8 py-6 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-1">{policy.name}</h2>
                <p className="text-sm text-muted-foreground">{policy.company}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="px-8 py-8 space-y-8">
              {/* Score Overview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-primary/5 border border-primary/20 rounded-lg p-6"
              >
                <h3 className="text-lg font-semibold text-foreground mb-6">Recommendation Score</h3>
                <div className="grid grid-cols-3 gap-6 mb-6">
                  <div className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-3 flex items-center justify-center">
                      <svg className="absolute inset-0" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--muted)/0.2)" strokeWidth="2" />
                        <motion.circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="hsl(var(--primary))"
                          strokeWidth="3"
                          strokeLinecap="round"
                          initial={{ strokeDasharray: '0 283' }}
                          animate={{ strokeDasharray: `${(policy.score / 100) * 283} 283` }}
                          transition={{ duration: 0.8 }}
                          style={{ rotate: '-90deg' }}
                        />
                      </svg>
                      <span className="text-2xl font-bold text-primary">{Math.round(policy.score)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground font-medium">Overall Score</p>
                  </div>
                  <div className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-3 flex items-center justify-center">
                      <svg className="absolute inset-0" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--muted)/0.2)" strokeWidth="2" />
                        <motion.circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="hsl(var(--accent))"
                          strokeWidth="3"
                          strokeLinecap="round"
                          initial={{ strokeDasharray: '0 283' }}
                          animate={{ strokeDasharray: `${(policy.riskMatch / 100) * 283} 283` }}
                          transition={{ duration: 0.8, delay: 0.1 }}
                          style={{ rotate: '-90deg' }}
                        />
                      </svg>
                      <span className="text-2xl font-bold text-accent">{policy.riskMatch}</span>
                    </div>
                    <p className="text-xs text-muted-foreground font-medium">Risk Match</p>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <ConfidenceIndicator level={policy.confidenceLevel} size="md" showLabel={false} />
                    <p className="text-xs text-muted-foreground font-medium mt-2">Confidence</p>
                  </div>
                </div>
              </motion.div>

              {/* Score Breakdown & Radar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-foreground">Score Breakdown</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Bars */}
                  <div className="space-y-4 bg-muted/30 rounded-lg p-5 border border-border">
                    <ScoreBar label="Coverage Strength" score={policy.coverageStrength} color="hsl(var(--primary))" size="md" />
                    <ScoreBar label="Cost Efficiency" score={policy.costEfficiency} color="#10B981" size="md" />
                    <ScoreBar label="Risk Alignment" score={policy.riskMatch} color="hsl(var(--accent))" size="md" />
                  </div>
                  {/* Radar Chart */}
                  <div className="bg-muted/30 rounded-lg p-5 border border-border flex items-center justify-center">
                    <PolicyRadarChart
                      coverageStrength={policy.coverageStrength}
                      costEfficiency={policy.costEfficiency}
                      riskMatch={policy.riskMatch}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Policy Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-lg font-semibold text-foreground mb-4">Policy Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/30 rounded-lg p-4 border border-border">
                    <p className="text-xs text-muted-foreground mb-2">Monthly Premium</p>
                    <p className="text-xl font-bold text-emerald-500">{formatCurrency(policy.premium)}</p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4 border border-border">
                    <p className="text-xs text-muted-foreground mb-2">Deductible</p>
                    <p className="text-xl font-bold text-foreground">{formatCurrency(policy.deductible)}</p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4 border border-border">
                    <p className="text-xs text-muted-foreground mb-2">Coverage Type</p>
                    <p className="text-lg font-bold text-foreground">{policy.coverageType}</p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4 border border-border">
                    <p className="text-xs text-muted-foreground mb-2">Annual Cost</p>
                    <p className="text-xl font-bold text-foreground">{formatCurrency(policy.premium * 12)}</p>
                  </div>
                </div>
              </motion.div>

              {/* Explanation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-lg font-semibold text-foreground mb-4">Why This Policy?</h3>
                <p className="text-sm leading-relaxed text-muted-foreground bg-muted/30 rounded-lg p-5 border border-border">
                  {policy.explanation}
                </p>
              </motion.div>

              {/* Comparison */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className="text-lg font-semibold text-foreground mb-4">How It Compares</h3>
                <div className="bg-muted/30 rounded-lg p-5 border border-border">
                  <p className="text-sm text-foreground mb-2">
                    <span className="font-semibold">{policy.name}</span> vs{' '}
                    <span className="font-semibold">{policy.comparisonVs.policyName}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">{policy.comparisonVs.difference}</p>
                </div>
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="pt-4"
              >
                <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-lg transition-all shadow-md">
                  Get This Policy
                </button>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
