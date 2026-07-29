'use client'

import React, { useState } from 'react'
import { GlassCard } from '@/components/ui/glass-card'
import { MessageSquare, Send, User } from 'lucide-react'

interface CommentItem {
  id: string
  authorName: string
  content: string
  createdAt: Date
}

export function BlogCommentSection({
  postId,
  initialComments,
}: {
  postId: string
  initialComments: CommentItem[]
}) {
  const [comments, setComments] = useState<CommentItem[]>(initialComments)
  const [authorName, setAuthorName] = useState('')
  const [authorEmail, setAuthorEmail] = useState('')
  const [content, setContent] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!authorName || !content) return

    const newComment: CommentItem = {
      id: String(Date.now()),
      authorName,
      content,
      createdAt: new Date(),
    }

    setComments([newComment, ...comments])
    setSubmitted(true)
    setAuthorName('')
    setAuthorEmail('')
    setContent('')

    setTimeout(() => setSubmitted(false), 4000)
  }

  return (
    <GlassCard className="space-y-8">
      <h3 className="text-xl font-bold text-white flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-blue-400" />
        Reader Discussions ({comments.length})
      </h3>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Your Name *"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            required
            className="px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
          <input
            type="email"
            placeholder="Your Email (Optional)"
            value={authorEmail}
            onChange={(e) => setAuthorEmail(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <textarea
          rows={3}
          placeholder="Share your thoughts on this technical paper..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
        />

        <div className="flex items-center justify-between">
          {submitted && <span className="text-xs text-emerald-400 font-mono">Comment published successfully!</span>}
          <button
            type="submit"
            className="ml-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-2 transition-all shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Post Comment</span>
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        {comments.map((comment) => (
          <div key={comment.id} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-400" />
                {comment.authorName}
              </span>
              <span className="font-mono text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
            </div>
            <p className="text-xs text-gray-300">{comment.content}</p>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}
