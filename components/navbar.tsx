'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { useTheme } from './theme-provider'
import { Sun, Moon, Menu, X, Shield } from 'lucide-react'

export interface NavItem {
  label: string
  href: string
}

const defaultNavItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Skills', href: '/skills' },
  { label: 'Projects', href: '/projects' },
  { label: 'Resume', href: '/resume' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
]

export function Navbar({ navItems = defaultNavItems }: { navItems?: NavItem[] }) {
  const pathname = usePathname()
  const { theme, toggleMode } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  const isLight = theme.themeMode === 'light'
  const ThemeToggle = ({ className = '' }: { className?: string }) => (
    <button
      onClick={toggleMode}
      className={`control-surface grid place-items-center w-10 h-10 rounded-xl text-gray-500 hover:text-slate-950 dark:hover:text-white transition-colors overflow-hidden ${className}`}
      title="Toggle theme"
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isLight ? 'moon' : 'sun'}
          initial={{ y: 14, rotate: -80, opacity: 0 }}
          animate={{ y: 0, rotate: 0, opacity: 1 }}
          exit={{ y: -14, rotate: 80, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="grid place-items-center"
        >
          {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
        </motion.span>
      </AnimatePresence>
    </button>
  )

  return (
    <motion.header
      initial={{ y: -90, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="fixed top-0 inset-x-0 z-50 px-3 sm:px-5 pt-3"
    >
      <div
        className={`nav-shell mx-auto max-w-7xl rounded-2xl px-3 sm:px-4 ${scrolled || open ? 'is-scrolled py-2' : 'py-3'} ${open ? 'is-open' : ''}`}
      >
        <div className="flex items-center justify-between gap-4">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div whileHover={{ rotate: -8, scale: 1.08 }} transition={{ type: 'spring', stiffness: 300, damping: 14 }} className="brand-mark" aria-hidden="true">
              GE
            </motion.div>
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-lg tracking-tight gradient-text">Gebretsadik</span>
              <span className="text-[10px] text-gray-400 font-mono tracking-wider uppercase">Senior Architect</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5 nav-surface rounded-full p-1" onMouseLeave={() => setHovered(null)}>
            {navItems.map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onMouseEnter={() => setHovered(item.href)}
                  className={`relative px-4 py-1.5 text-sm font-medium rounded-full transition-colors duration-200 ${
                    active ? 'text-white' : 'text-gray-500 dark:text-gray-400 hover:text-slate-950 dark:hover:text-white'
                  }`}
                >
                  {hovered === item.href && !active && (
                    <motion.span layoutId="nav-hover" className="absolute inset-0 rounded-full bg-black/5 dark:bg-white/10" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
                  )}
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full btn-primary-surface"
                      style={{ background: 'linear-gradient(135deg, var(--brand-1), var(--brand-2))', boxShadow: '0 8px 22px -8px color-mix(in srgb, var(--brand-1) 70%, transparent)' }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className={`relative z-10 ${active ? 'on-dark' : ''}`}>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            <Link href="/admin" className="admin-link flex items-center gap-2 px-4 h-10 text-xs font-semibold rounded-xl transition-all duration-200">
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              <span>Admin CMS</span>
            </Link>
          </div>

          {/* Mobile controls */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setOpen(!open)}
              className="control-surface grid place-items-center w-10 h-10 rounded-xl text-gray-500 dark:text-gray-300"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={open ? 'x' : 'm'} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="md:hidden overflow-hidden"
            >
              <div className="pt-4 pb-2 flex flex-col gap-1.5">
                {navItems.map((item, i) => (
                  <motion.div key={item.href} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.05 + i * 0.045 }}>
                    <Link
                      href={item.href}
                      className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                        pathname === item.href ? 'btn-primary on-dark' : 'text-gray-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                <Link href="/admin" className="mt-2 btn btn-ghost w-full">
                  <Shield className="w-4 h-4" /> Admin CMS Portal
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}
