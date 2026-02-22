'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react'
import { motion } from 'framer-motion'
import { navigationItems } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { useAuth } from '@/components/auth-provider'

export function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 z-50',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
              <span className="text-sidebar-primary-foreground font-bold text-sm">AI</span>
            </div>
            <span className="font-semibold text-sidebar-foreground text-sm">Broker</span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-1 hover:bg-sidebar-accent rounded-lg transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 text-sidebar-foreground/50" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-sidebar-foreground/50" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-8">
        {navigationItems.map((section, idx) => {
          // Filter items based on role
          const filteredItems = section.items.filter(item => {
            if (item.title === 'Admin' && user?.role !== 'admin') {
              return false
            }
            return true
          })

          if (filteredItems.length === 0) return null

          return (
            <div key={idx}>
              {section.label && !collapsed && (
                <h3 className="px-3 py-2 text-xs font-semibold text-sidebar-foreground/40 uppercase tracking-wider">
                  {section.label}
                </h3>
              )}
              <div className="space-y-1">
                {filteredItems.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                  const Icon = item.icon

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 relative group',
                        isActive
                          ? 'bg-sidebar-primary/20 text-sidebar-primary'
                          : 'text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                      )}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      {!collapsed && (
                        <>
                          <span className="flex-1 text-sm">{item.title}</span>
                          {item.badge && (
                            <span className="inline-flex items-center rounded-full bg-sidebar-primary/20 px-2 py-1 text-xs font-medium text-sidebar-primary">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute inset-0 rounded-lg bg-sidebar-primary/10 -z-10"
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center justify-between">
          <button className="flex-1 flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground/60 hover:bg-sidebar-accent transition-colors">
            <div className="w-8 h-8 rounded-full bg-sidebar-accent flex-shrink-0 flex items-center justify-center font-bold text-xs">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            {!collapsed && (
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-sidebar-foreground truncate max-w-[120px]">{user?.name || 'User'}</p>
                <p className="text-xs text-sidebar-foreground/50 capitalize">{user?.role || 'Broker'}</p>
              </div>
            )}
          </button>
          {!collapsed && (
            <button
              onClick={logout}
              className="p-2 text-sidebar-foreground/50 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.aside>
  )
}
