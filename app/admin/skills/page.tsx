import React from 'react'
import { prisma } from '@/lib/prisma'
import { GlassCard } from '@/components/ui/glass-card'
import { AdminSkillsManager } from '@/components/admin-skills-manager'
import { Cpu } from 'lucide-react'

export default async function AdminSkillsPage() {
  const categories = await prisma.skillCategory.findMany({
    orderBy: { order: 'asc' },
    include: { skills: true },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Skill Matrix & Tech Manager</h1>
        <p className="text-xs text-gray-400 font-mono mt-1">Manage skill categories, add new technical skills, and adjust mastery levels</p>
      </div>

      <AdminSkillsManager initialCategories={categories} />
    </div>
  )
}
