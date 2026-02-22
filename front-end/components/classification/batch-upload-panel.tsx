'use client'

import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Upload, FileSpreadsheet, X, CheckCircle2, Brain, Loader2 } from 'lucide-react'

// ─── Expected CSV columns (train.csv schema) ─────────────────────────────────
const EXPECTED_COLUMNS = [
  'User_ID', 'Estimated_Annual_Income', 'Adult_Dependents', 'Child_Dependents',
  'Infant_Dependents', 'Region_Code', 'Existing_Policyholder', 'Previous_Claims_Filed',
  'Years_Without_Claims', 'Policy_Amendments_Count', 'Broker_ID', 'Employer_ID',
  'Underwriting_Processing_Days', 'Vehicles_on_Policy', 'Custom_Riders_Requested',
  'Broker_Agency_Type', 'Deductible_Tier', 'Acquisition_Channel', 'Payment_Schedule',
  'Employment_Status', 'Policy_Start_Year', 'Policy_Start_Week', 'Policy_Start_Day',
  'Policy_Start_Month', 'Policy_Cancelled_Post_Purchase', 'Previous_Policy_Duration_Months',
  'Days_Since_Quote', 'Grace_Period_Extensions',
]

interface BatchUploadPanelProps {
  onUpload: (file: File) => void
  isLoading: boolean
}

export function BatchUploadPanel({ onUpload, isLoading }: BatchUploadPanelProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFilePick = (file: File | undefined) => {
    if (!file) return
    setSelectedFile(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFilePick(e.dataTransfer.files[0])
  }

  const handleRunBatch = () => {
    if (!selectedFile) return
    onUpload(selectedFile)
  }

  const handleClear = () => {
    setSelectedFile(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-card border border-border rounded-xl p-6"
    >
      <div className="flex flex-col items-center gap-6">
        {/* ── Drop zone ── */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => !isLoading && inputRef.current?.click()}
          className={`relative w-full max-w-xl border-2 border-dashed rounded-2xl p-10 flex flex-col items-center gap-4 cursor-pointer transition-all duration-200 select-none
            ${isLoading
              ? 'border-primary/40 bg-primary/5 cursor-not-allowed opacity-70'
              : isDragging
                ? 'border-primary bg-primary/5 scale-[1.01]'
                : selectedFile
                  ? 'border-emerald-500/60 bg-emerald-500/5'
                  : 'border-border hover:border-primary/50 hover:bg-muted/30'
            }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            className="hidden"
            disabled={isLoading}
            onChange={(e) => handleFilePick(e.target.files?.[0])}
          />

          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all
            ${isLoading
              ? 'bg-primary/15 text-primary'
              : selectedFile
                ? 'bg-emerald-500/15 text-emerald-500'
                : 'bg-primary/10 text-primary'
            }`}
          >
            {isLoading ? (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}>
                <Loader2 className="w-7 h-7" />
              </motion.div>
            ) : selectedFile ? (
              <CheckCircle2 className="w-7 h-7" />
            ) : (
              <Upload className="w-7 h-7" />
            )}
          </div>

          {isLoading ? (
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">Processing batch predictions…</p>
              <p className="text-xs text-muted-foreground mt-1">Running ML pipeline on all rows. This may take a moment.</p>
            </div>
          ) : selectedFile ? (
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground flex items-center gap-2 justify-center">
                <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                {selectedFile.name}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatSize(selectedFile.size)} — Click &quot;Run Batch&quot; to process predictions
              </p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">Drop your CSV file here</p>
              <p className="text-xs text-muted-foreground mt-1">
                or click to browse · Accepts <span className="font-mono">.csv</span> files
              </p>
            </div>
          )}

          {selectedFile && !isLoading && (
            <button
              onClick={(e) => { e.stopPropagation(); handleClear() }}
              className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* ── Expected columns hint ── */}
        <div className="w-full max-w-xl bg-muted/40 border border-border rounded-xl p-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Expected CSV columns ({EXPECTED_COLUMNS.length})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {EXPECTED_COLUMNS.map((col) => (
              <span
                key={col}
                className="font-mono text-[11px] bg-card border border-border rounded px-2 py-0.5 text-foreground/70"
              >
                {col}
              </span>
            ))}
          </div>
        </div>

        {/* ── Action button ── */}
        {selectedFile && !isLoading && (
          <motion.button
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleRunBatch}
            className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20"
          >
            <Brain className="w-4 h-4" />
            Run Batch Classification
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}
