'use client'

import React, { useState } from 'react'
import { createProjectAction, deleteProjectAction, updateProjectAction } from '@/app/actions/cms'
import { GlassCard } from '@/components/ui/glass-card'
import { MediaUploadField } from '@/components/media-upload-field'
import { Plus, Trash2, Edit3, Sparkles, Check, X } from 'lucide-react'
import type { Project, ProjectTechnology } from '@prisma/client'

type ProjectWithTech = Project & { technologies?: ProjectTechnology[] }

export function AdminProjectsManager({ initialProjects }: { initialProjects: ProjectWithTech[] }) {
  const [projects, setProjects] = useState(initialProjects)
  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState<ProjectWithTech | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const openCreate = () => {
    setEditingProject(null)
    setMessage('')
    setShowForm(true)
  }

  const openEdit = (project: ProjectWithTech) => {
    setEditingProject(project)
    setMessage('')
    setShowForm(true)
  }

  const closeForm = () => {
    setEditingProject(null)
    setShowForm(false)
  }

  const splitLines = (value: FormDataEntryValue | null) => String(value || '').split('\n').map((item) => item.trim()).filter(Boolean)
  const parseStoredList = (value: string) => {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : []
    } catch {
      return splitLines(value)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

    const res = editingProject
      ? await updateProjectAction(editingProject.id, data)
      : await createProjectAction(data)
    setLoading(false)

    if (res.success) {
      const project = res.project as Project
      const technologies = data.technologies.map((name) => ({ id: `${project.id}-${name}`, projectId: project.id, skillId: null, name }))
      setProjects((current) => editingProject
        ? current.map((item) => item.id === project.id ? { ...project, technologies } : item)
        : [...current, { ...project, technologies }]
      )
      setMessage(editingProject ? 'Project updated and published.' : 'Project created and published.')
      closeForm()
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
          onClick={showForm ? closeForm : openCreate}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>{showForm ? 'Cancel' : 'Create New Project'}</span>
        </button>
      </div>

      {message && <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400">{message}</p>}

      {/* Create / edit project form */}
      {showForm && (
        <GlassCard className="p-6 space-y-4 border-blue-500/30">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            {editingProject ? <Edit3 className="w-4 h-4 text-blue-400" /> : <Sparkles className="w-4 h-4 text-blue-400" />}
            {editingProject ? `Edit released project: ${editingProject.title}` : 'New Project Entry'}
          </h3>
          <p className="text-xs text-gray-500">Changes are published to the public portfolio when you save.</p>

          <form key={editingProject?.id || 'new'} onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="title"
                placeholder="Project Title *"
                required
                defaultValue={editingProject?.title}
                className="px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
              />
              <input
                type="text"
                name="slug"
                placeholder="URL Slug (e.g. auracloud-platform)"
                required
                defaultValue={editingProject?.slug}
                className="px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                type="text"
                name="category"
                placeholder="Category (e.g. Cloud Architecture)"
                required
                defaultValue={editingProject?.category}
                className="px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
              />
              <input
                type="number"
                name="rank"
                placeholder="Display Rank (e.g. 1)"
                defaultValue={editingProject?.rank || 1}
                className="px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
              />
              <select
                name="featured"
                defaultValue={editingProject?.featured ? 'true' : 'false'}
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
              defaultValue={editingProject?.summary}
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs resize-none"
            />

            <textarea
              name="description"
              rows={4}
              placeholder="Detailed System Architecture & Breakdown *"
              required
              defaultValue={editingProject?.description}
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs resize-none"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <MediaUploadField name="thumbnail" label="Project cover image" defaultValue={editingProject?.thumbnail} required />
              <input
                type="text"
                name="technologies"
                placeholder="Technologies (comma separated: Go, Rust, React)"
                required
                defaultValue={editingProject?.technologies?.map((tech) => tech.name).join(', ')}
                className="px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="liveUrl"
                placeholder="Live Application URL (Optional)"
                defaultValue={editingProject?.liveUrl || ''}
                className="px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
              />
              <input
                type="text"
                name="githubUrl"
                placeholder="GitHub Repo URL (Optional)"
                defaultValue={editingProject?.githubUrl || ''}
                className="px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
              />
            </div>

            <textarea
              name="architectureDiagram"
              rows={3}
              placeholder="Architecture Diagram (Mermaid syntax or text)"
              defaultValue={editingProject?.architectureDiagram || ''}
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-mono resize-none"
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <textarea name="features" rows={4} placeholder="Key features (one per line)" defaultValue={editingProject ? parseStoredList(editingProject.featuresJson).join('\n') : ''} className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs resize-none" />
              <textarea name="challenges" rows={4} placeholder="Challenges (one per line)" defaultValue={editingProject ? parseStoredList(editingProject.challengesJson).join('\n') : ''} className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs resize-none" />
              <textarea name="solutions" rows={4} placeholder="Solutions (one per line)" defaultValue={editingProject ? parseStoredList(editingProject.solutionsJson).join('\n') : ''} className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs resize-none" />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{loading ? 'Saving...' : editingProject ? 'Save Released Project' : 'Save & Publish Project'}</span>
            </button>
            <button type="button" onClick={closeForm} className="ml-3 px-5 py-2.5 rounded-xl text-xs font-semibold text-gray-500 hover:text-white inline-flex items-center gap-1"><X className="w-4 h-4" /> Cancel</button>
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
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(p)} className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 dark:text-blue-300 transition-colors" title="Edit released project"><Edit3 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors" title="Delete Project"><Trash2 className="w-4 h-4" /></button>
              </div>
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
