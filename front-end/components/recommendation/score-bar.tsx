'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface ScoreBarProps {
  label: string
  score: number
  maxScore?: number
  color?: string
  size?: 'sm' | 'md' | 'lg'
}

export function ScoreBar({ label, score, maxScore = 100, color = '#3B82F6', size = 'md' }: ScoreBarProps) {
  const percentage = (score / maxScore) * 100
  const clampedScore = Math.min(score, maxScore)

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5',
  }

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className={`font-medium text-slate-300 ${textSizeClasses[size]}`}>{label}</span>
        <span className={`font-semibold text-slate-100 ${textSizeClasses[size]}`}>{Math.round(clampedScore)}%</span>
      </div>
      <div className="w-full bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          className={`${sizeClasses[size]} rounded-full`}
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
