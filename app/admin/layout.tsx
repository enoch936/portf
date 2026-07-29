import React from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getAuthSession } from '@/lib/auth'
import { AdminLogoutButton } from '@/components/admin-logout-button'
import {
  LayoutDashboard,
  UserCheck,
  FolderKanban,
  Cpu,
  FileText,
  BookOpen,
  Palette,
  Compass,
  Image as ImageIcon,
  Bot,
  Inbox,
  Globe,
  Shield,
} from 'lucide-react'

const navLinks = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Profile & Content', href: '/admin/profile', icon: UserCheck },
  { label: 'Projects Showcase', href: '/admin/projects', icon: FolderKanban },
  { label: 'Skills & Tech', href: '/admin/skills', icon: Cpu },
  { label: 'CV / Resume Builder', href: '/admin/resume', icon: FileText },
  { label: 'Tech Blog Studio', href: '/admin/blog', icon: BookOpen },
  { label: 'Visual Theme Builder', href: '/admin/theme', icon: Palette },
  { label: 'Navigation & Pages', href: '/admin/navigation', icon: Compass },
  { label: 'Media Library', href: '/admin/media', icon: ImageIcon },
  { label: 'AI Assistant', href: '/admin/ai-assistant', icon: Bot },
  { label: 'Inbox & Messages', href: '/admin/inbox', icon: Inbox },
]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getAuthSession()

  if (!session) {
    redirect('/admin-login')
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-black/60 border-r border-white/10 hidden md:flex flex-col justify-between p-4 shrink-0 backdrop-blur-md">
        <div className="space-y-6">
          {/* Logo Header */}
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-white">CMS Admin Panel</h2>
              <span className="text-[10px] text-gray-400 font-mono">Gebretsadik SaaS</span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Icon className="w-4 h-4 text-blue-400" />
                  <span>{link.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Footer info & Logout */}
        <div className="pt-4 border-t border-white/10 space-y-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-center gap-2 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 border border-white/10 transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>View Public Site</span>
          </Link>
          <AdminLogoutButton />
        </div>
      </aside>

      {/* Main Content View */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-white/10 bg-black/40 backdrop-blur-md px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-mono text-gray-400">ADMIN SESSION ACTIVE</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-gray-300">
            <span>{session?.email || 'admin@gebretsadik.io'}</span>
          </div>
        </header>

        {/* Child Content */}
        <main className="p-6 sm:p-8 flex-1 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  )
}
