import React from 'react'
import { prisma } from '@/lib/prisma'
import { AdminProjectsManager } from '@/components/admin-projects-manager'

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { rank: 'asc' },
    include: { technologies: true },
  }).catch(() => [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Project Showcase CMS</h1>
        <p className="text-xs text-gray-400 font-mono mt-1">Create, edit, publish, feature, reorder, or delete released projects from one CMS workspace</p>
      </div>

      <AdminProjectsManager initialProjects={projects} />
    </div>
  )
}
