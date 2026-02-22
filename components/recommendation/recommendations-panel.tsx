'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { DetailedPolicy, InsuranceCompany } from '@/lib/recommendation-data'
import { CompanyCard } from './company-card'
import { PolicyCard } from './policy-card'
import { PolicyDetailDrawer } from './policy-detail-drawer'

interface RecommendationsPanelProps {
  companies: InsuranceCompany[]
  policies: DetailedPolicy[]
  isLoading?: boolean
}

export function RecommendationsPanel({ companies, policies, isLoading }: RecommendationsPanelProps) {
  const [selectedPolicy, setSelectedPolicy] = useState<DetailedPolicy | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const handlePolicySelect = (policy: DetailedPolicy) => {
    setSelectedPolicy(policy)
    setIsDrawerOpen(true)
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.15 }}
        className="h-full flex flex-col gap-8 overflow-y-auto"
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
            />
          </div>
        ) : policies.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-muted-foreground text-sm">Select a client to see personalized recommendations</p>
          </div>
        ) : (
          <>
            {/* Insurance Companies Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-lg font-bold text-foreground mb-4">Top Insurance Companies</h3>
              <div className="grid grid-cols-1 gap-3">
                {companies.slice(0, 3).map((company, index) => (
                  <CompanyCard key={company.id} company={company} index={index} />
                ))}
              </div>
            </motion.div>

            {/* Policies Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <h3 className="text-lg font-bold text-foreground mb-4">Recommended Policies</h3>
              <div className="space-y-3">
                {policies.map((policy, index) => (
                  <PolicyCard
                    key={policy.id}
                    policy={policy}
                    index={index}
                    onSelect={handlePolicySelect}
                  />
                ))}
              </div>
            </motion.div>
          </>
        )}
      </motion.div>

      {/* Policy Detail Drawer */}
      <PolicyDetailDrawer policy={selectedPolicy} isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  )
}
