import React from 'react'
import { prisma } from '@/lib/prisma'
import { GlassCard } from '@/components/ui/glass-card'
import { Compass, CheckCircle2 } from 'lucide-react'

export default async function AdminNavigationPage() {
  const website = await prisma.websiteSettings.findUnique({ where: { id: 'default' } })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Navigation & Page Builder</h1>
        <p className="text-xs text-gray-400 font-mono mt-1">Configure site header navigation menu items and toggle public section visibility</p>
      </div>

      <GlassCard className="p-8 space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Compass className="w-5 h-5 text-blue-400" /> Active Menu Route Structure
        </h2>

        <pre className="p-4 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-blue-300 overflow-x-auto">
          {website?.navItemsJson || '[]'}
        </pre>
      </GlassCard>
    </div>
  )
}
