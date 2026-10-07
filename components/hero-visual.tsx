'use client'

import React from 'react'
import Image from 'next/image'
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import { MapPin, Sparkles, Zap } from 'lucide-react'
import { CountUp } from './motion'

interface Stat { label: string; value: number; suffix?: string }

export function HeroVisual({
  name,
  avatarUrl,
  location,
  stats,
  chips,
}: {
  name: string
  avatarUrl: string
  location: string
  stats: Stat[]
  chips: string[]
}) {
  const reduce = useReducedMotion()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [9, -9]), { stiffness: 150, damping: 18 })
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-11, 11]), { stiffness: 150, damping: 18 })
  const glareX = useTransform(mx, [-0.5, 0.5], ['20%', '80%'])
  const glareY = useTransform(my, [-0.5, 0.5], ['10%', '90%'])
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,.55), transparent 55%)`

  const float = (d: number, delay = 0) =>
    reduce ? {} : { animate: { y: [0, -d, 0] }, transition: { duration: 5 + delay, repeat: Infinity, ease: 'easeInOut' as const, delay } }

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 40, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1, delay: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="relative mx-auto w-full max-w-md [perspective:1100px]"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        mx.set((e.clientX - r.left) / r.width - 0.5)
        my.set((e.clientY - r.top) / r.height - 0.5)
      }}
      onMouseLeave={() => {
        mx.set(0)
        my.set(0)
      }}
    >
      <div className="absolute -inset-6 rounded-[3rem] blur-3xl opacity-60" style={{ background: 'linear-gradient(135deg, color-mix(in srgb, var(--brand-1) 45%, transparent), color-mix(in srgb, var(--brand-2) 40%, transparent))' }} />

      <motion.div style={reduce ? undefined : { rotateX, rotateY, transformStyle: 'preserve-3d' }} className="relative">
        <div className="glass-card card-gradient relative overflow-hidden p-4 sm:p-5" style={{ borderRadius: '1.75rem' }}>
          <div className="relative aspect-[4/4.4] overflow-hidden rounded-[1.25rem] bg-slate-200 dark:bg-slate-800">
            <Image src={avatarUrl} alt={name} fill priority sizes="(max-width: 768px) 90vw, 440px" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
            {!reduce && (
              <motion.div
                className="absolute inset-0 mix-blend-soft-light"
                style={{ background: glare }}
              />
            )}
            <div className="absolute inset-x-0 bottom-0 p-5">
              <p className="on-dark text-lg font-bold leading-tight">{name}</p>
              <p className="mt-1 text-xs text-white/75 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{location}</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl py-2.5 bg-black/[.03] dark:bg-white/[.04]">
                <p className="text-xl font-extrabold text-white font-[family-name:var(--font-display)]"><CountUp to={s.value} suffix={s.suffix} /></p>
                <p className="text-[10px] tracking-wider uppercase text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* floating chips (parallax depth) */}
        <motion.div {...float(10)} style={{ translateZ: 60 }} className="float-chip hidden sm:flex absolute -left-10 top-16 items-center gap-2.5 px-3.5 py-2.5">
          <span className="icon-tile !w-8 !h-8 !rounded-lg"><Zap className="w-4 h-4" /></span>
          <div className="leading-tight"><p className="text-xs font-bold text-white">{chips[0] || 'Full-Stack'}</p><p className="text-[10px] text-gray-500">Core strength</p></div>
        </motion.div>
        <motion.div {...float(12, 1)} style={{ translateZ: 80 }} className="float-chip hidden sm:flex absolute -right-8 bottom-28 items-center gap-2.5 px-3.5 py-2.5">
          <span className="icon-tile !w-8 !h-8 !rounded-lg"><Sparkles className="w-4 h-4" /></span>
          <div className="leading-tight"><p className="text-xs font-bold text-white">{chips[1] || 'AI & Backend'}</p><p className="text-[10px] text-gray-500">Always learning</p></div>
        </motion.div>
        <motion.div {...float(8, 2)} style={{ translateZ: 50 }} className="float-chip hidden sm:flex absolute -right-4 -top-5 items-center gap-2 px-3 py-2">
          <span className="pulse-dot" />
          <span className="text-[11px] font-semibold text-white">Open to work</span>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
