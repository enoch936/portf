import React from 'react'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { GlassCard } from '@/components/ui/glass-card'
import { Users, Eye, Download, Mail, FolderKanban, Bell, ArrowRight, TrendingUp } from 'lucide-react'

export default async function AdminDashboardOverview() {
  const [projectsCount, messagesCount, resume, notifications, recentMessages] = await Promise.all([
    prisma.project.count().catch(() => 0),
    prisma.contactMessage.count({ where: { isRead: false } }).catch(() => 0),
    prisma.resume.findFirst({ where: { isDefault: true } }).catch(() => null),
    prisma.notification.findMany({ take: 5, orderBy: { createdAt: 'desc' } }).catch(() => []),
    prisma.contactMessage.findMany({ take: 5, orderBy: { createdAt: 'desc' } }).catch(() => []),
  ])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white">Dashboard Overview</h1>
        <p className="text-xs text-gray-400 font-mono mt-1">Real-time CMS analytics, content status, and visitor insights</p>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-gray-400">TOTAL PROJECTS</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white">{projectsCount}</p>
          <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Active Showcase
          </span>
        </GlassCard>

        <GlassCard className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-gray-400">UNREAD MESSAGES</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-purple-400">{messagesCount}</p>
          <span className="text-[10px] text-gray-400 font-mono">Inquiries Pending</span>
        </GlassCard>

        <GlassCard className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-gray-400">CV DOWNLOADS</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-emerald-400">{resume?.downloadsCount || 0}</p>
          <span className="text-[10px] text-emerald-400 font-mono">Tracked Downloads</span>
        </GlassCard>

        <GlassCard className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-gray-400">ESTIMATED VIEWS</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white">4,890+</p>
          <span className="text-[10px] text-gray-400 font-mono">Global Visitors</span>
        </GlassCard>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Messages */}
        <GlassCard className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-purple-400" /> Recent Contact Messages
            </h2>
            <Link href="/admin/inbox" className="text-xs font-mono text-blue-400 hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {recentMessages.length === 0 ? (
              <p className="text-xs text-gray-500 py-4 text-center">No messages received yet.</p>
            ) : (
              recentMessages.map((msg) => (
                <div key={msg.id} className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{msg.name} ({msg.email})</span>
                    <span className="font-mono text-gray-400 text-[10px]">{new Date(msg.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-blue-300 font-semibold">{msg.subject}</p>
                  <p className="text-xs text-gray-400 line-clamp-1">{msg.message}</p>
                </div>
              ))
            )}
          </div>
        </GlassCard>

        {/* System Notifications */}
        <GlassCard className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" /> Platform Notifications
            </h2>
          </div>

          <div className="space-y-3">
            {notifications.map((notif) => (
              <div key={notif.id} className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{notif.title}</span>
                  <span className="font-mono text-gray-400 text-[10px]">{new Date(notif.createdAt).toLocaleTimeString()}</span>
                </div>
                <p className="text-xs text-gray-400">{notif.message}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
