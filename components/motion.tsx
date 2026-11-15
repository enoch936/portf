'use client'

import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'

export const easeOut = [0.21, 0.47, 0.32, 0.98] as [number, number, number, number]

// Calm version: a short fade-in, no sliding or bouncing.
export function Reveal({ children, className }: { children: React.ReactNode; className?: string; delay?: number; y?: number; x?: number }) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>
  return (
    <motion.div className={className} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.35 }}>
      {children}
    </motion.div>
  )
}

export function Stagger({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>
}

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>
}

export function WordReveal({ parts }: { parts: { text: string; gradient?: boolean }[]; delay?: number }) {
  return <>{parts.map((p) => p.text).join(' ')}</>
}

export function Magnetic({ children, className }: { children: React.ReactNode; strength?: number; className?: string }) {
  return <div className={className} style={{ display: 'inline-block' }}>{children}</div>
}

export function CountUp({ to, suffix = '' }: { to: number; suffix?: string; duration?: number }) {
  return <span>{to}{suffix}</span>
}

export function AnimatedBar({ level }: { level: number }) {
  return (
    <div className="w-full h-2 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
      <div className="h-full rounded-full bar-fill" style={{ width: `${Math.max(0, Math.min(100, level))}%` }} />
    </div>
  )
}

// Plain list of tools instead of a scrolling ticker.
export function Marquee({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {items.map((label) => (
        <span key={label} className="marquee-chip">{label}</span>
      ))}
    </div>
  )
}
