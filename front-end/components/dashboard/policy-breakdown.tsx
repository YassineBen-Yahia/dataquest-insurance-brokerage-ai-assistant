'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts'
import { apiFetch } from '@/lib/api'

const COLORS = ['var(--primary)', 'var(--accent)', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316', '#84cc16', '#6366f1']

export function PolicyBreakdown() {
  const [data, setData] = useState<{ name: string; value: number }[]>([])

  useEffect(() => {
    apiFetch('/api/dashboard/stats')
      .then(stats => {
        const bundleData = Object.entries(stats.bundle_distribution || {})
          .map(([name, value]) => ({ name, value: value as number }))
          .sort((a, b) => b.value - a.value)
        setData(bundleData)
      })
      .catch(() => {})
  }, [])
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.4 }}
      className="bg-card backdrop-blur-sm rounded-lg border border-border p-6"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Bundle Distribution</h3>
        <p className="text-sm text-muted-foreground mt-1">Coverage bundle breakdown</p>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend
            verticalAlign="bottom"
            height={36}
            wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
