'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Award, ShieldCheck } from 'lucide-react'
import { PredictionResult } from '@/lib/classification-data'
import { ProbabilityDistribution } from './probability-distribution'

interface PredictionResultPanelProps {
  result: PredictionResult | null
  isLoading?: boolean
}

const TIER_COLOR: Record<string, string> = {
  Basic: 'text-slate-400 bg-slate-400/10 border-slate-400/30',
  Standard: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
  Premium: 'text-purple-400 bg-purple-400/10 border-purple-400/30',
  Enterprise: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
}

const CONFIDENCE_COLOR = (c: number) => {
  if (c >= 80) return 'text-emerald-500'
  if (c >= 60) return 'text-amber-500'
  return 'text-rose-500'
}

export function PredictionResultPanel({ result, isLoading }: PredictionResultPanelProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full"
        />
        <p className="text-sm text-muted-foreground">Running classification model…</p>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center gap-3">
        <ShieldCheck className="w-12 h-12 text-muted-foreground/30" />
        <p className="text-muted-foreground text-sm">Submit a customer profile to predict their coverage bundle</p>
      </div>
    )
  }

  const { bundleInfo, predictedBundle, confidence, classProbabilities } = result

  return (
    <motion.div
      key={predictedBundle}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="h-full flex flex-col gap-6 overflow-y-auto"
    >
      {/* Predicted bundle hero */}
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="bg-primary/5 border border-primary/20 rounded-xl p-6 flex items-center gap-5"
      >
        {/* Big number */}
        <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center">
          <span className="text-4xl font-extrabold text-primary">{predictedBundle}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">Predicted Bundle</span>
          </div>
          <h3 className="text-xl font-bold text-foreground leading-tight">{bundleInfo.name}</h3>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${TIER_COLOR[bundleInfo.tier]}`}>
              {bundleInfo.tier}
            </span>
            <span className={`text-sm font-bold ${CONFIDENCE_COLOR(confidence)}`}>
              {confidence}% confidence
            </span>
          </div>
        </div>
      </motion.div>

      {/* Confidence meter */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Model Confidence</span>
          <span className={`text-sm font-bold ${CONFIDENCE_COLOR(confidence)}`}>{confidence}%</span>
        </div>
        <div className="w-full h-2.5 bg-muted/30 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${confidence >= 80 ? 'bg-emerald-500' : confidence >= 60 ? 'bg-amber-500' : 'bg-rose-500'}`}
            initial={{ width: 0 }}
            animate={{ width: `${confidence}%` }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Bundle detail */}
      <div className="bg-muted/20 border border-border rounded-xl p-5 space-y-4">
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Description</p>
          <p className="text-sm text-foreground leading-relaxed">{bundleInfo.description}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Typical Customer</p>
          <p className="text-sm text-muted-foreground">{bundleInfo.typicalProfile}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Included Coverages</p>
          <div className="flex flex-wrap gap-2">
            {bundleInfo.coverages.map((cov) => (
              <span key={cov} className="text-xs px-2.5 py-1 rounded-md bg-primary/10 text-primary border border-primary/20">
                {cov}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Est. Monthly Premium</p>
          <p className="text-sm font-bold text-emerald-500">
            ${bundleInfo.monthlyPremiumRange[0]} – ${bundleInfo.monthlyPremiumRange[1]}
          </p>
        </div>
      </div>

      {/* Class probability distribution */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">All Class Probabilities</p>
        <ProbabilityDistribution probabilities={classProbabilities} predictedBundle={predictedBundle} />
      </div>
    </motion.div>
  )
}
