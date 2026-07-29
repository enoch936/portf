'use client'

import React, { useState } from 'react'
import { incrementResumeDownloadAction } from '@/app/actions/cms'
import { Download, Check } from 'lucide-react'

export function ResumeDownloadButton({ resumeId, pdfUrl }: { resumeId: string; pdfUrl: string }) {
  const [downloaded, setDownloaded] = useState(false)

  const handleDownload = async () => {
    if (resumeId) {
      await incrementResumeDownloadAction(resumeId)
    }
    setDownloaded(true)
    setTimeout(() => setDownloaded(false), 3000)

    // Trigger browser download or opening PDF window
    window.open(pdfUrl, '_blank')
  }

  return (
    <button
      onClick={handleDownload}
      className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
    >
      {downloaded ? (
        <>
          <Check className="w-4 h-4 text-emerald-300" />
          <span>Opening PDF...</span>
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          <span>Download PDF Version</span>
        </>
      )}
    </button>
  )
}
