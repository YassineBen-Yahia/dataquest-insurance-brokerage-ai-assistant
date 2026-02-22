'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Bell, Shield, Key } from 'lucide-react'
import { containerVariants, itemVariants } from '@/lib/animations'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account and application preferences.</p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Settings Navigation */}
        <motion.div variants={itemVariants} className="w-full md:w-64 space-y-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${activeTab === 'profile' ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              }`}
          >
            <User className="w-5 h-5 flex-shrink-0" />
            Profile
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${activeTab === 'notifications' ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              }`}
          >
            <Bell className="w-5 h-5 flex-shrink-0" />
            Notifications
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${activeTab === 'security' ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              }`}
          >
            <Shield className="w-5 h-5 flex-shrink-0" />
            Security
          </button>
        </motion.div>

        {/* Settings Content */}
        <motion.div variants={itemVariants} className="flex-1">
          {activeTab === 'profile' && (
            <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-foreground mb-6">Profile Information</h2>
              <div className="space-y-6">
                <div className="flex items-center gap-6 pb-6 border-b border-border">
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-2xl font-bold text-muted-foreground">
                    JD
                  </div>
                  <div>
                    <button className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground text-sm font-medium rounded-lg transition-colors">
                      Change Avatar
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">First Name</label>
                    <input type="text" defaultValue="John" className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Last Name</label>
                    <input type="text" defaultValue="Doe" className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                    <input type="email" defaultValue="john.doe@brokerage.com" className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-2">Brokerage Agency</label>
                    <input type="text" defaultValue="Acme Insurance Partners" className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button className="px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-foreground mb-6">Notification Preferences</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div>
                    <h3 className="text-foreground font-medium">New Client Matches</h3>
                    <p className="text-sm text-muted-foreground">Receive alerts when AI finds high-confidence matches</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div>
                    <h3 className="text-foreground font-medium">Weekly Performance Report</h3>
                    <p className="text-sm text-muted-foreground">Get a summary of your matching and conversion metrics</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div>
                    <h3 className="text-foreground font-medium">System Updates</h3>
                    <p className="text-sm text-muted-foreground">Receive notifications about platform updates and maintenance</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-foreground mb-6">Security Settings</h2>

              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                    <Key className="w-5 h-5 text-muted-foreground" /> Change Password
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Current Password</label>
                      <input type="password" placeholder="••••••••" className="w-full max-w-md px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">New Password</label>
                      <input type="password" placeholder="••••••••" className="w-full max-w-md px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Confirm New Password</label>
                      <input type="password" placeholder="••••••••" className="w-full max-w-md px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                    </div>
                    <div className="pt-2">
                      <button className="px-6 py-2 bg-muted hover:bg-muted/80 text-foreground font-medium rounded-lg transition-colors">
                        Update Password
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-border">
                  <h3 className="text-lg font-medium text-foreground mb-4">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
                    <div>
                      <p className="font-medium text-foreground">Authenticator App</p>
                      <p className="text-sm text-muted-foreground mt-1">Use an app like Google Authenticator to secure your account</p>
                    </div>
                    <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-lg transition-colors">
                      Enable 2FA
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
