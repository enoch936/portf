'use client'

import React, { useEffect, useRef, useState } from 'react'
import {
  motion,
  animate,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type Variants,
} from 'framer-motion'

export const easeOut = [0.21, 0.47, 0.32, 0.98] as [number, number, number, number]

/* ---------- Reveal: fade + rise when scrolled into view ---------- */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  x = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  y?: number
  x?: number
}) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, x, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, x: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.8, delay, ease: easeOut }}
    >
      {children}
    </motion.div>
  )
}

/* ---------- Stagger: children cascade in ---------- */
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}
const item: Variants = {
  hidden: { opacity: 0, y: 32, scale: 0.97, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', transition: { duration: 0.75, ease: easeOut } },
}

export function Stagger({ children, className }: { children: React.ReactNode; className?: string }) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>
  return (
    <motion.div className={className} variants={item}>
      {children}
    </motion.div>
  )
}

/* ---------- WordReveal: headline words slide up from a mask ---------- */
export function WordReveal({
  parts,
  delay = 0.1,
}: {
  parts: { text: string; gradient?: boolean }[]
  delay?: number
}) {
  const reduce = useReducedMotion()
  let index = 0
  return (
    <>
      {parts.map((part, pi) =>
        part.text.split(' ').filter(Boolean).map((word) => {
          const i = index++
          return (
            <span key={`${pi}-${i}`} className="inline-block overflow-hidden align-bottom pb-[.08em] -mb-[.08em]">
              <motion.span
                className={`inline-block ${part.gradient ? 'gradient-text' : ''}`}
                initial={reduce ? false : { y: '110%', rotate: 4 }}
                animate={{ y: 0, rotate: 0 }}
                transition={{ duration: 0.9, delay: delay + i * 0.07, ease: easeOut }}
              >
                {word}&nbsp;
              </motion.span>
            </span>
          )
        })
      )}
    </>
  )
}

/* ---------- Magnetic: element gently follows the cursor ---------- */
export function Magnetic({ children, strength = 0.25, className }: { children: React.ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 })
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 })
  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x, y, display: 'inline-block' }}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect()
        if (!r) return
        x.set((e.clientX - (r.left + r.width / 2)) * strength)
        y.set((e.clientY - (r.top + r.height / 2)) * strength)
      }}
      onMouseLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.div>
  )
}

/* ---------- CountUp ---------- */
export function CountUp({ to, suffix = '', duration = 1.8 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduce = useReducedMotion()
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!inView) return
    if (reduce) {
      setValue(to)
      return
    }
    const controls = animate(0, to, { duration, ease: 'easeOut', onUpdate: (v) => setValue(Math.round(v)) })
    return () => controls.stop()
  }, [inView, to, duration, reduce])
  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  )
}

/* ---------- AnimatedBar: skill level fill ---------- */
export function AnimatedBar({ level }: { level: number }) {
  const reduce = useReducedMotion()
  return (
    <div className="w-full h-2 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
      <motion.div
        className="h-full rounded-full bar-fill"
        initial={reduce ? false : { width: 0 }}
        whileInView={{ width: `${Math.max(0, Math.min(100, level))}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1.3, ease: easeOut, delay: 0.15 }}
      />
    </div>
  )
}

/* ---------- Marquee: infinite horizontal ticker ---------- */
export function Marquee({ items }: { items: string[] }) {
  const list = [...items, ...items]
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {list.map((label, i) => (
          <span key={i} className="marquee-chip">
            <span className="marquee-dot" />
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}
