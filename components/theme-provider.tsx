'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

export interface SpecialDayConfig {
  id: string
  name: string
  primaryColor: string
  accentColor: string
  backgroundGradient: string
  particleEffect: string
  greetingMessage: string
  celebrationBanner: string | null
  animationPreset: string
}

export interface ThemeConfig {
  themeMode: 'dark' | 'light' | 'system'
  primaryColor: string
  accentColor: string
  fontSans: string
  borderRadius: string
  glassOpacity: number
  animationPreset: string
  specialDay: SpecialDayConfig | null
}

interface ThemeContextType {
  theme: ThemeConfig
  setTheme: (theme: Partial<ThemeConfig>) => void
  toggleMode: () => void
  isSpecialDay: boolean
}

const defaultTheme: ThemeConfig = {
  themeMode: 'dark',
  primaryColor: '#3b82f6',
  accentColor: '#8b5cf6',
  fontSans: 'Inter',
  borderRadius: '0.75rem',
  glassOpacity: 0.15,
  animationPreset: 'smooth',
  specialDay: null,
}

const ThemeContext = createContext<ThemeContextType>({
  theme: defaultTheme,
  setTheme: () => {},
  toggleMode: () => {},
  isSpecialDay: false,
})

export function ThemeProvider({
  children,
  initialTheme,
}: {
  children: React.ReactNode
  initialTheme?: ThemeConfig
}) {
  const [theme, setThemeState] = useState<ThemeConfig>(initialTheme || defaultTheme)

  const isSpecialDay = theme.specialDay !== null

  useEffect(() => {
    const root = document.documentElement

    if (isSpecialDay && theme.specialDay) {
      root.classList.add('special-day-active')
      root.style.setProperty('--primary-color', theme.specialDay.primaryColor)
      root.style.setProperty('--accent-color', theme.specialDay.accentColor)
    } else {
      root.classList.remove('special-day-active')
      root.style.setProperty('--primary-color', theme.primaryColor)
      root.style.setProperty('--accent-color', theme.accentColor)
    }

    if (theme.themeMode === 'light') {
      root.classList.add('light')
      root.classList.remove('dark')
    } else if (theme.themeMode === 'dark') {
      root.classList.add('dark')
      root.classList.remove('light')
    } else {
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (isSystemDark) {
        root.classList.add('dark')
        root.classList.remove('light')
      } else {
        root.classList.add('light')
        root.classList.remove('dark')
      }
    }

    if (!isSpecialDay) {
      root.style.setProperty('--primary-color', theme.primaryColor)
      root.style.setProperty('--accent-color', theme.accentColor)
    }
    root.style.setProperty('--radius', theme.borderRadius)
    root.style.setProperty('--glass-opacity', String(theme.glassOpacity))
    root.style.setProperty('--font-family', `${theme.fontSans}, system-ui, sans-serif`)
  }, [theme, isSpecialDay])

  const setTheme = (updated: Partial<ThemeConfig>) => {
    setThemeState((prev) => ({ ...prev, ...updated }))
  }

  const toggleMode = () => {
    const newMode = theme.themeMode === 'dark' ? 'light' : 'dark'
    setTheme({ themeMode: newMode })
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleMode, isSpecialDay }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
