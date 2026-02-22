'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Cpu, BarChart3, ShieldCheck, Database } from 'lucide-react'

const features = [
  {
    icon: Cpu,
    title: 'Multi-Class Bundle Prediction',
    description: 'ML model classifies prospective customers into 10 coverage bundle tiers (0–9) with a single inference call.',
  },
  {
    icon: BarChart3,
    title: 'Class Probability Distribution',
    description: 'View the full probability distribution across all 10 bundles — not just the top pick — for transparent, explainable results.',
  },
  {
    icon: Database,
    title: 'Rich Feature Engineering',
    description: 'Ingest demographics, behavioural signals, and claims history to power accurate bundle classification at scale.',
  },
  {
    icon: ShieldCheck,
    title: 'Model Confidence Scoring',
    description: 'Every prediction ships with a calibrated confidence score so brokers know when to trust the model and when to review manually.',
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 relative">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Powerful Classification Features
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to predict and manage coverage bundle decisions at scale
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true, margin: '-100px' }}
                whileHover={{ translateY: -8 }}
                className="bg-card border border-border rounded-xl p-8 hover:border-primary/50 transition-all duration-300 group"
              >
                <div className="mb-6">
                  <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
