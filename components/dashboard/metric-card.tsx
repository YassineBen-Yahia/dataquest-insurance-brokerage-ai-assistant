'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MetricCardProps {
  label: string
  value: string | number
  trend?: number
  trendLabel?: string
  icon?: React.ReactNode
  color?: 'blue' | 'purple' | 'green' | 'orange'
}

export function MetricCard({
  label,
  value,
  trend,
  trendLabel,
  icon,
  color = 'blue',
}: MetricCardProps) {
  const colorClasses = {
    blue: 'bg-primary/10 border-primary/20 text-primary',
    purple: 'bg-accent/10 border-accent/20 text-accent',
    green: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500',
    orange: 'bg-orange-500/10 border-orange-500/20 text-orange-500',
  }

  const trendPositive = trend && trend > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      className={cn(
        'rounded-lg border bg-card backdrop-blur-sm p-6',
        'border-border hover:border-primary/50 transition-all duration-200'
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-2">{label}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-foreground">{value}</h3>
            {trend !== undefined && (
              <div className={cn(
                'flex items-center gap-1 text-xs font-medium',
                trendPositive ? 'text-emerald-500' : 'text-red-500'
              )}>
                {trendPositive ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>{Math.abs(trend)}%</span>
              </div>
            )}
          </div>
          {trendLabel && (
            <p className="text-xs text-muted-foreground/60 mt-2">{trendLabel}</p>
          )}
        </div>
        {icon && (
          <div className="text-2xl opacity-50">
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  )
}
