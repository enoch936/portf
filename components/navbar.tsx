'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from './theme-provider'
import { Sun, Moon, Menu, X, Shield, Terminal } from 'lucide-react'

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-black/60 dark:bg-black/70 backdrop-blur-md border-b border-white/10 py-3 shadow-xl'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform duration-300">
            <Terminal className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight gradient-text">Gebretsadik</span>
            <span className="text-[10px] text-gray-400 font-mono tracking-wider uppercase">Senior Architect</span>
          </div>
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 backdrop-blur-md">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Action Controls */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleMode}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all duration-200"
            title="Toggle theme"
          >
            {theme.themeMode === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Admin CMS Access */}
          <Link
            href="/admin"
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white backdrop-blur-md transition-all duration-200 shadow-sm hover:shadow-blue-500/20"
          >
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            <span>Admin CMS</span>
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleMode}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-300"
          >
            {theme.themeMode === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-300"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-xl border-b border-white/10 px-4 pt-4 pb-6 mt-2 flex flex-col gap-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-2.5 rounded-xl text-base font-medium transition-colors ${
                pathname === item.href ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-white/5'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-2 flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm"
          >
            <Shield className="w-4 h-4" />
            Admin CMS Portal
          </Link>
        </div>
      )}
    </header>
  )
}
