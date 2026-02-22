'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Loader2 } from 'lucide-react'
import { containerVariants, itemVariants } from '@/lib/animations'

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('http://localhost:8000/api/clients')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch')
        return res.json()
      })
      .then(data => {
        setClients(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-foreground">Clients</h1>
        <p className="text-muted-foreground mt-2">Manage and track all your clients in one place.</p>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-card border border-border rounded-xl p-6 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="ml-3">Loading clients...</span>
          </div>
        ) : error ? (
          <div className="text-red-500 py-12 text-center">Failed to load: {error}</div>
        ) : clients.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No clients found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-semibold">ID</th>
                  <th className="px-6 py-4 font-semibold">Type</th>
                  <th className="px-6 py-4 font-semibold">Name / Company</th>
                  <th className="px-6 py-4 font-semibold">Email</th>
                  <th className="px-6 py-4 font-semibold">City</th>
                  <th className="px-6 py-4 font-semibold">Risk Profile</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {clients.map((client, idx) => (
                  <tr key={idx} className="hover:bg-muted/10 transition-colors">
                    <td className="px-6 py-4">{client.client_id}</td>
                    <td className="px-6 py-4">{client.client_type}</td>
                    <td className="px-6 py-4 font-medium text-foreground">
                      {client.client_type === 'Company' ? client.company_name : client.full_name}
                    </td>
                    <td className="px-6 py-4">{client.email || 'N/A'}</td>
                    <td className="px-6 py-4">{client.city}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${client.risk_profile === 'Low' ? 'bg-emerald-500/10 text-emerald-500' :
                          client.risk_profile === 'Medium' ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'
                        }`}>
                        {client.risk_profile}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${client.current_insurance_status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' :
                          client.current_insurance_status === 'Pending' ? 'bg-amber-500/10 text-amber-500' : 'bg-muted/30 text-muted-foreground'
                        }`}>
                        {client.current_insurance_status || 'None'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
