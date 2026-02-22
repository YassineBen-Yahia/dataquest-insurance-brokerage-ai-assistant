'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { Client, SAMPLE_CLIENTS } from '@/lib/recommendation-data'

interface ClientInputSectionProps {
  onClientSubmit: (client: Client) => void
}

export function ClientInputSection({ onClientSubmit }: ClientInputSectionProps) {
  const [activeTab, setActiveTab] = useState<'existing' | 'new'>('existing')
  const [selectedClientId, setSelectedClientId] = useState<string>(SAMPLE_CLIENTS[0].id)
  const [clientType, setClientType] = useState<'individual' | 'company'>('individual')
  const [showDropdown, setShowDropdown] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    income: '',
    employmentStatus: 'Employed',
    vehicleType: 'Sedan',
    companySize: '',
    riskCategory: 'Medium',
    coveragePreference: 'Comprehensive',
  })

  const selectedClient = SAMPLE_CLIENTS.find((c) => c.id === selectedClientId) || SAMPLE_CLIENTS[0]

  const handleExistingClientSubmit = () => {
    if (selectedClient) {
      onClientSubmit(selectedClient)
    }
  }

  const handleNewClientSubmit = () => {
    if (!formData.name || !formData.income) {
      alert('Please fill in all required fields')
      return
    }

    const newClient: Client = {
      id: `custom-${Date.now()}`,
      type: clientType,
      name: formData.name,
      income: Number(formData.income),
      employmentStatus: clientType === 'individual' ? formData.employmentStatus : undefined,
      vehicleType: clientType === 'individual' ? formData.vehicleType : undefined,
      companySize: clientType === 'company' ? Number(formData.companySize) : undefined,
      riskCategory: formData.riskCategory,
      coveragePreference: formData.coveragePreference,
    }

    onClientSubmit(newClient)

    // Reset form
    setFormData({
      name: '',
      income: '',
      employmentStatus: 'Employed',
      vehicleType: 'Sedan',
      companySize: '',
      riskCategory: 'Medium',
      coveragePreference: 'Comprehensive',
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className="h-full flex flex-col gap-6"
    >
      {/* Tabs */}
      <div className="flex gap-3">
        <button
          onClick={() => setActiveTab('existing')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${activeTab === 'existing'
              ? 'bg-primary/10 border border-primary/20 text-primary'
              : 'bg-muted/50 border border-border text-muted-foreground hover:text-foreground'
            }`}
        >
          Select Client
        </button>
        <button
          onClick={() => setActiveTab('new')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${activeTab === 'new'
              ? 'bg-primary/10 border border-primary/20 text-primary'
              : 'bg-muted/50 border border-border text-muted-foreground hover:text-foreground'
            }`}
        >
          New Client
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'existing' ? (
          <motion.div
            key="existing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-full bg-muted/50 border border-border hover:border-primary/50 rounded-lg px-4 py-3 text-left text-foreground flex items-center justify-between transition-colors"
              >
                <span className="font-medium">{selectedClient.name}</span>
                <ChevronDown
                  className="w-4 h-4 text-muted-foreground transition-transform"
                  style={{ transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)' }}
                />
              </button>

              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg overflow-hidden z-10 shadow-lg"
                >
                  {SAMPLE_CLIENTS.map((client) => (
                    <button
                      key={client.id}
                      onClick={() => {
                        setSelectedClientId(client.id)
                        setShowDropdown(false)
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground border-b border-border last:border-0"
                    >
                      <p className="font-medium">{client.name}</p>
                      <p className="text-xs text-muted-foreground/60 mt-1">
                        {client.type === 'individual' ? 'Individual' : 'Company'} • ${client.income.toLocaleString()}/yr
                      </p>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Client Details */}
            {selectedClient && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-muted/30 border border-border rounded-lg p-4 space-y-3 text-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-medium text-foreground capitalize">{selectedClient.type}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Income</span>
                  <span className="font-medium text-emerald-500">${selectedClient.income.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Risk Category</span>
                  <span className="font-medium text-foreground">{selectedClient.riskCategory}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Coverage</span>
                  <span className="font-medium text-foreground">{selectedClient.coveragePreference}</span>
                </div>
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleExistingClientSubmit}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-lg transition-all shadow-sm mt-6"
            >
              Get Recommendations
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="new"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Client Type Toggle */}
            <div className="flex gap-3">
              <button
                onClick={() => setClientType('individual')}
                className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all ${clientType === 'individual'
                    ? 'bg-primary/10 border border-primary/20 text-primary'
                    : 'bg-muted/50 border border-border text-muted-foreground'
                  }`}
              >
                Individual
              </button>
              <button
                onClick={() => setClientType('company')}
                className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all ${clientType === 'company'
                    ? 'bg-primary/10 border border-primary/20 text-primary'
                    : 'bg-muted/50 border border-border text-muted-foreground'
                  }`}
              >
                Company
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-3">
              {/* Name */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-2">Client Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter client name"
                  className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-foreground placeholder-muted-foreground/50 focus:border-primary outline-none transition-colors text-sm"
                />
              </div>

              {/* Income */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-2">Annual Income *</label>
                <input
                  type="number"
                  value={formData.income}
                  onChange={(e) => setFormData({ ...formData, income: e.target.value })}
                  placeholder="Enter annual income"
                  className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-foreground placeholder-muted-foreground/50 focus:border-primary outline-none transition-colors text-sm"
                />
              </div>

              {/* Conditional Fields */}
              {clientType === 'individual' ? (
                <>
                  {/* Employment Status */}
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-2">Employment Status</label>
                    <select
                      value={formData.employmentStatus}
                      onChange={(e) => setFormData({ ...formData, employmentStatus: e.target.value })}
                      className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-foreground focus:border-primary outline-none transition-colors text-sm"
                    >
                      <option value="Employed">Employed</option>
                      <option value="Self-Employed">Self-Employed</option>
                      <option value="Retired">Retired</option>
                    </select>
                  </div>

                  {/* Vehicle Type */}
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-2">Vehicle Type</label>
                    <select
                      value={formData.vehicleType}
                      onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                      className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-foreground focus:border-primary outline-none transition-colors text-sm"
                    >
                      <option value="Sedan">Sedan</option>
                      <option value="SUV">SUV</option>
                      <option value="Truck">Truck</option>
                      <option value="Luxury">Luxury</option>
                    </select>
                  </div>
                </>
              ) : (
                <>
                  {/* Company Size */}
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-2">Company Size</label>
                    <input
                      type="number"
                      value={formData.companySize}
                      onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                      placeholder="Number of employees"
                      className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-foreground placeholder-muted-foreground/50 focus:border-primary outline-none transition-colors text-sm"
                    />
                  </div>
                </>
              )}

              {/* Risk Category */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-2">Risk Category</label>
                <select
                  value={formData.riskCategory}
                  onChange={(e) => setFormData({ ...formData, riskCategory: e.target.value })}
                  className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-foreground focus:border-primary outline-none transition-colors text-sm"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              {/* Coverage Preference */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-2">Coverage Preference</label>
                <select
                  value={formData.coveragePreference}
                  onChange={(e) => setFormData({ ...formData, coveragePreference: e.target.value })}
                  className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-foreground focus:border-primary outline-none transition-colors text-sm"
                >
                  <option value="Basic">Basic</option>
                  <option value="Comprehensive">Comprehensive</option>
                  <option value="Full Coverage">Full Coverage</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleNewClientSubmit}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-lg transition-all shadow-sm mt-6"
            >
              Get Recommendations
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
