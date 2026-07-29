'use client'

import React, { useState } from 'react'
import { updateProfileAction } from '@/app/actions/cms'
import { Save, CheckCircle2 } from 'lucide-react'
import type { Profile } from '@prisma/client'

export function AdminProfileForm({ profile }: { profile: Profile | null }) {
  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setSuccessMsg(false)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name') as string,
      title: formData.get('title') as string,
      bio: formData.get('bio') as string,
      brandingStatement: formData.get('brandingStatement') as string,
      avatarUrl: formData.get('avatarUrl') as string,
      heroImageUrl: formData.get('heroImageUrl') as string,
      location: formData.get('location') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      status: formData.get('status') as string,
    }

    await updateProfileAction(data)
    setLoading(false)
    setSuccessMsg(true)
    setTimeout(() => setSuccessMsg(false), 3000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Profile & Branding updated successfully!</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-mono text-gray-300">Full Name</label>
          <input
            type="text"
            name="name"
            defaultValue={profile?.name || ''}
            required
            className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-mono text-gray-300">Professional Title</label>
          <input
            type="text"
            name="title"
            defaultValue={profile?.title || ''}
            required
            className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-mono text-gray-300">Personal Branding Statement</label>
        <input
          type="text"
          name="brandingStatement"
          defaultValue={profile?.brandingStatement || ''}
          required
          className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-mono text-gray-300">Biography</label>
        <textarea
          name="bio"
          rows={4}
          defaultValue={profile?.bio || ''}
          required
          className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs resize-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-mono text-gray-300">Avatar Image URL</label>
          <input
            type="text"
            name="avatarUrl"
            defaultValue={profile?.avatarUrl || ''}
            required
            className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-mono text-gray-300">Hero Image URL</label>
          <input
            type="text"
            name="heroImageUrl"
            defaultValue={profile?.heroImageUrl || ''}
            className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-mono text-gray-300">Location</label>
          <input
            type="text"
            name="location"
            defaultValue={profile?.location || ''}
            className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-mono text-gray-300">Contact Email</label>
          <input
            type="email"
            name="email"
            defaultValue={profile?.email || ''}
            className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-mono text-gray-300">Phone</label>
          <input
            type="text"
            name="phone"
            defaultValue={profile?.phone || ''}
            className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-mono text-gray-300">Status Badge Text</label>
        <input
          type="text"
          name="status"
          defaultValue={profile?.status || ''}
          className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg transition-all"
      >
        <Save className="w-4 h-4" />
        <span>{loading ? 'Saving Profile...' : 'Save Profile Changes'}</span>
      </button>
    </form>
  )
}
