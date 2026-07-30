import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { GlassCard } from '@/components/ui/glass-card'
import { ArrowRight, ExternalLink, Code2 as Github, Layers, Search } from 'lucide-react'
import { Prisma } from '@prisma/client'

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>
}) {
  const { category, search } = await searchParams

  const whereClause: Prisma.ProjectWhereInput = {}
  if (category) {
    whereClause.category = category
  }
  if (search) {
    whereClause.OR = [
      { title: { contains: search } },
      { summary: { contains: search } },
      { category: { contains: search } },
    ]
  }

  const projects = await prisma.project.findMany({
    where: whereClause,
    orderBy: { rank: 'asc' },
    include: { technologies: true },
  }).catch(() => [])

  const categories = [
    'All',
    'Cloud Architecture & DevOps',
    'AI & Data Engineering',
    'Fintech & Full-Stack Systems',
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 py-8">
      {/* Header */}
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono">
          <Layers className="w-3.5 h-3.5" />
          <span>ENGINEERING PORTFOLIO</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
          Featured <span className="gradient-text">Projects</span>
        </h1>
        <p className="text-gray-400 text-base sm:text-lg">
          Explore distributed platforms, AI infrastructure, enterprise backends, and full-stack SaaS applications.
        </p>
      </div>

      {/* Category Filter Pills & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => {
            const isSelected = (!category && cat === 'All') || category === cat
            const href = cat === 'All' ? '/projects' : `/projects?category=${encodeURIComponent(cat)}`
            return (
              <Link
                key={cat}
                href={href}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat}
              </Link>
            )
          })}
        </div>

        {/* Search Input */}
        <form action="/projects" method="GET" className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            name="search"
            defaultValue={search || ''}
            placeholder="Search projects..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </form>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <GlassCard key={project.id} className="flex flex-col justify-between group" glowOnHover>
            <div className="space-y-4">
              <div className="relative h-52 rounded-xl overflow-hidden border border-white/10">
                <Image
                  src={project.thumbnail}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md text-[10px] font-mono text-blue-400 border border-white/10">
                  {project.category}
                </div>
              </div>

              <h2 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                {project.title}
              </h2>
              <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">{project.summary}</p>
            </div>

            <div className="space-y-4 pt-4 mt-4 border-t border-white/10">
              <div className="flex flex-wrap gap-1.5">
                {project.technologies.map((tech) => (
                  <span key={tech.id} className="px-2.5 py-1 rounded bg-white/5 text-[10px] font-mono text-gray-300">
                    {tech.name}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-3">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors"
                      title="GitHub Repository"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors"
                      title="Live Demo"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>

                <Link
                  href={`/projects/${project.id}`}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition-all flex items-center gap-1"
                >
                  <span>Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
