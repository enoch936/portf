import React from 'react'
import { prisma } from '@/lib/prisma'
import { AdminThemePageClient } from '@/components/admin-theme-page-client'

export default async function AdminThemePage() {
  const theme = await prisma.themeSettings.findUnique({ where: { id: 'default' } })
  const specialDayThemes = await prisma.specialDayTheme.findMany({
    orderBy: [{ month: 'asc' }, { day: 'asc' }],
  })

  return <AdminThemePageClient initialTheme={theme} specialDayThemes={specialDayThemes} />
}
