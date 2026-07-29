'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { GlassCard } from '@/components/ui/glass-card'
import { Upload, Copy, Check, File } from 'lucide-react'
import type { MediaFile } from '@prisma/client'

export function AdminMediaManager({ initialMedia }: { initialMedia: MediaFile[] }) {
  const [mediaList, setMediaList] = useState(initialMedia)
  const [uploading, setUploading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/media/upload', {
      method: 'POST',
      body: formData,
    })

    const data = await res.json()
    setUploading(false)

    if (data.success && data.media) {
      setMediaList([data.media, ...mediaList])
    }
  }

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="space-y-6">
      {/* File Upload Trigger */}
      <GlassCard className="p-8 text-center space-y-4 border-dashed border-white/20">
        <Upload className="w-8 h-8 text-blue-400 mx-auto" />
        <div>
          <h3 className="text-base font-bold text-white">Upload New Media Asset</h3>
          <p className="text-xs text-gray-400">Select directly from your device. Uploaded assets are ready for project, profile, and article forms.</p>
        </div>
        <label className="inline-block px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs cursor-pointer shadow-md transition-all">
          <span>{uploading ? 'Uploading File...' : 'Choose File to Upload'}</span>
          <input type="file" accept="image/*,application/pdf,video/*" onChange={handleUpload} disabled={uploading} className="hidden" />
        </label>
      </GlassCard>

      {/* Grid of uploaded files */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {mediaList.map((m) => (
          <GlassCard key={m.id} className="space-y-3">
            <div className="relative h-36 rounded-xl overflow-hidden bg-black/40 border border-white/10 flex items-center justify-center">
              {m.mimeType?.startsWith('image/') ? (
                <Image src={m.url} alt={m.name} fill className="object-cover" />
              ) : (
                <File className="w-10 h-10 text-gray-400" />
              )}
            </div>

            <div>
              <p className="text-xs font-bold text-white truncate">{m.name}</p>
              <p className="text-[10px] font-mono text-gray-400">{(m.sizeBytes / 1024).toFixed(1)} KB</p>
            </div>

            <button
              onClick={() => copyUrl(m.url, m.id)}
              className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-blue-400 flex items-center justify-center gap-1.5 border border-white/10 transition-colors"
            >
              {copiedId === m.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedId === m.id ? 'Copied!' : 'Copy Asset URL'}</span>
            </button>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
