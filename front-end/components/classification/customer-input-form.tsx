'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Sparkles } from 'lucide-react'
import { CustomerProfile, SAMPLE_CUSTOMERS } from '@/lib/classification-data'

interface CustomerInputFormProps {
  onSubmit: (customer: CustomerProfile) => void
  isLoading?: boolean
}

const FIELD_SELECT = 'w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-foreground focus:border-primary outline-none transition-colors text-sm'
const FIELD_INPUT  = 'w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-foreground placeholder-muted-foreground/50 focus:border-primary outline-none transition-colors text-sm'

export function CustomerInputForm({ onSubmit, isLoading }: CustomerInputFormProps) {
  const [activeTab, setActiveTab] = useState<'sample' | 'custom'>('sample')
  const [selectedId, setSelectedId] = useState<string>(SAMPLE_CUSTOMERS[0].id)
  const [showDropdown, setShowDropdown] = useState(false)
  const [form, setForm] = useState<Omit<CustomerProfile, 'id' | 'name'> & { name: string }>({
    name: '',
    age: 30,
    gender: 'Male',
    maritalStatus: 'Single',
    annualIncome: 60000,
    employmentStatus: 'Employed',
    numDependents: 0,
    educationLevel: "Bachelor's",
    propertyOwnership: 'Renter',
    vehicleType: 'Sedan',
    priorClaimsCount: 0,
    region: 'East',
  })

  const selectedCustomer = SAMPLE_CUSTOMERS.find((c) => c.id === selectedId) ?? SAMPLE_CUSTOMERS[0]

  const field = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleSampleSubmit = () => onSubmit(selectedCustomer)

  const handleCustomSubmit = () => {
    if (!form.name.trim()) return
    onSubmit({
      id: `custom-${Date.now()}`,
      ...form,
      age: Number(form.age),
      annualIncome: Number(form.annualIncome),
      numDependents: Number(form.numDependents),
      priorClaimsCount: Number(form.priorClaimsCount),
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className="h-full flex flex-col gap-5"
    >
      {/* Header */}
      <div>
        <h2 className="text-base font-semibold text-foreground">Customer Profile</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Enter demographic & behavioural features for bundle prediction</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-3">
        {(['sample', 'custom'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all ${
              activeTab === tab
                ? 'bg-primary/10 border border-primary/20 text-primary'
                : 'bg-muted/50 border border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab === 'sample' ? 'Sample Customer' : 'New Customer'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {activeTab === 'sample' ? (
          <motion.div key="sample" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            {/* Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-full bg-muted/50 border border-border hover:border-primary/50 rounded-lg px-4 py-3 text-left text-foreground flex items-center justify-between transition-colors"
              >
                <span className="font-medium">{selectedCustomer.name}</span>
                <ChevronDown className="w-4 h-4 text-muted-foreground" style={{ transform: showDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg overflow-hidden z-10 shadow-lg"
                >
                  {SAMPLE_CUSTOMERS.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => { setSelectedId(c.id); setShowDropdown(false) }}
                      className="w-full text-left px-4 py-3 hover:bg-muted transition-colors border-b border-border last:border-0"
                    >
                      <p className="font-medium text-foreground text-sm">{c.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Age {c.age} · {c.employmentStatus} · ${c.annualIncome.toLocaleString()}/yr</p>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Details card */}
            <div className="bg-muted/30 border border-border rounded-lg p-4 mt-4 space-y-2 text-sm">
              {[
                ['Age', selectedCustomer.age],
                ['Gender', selectedCustomer.gender],
                ['Marital Status', selectedCustomer.maritalStatus],
                ['Annual Income', `$${selectedCustomer.annualIncome.toLocaleString()}`],
                ['Employment', selectedCustomer.employmentStatus],
                ['Dependents', selectedCustomer.numDependents],
                ['Education', selectedCustomer.educationLevel],
                ['Property', selectedCustomer.propertyOwnership],
                ['Vehicle', selectedCustomer.vehicleType],
                ['Prior Claims', selectedCustomer.priorClaimsCount],
                ['Region', selectedCustomer.region],
              ].map(([label, value]) => (
                <div key={String(label)} className="flex items-center justify-between">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium text-foreground">{String(value)}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleSampleSubmit}
              disabled={isLoading}
              className="w-full mt-5 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-60 text-primary-foreground font-semibold py-3 px-6 rounded-lg transition-all shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              {isLoading ? 'Classifying…' : 'Predict Bundle'}
            </button>
          </motion.div>
        ) : (
          <motion.div key="custom" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            {/* Name */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Full Name *</label>
              <input type="text" value={form.name} onChange={(e) => field('name', e.target.value)} placeholder="Enter customer name" className={FIELD_INPUT} />
            </div>

            {/* Age + Gender */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Age</label>
                <input type="number" min={18} max={90} value={form.age} onChange={(e) => field('age', Number(e.target.value))} className={FIELD_INPUT} />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Gender</label>
                <select value={form.gender} onChange={(e) => field('gender', e.target.value as CustomerProfile['gender'])} className={FIELD_SELECT}>
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
            </div>

            {/* Marital Status */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Marital Status</label>
              <select value={form.maritalStatus} onChange={(e) => field('maritalStatus', e.target.value as CustomerProfile['maritalStatus'])} className={FIELD_SELECT}>
                <option>Single</option><option>Married</option><option>Divorced</option><option>Widowed</option>
              </select>
            </div>

            {/* Annual Income */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Annual Income ($)</label>
              <input type="number" min={0} value={form.annualIncome} onChange={(e) => field('annualIncome', Number(e.target.value))} placeholder="e.g. 75000" className={FIELD_INPUT} />
            </div>

            {/* Employment */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Employment Status</label>
              <select value={form.employmentStatus} onChange={(e) => field('employmentStatus', e.target.value as CustomerProfile['employmentStatus'])} className={FIELD_SELECT}>
                <option>Employed</option><option>Self-Employed</option><option>Unemployed</option><option>Retired</option>
              </select>
            </div>

            {/* Dependents */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Number of Dependents</label>
              <input type="number" min={0} max={10} value={form.numDependents} onChange={(e) => field('numDependents', Number(e.target.value))} className={FIELD_INPUT} />
            </div>

            {/* Education */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Education Level</label>
              <select value={form.educationLevel} onChange={(e) => field('educationLevel', e.target.value as CustomerProfile['educationLevel'])} className={FIELD_SELECT}>
                <option>High School</option><option>{"Bachelor's"}</option><option>{"Master's"}</option><option>PhD</option>
              </select>
            </div>

            {/* Property + Vehicle */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Property</label>
                <select value={form.propertyOwnership} onChange={(e) => field('propertyOwnership', e.target.value as CustomerProfile['propertyOwnership'])} className={FIELD_SELECT}>
                  <option>Renter</option><option>Homeowner</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Vehicle</label>
                <select value={form.vehicleType} onChange={(e) => field('vehicleType', e.target.value as CustomerProfile['vehicleType'])} className={FIELD_SELECT}>
                  <option>None</option><option>Sedan</option><option>SUV</option><option>Truck</option><option>Luxury</option>
                </select>
              </div>
            </div>

            {/* Prior Claims + Region */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Prior Claims</label>
                <input type="number" min={0} max={10} value={form.priorClaimsCount} onChange={(e) => field('priorClaimsCount', Number(e.target.value))} className={FIELD_INPUT} />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Region</label>
                <select value={form.region} onChange={(e) => field('region', e.target.value as CustomerProfile['region'])} className={FIELD_SELECT}>
                  <option>North</option><option>South</option><option>East</option><option>West</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleCustomSubmit}
              disabled={isLoading || !form.name.trim()}
              className="w-full mt-3 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-60 text-primary-foreground font-semibold py-3 px-6 rounded-lg transition-all shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              {isLoading ? 'Classifying…' : 'Predict Bundle'}
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
