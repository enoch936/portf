'use client'

import React, { useState } from 'react'
import { createBlogPostAction, deleteBlogPostAction } from '@/app/actions/cms'
import { GlassCard } from '@/components/ui/glass-card'
import { Plus, Trash2, BookOpen, Check } from 'lucide-react'
import type { BlogPost, BlogCategory } from '@prisma/client'

type BlogPostWithCategory = BlogPost & { category?: BlogCategory | null }

export function AdminBlogStudio({ initialPosts, categories }: { initialPosts: BlogPostWithCategory[]; categories: BlogCategory[] }) {
  const [posts, setPosts] = useState<BlogPostWithCategory[]>(initialPosts)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      title: formData.get('title') as string,
      slug: (formData.get('slug') as string) || `post-${Date.now()}`,
      summary: formData.get('summary') as string,
      content: formData.get('content') as string,
      coverImage: formData.get('coverImage') as string,
      categoryId: (formData.get('categoryId') as string) || undefined,
      readTimeMinutes: Number(formData.get('readTimeMinutes')) || 5,
      tags: ((formData.get('tags') as string) || '').split(',').map((t) => t.trim()).filter(Boolean),
    }

    const res = await createBlogPostAction(data)
    setLoading(false)

    if (res.success && res.post) {
      setPosts([res.post, ...posts])
      setShowForm(false)
      ;(e.target as HTMLFormElement).reset()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return
    await deleteBlogPostAction(id)
    setPosts(posts.filter((p) => p.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Articles ({posts.length})</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>{showForm ? 'Cancel' : 'Write New Article'}</span>
        </button>
      </div>

      {showForm && (
        <GlassCard className="p-6 space-y-4 border-blue-500/30">
          <h3 className="text-lg font-bold text-white">Markdown Article Editor</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="title"
                placeholder="Article Title *"
                required
                className="px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
              />
              <input
                type="text"
                name="slug"
                placeholder="Slug (e.g. building-resilient-microservices)"
                required
                className="px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                type="text"
                name="coverImage"
                placeholder="Cover Image URL *"
                required
                className="px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
              />
              <input
                type="number"
                name="readTimeMinutes"
                placeholder="Read Time (mins)"
                defaultValue={6}
                className="px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
              />
              <input
                type="text"
                name="tags"
                placeholder="Tags (Go, Next.js, Architecture)"
                className="px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
              />
            </div>

            <textarea
              name="summary"
              rows={2}
              placeholder="Article Executive Summary *"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs resize-none"
            />

            <textarea
              name="content"
              rows={8}
              placeholder="Markdown Body Content *"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-mono resize-none"
            />

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Publish Article</span>
            </button>
          </form>
        </GlassCard>
      )}

      {/* Posts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <GlassCard key={post.id} className="space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-purple-400 uppercase">
                  {post.category?.name || 'Technical Paper'}
                </span>
                <h3 className="text-lg font-bold text-white">{post.title}</h3>
              </div>
              <button
                onClick={() => handleDelete(post.id)}
                className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-400 line-clamp-2">{post.summary}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
