'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Cpu, TrendingUp, Target } from 'lucide-react'

const recommendations = [
  {
    id: 1,
    title: 'Premium Match for Acme Corp',
    description: 'High-value business liability policy match with 95% confidence',
    icon: <Target className="w-5 h-5" />,
    confidence: 95,
    action: 'Review',
    type: 'match',
  },
  {
    id: 2,
    title: 'Optimize Coverage Strategy',
    description: 'Client group shows opportunity for workers comp consolidation',
    icon: <TrendingUp className="w-5 h-5" />,
    confidence: 87,
    action: 'Analyze',
    type: 'strategy',
  },
  {
    id: 3,
    title: 'Upcoming Renewal Alert',
    description: '12 policies expiring within 30 days - proactive outreach recommended',
    icon: <Cpu className="w-5 h-5" />,
    confidence: 100,
    action: 'Prepare',
    type: 'alert',
  },
]

export function AIRecommendationsCard() {
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
            <Cpu className="w-5 h-5 text-primary" />
            AI-Powered Recommendations
          </h3>
          <p className="text-sm text-muted-foreground mt-1">Smart insights to grow your business</p>
        </div>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec, idx) => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * idx }}
            className="flex items-start gap-4 p-4 rounded-lg bg-accent/5 border border-border hover:border-primary/50 transition-all group cursor-pointer"
          >
            <div className={`p-2 rounded-lg flex-shrink-0 ${rec.type === 'match' ? 'bg-primary/10 text-primary' :
                rec.type === 'strategy' ? 'bg-accent/10 text-accent' :
                  'bg-orange-500/10 text-orange-500'
              }`}>
              {rec.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground">{rec.title}</p>
              <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 max-w-xs bg-muted/30 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full ${rec.confidence >= 90 ? 'bg-emerald-500' :
                        rec.confidence >= 80 ? 'bg-primary' :
                          'bg-amber-500'
                      }`}
                    style={{ width: `${rec.confidence}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{rec.confidence}% confidence</span>
              </div>
            </div>
            <button className="flex-shrink-0 px-3 py-1 text-sm rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all opacity-0 group-hover:opacity-100 border border-primary/20">
              {rec.action}
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
