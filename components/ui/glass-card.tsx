'use client'

import React from 'react'
import { motion, useReducedMotion, HTMLMotionProps } from 'framer-motion'
import { clsx } from 'clsx'

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode
  className?: string
  glowOnHover?: boolean
}

export function GlassCard({ children, className, glowOnHover = false, onMouseMove, ...props }: GlassCardProps) {
  const reduce = useReducedMotion()

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
    onMouseMove?.(e)
  }

  return (
    <motion.div
      className={clsx('glass-card spotlight p-6 relative overflow-hidden', glowOnHover && 'card-gradient', className)}
      initial={reduce ? false : { opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
      whileHover={glowOnHover && !reduce ? { y: -6 } : undefined}
      onMouseMove={handleMove}
      {...props}
    >
      {children}
    </motion.div>
  )
}
