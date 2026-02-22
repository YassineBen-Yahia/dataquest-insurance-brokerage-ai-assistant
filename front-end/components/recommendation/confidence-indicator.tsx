'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface ConfidenceIndicatorProps {
  level: number // 0-100
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

export function ConfidenceIndicator({ level, size = 'md', showLabel = true }: ConfidenceIndicatorProps) {
  const getColor = (level: number) => {
    if (level >= 90) return '#10B981' // emerald
    if (level >= 75) return '#3B82F6' // blue
    if (level >= 60) return '#F59E0B' // amber
    return '#EF4444' // red
  }

  const getLabel = (level: number) => {
    if (level >= 90) return 'Very High'
    if (level >= 75) return 'High'
    if (level >= 60) return 'Moderate'
    return 'Low'
  }

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  }

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }

  const color = getColor(level)

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`${sizeClasses[size]} relative flex items-center justify-center`}>
        {/* Outer ring */}
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#334155" strokeWidth="2" />
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ strokeDasharray: '0 283' }}
            animate={{ strokeDasharray: `${(level / 100) * 283} 283` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{ rotate: '-90deg' }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-bold ${textSizeClasses[size]}`} style={{ color }}>
            {Math.round(level)}%
          </span>
        </div>
      </div>
      {showLabel && <span className="text-xs text-slate-400">{getLabel(level)} Confidence</span>}
    </div>
  )
}
