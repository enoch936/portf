'use client'

import React, { useState } from 'react'
import { createSkillCategoryAction, createSkillAction, deleteSkillAction } from '@/app/actions/cms'
import { GlassCard } from '@/components/ui/glass-card'
import { DynamicIcon } from '@/components/icon'
import { Plus, Trash2, Layers, Cpu, Check } from 'lucide-react'
import type { SkillCategory, Skill } from '@prisma/client'

type SkillCategoryWithSkills = SkillCategory & { skills: Skill[] }

export function AdminSkillsManager({ initialCategories }: { initialCategories: SkillCategoryWithSkills[] }) {
  const [categories, setCategories] = useState(initialCategories)
  const [newCatName, setNewCatName] = useState('')
  const [selectedCatId, setSelectedCatId] = useState(categories[0]?.id || '')

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCatName) return
    const res = await createSkillCategoryAction(newCatName)
    if (res.success && res.category) {
      setCategories([...categories, { ...res.category, skills: [] }])
      setNewCatName('')
    }
  }

  const handleAddSkill = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const data = {
      categoryId: selectedCatId || categories[0]?.id,
      name: formData.get('name') as string,
      iconName: (formData.get('iconName') as string) || 'Code2',
      level: Number(formData.get('level')) || 90,
      experienceYears: Number(formData.get('experienceYears')) || 5,
      description: formData.get('description') as string,
    }

    const res = await createSkillAction(data)
    if (res.success && res.skill) {
      setCategories(
        categories.map((c) =>
          c.id === data.categoryId ? { ...c, skills: [...c.skills, res.skill] } : c
        )
      )
      ;(e.target as HTMLFormElement).reset()
    }
  }

  const handleDeleteSkill = async (catId: string, skillId: string) => {
    await deleteSkillAction(skillId)
    setCategories(
      categories.map((c) =>
        c.id === catId ? { ...c, skills: c.skills.filter((s) => s.id !== skillId) } : c
      )
    )
  }

  return (
    <div className="space-y-8">
      {/* Category Creator Form */}
      <GlassCard className="p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-400" /> Create Skill Category
        </h3>
        <form onSubmit={handleCreateCategory} className="flex gap-3">
          <input
            type="text"
            placeholder="Category Name (e.g. Security & Compliance)"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            className="flex-1 px-4 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
          >
            Add Category
          </button>
        </form>
      </GlassCard>

      {/* Add Skill Form */}
      {categories.length > 0 && (
        <GlassCard className="p-6 space-y-4 border-purple-500/30">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple-400" /> Add Skill Entry
          </h3>
          <form onSubmit={handleAddSkill} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <select
                value={selectedCatId}
                onChange={(e) => setSelectedCatId(e.target.value)}
                className="px-4 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                name="name"
                placeholder="Skill Name (e.g. Rust)"
                required
                className="px-4 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
              />

              <input
                type="text"
                name="iconName"
                placeholder="Lucide Icon (e.g. Shield, Cpu, Code2)"
                defaultValue="Code2"
                className="px-4 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="number"
                name="level"
                placeholder="Proficiency Level (1-100)"
                defaultValue={90}
                min={1}
                max={100}
                className="px-4 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
              />

              <input
                type="number"
                name="experienceYears"
                placeholder="Years of Experience"
                defaultValue={5}
                className="px-4 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
              />
            </div>

            <input
              type="text"
              name="description"
              placeholder="Short Description of skill application"
              required
              className="w-full px-4 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
            />

            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" /> Save Skill
            </button>
          </form>
        </GlassCard>
      )}

      {/* Categories & Skills Matrix View */}
      <div className="space-y-6">
        {categories.map((cat) => (
          <GlassCard key={cat.id} className="space-y-4">
            <h3 className="text-lg font-bold text-white">{cat.name}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cat.skills.map((s) => (
                <div
                  key={s.id}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                      <DynamicIcon name={s.iconName} className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{s.name}</p>
                      <p className="text-[10px] font-mono text-gray-400">{s.level}% | {s.experienceYears}y</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteSkill(cat.id, s.id)}
                    className="text-rose-400 hover:text-rose-300 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
