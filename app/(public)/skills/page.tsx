import React from 'react'
import { prisma } from '@/lib/prisma'
import { GlassCard } from '@/components/ui/glass-card'
import { DynamicIcon } from '@/components/icon'
import { Cpu, Layers } from 'lucide-react'

export default async function SkillsPage() {
  const categories = await prisma.skillCategory.findMany({
    orderBy: { order: 'asc' },
    include: {
      skills: {
        orderBy: { order: 'asc' },
      },
    },
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 py-8">
      {/* Header */}
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono">
          <Cpu className="w-3.5 h-3.5" />
          <span>TECHNICAL COMPETENCIES & STACK</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
          Skills & <span className="gradient-text">Proficiencies</span>
        </h1>
        <p className="text-gray-400 text-base sm:text-lg">
          Detailed technical matrix covering systems engineering, cloud infrastructure, AI models, and frontend applications.
        </p>
      </div>

      {/* Category Cards Matrix */}
      <div className="space-y-12">
        {categories.map((cat) => (
          <div key={cat.id} className="space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Layers className="w-4 h-4" />
              </span>
              {cat.name}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cat.skills.map((skill) => (
                <GlassCard key={skill.id} className="space-y-4" glowOnHover>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400">
                        <DynamicIcon name={skill.iconName} className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{skill.name}</h3>
                        <span className="text-[10px] font-mono text-gray-400">
                          {skill.experienceYears} Years Exp
                        </span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold font-mono">
                      {skill.level}%
                    </span>
                  </div>

                  <p className="text-xs text-gray-400 leading-relaxed">{skill.description}</p>

                  {/* Level Progress Bar */}
                  <div className="space-y-1 pt-2">
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-1000"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
