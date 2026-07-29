import React from 'react'
import { prisma } from '@/lib/prisma'
import { GlassCard } from '@/components/ui/glass-card'
import { AdminProjectsManager } from '@/components/admin-projects-manager'
import { FolderKanban } from 'lucide-react'

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { rank: 'asc' },
    include: { technologies: true },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Project Showcase CMS</h1>
        <p className="text-xs text-gray-400 font-mono mt-1">Manage, add, delete, and reorder engineering projects in your showcase</p>
      </div>

      <AdminProjectsManager initialProjects={projects} />
    </div>
  )
}
