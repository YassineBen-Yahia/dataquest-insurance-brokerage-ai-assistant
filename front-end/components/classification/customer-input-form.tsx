'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { SinglePredictionInput, CATEGORICAL_OPTIONS, getDefaultSingleInput } from '@/lib/classification-data'

interface CustomerInputFormProps {
  onSubmit: (input: SinglePredictionInput) => void
  isLoading?: boolean
}

const FIELD_SELECT = 'w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-foreground focus:border-primary outline-none transition-colors text-sm'
const FIELD_INPUT  = 'w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-foreground placeholder-muted-foreground/50 focus:border-primary outline-none transition-colors text-sm'
const LABEL = 'block text-xs font-medium text-muted-foreground mb-1'

export function CustomerInputForm({ onSubmit, isLoading }: CustomerInputFormProps) {
  const [form, setForm] = useState<SinglePredictionInput>(getDefaultSingleInput())

  const set = <K extends keyof SinglePredictionInput>(key: K, value: SinglePredictionInput[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = () => onSubmit(form)

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className="h-full flex flex-col gap-4"
    >
      {/* Header */}
      <div>
        <h2 className="text-base font-semibold text-foreground">Client Profile</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Enter policy & demographic features matching the training schema</p>
      </div>

      {/* Scrollable form */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {/* Income */}
        <div>
          <label className={LABEL}>Estimated Annual Income ($)</label>
          <input type="number" min={0} value={form.Estimated_Annual_Income} onChange={(e) => set('Estimated_Annual_Income', Number(e.target.value))} placeholder="e.g. 75000" className={FIELD_INPUT} />
        </div>

        {/* Employment Status */}
        <div>
          <label className={LABEL}>Employment Status</label>
          <select value={form.Employment_Status} onChange={(e) => set('Employment_Status', e.target.value)} className={FIELD_SELECT}>
            {CATEGORICAL_OPTIONS.Employment_Status.map((v) => <option key={v} value={v}>{v.replace(/_/g, ' ')}</option>)}
          </select>
        </div>

        {/* Dependents row */}
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className={LABEL}>Adult Dep.</label>
            <input type="number" min={0} max={10} value={form.Adult_Dependents} onChange={(e) => set('Adult_Dependents', Number(e.target.value))} className={FIELD_INPUT} />
          </div>
          <div>
            <label className={LABEL}>Child Dep.</label>
            <input type="number" min={0} max={10} value={form.Child_Dependents ?? 0} onChange={(e) => set('Child_Dependents', Number(e.target.value))} className={FIELD_INPUT} />
          </div>
          <div>
            <label className={LABEL}>Infant Dep.</label>
            <input type="number" min={0} max={10} value={form.Infant_Dependents} onChange={(e) => set('Infant_Dependents', Number(e.target.value))} className={FIELD_INPUT} />
          </div>
        </div>

        {/* Region + Broker Agency */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className={LABEL}>Region Code</label>
            <select value={form.Region_Code} onChange={(e) => set('Region_Code', e.target.value)} className={FIELD_SELECT}>
              {CATEGORICAL_OPTIONS.Region_Code.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className={LABEL}>Broker Agency</label>
            <select value={form.Broker_Agency_Type} onChange={(e) => set('Broker_Agency_Type', e.target.value)} className={FIELD_SELECT}>
              {CATEGORICAL_OPTIONS.Broker_Agency_Type.map((v) => <option key={v} value={v}>{v.replace(/_/g, ' ')}</option>)}
            </select>
          </div>
        </div>

        {/* Vehicles + Riders */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className={LABEL}>Vehicles on Policy</label>
            <input type="number" min={0} max={10} value={form.Vehicles_on_Policy} onChange={(e) => set('Vehicles_on_Policy', Number(e.target.value))} className={FIELD_INPUT} />
          </div>
          <div>
            <label className={LABEL}>Custom Riders</label>
            <input type="number" min={0} max={10} value={form.Custom_Riders_Requested} onChange={(e) => set('Custom_Riders_Requested', Number(e.target.value))} className={FIELD_INPUT} />
          </div>
        </div>

        {/* Deductible + Acquisition */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className={LABEL}>Deductible Tier</label>
            <select value={form.Deductible_Tier} onChange={(e) => set('Deductible_Tier', e.target.value)} className={FIELD_SELECT}>
              {CATEGORICAL_OPTIONS.Deductible_Tier.map((v) => <option key={v} value={v}>{v.replace(/_/g, ' ')}</option>)}
            </select>
          </div>
          <div>
            <label className={LABEL}>Acquisition Channel</label>
            <select value={form.Acquisition_Channel} onChange={(e) => set('Acquisition_Channel', e.target.value)} className={FIELD_SELECT}>
              {CATEGORICAL_OPTIONS.Acquisition_Channel.map((v) => <option key={v} value={v}>{v.replace(/_/g, ' ')}</option>)}
            </select>
          </div>
        </div>

        {/* Payment + Month */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className={LABEL}>Payment Schedule</label>
            <select value={form.Payment_Schedule} onChange={(e) => set('Payment_Schedule', e.target.value)} className={FIELD_SELECT}>
              {CATEGORICAL_OPTIONS.Payment_Schedule.map((v) => <option key={v} value={v}>{v.replace(/_/g, ' ')}</option>)}
            </select>
          </div>
          <div>
            <label className={LABEL}>Policy Start Month</label>
            <select value={form.Policy_Start_Month} onChange={(e) => set('Policy_Start_Month', e.target.value)} className={FIELD_SELECT}>
              {CATEGORICAL_OPTIONS.Policy_Start_Month.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
        </div>

        {/* Claims + Years Without Claims */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className={LABEL}>Previous Claims</label>
            <input type="number" min={0} max={20} value={form.Previous_Claims_Filed} onChange={(e) => set('Previous_Claims_Filed', Number(e.target.value))} className={FIELD_INPUT} />
          </div>
          <div>
            <label className={LABEL}>Yrs Without Claims</label>
            <input type="number" min={0} max={30} value={form.Years_Without_Claims} onChange={(e) => set('Years_Without_Claims', Number(e.target.value))} className={FIELD_INPUT} />
          </div>
        </div>

        {/* Policy Duration + Days Since Quote */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className={LABEL}>Prev. Policy (months)</label>
            <input type="number" min={0} value={form.Previous_Policy_Duration_Months} onChange={(e) => set('Previous_Policy_Duration_Months', Number(e.target.value))} className={FIELD_INPUT} />
          </div>
          <div>
            <label className={LABEL}>Days Since Quote</label>
            <input type="number" min={0} value={form.Days_Since_Quote} onChange={(e) => set('Days_Since_Quote', Number(e.target.value))} className={FIELD_INPUT} />
          </div>
        </div>

        {/* Grace + Amendments + Underwriting */}
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className={LABEL}>Grace Ext.</label>
            <input type="number" min={0} max={10} value={form.Grace_Period_Extensions} onChange={(e) => set('Grace_Period_Extensions', Number(e.target.value))} className={FIELD_INPUT} />
          </div>
          <div>
            <label className={LABEL}>Amendments</label>
            <input type="number" min={0} max={10} value={form.Policy_Amendments_Count} onChange={(e) => set('Policy_Amendments_Count', Number(e.target.value))} className={FIELD_INPUT} />
          </div>
          <div>
            <label className={LABEL}>UW Days</label>
            <input type="number" min={0} value={form.Underwriting_Processing_Days} onChange={(e) => set('Underwriting_Processing_Days', Number(e.target.value))} className={FIELD_INPUT} />
          </div>
        </div>

        {/* Existing Policyholder toggle */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-medium text-muted-foreground">Existing Policyholder</label>
          <button
            type="button"
            onClick={() => set('Existing_Policyholder', form.Existing_Policyholder === 1 ? 0 : 1)}
            className={`w-10 h-5 rounded-full transition-colors relative ${form.Existing_Policyholder === 1 ? 'bg-primary' : 'bg-muted'}`}
          >
            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${form.Existing_Policyholder === 1 ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
          <span className="text-xs text-muted-foreground">{form.Existing_Policyholder === 1 ? 'Yes' : 'No'}</span>
        </div>
      </div>

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-60 text-primary-foreground font-semibold py-3 px-6 rounded-lg transition-all shadow-sm"
      >
        <Sparkles className="w-4 h-4" />
        {isLoading ? 'Running ML Pipeline…' : 'Predict Bundle'}
      </button>
    </motion.div>
  )
}
