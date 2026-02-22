'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart3,
  Users,
  TrendingUp,
  TrendingDown,
  Target,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
} from 'lucide-react'
import {
  BatchPredictionResult,
  BatchPredictionRow,
  BUNDLE_DISPLAY,
  CLASS_ORDER,
} from '@/lib/classification-data'
import { GlobalFeatureImportance, type FeatureImportanceEntry } from './global-feature-importance'

// ─── Helpers ───────────────────────────────────────────────────────────────────

const CONF_COLOR = (c: number) =>
  c >= 80 ? 'text-emerald-500' : c >= 60 ? 'text-amber-500' : 'text-rose-500'

const CONF_BG = (c: number) =>
  c >= 80 ? 'bg-emerald-500' : c >= 60 ? 'bg-amber-500' : 'bg-rose-500'

type SortKey = 'row_index' | 'confidence' | 'predicted_bundle'
type SortDir = 'asc' | 'desc'

// ─── Component ─────────────────────────────────────────────────────────────────

interface BatchResultPanelProps {
  result: BatchPredictionResult | null
  isLoading: boolean
}

export function BatchResultPanel({ result, isLoading }: BatchResultPanelProps) {
  const [sortKey, setSortKey] = useState<SortKey>('row_index')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [showAll, setShowAll] = useState(false)

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-xl p-8 flex flex-col items-center justify-center gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full"
        />
        <p className="text-sm text-muted-foreground">Processing batch predictions…</p>
      </div>
    )
  }

  if (!result) return null

  const { total_rows, predictions, summary } = result

  // ── Sorting ────────────────────────────────────────────────────────────────
  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir(key === 'confidence' ? 'desc' : 'asc')
    }
  }

  const sorted = [...predictions].sort((a, b) => {
    const dir = sortDir === 'asc' ? 1 : -1
    if (sortKey === 'row_index') return (a.row_index - b.row_index) * dir
    if (sortKey === 'confidence') return (a.confidence - b.confidence) * dir
    return a.predicted_bundle.localeCompare(b.predicted_bundle) * dir
  })

  const PREVIEW_LIMIT = 50
  const displayed = showAll ? sorted : sorted.slice(0, PREVIEW_LIMIT)
  const hasMore = sorted.length > PREVIEW_LIMIT

  // ── Bundle distribution bars ───────────────────────────────────────────────
  const distEntries = CLASS_ORDER
    .filter((cls) => (summary.bundle_distribution[cls] ?? 0) > 0)
    .map((cls) => ({
      bundle: cls,
      count: summary.bundle_distribution[cls] ?? 0,
      display: BUNDLE_DISPLAY[cls] ?? { name: cls, color: '#6366f1', icon: '📋' },
    }))
    .sort((a, b) => b.count - a.count)

  const maxCount = Math.max(...distEntries.map((e) => e.count), 1)

  // find top bundle
  const topBundle = distEntries[0]

  // Global feature importances from model
  const globalImportances: FeatureImportanceEntry[] = result.global_importances
    ? Object.entries(result.global_importances).map(([feature, importance]) => ({
        feature,
        importance,
      }))
    : []

  // ── Sort icon helper ───────────────────────────────────────────────────────
  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="w-3 h-3 opacity-40" />
    return sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col gap-6"
    >
      {/* ── Summary strip ── */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Total rows */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total Rows</p>
              <p className="text-lg font-bold text-foreground">{total_rows.toLocaleString()}</p>
            </div>
          </div>

          {/* Avg confidence */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Avg Confidence</p>
              <p className={`text-lg font-bold ${CONF_COLOR(summary.avg_confidence)}`}>
                {summary.avg_confidence.toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Min / Max */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Min / Max</p>
              <p className="text-lg font-bold text-foreground">
                <span className={CONF_COLOR(summary.min_confidence)}>{summary.min_confidence.toFixed(1)}</span>
                <span className="text-muted-foreground mx-1">/</span>
                <span className={CONF_COLOR(summary.max_confidence)}>{summary.max_confidence.toFixed(1)}%</span>
              </p>
            </div>
          </div>

          {/* Top bundle */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-violet-500" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Top Bundle</p>
              <p className="text-sm font-bold text-foreground truncate">
                {topBundle ? `${topBundle.display.icon} ${topBundle.display.name}` : '—'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bundle distribution ── */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
          <BarChart3 className="w-3.5 h-3.5" />
          Bundle Distribution
        </h3>

        <div className="space-y-2.5">
          {distEntries.map(({ bundle, count, display }, idx) => {
            const pct = total_rows > 0 ? (count / total_rows * 100) : 0
            return (
              <motion.div
                key={bundle}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="flex items-center gap-3"
              >
                {/* Icon */}
                <div
                  className="w-7 h-7 rounded-md flex items-center justify-center text-sm flex-shrink-0 border"
                  style={{ background: `${display.color}15`, borderColor: `${display.color}30` }}
                >
                  {display.icon}
                </div>

                {/* Label + bar */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-foreground font-medium truncate">{display.name}</span>
                    <span className="text-xs text-muted-foreground font-mono flex-shrink-0 ml-2">
                      {count} ({pct.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-muted/30 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: display.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / maxCount) * 100}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut', delay: idx * 0.04 }}
                    />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* ── Global Feature Importance ── */}
      {globalImportances.length > 0 && (
        <GlobalFeatureImportance
          importances={globalImportances}
          initialShow={15}
          title="Global Feature Importance"
        />
      )}

      {/* ── Predictions table ── */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-border flex items-center justify-between">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            All Predictions
          </h3>
          <span className="text-xs text-muted-foreground bg-muted/50 rounded-full px-2 py-0.5">
            {predictions.length} rows
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="text-left px-4 py-2.5">
                  <button onClick={() => toggleSort('row_index')} className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors">
                    # <SortIcon col="row_index" />
                  </button>
                </th>
                <th className="text-left px-4 py-2.5">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">User ID</span>
                </th>
                <th className="text-left px-4 py-2.5">
                  <button onClick={() => toggleSort('predicted_bundle')} className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors">
                    Bundle <SortIcon col="predicted_bundle" />
                  </button>
                </th>
                <th className="text-left px-4 py-2.5">
                  <button onClick={() => toggleSort('confidence')} className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors">
                    Confidence <SortIcon col="confidence" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {displayed.map((row, idx) => {
                  const display = BUNDLE_DISPLAY[row.predicted_bundle] ?? { name: row.predicted_bundle, color: '#6366f1', icon: '📋' }
                  return (
                    <motion.tr
                      key={`${row.row_index}-${row.user_id}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: Math.min(idx * 0.01, 0.3) }}
                      className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-4 py-2.5 text-xs font-mono text-muted-foreground">{row.row_index}</td>
                      <td className="px-4 py-2.5 text-xs font-medium text-foreground">{row.user_id}</td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-6 h-6 rounded flex items-center justify-center text-xs flex-shrink-0"
                            style={{ background: `${display.color}15` }}
                          >
                            {display.icon}
                          </span>
                          <span className="text-xs font-medium text-foreground truncate">{display.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-muted/30 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${CONF_BG(row.confidence)}`}
                              style={{ width: `${row.confidence}%` }}
                            />
                          </div>
                          <span className={`text-xs font-bold ${CONF_COLOR(row.confidence)}`}>
                            {row.confidence.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Show more / less */}
        {hasMore && (
          <div className="px-5 py-3 border-t border-border flex items-center justify-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-xs text-primary font-medium hover:text-primary/80 transition-colors flex items-center gap-1"
            >
              {showAll ? (
                <>Show less <ChevronUp className="w-3 h-3" /></>
              ) : (
                <>Show all {predictions.length} predictions <ChevronDown className="w-3 h-3" /></>
              )}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
}
