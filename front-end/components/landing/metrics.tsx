'use client'

import React from 'react'
import { motion } from 'framer-motion'

const metrics = [
  { value: '91%', label: 'Classification Accuracy', subtext: 'Average top-1 accuracy across 10 bundle classes' },
  { value: '10x', label: 'Faster Underwriting', subtext: 'Bundle assignment time vs. manual review' },
  { value: '28%', label: 'Higher Conversion', subtext: 'Uplift when predicted bundle is presented first' },
]

export function Metrics() {
  return (
    <section id="metrics" className="py-20 relative">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {metrics.map((metric, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              viewport={{ once: true, margin: '-100px' }}
              className="text-center group"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="mb-4"
              >
                <div className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {metric.value}
                </div>
              </motion.div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {metric.label}
              </h3>
              <p className="text-muted-foreground">
                {metric.subtext}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
