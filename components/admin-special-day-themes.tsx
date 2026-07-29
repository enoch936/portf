'use client'

import React, { useState, useEffect } from 'react'
import {
  getSpecialDayThemesAction,
  createSpecialDayThemeAction,
  updateSpecialDayThemeAction,
  deleteSpecialDayThemeAction,
} from '@/app/actions/cms'
import { GlassCard } from '@/components/ui/glass-card'
import { CalendarDays, Plus, Trash2, Check, X, Sparkles, Eye } from 'lucide-react'

interface SpecialDayTheme {
  id: string
  name: string
  month: number
  day: number
  isActive: boolean
  primaryColor: string
  accentColor: string
  backgroundGradient: string
  particleEffect: string
  greetingMessage: string
  celebrationBanner: string | null
  animationPreset: string
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const PARTICLE_EFFECTS = ['confetti', 'snowflakes', 'stars', 'hearts', 'sparkles']

const PRESETS: Partial<SpecialDayTheme>[] = [
  {
    name: 'Birthday',
    primaryColor: '#f43f5e',
    accentColor: '#f59e0b',
    backgroundGradient: 'linear-gradient(135deg, #f43f5e, #f59e0b)',
    particleEffect: 'confetti',
    greetingMessage: 'Happy Birthday!',
    celebrationBanner: 'Wishing you an amazing day!',
    animationPreset: 'festive',
  },
  {
    name: 'New Year',
    primaryColor: '#fbbf24',
    accentColor: '#3b82f6',
    backgroundGradient: 'linear-gradient(135deg, #fbbf24, #3b82f6)',
    particleEffect: 'sparkles',
    greetingMessage: 'Happy New Year!',
    celebrationBanner: 'Cheers to a brand new beginning!',
    animationPreset: 'festive',
  },
  {
    name: 'Valentine\'s Day',
    primaryColor: '#e11d48',
    accentColor: '#ec4899',
    backgroundGradient: 'linear-gradient(135deg, #e11d48, #ec4899)',
    particleEffect: 'hearts',
    greetingMessage: 'Happy Valentine\'s Day!',
    celebrationBanner: 'Spread the love!',
    animationPreset: 'festive',
  },
  {
    name: 'Christmas',
    primaryColor: '#16a34a',
    accentColor: '#dc2626',
    backgroundGradient: 'linear-gradient(135deg, #16a34a, #dc2626)',
    particleEffect: 'snowflakes',
    greetingMessage: 'Merry Christmas!',
    celebrationBanner: 'Season\'s greetings!',
    animationPreset: 'festive',
  },
  {
    name: 'Work Anniversary',
    primaryColor: '#8b5cf6',
    accentColor: '#06b6d4',
    backgroundGradient: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
    particleEffect: 'stars',
    greetingMessage: 'Happy Work Anniversary!',
    celebrationBanner: 'Thank you for your dedication!',
    animationPreset: 'festive',
  },
]

const DAYS_IN_MONTH = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

export function AdminSpecialDayThemes({ initialThemes }: { initialThemes?: SpecialDayTheme[] }) {
  const [themes, setThemes] = useState<SpecialDayTheme[]>(initialThemes || [])
  const [loading, setLoading] = useState(!initialThemes)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const [formName, setFormName] = useState('')
  const [formMonth, setFormMonth] = useState(1)
  const [formDay, setFormDay] = useState(1)
  const [formIsActive, setFormIsActive] = useState(true)
  const [formPrimaryColor, setFormPrimaryColor] = useState('#f43f5e')
  const [formAccentColor, setFormAccentColor] = useState('#f59e0b')
  const [formBackgroundGradient, setFormBackgroundGradient] = useState('linear-gradient(135deg, #f43f5e, #f59e0b)')
  const [formParticleEffect, setFormParticleEffect] = useState('confetti')
  const [formGreetingMessage, setFormGreetingMessage] = useState('')
  const [formCelebrationBanner, setFormCelebrationBanner] = useState('')
  const [formAnimationPreset, setFormAnimationPreset] = useState('festive')

  const loadThemes = async () => {
    setLoading(true)
    const data = await getSpecialDayThemesAction()
    setThemes(data as SpecialDayTheme[])
    setLoading(false)
  }

  useEffect(() => {
    loadThemes()
  }, [])

  const resetForm = () => {
    setFormName('')
    setFormMonth(1)
    setFormDay(1)
    setFormIsActive(true)
    setFormPrimaryColor('#f43f5e')
    setFormAccentColor('#f59e0b')
    setFormBackgroundGradient('linear-gradient(135deg, #f43f5e, #f59e0b)')
    setFormParticleEffect('confetti')
    setFormGreetingMessage('')
    setFormCelebrationBanner('')
    setFormAnimationPreset('festive')
    setEditingId(null)
    setShowForm(false)
  }

  const applyPreset = (preset: Partial<SpecialDayTheme>) => {
    if (preset.name) setFormName(preset.name)
    if (preset.primaryColor) setFormPrimaryColor(preset.primaryColor)
    if (preset.accentColor) setFormAccentColor(preset.accentColor)
    if (preset.backgroundGradient) setFormBackgroundGradient(preset.backgroundGradient)
    if (preset.particleEffect) setFormParticleEffect(preset.particleEffect)
    if (preset.greetingMessage) setFormGreetingMessage(preset.greetingMessage)
    if (preset.celebrationBanner !== undefined) setFormCelebrationBanner(preset.celebrationBanner || '')
    if (preset.animationPreset) setFormAnimationPreset(preset.animationPreset)
  }

  const handleEdit = (theme: SpecialDayTheme) => {
    setEditingId(theme.id)
    setFormName(theme.name)
    setFormMonth(theme.month)
    setFormDay(theme.day)
    setFormIsActive(theme.isActive)
    setFormPrimaryColor(theme.primaryColor)
    setFormAccentColor(theme.accentColor)
    setFormBackgroundGradient(theme.backgroundGradient)
    setFormParticleEffect(theme.particleEffect)
    setFormGreetingMessage(theme.greetingMessage)
    setFormCelebrationBanner(theme.celebrationBanner || '')
    setFormAnimationPreset(theme.animationPreset)
    setShowForm(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const data = {
      name: formName,
      month: formMonth,
      day: formDay,
      isActive: formIsActive,
      primaryColor: formPrimaryColor,
      accentColor: formAccentColor,
      backgroundGradient: formBackgroundGradient,
      particleEffect: formParticleEffect,
      greetingMessage: formGreetingMessage,
      celebrationBanner: formCelebrationBanner || undefined,
      animationPreset: formAnimationPreset,
    }

    if (editingId) {
      await updateSpecialDayThemeAction(editingId, data)
    } else {
      await createSpecialDayThemeAction(data)
    }

    resetForm()
    await loadThemes()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleDelete = async (id: string) => {
    await deleteSpecialDayThemeAction(id)
    await loadThemes()
  }

  const handleToggleActive = async (theme: SpecialDayTheme) => {
    await updateSpecialDayThemeAction(theme.id, { isActive: !theme.isActive })
    await loadThemes()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-purple-400" /> Special Day Themes
          </h2>
          <p className="text-xs text-gray-400 font-mono mt-1">Automatically apply festive themes on specific dates</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true) }}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Special Day
        </button>
      </div>

      {saved && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Special day theme saved successfully!</span>
        </div>
      )}

