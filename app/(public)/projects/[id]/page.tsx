import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { GlassCard } from '@/components/ui/glass-card'
import { ArrowLeft, ArrowRight, ArrowUpRight, ExternalLink, Code2 as Github, Cpu, ShieldCheck, CheckCircle, AlertTriangle, Lightbulb } from 'lucide-react'

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      technologies: true,
      images: { orderBy: { order: 'asc' } },
    },
  })

  if (!project) {
    notFound()
  }

  const [prevProject, nextProject] = await Promise.all([
    prisma.project.findFirst({
      where: { rank: { lt: project.rank } },
      orderBy: { rank: 'desc' },
      select: { id: true, title: true, thumbnail: true, category: true },
    }),
    prisma.project.findFirst({
      where: { rank: { gt: project.rank } },
      orderBy: { rank: 'asc' },
      select: { id: true, title: true, thumbnail: true, category: true },
    }),
  ])

  let features: string[] = []
  let challenges: string[] = []
  let solutions: string[] = []

  try {
    features = JSON.parse(project.featuresJson)
    challenges = JSON.parse(project.challengesJson)
    solutions = JSON.parse(project.solutionsJson)
  } catch (e) {
    console.error(e)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 py-8">
      {/* Back button */}
      <Link href="/projects" className="inline-flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>BACK TO PORTFOLIO SHOWCASE</span>
      </Link>

      {/* Main Header */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono">
            {project.category}
          </span>
          <span className="text-xs text-gray-500 font-mono">Rank #{project.rank}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
          {project.title}
        </h1>

        <p className="text-lg text-gray-300 leading-relaxed max-w-4xl">{project.summary}</p>

        {/* Links & Action CTAs */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Launch Live App</span>
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/15 flex items-center gap-2 transition-all"
            >
              <Github className="w-4 h-4" />
              <span>View Source Code</span>
            </a>
          )}
        </div>
      </div>

      {/* Main Banner Image */}
      <div className="relative h-80 sm:h-[450px] w-full rounded-2xl overflow-hidden border border-white/15 shadow-2xl">
        <Image src={project.thumbnail} alt={project.title} fill className="object-cover" priority />
      </div>

      {/* Tech Stack Pills */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono text-gray-400 uppercase tracking-wider">Technologies & Frameworks</h3>
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <span key={tech.id} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-blue-300">
              {tech.name}
            </span>
          ))}
        </div>
      </div>

      {/* Detailed Description */}
      <GlassCard className="space-y-4">
        <h2 className="text-2xl font-bold text-white">System Architecture & Breakdown</h2>
        <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">{project.description}</p>
      </GlassCard>

      {/* Architecture Diagram */}
      {project.architectureDiagram && (
        <GlassCard className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-400" />
            Architecture Diagram & Component Flow
          </h2>
          <pre className="p-4 rounded-xl bg-black/60 border border-white/10 text-blue-300 font-mono text-xs overflow-x-auto">
            {project.architectureDiagram}
          </pre>
        </GlassCard>
      )}

      {/* Features, Challenges, and Solutions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Features */}
        <GlassCard className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-blue-400" />
            Key Features
          </h3>
          <ul className="space-y-2 text-xs text-gray-300">
            {features.map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">•</span>
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </GlassCard>

        {/* Challenges */}
        <GlassCard className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Technical Challenges
          </h3>
          <ul className="space-y-2 text-xs text-gray-300">
            {challenges.map((chal, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>{chal}</span>
              </li>
            ))}
          </ul>
        </GlassCard>

        {/* Solutions */}
        <GlassCard className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-emerald-400" />
            Engineered Solutions
          </h3>
          <ul className="space-y-2 text-xs text-gray-300">
            {solutions.map((sol, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>{sol}</span>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>

      {/* Gallery Screenshots */}
      {project.images && project.images.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Interface Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {project.images.map((img) => (
              <div key={img.id} className="space-y-2">
                <div className="relative h-64 rounded-xl overflow-hidden border border-white/10">
                  <Image src={img.url} alt={img.caption || 'Project screenshot'} fill className="object-cover" />
                </div>
                {img.caption && <p className="text-xs font-mono text-gray-400 text-center">{img.caption}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* More Projects CTA */}
      <div className="flex items-center justify-center">
        <Link
          href="/projects"
          className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-semibold text-gray-300 hover:text-white flex items-center gap-2 transition-all"
        >
          <span>View All Projects</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Prev / Next Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
        {prevProject ? (
          <Link
            href={`/projects/${prevProject.id}`}
            className="glass-card group flex items-center gap-4 p-4 hover:border-blue-500/30 transition-all"
          >
            <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-white/10">
              <Image src={prevProject.thumbnail} alt={prevProject.title} fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Previous</span>
              <h4 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors truncate">
                {prevProject.title}
              </h4>
              <span className="text-[10px] font-mono text-gray-500">{prevProject.category}</span>
            </div>
            <ArrowLeft className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors shrink-0" />
          </Link>
        ) : (
          <div />
        )}

        {nextProject ? (
          <Link
            href={`/projects/${nextProject.id}`}
            className="glass-card group flex items-center gap-4 p-4 hover:border-blue-500/30 transition-all md:justify-end md:text-right"
          >
            <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors shrink-0 order-last md:order-first" />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Next</span>
              <h4 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors truncate">
                {nextProject.title}
              </h4>
              <span className="text-[10px] font-mono text-gray-500">{nextProject.category}</span>
            </div>
            <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-white/10 order-first md:order-last">
              <Image src={nextProject.thumbnail} alt={nextProject.title} fill className="object-cover" />
            </div>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  )
}
