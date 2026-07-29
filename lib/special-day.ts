import { prisma } from '@/lib/prisma'

export interface SpecialDayConfig {
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

export async function getActiveSpecialDayTheme(): Promise<SpecialDayConfig | null> {
  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const currentDay = now.getDate()

  const match = await prisma.specialDayTheme.findFirst({
    where: {
      isActive: true,
      month: currentMonth,
      day: currentDay,
    },
  })

  if (!match) return null

  return {
    id: match.id,
    name: match.name,
    month: match.month,
    day: match.day,
    isActive: match.isActive,
    primaryColor: match.primaryColor,
    accentColor: match.accentColor,
    backgroundGradient: match.backgroundGradient,
    particleEffect: match.particleEffect,
    greetingMessage: match.greetingMessage,
    celebrationBanner: match.celebrationBanner,
    animationPreset: match.animationPreset,
  }
}

export async function getAllSpecialDayThemes(): Promise<SpecialDayConfig[]> {
  const all = await prisma.specialDayTheme.findMany({
    orderBy: [{ month: 'asc' }, { day: 'asc' }],
  })

  return all.map((m) => ({
    id: m.id,
    name: m.name,
    month: m.month,
    day: m.day,
    isActive: m.isActive,
    primaryColor: m.primaryColor,
    accentColor: m.accentColor,
    backgroundGradient: m.backgroundGradient,
    particleEffect: m.particleEffect,
    greetingMessage: m.greetingMessage,
    celebrationBanner: m.celebrationBanner,
    animationPreset: m.animationPreset,
  }))
}
