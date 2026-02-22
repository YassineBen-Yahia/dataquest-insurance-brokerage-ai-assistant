'use client'

import React from 'react'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts'

interface PolicyRadarChartProps {
  coverageStrength: number
  costEfficiency: number
  riskMatch: number
}

export function PolicyRadarChart({ coverageStrength, costEfficiency, riskMatch }: PolicyRadarChartProps) {
  const data = [
    {
      category: 'Coverage',
      value: coverageStrength,
    },
    {
      category: 'Cost',
      value: costEfficiency,
    },
    {
      category: 'Risk',
      value: riskMatch,
    },
  ]

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis dataKey="category" tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} />
          <Radar name="Score" dataKey="value" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
