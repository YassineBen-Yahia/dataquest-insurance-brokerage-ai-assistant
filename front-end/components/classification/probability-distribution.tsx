'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { BUNDLE_DISPLAY, CLASS_ORDER } from '@/lib/classification-data'

interface ProbabilityDistributionProps {
  probabilities: Record<string, number>   // class → probability (0–100)
  predictedBundle: string
}

export function ProbabilityDistribution({ probabilities, predictedBundle }: ProbabilityDistributionProps) {
  const items = CLASS_ORDER.map((cls) => ({
    bundle: cls,
    probability: probabilities[cls] ?? 0,
    display: BUNDLE_DISPLAY[cls] ?? { name: cls, color: '#6366f1', icon: '📋' },
  })).sort((a, b) => b.probability - a.probability)

  return (
    <div className="space-y-2">
      {items.map(({ bundle, probability, display }, idx) => {
        const isTop = bundle === predictedBundle
        return (
          <motion.div
            key={bundle}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.04 }}
            className={`flex items-center gap-3 group ${isTop ? 'opacity-100' : 'opacity-75 hover:opacity-100'} transition-opacity`}
          >
            {/* Bundle icon */}
            <div
              className={`w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 text-sm border ${
                isTop ? 'border-primary/50' : 'border-border'
              }`}
              style={isTop ? { background: `${display.color}20`, borderColor: `${display.color}55` } : {}}
            >
              {display.icon}
            </div>

            {/* Bar */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs truncate ${isTop ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                  {display.name}
                </span>
                <span className={`text-xs font-bold flex-shrink-0 ml-2 ${isTop ? 'text-primary' : 'text-muted-foreground'}`}>
                  {probability.toFixed(1)}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-muted/30 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: isTop ? display.color : 'var(--muted-foreground)', opacity: isTop ? 1 : 0.3 }}
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
