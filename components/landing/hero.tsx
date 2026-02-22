'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center relative pt-20">
      <div className="max-w-5xl mx-auto px-6 text-center">
        {/* Animated label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card/50 mb-8"
        >
          <span className="w-2 h-2 bg-blue-500 rounded-full" />
          <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Enterprise AI Classification Platform</span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl sm:text-7xl font-bold text-foreground mb-6 leading-tight text-balance"
        >
          AI-Powered Coverage Bundle Prediction
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto text-balance"
        >
          Predict the right coverage bundle for every prospective customer. Automate classification across 10 bundle tiers using enterprise-grade machine learning on global brokerage data.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/dashboard"
            className="px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg flex items-center gap-2 transition-all duration-300 shadow-lg shadow-primary/20 hover:scale-[1.02]"
          >
            Enter Dashboard
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="#features"
            className="px-8 py-4 border border-border hover:border-border/80 text-foreground font-semibold rounded-lg transition-all hover:bg-accent/50"
          >
            Request Demo
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