      {showForm && (
        <GlassCard className="p-8 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">
              {editingId ? 'Edit Special Day' : 'New Special Day'}
            </h3>
            <button onClick={resetForm} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-gray-400 font-mono w-full mb-1">Quick Presets:</span>
              {PRESETS.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300 hover:bg-white/10 transition-colors flex items-center gap-1.5"
                >
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.primaryColor }} />
                  {p.name}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-gray-300">Name</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Birthday"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-gray-300">Greeting Message</label>
                <input
                  type="text"
                  value={formGreetingMessage}
                  onChange={(e) => setFormGreetingMessage(e.target.value)}
                  placeholder="e.g. Happy Birthday!"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-gray-300">Month</label>
                <select
                  value={formMonth}
                  onChange={(e) => {
                    const m = Number(e.target.value)
                    setFormMonth(m)
                    if (formDay > DAYS_IN_MONTH[m - 1]) setFormDay(DAYS_IN_MONTH[m - 1])
                  }}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
                >
                  {MONTH_NAMES.map((name, i) => (
                    <option key={i} value={i + 1}>{name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-gray-300">Day</label>
                <select
                  value={formDay}
                  onChange={(e) => setFormDay(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
                >
                  {Array.from({ length: DAYS_IN_MONTH[formMonth - 1] }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-gray-300">Primary Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formPrimaryColor}
                    onChange={(e) => setFormPrimaryColor(e.target.value)}
                    className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
                  />
                  <span className="text-xs text-gray-400 font-mono">{formPrimaryColor}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-gray-300">Accent Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formAccentColor}
                    onChange={(e) => setFormAccentColor(e.target.value)}
                    className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
                  />
                  <span className="text-xs text-gray-400 font-mono">{formAccentColor}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-gray-300">Particle Effect</label>
                <select
                  value={formParticleEffect}
                  onChange={(e) => setFormParticleEffect(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
                >
                  {PARTICLE_EFFECTS.map((pe) => (
                    <option key={pe} value={pe}>{pe.charAt(0).toUpperCase() + pe.slice(1)}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-gray-300">Banner Text (optional)</label>
                <input
                  type="text"
                  value={formCelebrationBanner}
                  onChange={(e) => setFormCelebrationBanner(e.target.value)}
                  placeholder="Extra message on banner"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-gray-300">Background Gradient</label>
              <input
                type="text"
                value={formBackgroundGradient}
                onChange={(e) => setFormBackgroundGradient(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-mono"
              />
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formIsActive}
                  onChange={(e) => setFormIsActive(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-black/40"
                />
                <span className="text-xs text-gray-300">Active (auto-apply on this date)</span>
              </label>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-white/5">
              <Eye className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-400">Preview:</span>
              <div className="flex-1 h-8 rounded-lg" style={{ background: formBackgroundGradient }} />
              <Sparkles className="w-4 h-4" style={{ color: formPrimaryColor }} />
              <span className="text-xs text-white font-semibold">{formGreetingMessage || 'Greeting'}</span>
            </div>

            <button
              type="button"
              onClick={handleSave}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" /> {editingId ? 'Update Special Day' : 'Create Special Day'}
            </button>
          </div>
        </GlassCard>
      )}

      {loading ? (
        <div className="text-center py-8 text-gray-400 text-xs font-mono">Loading special day themes...</div>
      ) : themes.length === 0 ? (
        <GlassCard className="p-12 text-center space-y-3">
          <CalendarDays className="w-10 h-10 text-gray-600 mx-auto" />
          <p className="text-gray-400 text-sm">No special day themes configured yet.</p>
          <p className="text-gray-500 text-xs">Click &quot;Add Special Day&quot; to create your first festive theme.</p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {themes.map((theme) => (
            <GlassCard key={theme.id} className="p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{theme.name}</h4>
                  <p className="text-xs text-gray-400 font-mono">
                    {MONTH_NAMES[theme.month - 1]} {theme.day}
                  </p>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    theme.isActive
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                  }`}
                >
                  {theme.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div
                className="h-3 rounded-full"
                style={{ background: theme.backgroundGradient }}
              />

              <p className="text-xs text-gray-300 italic">&quot;{theme.greetingMessage}&quot;</p>

              <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                <Sparkles className="w-3 h-3" />
                <span>{theme.particleEffect}</span>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => handleToggleActive(theme)}
                  className={`flex-1 py-1.5 rounded-lg text-[10px] font-semibold border transition-colors ${
                    theme.isActive
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {theme.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => handleEdit(theme)}
                  className="flex-1 py-1.5 rounded-lg text-[10px] font-semibold bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(theme.id)}
                  className="py-1.5 px-3 rounded-lg text-[10px] font-semibold bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  )
}
