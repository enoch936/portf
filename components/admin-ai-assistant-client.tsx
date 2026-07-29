'use client'

import React, { useState } from 'react'
import { generateAICacheAction } from '@/app/actions/ai'
import { Sparkles, Copy, Check } from 'lucide-react'

export function AdminAIAssistantClient() {
  const [type, setType] = useState<'project' | 'blog' | 'resume'>('project')
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt) return
    setLoading(true)
    setOutput('')

    const res = await generateAICacheAction(type, prompt)
    setLoading(false)

    if (res.success && res.generatedContent) {
      setOutput(res.generatedContent)
    }
  }

  const copyOutput = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleGenerate} className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setType('project')}
            className={`py-2 rounded-xl text-xs font-semibold border ${
              type === 'project' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-gray-400'
            }`}
          >
            Project Description
          </button>
          <button
            type="button"
            onClick={() => setType('blog')}
            className={`py-2 rounded-xl text-xs font-semibold border ${
              type === 'blog' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-gray-400'
            }`}
          >
            Blog Outline
          </button>
          <button
            type="button"
            onClick={() => setType('resume')}
            className={`py-2 rounded-xl text-xs font-semibold border ${
              type === 'resume' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-gray-400'
            }`}
          >
            Resume Summary
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-mono text-gray-300">Prompt Context / Key Topics</label>
          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. Distributed raft consensus microservice architecture in Go..."
            className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-xs resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg"
        >
          <Sparkles className="w-4 h-4" />
          <span>{loading ? 'Generating AI Response...' : 'Generate with AI'}</span>
        </button>
      </form>

      {output && (
        <div className="space-y-3 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-blue-400">AI Generated Content</span>
            <button
              onClick={copyOutput}
              className="px-3 py-1 rounded bg-white/5 text-xs text-gray-300 hover:text-white flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <pre className="p-4 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-gray-200 whitespace-pre-wrap">
            {output}
          </pre>
        </div>
      )}
    </div>
  )
}
