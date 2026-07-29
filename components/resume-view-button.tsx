'use client'

import React, { useState } from 'react'
import { Eye, Check } from 'lucide-react'

export function ResumeViewButton() {
  const [viewed, setViewed] = useState(false)

  const handleView = () => {
    setViewed(true)
    window.open('/api/cv', '_blank')
    setTimeout(() => setViewed(false), 3000)
  }

  return (
    <button
      onClick={handleView}
      className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all"
    >
      {viewed ? (
        <>
          <Check className="w-4 h-4 text-emerald-300" />
          <span>Opening CV View...</span>
        </>
      ) : (
        <>
          <Eye className="w-4 h-4" />
          <span>View CV in Browser</span>
        </>
      )}
    </button>
  )
}
