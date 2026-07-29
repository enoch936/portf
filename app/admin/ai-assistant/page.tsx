import React from 'react'
import { GlassCard } from '@/components/ui/glass-card'
import { AdminAIAssistantClient } from '@/components/admin-ai-assistant-client'
import { Bot } from 'lucide-react'

export default async function AdminAIAssistantPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white">AI Content Assistant</h1>
        <p className="text-xs text-gray-400 font-mono mt-1">Generate AI project descriptions, blog outlines, and resume summary improvements</p>
      </div>

      <GlassCard className="p-8">
        <AdminAIAssistantClient />
      </GlassCard>
    </div>
  )
}
