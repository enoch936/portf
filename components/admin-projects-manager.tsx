'use client'

import React, { useState } from 'react'
import { createProjectAction, deleteProjectAction } from '@/app/actions/cms'
import { GlassCard } from '@/components/ui/glass-card'
import { Plus, Trash2, Edit, ExternalLink, Code2 as Github, Sparkles, Check } from 'lucide-react'
import type { Project, ProjectTechnology } from '@prisma/client'

type ProjectWithTech = Project & { technologies?: ProjectTechnology[] }

export function AdminProjectsManager({ initialProjects }: { initialProjects: ProjectWithTech[] }) {
  const [projects, setProjects] = useState(initialProjects)
  const [showAddForm, setShowAddForm] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const techInput = (formData.get('technologies') as string) || ''

    const data = {
      title: formData.get('title') as string,
      slug: (formData.get('slug') as string) || `project-${Date.now()}`,
      summary: formData.get('summary') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      featured: formData.get('featured') === 'true',
      rank: Number(formData.get('rank')) || 1,
      thumbnail: formData.get('thumbnail') as string,
      liveUrl: formData.get('liveUrl') as string,
      githubUrl: formData.get('githubUrl') as string,
      architectureDiagram: formData.get('architectureDiagram') as string,
      features: ((formData.get('features') as string) || '').split('\n').filter(Boolean),
      challenges: ((formData.get('challenges') as string) || '').split('\n').filter(Boolean),
      solutions: ((formData.get('solutions') as string) || '').split('\n').filter(Boolean),
      technologies: techInput.split(',').map((t) => t.trim()).filter(Boolean),
    }

    const res = await createProjectAction(data)
    setLoading(false)

    if (res.success && res.project) {
      setProjects([...projects, res.project])
      setShowAddForm(false)
      ;(e.target as HTMLFormElement).reset()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return
    await deleteProjectAction(id)
    setProjects(projects.filter((p) => p.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Showcase Items ({projects.length})</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? 'Cancel' : 'Create New Project'}</span>
        </button>
      </div>

      {/* Add Project Form */}
      {showAddForm && (
        <GlassCard className="p-6 space-y-4 border-blue-500/30">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" /> New Project Entry
          </h3>

          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="title"
                placeholder="Project Title *"
                required
                className="px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
              />
              <input
                type="text"
                name="slug"
                placeholder="URL Slug (e.g. auracloud-platform)"
                required
                className="px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                type="text"
                name="category"
                placeholder="Category (e.g. Cloud Architecture)"
                required
                className="px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
              />
              <input
                type="number"
                name="rank"
                placeholder="Display Rank (e.g. 1)"
                defaultValue={1}
                className="px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
              />
              <select
                name="featured"
                className="px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
              >
                <option value="true">Featured: Yes</option>
                <option value="false">Featured: No</option>
              </select>
            </div>

            <textarea
              name="summary"
              rows={2}
              placeholder="Short Summary / Tagline *"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs resize-none"
            />

            <textarea
              name="description"
              rows={4}
              placeholder="Detailed System Architecture & Breakdown *"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs resize-none"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="thumbnail"
                placeholder="Thumbnail Image URL *"
                required
                className="px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
              />
              <input
                type="text"
                name="technologies"
                placeholder="Technologies (comma separated: Go, Rust, React)"
                required
                className="px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="liveUrl"
                placeholder="Live Application URL (Optional)"
                className="px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
              />
              <input
                type="text"
                name="githubUrl"
                placeholder="GitHub Repo URL (Optional)"
                className="px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
              />
            </div>

            <textarea
              name="architectureDiagram"
              rows={3}
              placeholder="Architecture Diagram (Mermaid syntax or text)"
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-mono resize-none"
            />

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{loading ? 'Creating...' : 'Save & Publish Project'}</span>
            </button>
          </form>
        </GlassCard>
      )}

      {/* Projects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((p) => (
          <GlassCard key={p.id} className="space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-blue-400 uppercase">{p.category}</span>
                <h3 className="text-lg font-bold text-white">{p.title}</h3>
              </div>
              <button
                onClick={() => handleDelete(p.id)}
                className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                title="Delete Project"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-400 line-clamp-2">{p.summary}</p>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-gray-500 font-mono">
              <span>Rank #{p.rank}</span>
              <span>{p.featured ? 'Featured' : 'Standard'}</span>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
