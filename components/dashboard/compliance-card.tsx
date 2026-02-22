'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { FileCheck, AlertTriangle, CheckCircle, Clock } from 'lucide-react'

const documents = [
  {
    id: 1,
    name: 'SOC 2 Type II Compliance',
    status: 'verified',
    dueDate: 'Expires Dec 2024',
    icon: <CheckCircle className="w-4 h-4" />,
  },
  {
    id: 2,
    name: 'Annual Audit Report',
    status: 'pending',
    dueDate: 'Due in 15 days',
    icon: <Clock className="w-4 h-4" />,
  },
  {
    id: 3,
    name: 'HIPAA Business Associate',
    status: 'verified',
    dueDate: 'Expires Jun 2025',
    icon: <CheckCircle className="w-4 h-4" />,
  },
  {
    id: 4,
    name: 'Privacy Policy Update',
    status: 'overdue',
    dueDate: 'Overdue by 3 days',
    icon: <AlertTriangle className="w-4 h-4" />,
  },
]

export function ComplianceCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.7 }}
      className="bg-card backdrop-blur-sm rounded-lg border border-border p-6 col-span-full"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-primary" />
            Compliance & Documents
          </h3>
          <p className="text-sm text-muted-foreground mt-1">Manage regulatory requirements and documentation</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 text-sm font-medium transition-colors border border-primary/20"
        >
          Upload Document
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {documents.map((doc, idx) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 * idx }}
            className={`p-4 rounded-lg border transition-all group cursor-pointer ${doc.status === 'verified'
                ? 'bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/50'
                : doc.status === 'pending'
                  ? 'bg-primary/10 border-primary/20 hover:border-primary/50'
                  : 'bg-red-500/10 border-red-500/20 hover:border-red-500/50'
              }`}
          >
            <div className="flex items-start justify-between">
              <div className={`${doc.status === 'verified'
                  ? 'text-emerald-500'
                  : doc.status === 'pending'
                    ? 'text-primary'
                    : 'text-red-500'
                }`}>
                {doc.icon}
              </div>
            </div>
            <p className="text-sm font-medium text-foreground mt-2 line-clamp-2">{doc.name}</p>
            <p className={`text-xs mt-2 ${doc.status === 'verified'
                ? 'text-emerald-500/80'
                : doc.status === 'pending'
                  ? 'text-primary/80'
                  : 'text-red-500/80'
              }`}>
              {doc.dueDate}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
