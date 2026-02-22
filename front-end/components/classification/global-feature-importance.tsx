'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart2, ChevronDown, ChevronUp, TrendingUp } from 'lucide-react'

export interface FeatureImportanceEntry {
  feature: string
  importance: number
}

interface GlobalFeatureImportanceProps {
  importances: FeatureImportanceEntry[]
  /** How many features to show before "Show more" (default 15) */
  initialShow?: number
  /** Optional title override */
  title?: string
}

/**
 * Horizontal bar chart of model-level (global) feature importances.
 * Receives data via props – no self-fetching.
 */
export function GlobalFeatureImportance({
  importances,
  initialShow = 15,
  title = 'Global Feature Importance',
}: GlobalFeatureImportanceProps) {
  const [expanded, setExpanded] = useState(false)

  if (!importances.length) return null

  const sorted = [...importances].sort((a, b) => b.importance - a.importance)
  const maxVal = sorted[0]?.importance ?? 1
  const displayed = expanded ? sorted : sorted.slice(0, initialShow)
  const hasMore = sorted.length > initialShow

  const barColor = (rank: number) => {
    if (rank < 3) return 'bg-primary'
    if (rank < 5) return 'bg-primary/70'
    return 'bg-muted-foreground/40'
  }

  return (
    <div className="bg-muted/20 border border-border rounded-xl p-5">
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
        <BarChart2 className="w-3.5 h-3.5" />
        {title}
      </h4>

      <div className="space-y-1.5">
        {displayed.map((feat, idx) => {
          const pct = (feat.importance / maxVal) * 100
          return (
            <motion.div
              key={feat.feature}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: Math.min(idx * 0.02, 0.5) }}
              className="flex items-center gap-2"
            >
              {/* Rank badge */}
              <span className="text-[10px] text-muted-foreground/60 font-mono w-5 text-right flex-shrink-0">
                {idx + 1}
              </span>

              {/* Feature name */}
              <span
                className="text-xs text-muted-foreground w-44 flex-shrink-0 truncate"
                title={feat.feature}
              >
                {feat.feature.replace(/_/g, ' ')}
              </span>

              {/* Horizontal bar */}
              <div className="flex-1 h-3 bg-muted/20 rounded-sm overflow-hidden">
                <motion.div
                  className={`h-full rounded-sm ${barColor(idx)}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut', delay: Math.min(idx * 0.02, 0.5) }}
                />
              </div>

              {/* Value */}
              <span className="text-[11px] font-mono text-muted-foreground w-14 text-right flex-shrink-0">
                {feat.importance < 0.01
                  ? feat.importance.toExponential(1)
                  : feat.importance.toFixed(3)}
              </span>
            </motion.div>
          )
        })}
      </div>

      {/* Expand / collapse */}
      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-xs text-primary font-medium hover:text-primary/80 transition-colors flex items-center gap-1 mx-auto"
        >
          {expanded ? (
            <>
              Show top {initialShow} <ChevronUp className="w-3 h-3" />
            </>
          ) : (
            <>
              Show all {sorted.length} features <ChevronDown className="w-3 h-3" />
            </>
          )}
        </button>
      )}

      <p className="text-[10px] text-muted-foreground/60 mt-3">
        XGBoost gain-based importance — higher values indicate more influential features across all predictions.
      </p>
    </div>
  )
}