'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Users, FileText, TrendingUp, AlertCircle, CheckCircle2, Building2, Layers, Clock } from 'lucide-react'
import { MetricCard } from '@/components/dashboard/metric-card'
import { PerformanceChart } from '@/components/dashboard/performance-chart'
import { ClientDistribution } from '@/components/dashboard/client-distribution'
import { PolicyBreakdown } from '@/components/dashboard/policy-breakdown'
import { AIClassificationsCard } from '@/components/dashboard/ai-classifications-card'
import { InsuranceQuotesCard } from '@/components/dashboard/insurance-quotes-card'
import { ComplianceCard } from '@/components/dashboard/compliance-card'
import { containerVariants, itemVariants } from '@/lib/animations'

export default function DashboardPage() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome back! Here's your AI bundle classification platform overview.</p>
      </motion.div>

      {/* Metrics Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <MetricCard
          label="Total Customers"
          value="327"
          trend={12}
          trendLabel="vs last month"
          icon={<Users />}
          color="blue"
        />
        <MetricCard
          label="Bundles Classified"
          value="284"
          trend={8}
          trendLabel="this month"
          icon={<TrendingUp />}
          color="purple"
        />
        <MetricCard
          label="Pending Classification"
          value="43"
          trend={-5}
          trendLabel="awaiting review"
          icon={<AlertCircle />}
          color="orange"
        />
        <MetricCard
          label="Model Accuracy"
          value="91%"
          trend={3}
          trendLabel="top-1 accuracy"
          icon={<FileText />}
          color="green"
        />
      </motion.div>

      {/* AI Recommendations */}
      <motion.div variants={itemVariants}>
        <AIClassificationsCard />
      </motion.div>

      {/* Charts Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <PerformanceChart />
        <ClientDistribution />
      </motion.div>

      {/* Bottom Row */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 gap-6"
      >
        <InsuranceQuotesCard />
      </motion.div>

      {/* Compliance */}
      <motion.div variants={itemVariants}>
        <ComplianceCard />
      </motion.div>

      {/* Final Row */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <PolicyBreakdown />

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="bg-card backdrop-blur-sm rounded-lg border border-border p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
          </div>
          <div className="space-y-4">
            {[
              { action: 'New customer profile added', time: '2 hours ago', Icon: Users, color: 'text-blue-500' },
              { action: 'Bundle classification completed', time: '4 hours ago', Icon: CheckCircle2, color: 'text-emerald-500' },
              { action: 'Insurance company data updated', time: '1 day ago', Icon: Building2, color: 'text-purple-500' },
              { action: 'New bundle classification run', time: '2 days ago', Icon: Layers, color: 'text-amber-500' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 pb-3 border-b border-border last:border-0">
                <div className={`p-2 rounded-lg bg-accent/10 ${item.color}`}>
                  <item.Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">{item.action}</p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
