'use client'

import React, { useState } from 'react'
import { updateThemeSettingsAction } from '@/app/actions/cms'
import { useTheme } from '@/components/theme-provider'
import { GlassCard } from '@/components/ui/glass-card'
import { Palette, Check, RefreshCw, Sun, Moon } from 'lucide-react'
import type { ThemeSettings } from '@prisma/client'
import type { ThemeConfig } from '@/components/theme-provider'

export function AdminThemeCustomizer({ initialTheme }: { initialTheme: ThemeSettings | null }) {
  const { setTheme } = useTheme()

  const [primaryColor, setPrimaryColor] = useState(initialTheme?.primaryColor || '#3b82f6')
  const [accentColor, setAccentColor] = useState(initialTheme?.accentColor || '#8b5cf6')
  const [fontSans, setFontSans] = useState(initialTheme?.fontSans || 'Inter')
  const [borderRadius, setBorderRadius] = useState(initialTheme?.borderRadius || '0.75rem')
  const [glassOpacity, setGlassOpacity] = useState(initialTheme?.glassOpacity || 0.15)
  const [themeMode, setThemeMode] = useState(initialTheme?.themeMode || 'dark')
  const [saved, setSaved] = useState(false)

  const handleApplyLive = (updates: Partial<ThemeConfig>) => {
    setTheme(updates)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const data = {
      themeMode,
      primaryColor,
      accentColor,
      fontSans,
      borderRadius,
      glassOpacity,
      animationPreset: 'smooth',
    }

    await updateThemeSettingsAction(data)
    handleApplyLive(data as Partial<ThemeConfig>)

    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const colorPresets = ['#3b82f6', '#10b981', '#8b5cf6', '#f43f5e', '#f59e0b', '#06b6d4']

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Controls Form */}
      <GlassCard className="p-8 space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Palette className="w-5 h-5 text-blue-400" /> Theme Configuration
        </h2>

        {saved && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Theme settings saved to database & applied live!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Mode Switcher */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-gray-300">Default Color Mode</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setThemeMode('dark')
                  handleApplyLive({ themeMode: 'dark' })
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-2 ${
                  themeMode === 'dark' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-gray-400'
                }`}
              >
                <Moon className="w-4 h-4" /> Dark Mode
              </button>
              <button
                type="button"
                onClick={() => {
                  setThemeMode('light')
                  handleApplyLive({ themeMode: 'light' })
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-2 ${
                  themeMode === 'light' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-gray-400'
                }`}
              >
                <Sun className="w-4 h-4" /> Light Mode
              </button>
            </div>
          </div>

          {/* Primary Color Picker */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-gray-300">Primary Color ({primaryColor})</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => {
                  setPrimaryColor(e.target.value)
                  handleApplyLive({ primaryColor: e.target.value })
                }}
                className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
              />
              <div className="flex gap-2">
                {colorPresets.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setPrimaryColor(c)
                      handleApplyLive({ primaryColor: c })
                    }}
                    className="w-7 h-7 rounded-full border border-white/20 hover:scale-110 transition-transform"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Font Selector */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-gray-300">Typography Font</label>
            <select
              value={fontSans}
              onChange={(e) => {
                setFontSans(e.target.value)
                handleApplyLive({ fontSans: e.target.value })
              }}
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
            >
              <option value="Inter">Inter (Standard Modern)</option>
              <option value="Outfit">Outfit (Geometric Enterprise)</option>
              <option value="Fira Code">Fira Code (Developer Centric)</option>
            </select>
          </div>

          {/* Border Radius */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-gray-300">Corner Border Radius ({borderRadius})</label>
            <select
              value={borderRadius}
              onChange={(e) => {
                setBorderRadius(e.target.value)
                handleApplyLive({ borderRadius: e.target.value })
              }}
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
            >
              <option value="0.5rem">0.5rem (Sharp Enterprise)</option>
              <option value="0.75rem">0.75rem (Balanced Modern)</option>
              <option value="1rem">1.0rem (Rounded Soft)</option>
            </select>
          </div>

          {/* Glass Opacity Slider */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-gray-300">Glassmorphism Opacity ({glassOpacity})</label>
            <input
              type="range"
              min={0.05}
              max={0.4}
              step={0.05}
              value={glassOpacity}
              onChange={(e) => {
                const val = Number(e.target.value)
                setGlassOpacity(val)
                handleApplyLive({ glassOpacity: val })
              }}
              className="w-full"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg"
          >
            <Check className="w-4 h-4" /> Save Theme Settings Permanently
          </button>
        </form>
      </GlassCard>

      {/* Live Preview Card */}
      <div className="space-y-4">
        <h3 className="text-sm font-mono text-gray-400 uppercase">Live Real-Time Preview</h3>
        <GlassCard className="p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: primaryColor }}
            >
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Live Dynamic Card</h4>
              <p className="text-xs text-gray-400">See changes applied instantly across the entire platform</p>
            </div>
          </div>
          <button
            className="w-full py-2.5 rounded-xl text-white font-semibold text-xs"
            style={{ backgroundColor: primaryColor }}
          >
            Primary Action Button
          </button>
        </GlassCard>
      </div>
    </div>
  )
}
