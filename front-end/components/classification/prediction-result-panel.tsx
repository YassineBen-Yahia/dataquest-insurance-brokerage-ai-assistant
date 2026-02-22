'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Award, ShieldCheck } from 'lucide-react'
import { SinglePredictionResult, BUNDLE_DISPLAY } from '@/lib/classification-data'
import { ProbabilityDistribution } from './probability-distribution'
import { ShapWaterfallChart } from './shap-waterfall-chart'
import { GlobalFeatureImportance, type FeatureImportanceEntry } from './global-feature-importance'

interface PredictionResultPanelProps {
  result: SinglePredictionResult | null
  isLoading?: boolean
  /** Model-level feature importances (from /metadata endpoint) */
  globalImportances?: FeatureImportanceEntry[]
}

const CONFIDENCE_COLOR = (c: number) => {
  if (c >= 80) return 'text-emerald-500'
  if (c >= 60) return 'text-amber-500'
  return 'text-rose-500'
}
const CONFIDENCE_BG = (c: number) => {
  if (c >= 80) return 'bg-emerald-500'
  if (c >= 60) return 'bg-amber-500'
  return 'bg-rose-500'
}

export function PredictionResultPanel({ result, isLoading, globalImportances }: PredictionResultPanelProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full"
        />
        <p className="text-sm text-muted-foreground">Running ML pipeline…</p>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center gap-3">
        <ShieldCheck className="w-12 h-12 text-muted-foreground/30" />
        <p className="text-muted-foreground text-sm">Submit a client profile to predict their coverage bundle</p>
      </div>
    )
  }

  const { predicted_bundle, confidence, class_probabilities, feature_explanations } = result
  const display = BUNDLE_DISPLAY[predicted_bundle] ?? { name: predicted_bundle, color: '#6366f1', icon: '📋' }

  return (
    <motion.div
      key={predicted_bundle}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-5 overflow-y-auto"
    >
      {/* ── Hero card ── */}
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="rounded-xl p-5 flex items-center gap-4" style={{ background: `${display.color}10`, border: `1px solid ${display.color}33` }}>
        <div className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl" style={{ background: `${display.color}20`, border: `1px solid ${display.color}44` }}>
          {display.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-4 h-4" style={{ color: display.color }} />
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: display.color }}>Predicted Bundle</span>
          </div>
          <h3 className="text-xl font-bold text-foreground leading-tight">{display.name}</h3>
          <span className={`text-sm font-bold ${CONFIDENCE_COLOR(confidence)}`}>{confidence.toFixed(1)}% confidence</span>
        </div>
      </motion.div>

      {/* ── Confidence meter ── */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Model Confidence</span>
          <span className={`text-sm font-bold ${CONFIDENCE_COLOR(confidence)}`}>{confidence.toFixed(1)}%</span>
        </div>
        <div className="w-full h-2.5 bg-muted/30 rounded-full overflow-hidden">
          <motion.div className={`h-full rounded-full ${CONFIDENCE_BG(confidence)}`} initial={{ width: 0 }} animate={{ width: `${confidence}%` }} transition={{ duration: 0.7, ease: 'easeOut' }} />
        </div>
      </div>

      {/* ── SHAP Waterfall ── */}
      <ShapWaterfallChart
        explanations={feature_explanations}
        topN={12}
        title="Feature Impact (SHAP Values)"
      />

      {/* ── Global Feature Importance ── */}
      {globalImportances && globalImportances.length > 0 && (
        <GlobalFeatureImportance
          importances={globalImportances}
          initialShow={15}
          title="Global Feature Importance"
        />
      )}

      {/* ── Class probability distribution ── */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">All Class Probabilities</p>
        <ProbabilityDistribution probabilities={class_probabilities} predictedBundle={predicted_bundle} />
      </div>
    </motion.div>
  )
}
