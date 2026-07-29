import React from 'react'
import { prisma } from '@/lib/prisma'
import { GlassCard } from '@/components/ui/glass-card'
import { AdminMediaManager } from '@/components/admin-media-manager'
import { Image as ImageIcon } from 'lucide-react'

export default async function AdminMediaPage() {
  const mediaFiles = await prisma.mediaFile.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Media Manager</h1>
        <p className="text-xs text-gray-400 font-mono mt-1">Upload images, PDFs, architecture diagrams, and manage asset URLs</p>
      </div>

      <AdminMediaManager initialMedia={mediaFiles} />
    </div>
  )
}
