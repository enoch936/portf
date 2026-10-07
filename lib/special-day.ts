import { prisma } from '@/lib/prisma'

export interface SpecialDayConfig {
  id: string
  name: string
  month: number | null
  day: number | null
  startsAt: Date | null
  endsAt: Date | null
  isActive: boolean
  primaryColor: string
  accentColor: string
  backgroundGradient: string
  particleEffect: string
  greetingMessage: string
  celebrationBanner: string | null
  animationPreset: string
}

function toConfig(match: {
  id: string
  name: string
  month: number | null
  day: number | null
  startsAt: Date | null
  endsAt: Date | null
  isActive: boolean
  primaryColor: string
  accentColor: string
  backgroundGradient: string
  particleEffect: string
  greetingMessage: string
  celebrationBanner: string | null
  animationPreset: string
}): SpecialDayConfig {
  return {
    id: match.id,
    name: match.name,
    month: match.month,
    day: match.day,
    startsAt: match.startsAt,
    endsAt: match.endsAt,
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

export async function getActiveSpecialDayTheme(): Promise<SpecialDayConfig | null> {
  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const currentDay = now.getDate()

  const match = await prisma.specialDayTheme.findFirst({
    where: {
      isActive: true,
      OR: [
        // Yearly repeat mode: matches this month & day every year
        { month: currentMonth, day: currentDay },
        // One-time exact mode: matches between the chosen start and end of that day
        { startsAt: { lte: now }, endsAt: { gte: now } },
      ],
    },
    orderBy: { createdAt: 'desc' },
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

        return toConfig(sample)
      } catch (e) {
        // ignore errors and fall through to return null
        console.warn('Could not create dev special-day theme:', e)
      }
    }
    return null
  }

  return toConfig(match)
}

export async function getAllSpecialDayThemes(): Promise<SpecialDayConfig[]> {
  const all = await prisma.specialDayTheme.findMany({
    orderBy: [{ month: { sort: 'asc', nulls: 'last' } }, { day: 'asc' }, { createdAt: 'desc' }],
  })

  return all.map(toConfig)
}
