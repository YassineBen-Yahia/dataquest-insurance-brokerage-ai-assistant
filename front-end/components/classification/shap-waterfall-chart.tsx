'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Lightbulb } from 'lucide-react'
import type { FeatureExplanation } from '@/lib/classification-data'

interface ShapWaterfallChartProps {
  explanations: FeatureExplanation[]
  /** How many features to display (default 12) */
  topN?: number
  /** Optional title override */
  title?: string
  /** Compact mode for tighter spacing */
  compact?: boolean
}

export function ShapWaterfallChart({
  explanations,
  topN = 12,
  title = 'Feature Impact (SHAP Values)',
  compact = false,
}: ShapWaterfallChartProps) {
  if (!explanations.length) return null

  const sorted = [...explanations].sort(
    (a, b) => Math.abs(b.shap_value) - Math.abs(a.shap_value),
  )
  const top = sorted.slice(0, topN)
  const maxAbs = Math.max(...top.map((f) => Math.abs(f.shap_value)), 0.01)

  return (
    <div className="bg-muted/20 border border-border rounded-xl p-5">
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
        <Lightbulb className="w-3.5 h-3.5" />
        {title}
      </h4>

      <div className={compact ? 'space-y-1.5' : 'space-y-2.5'}>
        {top.map((feat, idx) => {
          const isPositive = feat.shap_value >= 0
          const pct = (Math.abs(feat.shap_value) / maxAbs) * 100
          return (
            <motion.div
              key={feat.feature}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.03 }}
              className="flex items-center gap-2"
            >
              {/* Feature name */}
              <span
                className={`text-xs text-muted-foreground flex-shrink-0 truncate ${
                  compact ? 'w-36' : 'w-44'
                }`}
                title={feat.feature}
              >
                {feat.feature.replace(/_/g, ' ')}
              </span>

              {/* Bidirectional bar */}
              <div className="flex-1 flex items-center h-4">
                {/* Negative half */}
                <div className="flex-1 flex justify-end">
                  {!isPositive && (
                    <motion.div
                      className="h-3.5 rounded-l-sm bg-rose-500/80"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.4, delay: idx * 0.03 }}
                    />
                  )}
                </div>
                {/* Center line */}
                <div className="w-px h-5 bg-border flex-shrink-0" />
                {/* Positive half */}
                <div className="flex-1">
                  {isPositive && (
                    <motion.div
                      className="h-3.5 rounded-r-sm bg-emerald-500/80"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.4, delay: idx * 0.03 }}
                    />
                  )}
                </div>
              </div>

              {/* Value + icon */}
              <div className="w-16 flex-shrink-0 flex items-center justify-end gap-1">
                {isPositive ? (
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-rose-500" />
                )}
                <span
                  className={`text-xs font-mono font-bold ${
                    isPositive ? 'text-emerald-500' : 'text-rose-500'
                  }`}
                >
                  {isPositive ? '+' : ''}
                  {feat.shap_value.toFixed(2)}
                </span>
              </div>
            </motion.div>
          )
        })}
      </div>

      <p className="text-[10px] text-muted-foreground/60 mt-3">
        Green pushes toward this bundle; red pushes away.
      </p>
    </div>
  )
}
