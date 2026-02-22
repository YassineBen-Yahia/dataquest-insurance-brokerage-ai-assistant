'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { CustomerProfile, PredictionResult, predictBundle } from '@/lib/classification-data'
import { CustomerInputForm } from '@/components/classification/customer-input-form'
import { PredictionResultPanel } from '@/components/classification/prediction-result-panel'

export default function AIClassificationPage() {
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (customer: CustomerProfile) => {
    setIsLoading(true)
    // Simulate model inference latency
    await new Promise((resolve) => setTimeout(resolve, 900))
    setResult(predictBundle(customer))
    setIsLoading(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-full flex flex-col gap-8"
    >
      {/* Page header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full">
            Multi-Class · 10 Bundles
          </span>
        </div>
        <h1 className="text-3xl font-bold text-foreground mt-2">AI Bundle Classification</h1>
        <p className="text-muted-foreground mt-1">
          Predict which of the 10 coverage bundles (0–9) a prospective customer will purchase, based on their demographic and behavioural profile.
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 flex-1 min-h-0">
        {/* Left – Customer input (40%) */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6 overflow-hidden flex flex-col">
          <CustomerInputForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>

        {/* Right – Prediction output (60%) */}
        <div className="lg:col-span-3 bg-card border border-border rounded-xl p-6 overflow-hidden flex flex-col">
          <div className="mb-5 flex-shrink-0">
            <h2 className="text-base font-semibold text-foreground">Prediction Output</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Predicted bundle with class probabilities and model confidence</p>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto">
            <PredictionResultPanel result={result} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
