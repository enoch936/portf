'use client'

import { useState } from 'react'
import { Check, Save } from 'lucide-react'
import type { Resume } from '@prisma/client'
import { updateResumeMediaAction } from '@/app/actions/cms'
import { MediaUploadField } from '@/components/media-upload-field'

export function AdminResumeManager({ resume }: { resume: Resume | null }) {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  if (!resume) return <p className="text-sm text-gray-500">No active résumé has been created yet.</p>

  const save = async (formData: FormData) => {
    setSaving(true)
    await updateResumeMediaAction(resume.id, { title: String(formData.get('title') || ''), pdfUrl: String(formData.get('pdfUrl') || '') })
    setSaving(false)
    setSaved(true)
    window.setTimeout(() => setSaved(false), 3000)
  }

  return (
    <form action={save} className="space-y-4">
      <label className="block text-xs font-mono text-gray-300">Résumé title<input name="title" required defaultValue={resume.title} className="mt-2 w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs" /></label>
      <MediaUploadField name="pdfUrl" label="Résumé PDF" defaultValue={resume.pdfUrl || ''} required accept="application/pdf" />
      {saved && <p className="text-sm text-emerald-500 flex items-center gap-1.5"><Check className="w-4 h-4" /> Résumé file updated.</p>}
      <button disabled={saving} className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold inline-flex items-center gap-2"><Save className="w-4 h-4" /> {saving ? 'Saving…' : 'Save résumé file'}</button>
    </form>
  )
}
