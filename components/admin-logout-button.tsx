'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { logoutAdminAction } from '@/app/actions/admin-auth'
import { LogOut } from 'lucide-react'

export function AdminLogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    await logoutAdminAction()
    router.push('/admin-login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold border border-rose-500/20 transition-colors"
    >
      <LogOut className="w-3.5 h-3.5" />
      <span>Sign Out</span>
    </button>
  )
}
