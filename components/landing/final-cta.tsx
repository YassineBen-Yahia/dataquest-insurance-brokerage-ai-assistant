'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export function FinalCTA() {
  return (
    <section id="cta" className="py-20 relative">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center"
        >
          <h2 className="text-4xl sm:text-6xl font-bold text-foreground mb-6 leading-tight text-balance">
            Built to Predict. Built to Convert.
          </h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Give every prospective customer the exact bundle the model says they’ll choose — backed by a global brokerage dataset and a 10-class classification engine.
          </p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/dashboard"
              className="px-10 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg flex items-center gap-2 transition-all duration-300 shadow-lg shadow-primary/10 hover:scale-[1.02]"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="#features"
              className="px-10 py-4 border border-border hover:border-border/80 text-foreground font-semibold rounded-lg transition-all hover:bg-accent/50"
            >
              Learn More
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
