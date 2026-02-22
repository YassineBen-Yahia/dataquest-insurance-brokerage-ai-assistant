'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Brain, Target, TrendingUp } from 'lucide-react'

const recentPredictions = [
  {
    id: 1,
    customerName: 'Alex Rivera',
    predictedBundle: 1,
    bundleName: 'Essential Auto',
    confidence: 72,
    tier: 'Basic',
    icon: <Target className="w-5 h-5" />,
  },
  {
    id: 2,
    customerName: 'Sarah Chen',
    predictedBundle: 5,
    bundleName: 'Full Auto + Home',
    confidence: 84,
    tier: 'Premium',
    icon: <TrendingUp className="w-5 h-5" />,
  },
  {
    id: 3,
    customerName: 'Marcus Johnson',
    predictedBundle: 7,
    bundleName: 'Premium All-Coverage',
    confidence: 91,
    tier: 'Premium',
    icon: <Brain className="w-5 h-5" />,
  },
]

const TIER_BG: Record<string, string> = {
  Basic: 'bg-slate-500/10 text-slate-400',
  Standard: 'bg-blue-500/10 text-blue-400',
  Premium: 'bg-purple-500/10 text-purple-400',
  Enterprise: 'bg-emerald-500/10 text-emerald-400',
}

const CONF_COLOR = (c: number) =>
  c >= 80 ? 'bg-emerald-500' : c >= 60 ? 'bg-amber-500' : 'bg-rose-500'

export function AIClassificationsCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.5 }}
      className="bg-card backdrop-blur-sm rounded-lg border border-border p-6 col-span-full"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            AI Bundle Classifications
          </h3>
          <p className="text-sm text-muted-foreground mt-1">Latest predicted coverage bundles for prospective customers</p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
          10 Classes
        </span>
      </div>

      <div className="space-y-3">
        {recentPredictions.map((pred, idx) => (
          <motion.div
            key={pred.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * idx }}
            className="flex items-center gap-4 p-4 rounded-lg bg-accent/5 border border-border hover:border-primary/50 transition-all group cursor-pointer"
          >
            {/* Bundle number badge */}
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
              <span className="text-lg font-extrabold text-primary">{pred.predictedBundle}</span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-medium text-foreground text-sm">{pred.customerName}</p>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${TIER_BG[pred.tier]}`}>
                  {pred.tier}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{pred.bundleName}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 max-w-[140px] bg-muted/30 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${CONF_COLOR(pred.confidence)}`}
                    style={{ width: `${pred.confidence}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{pred.confidence}% confidence</span>
              </div>
            </div>

            <button className="flex-shrink-0 px-3 py-1 text-sm rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all opacity-0 group-hover:opacity-100 border border-primary/20">
              Review
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
