'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { loginAdminAction } from '@/app/actions/admin-auth'
import { Shield, Lock, Mail, Key, ArrowRight } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [requires2FA, setRequires2FA] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const res = await loginAdminAction(formData)

    setLoading(false)

    if (res.requires2FA) {
      setRequires2FA(true)
      if (res.error) setError(res.error)
      return
    }

    if (res.success) {
      router.push('/admin')
      router.refresh()
    } else {
      setError(res.error || 'Authentication failed.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 text-white">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white mx-auto shadow-xl">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Admin CMS Portal</h1>
          <p className="text-xs text-gray-400 font-mono">Gebretsadik SaaS Authentication</p>
        </div>

        <div className="glass-card p-8 space-y-6 border-white/15">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-mono text-gray-300">Admin Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="email"
                  name="email"
                  defaultValue="admin@gebretsadik.io"
                  required
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-gray-300">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="password"
                  name="password"
                  defaultValue="adminpassword123"
                  required
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {requires2FA && (
              <div className="space-y-2 pt-2 border-t border-white/10">
                <label className="text-xs font-mono text-blue-400">2FA Authenticator Code (TOTP)</label>
                <div className="relative">
                  <Key className="w-4 h-4 text-blue-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="totpToken"
                    placeholder="6-digit code"
                    maxLength={6}
                    required
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-white text-xs font-mono placeholder-gray-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-[10px] text-gray-500 font-mono text-center border-t border-white/10 pt-4">
            Default credentials: <span className="text-gray-300">admin@gebretsadik.io</span> / <span className="text-gray-300">adminpassword123</span>
          </div>
        </div>
      </div>
    </div>
  )
}
