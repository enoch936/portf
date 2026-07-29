'use client'

import React, { useState } from 'react'
import { submitContactMessage } from '@/app/actions/contact'
import { Send, CheckCircle2, AlertCircle } from 'lucide-react'

export function ContactFormClient() {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)

    const formData = new FormData(e.currentTarget)
    const res = await submitContactMessage(formData)

    setLoading(false)
    if (res.success) {
      setStatus({ type: 'success', message: res.message || 'Message sent!' })
      ;(e.target as HTMLFormElement).reset()
    } else {
      setStatus({ type: 'error', message: res.error || 'Failed to send message.' })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white">Send a Direct Message</h2>
        <p className="text-xs text-gray-400">Fill out the form below to reach out directly to Gebretsadik.</p>
      </div>

      {status && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-3 border ${
            status.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}
        >
          {status.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{status.message}</span>
        </div>
      )}

      {/* Honeypot field (hidden from normal users) */}
      <input type="text" name="website_field" className="hidden" tabIndex={-1} autoComplete="off" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-mono text-gray-300">Your Full Name *</label>
          <input
            type="text"
            name="name"
            required
            placeholder="e.g. Sarah Jenkins"
            className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-mono text-gray-300">Email Address *</label>
          <input
            type="email"
            name="email"
            required
            placeholder="sarah@company.com"
            className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-mono text-gray-300">Subject</label>
        <input
          type="text"
          name="subject"
          placeholder="System Architecture Advisory / Consulting Opportunity"
          className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-mono text-gray-300">Message Content *</label>
        <textarea
          name="message"
          rows={5}
          required
          placeholder="Describe your project scope, technical requirements, or inquiry..."
          className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
      >
        <Send className="w-4 h-4" />
        <span>{loading ? 'Sending Message...' : 'Transmit Message'}</span>
      </button>
    </form>
  )
}
