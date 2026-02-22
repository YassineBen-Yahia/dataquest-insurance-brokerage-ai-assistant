'use client'

import React, { useState } from 'react'
import { Sidebar } from './sidebar'
import { TopBar } from './top-bar'
import { motion } from 'framer-motion'
import { pageTransition } from '@/lib/animations'
import { cn } from '@/lib/utils'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="bg-background min-h-screen">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <TopBar />
      <motion.main
        initial={pageTransition.initial}
        animate={pageTransition.animate}
        exit={pageTransition.exit}
        transition={pageTransition.transition}
        className={cn(
          "mt-16 p-6 transition-all duration-300",
          collapsed ? "ml-20" : "ml-64"
        )}
      >
        {children}
      </motion.main>
    </div>
  )
}
