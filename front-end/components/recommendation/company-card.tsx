'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { InsuranceCompany } from '@/lib/recommendation-data'

interface CompanyCardProps {
  company: InsuranceCompany
  index?: number
}

export function CompanyCard({ company, index = 0 }: CompanyCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ y: -4, boxShadow: '0 20px 25px -5px rgba(59, 130, 246, 0.15)' }}
      className="relative group"
    >
      <div className="bg-card border border-border rounded-lg p-5 hover:border-primary/50 transition-colors">
        {/* Rank Badge */}
        <div className="absolute top-3 right-3 bg-primary/20 border border-primary/50 rounded-lg px-3 py-1">
          <span className="text-xs font-bold text-primary">#{company.rank}</span>
        </div>

        {/* Company Name */}
        <h3 className="text-base font-semibold text-foreground mb-4 pr-12">{company.name}</h3>

        {/* Match Score */}
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-muted-foreground">Match Score</span>
              <span className="text-sm font-bold text-primary">{company.matchScore}%</span>
            </div>
            <div className="w-full h-2 bg-muted/30 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${company.matchScore}%` }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
              />
            </div>
          </div>

          {/* Risk Alignment */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-muted-foreground">Risk Alignment</span>
              <span className="text-sm font-bold text-accent">{company.riskAlignment}%</span>
            </div>
            <div className="w-full h-2 bg-muted/30 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-accent"
                initial={{ width: 0 }}
                animate={{ width: `${company.riskAlignment}%` }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
              />
            </div>
          </div>

          {/* Confidence */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-muted-foreground">Confidence</span>
              <span className="text-sm font-bold text-emerald-500">{company.confidenceLevel}%</span>
            </div>
            <div className="w-full h-2 bg-muted/30 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-emerald-500"
                initial={{ width: 0 }}
                animate={{ width: `${company.confidenceLevel}%` }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
