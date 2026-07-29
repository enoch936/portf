import React from 'react'
import { prisma } from '@/lib/prisma'
import { GlassCard } from '@/components/ui/glass-card'
import { AdminProfileForm } from '@/components/admin-profile-form'
import { UserCheck } from 'lucide-react'

export default async function AdminProfilePage() {
  const profile = await prisma.profile.findFirst()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Profile & Branding Editor</h1>
        <p className="text-xs text-gray-400 font-mono mt-1">Customize public owner details, bio, contact info, and branding statements</p>
      </div>

      <GlassCard className="p-8">
        <AdminProfileForm profile={profile} />
      </GlassCard>
    </div>
  )
}
