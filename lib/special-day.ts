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

  if (!match) {
    // In development, auto-create a sample special day theme for today so the feature can be tested.
    if (process.env.NODE_ENV !== 'production') {
      try {
        const sample = await prisma.specialDayTheme.create({
          data: {
            name: 'Dev Special Day',
            month: currentMonth,
            day: currentDay,
            isActive: true,
            primaryColor: '#ef4444',
            accentColor: '#f59e0b',
            backgroundGradient: 'linear-gradient(135deg, #ef4444, #f59e0b)',
            particleEffect: 'confetti',
            greetingMessage: 'Happy Special Day! 🎉',
            celebrationBanner: null,
            animationPreset: 'festive',
          },
        })

        return {
          id: sample.id,
          name: sample.name,
          month: sample.month,
          day: sample.day,
          isActive: sample.isActive,
          primaryColor: sample.primaryColor,
          accentColor: sample.accentColor,
          backgroundGradient: sample.backgroundGradient,
          particleEffect: sample.particleEffect,
          greetingMessage: sample.greetingMessage,
          celebrationBanner: sample.celebrationBanner,
          animationPreset: sample.animationPreset,
        }
      } catch (e) {
        // ignore errors and fall through to return null
        console.warn('Could not create dev special-day theme:', e)
      }
    }
    return null
  }

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
