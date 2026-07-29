'use client'

import React, { useState } from 'react'
import { X, Sparkles } from 'lucide-react'

interface CelebrationBannerProps {
  greetingMessage: string
  celebrationBanner?: string | null
  primaryColor: string
  accentColor: string
}

export function CelebrationBanner({
  greetingMessage,
  celebrationBanner,
  primaryColor,
  accentColor,
}: CelebrationBannerProps) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div
      className="relative w-full py-3 px-4 text-center text-white font-semibold text-sm z-40 overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})`,
      }}
    >
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-32 h-32 rounded-full bg-white/20 blur-2xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-24 h-24 rounded-full bg-white/15 blur-xl animate-pulse delay-500" />
      </div>

      <div className="relative flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4 animate-spin-slow" />
        <span className="tracking-wide">{greetingMessage}</span>
        {celebrationBanner && (
          <>
            <span className="mx-2 opacity-50">|</span>
            <span className="font-normal opacity-90">{celebrationBanner}</span>
          </>
        )}
        <Sparkles className="w-4 h-4 animate-spin-slow" />
      </div>

      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/20 transition-colors"
        aria-label="Dismiss banner"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}
