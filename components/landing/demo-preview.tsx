'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

export function DemoPreview() {
  return (
    <section className="py-20 relative">
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
            Interactive Demo Preview
          </h2>
          <p className="text-lg text-muted-foreground">
            See how the model classifies a customer into the right coverage bundle instantly
          </p>
        </motion.div>

        {/* Demo Cards Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Client Profile Card */}
          <motion.div
            whileHover={{ translateY: -4 }}
            className="bg-card border border-border rounded-xl p-8 hover:border-primary/50 transition-colors"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent" />
              <div>
                <h3 className="text-foreground font-semibold text-lg">Customer Profile</h3>
                <p className="text-muted-foreground text-sm">Classification Input Features</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Age / Gender</p>
                <p className="text-foreground font-medium">42 · Married Female</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm mb-1">Annual Income</p>
                <p className="text-foreground font-medium">$118,000</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm mb-1">Employment / Property</p>
                <p className="text-foreground font-medium">Employed · Homeowner</p>
              </div>
              <div className="pt-4 border-t border-border">
                <p className="text-muted-foreground text-sm mb-2">Key Signals</p>
                <div className="flex flex-wrap gap-2">
                  {['2 Dependents', 'SUV', '1 Prior Claim'].map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Ranked Policies Card */}
          <motion.div
            whileHover={{ translateY: -4 }}
            className="bg-card border border-border rounded-xl p-8 hover:border-primary/50 transition-colors"
          >
            <h3 className="text-foreground font-semibold text-lg mb-2">AI Classification Result</h3>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
                <span className="text-3xl font-extrabold text-primary">5</span>
              </div>
              <div>
                <p className="text-foreground font-bold">Full Auto + Home</p>
                <p className="text-xs text-purple-400 font-semibold">Premium tier · 84% confidence</p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { bundle: 5, name: 'Full Auto + Home', prob: 84 },
                { bundle: 7, name: 'Premium All-Coverage', prob: 9 },
                { bundle: 2, name: 'Home + Auto Starter', prob: 5 },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-accent/5 rounded-lg p-4 border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-md bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">{item.bundle}</span>
                      <p className="text-foreground font-medium text-sm">{item.name}</p>
                    </div>
                    <span className="text-primary font-bold text-sm">{item.prob}%</span>
                  </div>
                  <div className="w-full bg-border/50 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${idx === 0 ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                      style={{ width: `${item.prob}%` }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              className="w-full mt-6 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center justify-center gap-2 shadow-lg shadow-primary/10"
            >
              <CheckCircle2 className="w-5 h-5" />
              Run Classification
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
