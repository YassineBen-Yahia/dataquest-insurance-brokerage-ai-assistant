'use client'

import React from 'react'
import { Search, Bell, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export function TopBar() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <motion.header
      initial={{ y: -64 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-64 right-0 h-16 bg-background/80 backdrop-blur-md border-b border-border flex items-center justify-between px-6 z-40"
    >
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search clients, policies..."
            className={cn(
              'w-full pl-10 pr-4 py-2 rounded-lg bg-accent/10 border border-border',
              'text-sm text-foreground placeholder-muted-foreground',
              'focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30',
              'transition-all duration-200'
            )}
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4 ml-6">
        {/* Notifications */}
        <button
          className={cn(
            'p-2 rounded-lg hover:bg-accent/20 transition-colors relative',
            'text-muted-foreground hover:text-foreground'
          )}
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className={cn(
            'p-2 rounded-lg hover:bg-accent/20 transition-colors',
            'text-muted-foreground hover:text-foreground'
          )}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

      </div>
    </motion.header>
  )
}
