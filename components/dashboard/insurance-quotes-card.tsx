'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { DollarSign, CheckCircle2, Clock } from 'lucide-react'

const quotes = [
  {
    id: 1,
    company: 'SafeGuard Insurance',
    clientName: 'Tech Startup Inc',
    policyType: 'Business Liability',
    premium: '$2,850',
    status: 'quoted',
    expires: '3 days',
  },
  {
    id: 2,
    company: 'Guardian Plus',
    clientName: 'Manufacturing Co',
    policyType: 'Workers Compensation',
    premium: '$4,200',
    status: 'accepted',
    expires: 'Active',
  },
  {
    id: 3,
    company: 'Premier Coverage',
    clientName: 'Retail Group LLC',
    policyType: 'Property Insurance',
    premium: '$1,950',
    status: 'pending',
    expires: '5 days',
  },
]

export function InsuranceQuotesCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.6 }}
      className="bg-card backdrop-blur-sm rounded-lg border border-border p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-500" />
            Active Quotes & Policies
          </h3>
          <p className="text-sm text-muted-foreground mt-1">{quotes.length} recent transactions</p>
        </div>
      </div>

      <div className="space-y-2">
        {quotes.map((quote, idx) => (
          <motion.div
            key={quote.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 * idx }}
            className="flex items-center justify-between p-3 rounded-lg bg-accent/5 border border-border hover:border-primary/50 transition-all group"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{quote.clientName}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{quote.company} • {quote.policyType}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-foreground">{quote.premium}</span>
              <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium">
                {quote.status === 'accepted' ? (
                  <div className="flex items-center gap-1 text-emerald-500">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approved</span>
                  </div>
                ) : quote.status === 'quoted' ? (
                  <div className="flex items-center gap-1 text-primary">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Quoted</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-amber-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Pending</span>
                  </div>
                )}
              </div>
              <span className="text-xs text-muted-foreground w-12 text-right">{quote.expires}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.button
        whileHover={{ x: 4 }}
        className="w-full mt-4 py-2 rounded-lg bg-muted/50 border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
      >
        View All Quotes →
      </motion.button>
    </motion.div>
  )
}
