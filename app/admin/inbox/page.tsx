import React from 'react'
import { prisma } from '@/lib/prisma'
import { GlassCard } from '@/components/ui/glass-card'
import { Inbox, Mail, AlertTriangle, ShieldCheck } from 'lucide-react'

export default async function AdminInboxPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Contact Messages Inbox</h1>
        <p className="text-xs text-gray-400 font-mono mt-1">Review contact submissions, spam detection scores, and client inquiries</p>
      </div>

      <div className="space-y-4">
        {messages.length === 0 ? (
          <GlassCard className="p-8 text-center text-xs text-gray-500 font-mono">
            No contact messages received yet.
          </GlassCard>
        ) : (
          messages.map((msg) => (
            <GlassCard key={msg.id} className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-white">{msg.name}</h3>
                  <p className="text-xs text-blue-400 font-mono">{msg.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  {msg.isSpam ? (
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[10px] flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Flagged Spam
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Verified Clean
                    </span>
                  )}
                  <span className="text-[10px] font-mono text-gray-500">
                    {new Date(msg.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 space-y-1">
                <p className="text-xs font-semibold text-white">Subject: {msg.subject}</p>
                <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
              </div>
            </GlassCard>
          ))
        )}
      </div>
    </div>
  )
}
