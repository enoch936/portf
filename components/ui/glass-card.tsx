'use client'

import React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { clsx } from 'clsx'

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode
  className?: string
  glowOnHover?: boolean
}

export function GlassCard({ children, className, glowOnHover = false, ...props }: GlassCardProps) {
  return (
    <motion.div
      className={clsx(
        'glass-card p-6 relative overflow-hidden transition-all duration-300',
        glowOnHover && 'glass-glow',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
}
