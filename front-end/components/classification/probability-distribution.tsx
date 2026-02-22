'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { BUNDLE_INFO } from '@/lib/classification-data'

interface ProbabilityDistributionProps {
  probabilities: number[]        // length 10
  predictedBundle: number        // 0–9
}

export function ProbabilityDistribution({ probabilities, predictedBundle }: ProbabilityDistributionProps) {
  const sorted = probabilities
    .map((p, i) => ({ bundle: i, probability: p, info: BUNDLE_INFO[i] }))
    .sort((a, b) => b.probability - a.probability)

  return (
    <div className="space-y-2">
      {sorted.map(({ bundle, probability, info }, idx) => {
        const isTop = bundle === predictedBundle
        return (
          <motion.div
            key={bundle}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.04 }}
            className={`flex items-center gap-3 group ${isTop ? 'opacity-100' : 'opacity-75 hover:opacity-100'} transition-opacity`}
          >
            {/* Bundle badge */}
            <div
              className={`w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 text-xs font-bold border ${
                isTop
                  ? 'bg-primary/20 border-primary/50 text-primary'
                  : 'bg-muted/30 border-border text-muted-foreground'
              }`}
            >
              {bundle}
            </div>

            {/* Bar */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs truncate ${isTop ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                  {info.name}
                </span>
                <span className={`text-xs font-bold flex-shrink-0 ml-2 ${isTop ? 'text-primary' : 'text-muted-foreground'}`}>
                  {probability}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-muted/30 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${isTop ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${probability}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut', delay: idx * 0.04 }}
                />
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
