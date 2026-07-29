'use client'

import React, { useState } from 'react'
import { Palette, CalendarDays } from 'lucide-react'
import { AdminThemeCustomizer } from '@/components/admin-theme-customizer'
import { AdminSpecialDayThemes } from '@/components/admin-special-day-themes'
import type { ThemeSettings, SpecialDayTheme } from '@prisma/client'

export function AdminThemePageClient({
  initialTheme,
  specialDayThemes,
}: {
  initialTheme: ThemeSettings | null
  specialDayThemes: SpecialDayTheme[]
}) {
  const [activeTab, setActiveTab] = useState<'theme' | 'special-days'>('theme')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Visual Theme & Design System Builder</h1>
        <p className="text-xs text-gray-400 font-mono mt-1">Customize primary colors, typography, glassmorphism intensity, border radius, animation presets, and special day celebrations</p>
      </div>

      <div className="flex gap-2 border-b border-white/10 pb-px">
        <button
          onClick={() => setActiveTab('theme')}
          className={`px-5 py-2.5 text-xs font-semibold rounded-t-xl transition-colors flex items-center gap-2 ${
            activeTab === 'theme'
              ? 'bg-white/10 text-white border border-white/10 border-b-transparent -mb-px'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          <Palette className="w-4 h-4" /> Theme Configuration
        </button>
        <button
          onClick={() => setActiveTab('special-days')}
          className={`px-5 py-2.5 text-xs font-semibold rounded-t-xl transition-colors flex items-center gap-2 ${
            activeTab === 'special-days'
              ? 'bg-white/10 text-white border border-white/10 border-b-transparent -mb-px'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          <CalendarDays className="w-4 h-4" /> Special Days
        </button>
      </div>

      {activeTab === 'theme' && <AdminThemeCustomizer initialTheme={initialTheme} />}
      {activeTab === 'special-days' && <AdminSpecialDayThemes initialThemes={specialDayThemes} />}
    </div>
  )
}
