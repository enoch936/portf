import React from 'react'
import { prisma } from '@/lib/prisma'
import { GlassCard } from '@/components/ui/glass-card'
import { FileText } from 'lucide-react'
import { AdminResumeManager } from '@/components/admin-resume-manager'

export default async function AdminResumePage() {
  const resume = await prisma.resume.findFirst({ where: { isDefault: true } })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white">CV & Resume Builder CMS</h1>
        <p className="text-xs text-gray-400 font-mono mt-1">Manage resume versions, update PDF download links, and monitor download analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="space-y-2">
          <span className="text-xs font-mono text-gray-400">TOTAL CV DOWNLOADS</span>
          <p className="text-3xl font-extrabold text-emerald-400">{resume?.downloadsCount || 0}</p>
          <span className="text-[10px] text-gray-400 font-mono">Real-time Visitor Downloads</span>
        </GlassCard>

        <GlassCard className="md:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" /> Active Resume Version
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/10">
              <div>
                <p className="font-bold text-white">{resume?.title || 'Senior Architect CV'}</p>
                <p className="text-gray-400 text-[10px]">PDF Link: {resume?.pdfUrl || '/documents/Gebretsadik_Senior_Architect_CV.pdf'}</p>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[10px]">
                DEFAULT ACTIVE
              </span>
            </div>

            <p className="text-gray-300 leading-relaxed">{resume?.summary}</p>
          </div>
          <div className="border-t border-white/10 pt-5">
            <AdminResumeManager resume={resume} />
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
