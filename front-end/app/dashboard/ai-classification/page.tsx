'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Upload, User, Sparkles } from 'lucide-react'
import { SinglePredictionInput, SinglePredictionResult, BatchPredictionResult, getDefaultSingleInput } from '@/lib/classification-data'
import { apiFetch, getApiUrl, getAuthHeaders } from '@/lib/api'
import { CustomerInputForm } from '@/components/classification/customer-input-form'
import { PredictionResultPanel } from '@/components/classification/prediction-result-panel'
import { BatchUploadPanel } from '@/components/classification/batch-upload-panel'
import { BatchResultPanel } from '@/components/classification/batch-result-panel'
import type { FeatureImportanceEntry } from '@/components/classification/global-feature-importance'

type TabMode = 'single' | 'batch'

export default function AIClassificationPage() {
  const [tab, setTab] = useState<TabMode>('single')

  // Global importances (fetched once from /metadata)
  const [globalImportances, setGlobalImportances] = useState<FeatureImportanceEntry[]>([])

  // Single prediction state
  const [singleResult, setSingleResult] = useState<SinglePredictionResult | null>(null)
  const [singleLoading, setSingleLoading] = useState(false)

  // Batch prediction state
  const [batchResult, setBatchResult] = useState<BatchPredictionResult | null>(null)
  const [batchLoading, setBatchLoading] = useState(false)

  // Fetch global importances on mount
  useEffect(() => {
    apiFetch<{ global_importances?: Record<string, number> }>('/api/classify/metadata')
      .then((meta) => {
        if (meta.global_importances) {
          setGlobalImportances(
            Object.entries(meta.global_importances).map(([feature, importance]) => ({
              feature,
              importance,
            })),
          )
        }
      })
      .catch(() => {/* ignore – importances are optional */})
  }, [])

  const handleSingleSubmit = async (input: SinglePredictionInput) => {
    setSingleLoading(true)
    setSingleResult(null)
    try {
      const result = await apiFetch<SinglePredictionResult>('/api/classify/single', {
        method: 'POST',
        body: JSON.stringify(input),
      })
      setSingleResult(result)
    } catch (err: any) {
      console.error('Single prediction failed:', err)
      alert(err.message || 'Prediction failed')
    } finally {
      setSingleLoading(false)
    }
  }

  const handleBatchUpload = async (file: File) => {
    setBatchLoading(true)
    setBatchResult(null)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const token = typeof window !== 'undefined' ? localStorage.getItem('marcos_token') : null
      const headers: Record<string, string> = {}
      if (token) headers['Authorization'] = `Bearer ${token}`

      const res = await fetch(getApiUrl('/api/classify/batch'), {
        method: 'POST',
        headers,
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.detail || `Upload failed: ${res.status}`)
      }

      const result: BatchPredictionResult = await res.json()
      setBatchResult(result)
    } catch (err: any) {
      console.error('Batch prediction failed:', err)
      alert(err.message || 'Batch prediction failed')
    } finally {
      setBatchLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-full flex flex-col gap-6"
    >
      {/* Page header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full">
            XGBoost · 10 Bundles · SHAP Explainability
          </span>
        </div>
        <h1 className="text-3xl font-bold text-foreground mt-2">AI Bundle Classification</h1>
        <p className="text-muted-foreground mt-1">
          Predict coverage bundles using the trained ML pipeline with real-time SHAP feature explanations.
        </p>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-3">
        {([
          { key: 'single' as const, label: 'Single Prediction', icon: User },
          { key: 'batch' as const, label: 'Batch CSV Upload', icon: Upload },
        ]).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${
              tab === key
                ? 'bg-primary/10 border border-primary/20 text-primary'
                : 'bg-muted/50 border border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {tab === 'single' ? (
          <motion.div
            key="single"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-5 gap-6 flex-1 min-h-0"
          >
            {/* Left – Customer input (40%) */}
            <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6 overflow-hidden flex flex-col">
              <CustomerInputForm onSubmit={handleSingleSubmit} isLoading={singleLoading} />
            </div>

            {/* Right – Prediction output (60%) */}
            <div className="lg:col-span-3 bg-card border border-border rounded-xl p-6 overflow-hidden flex flex-col">
              <div className="mb-5 flex-shrink-0">
                <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                  <Brain className="w-4 h-4 text-primary" />
                  Prediction Output
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">Predicted bundle with class probabilities and SHAP explainability</p>
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto">
                <PredictionResultPanel result={singleResult} isLoading={singleLoading} globalImportances={globalImportances} />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="batch"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-6 flex-1 min-h-0"
          >
            {/* Upload zone */}
            <BatchUploadPanel onUpload={handleBatchUpload} isLoading={batchLoading} />

            {/* Batch results */}
            {(batchResult || batchLoading) && (
              <BatchResultPanel result={batchResult} isLoading={batchLoading} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
