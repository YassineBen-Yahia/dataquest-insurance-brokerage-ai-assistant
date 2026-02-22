'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { DetailedPolicy } from '@/lib/recommendation-data'
import { formatCurrency } from '@/lib/recommendation-utils'

interface PolicyCardProps {
  policy: DetailedPolicy
  index?: number
  onSelect?: (policy: DetailedPolicy) => void
}

export function PolicyCard({ policy, index = 0, onSelect }: PolicyCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={{ x: 4 }}
      onClick={() => onSelect?.(policy)}
      className="group cursor-pointer"
    >
      <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all group-hover:shadow-lg group-hover:shadow-primary/5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {/* Rank Badge */}
            <div className="inline-block bg-primary/20 border border-primary/50 rounded px-2.5 py-1 mb-3">
              <span className="text-xs font-bold text-primary">RANK #{policy.rank}</span>
            </div>

            {/* Policy Name */}
            <h3 className="text-lg font-semibold text-foreground mb-1">{policy.name}</h3>
            <p className="text-sm text-muted-foreground">{policy.company}</p>
          </div>

          {/* Score Badge */}
          <div className="text-right">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" className="text-muted/20" strokeWidth="2" />
                <motion.circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke="currentColor"
                  className="text-primary"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: '0 176' }}
                  animate={{ strokeDasharray: `${(policy.score / 100) * 176} 176` }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                  style={{ rotate: '-90deg' }}
                />
              </svg>
              <span className="text-lg font-bold text-primary">{Math.round(policy.score)}</span>
            </div>
          </div>
        </div>

        {/* Key Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-5 pb-5 border-b border-border">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Monthly Premium</p>
            <p className="text-base font-semibold text-emerald-500">{formatCurrency(policy.premium)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Deductible</p>
            <p className="text-base font-semibold text-foreground">{formatCurrency(policy.deductible)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Coverage Type</p>
            <p className="text-base font-semibold text-foreground">{policy.coverageType}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Risk Match</p>
            <p className="text-base font-semibold text-accent">{policy.riskMatch}%</p>
          </div>
        </div>

        {/* Sub-scores */}
        <div className="space-y-2 mb-5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Coverage Strength</span>
            <span className="font-semibold text-foreground">{policy.coverageStrength}%</span>
          </div>
          <div className="w-full h-1.5 bg-muted/30 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${policy.coverageStrength}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>

          <div className="flex items-center justify-between text-xs pt-2">
            <span className="text-muted-foreground">Cost Efficiency</span>
            <span className="font-semibold text-foreground">{policy.costEfficiency}%</span>
          </div>
          <div className="w-full h-1.5 bg-muted/30 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-emerald-500"
              initial={{ width: 0 }}
              animate={{ width: `${policy.costEfficiency}%` }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            />
          </div>
        </div>

        {/* CTA Button */}
        <motion.button
          whileHover={{ x: 2 }}
          onClick={(e) => {
            e.stopPropagation()
            onSelect?.(policy)
          }}
          className="w-full flex items-center justify-between bg-primary/10 border border-primary/50 hover:bg-primary/20 hover:border-primary/80 text-primary py-2.5 px-4 rounded-lg transition-all group-hover:text-primary font-medium text-sm"
        >
          <span>View Details</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </div>
    </motion.div>
  )
}
