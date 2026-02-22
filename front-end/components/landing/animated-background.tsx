'use client'

import React from 'react'

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Background base */}
      <div className="absolute inset-0 bg-background" />

      {/* Animated gradient glow */}
      <div className="absolute inset-0 opacity-20 transition-opacity duration-1000 dark:opacity-40">
        {/* Primary glow - top right */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full filter blur-[120px] animate-blob" />

        {/* Secondary glow - bottom left */}
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full filter blur-[120px] animate-blob animation-delay-2000" />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
    </div>
  )
}
