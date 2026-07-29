import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { GlassCard } from '@/components/ui/glass-card'
import { DynamicIcon } from '@/components/icon'
import { ArrowRight, Download, Mail, Sparkles, Code, Cpu, ShieldCheck, Zap } from 'lucide-react'

export default async function HomePage() {
  const profile = await prisma.profile.findFirst({
    include: { socialLinks: { orderBy: { order: 'asc' } } },
  })
  const featuredProjects = await prisma.project.findMany({
    where: { featured: true },
    orderBy: { rank: 'asc' },
    take: 3,
    include: { technologies: true },
  })
  const skillsCount = await prisma.skill.count()
  const experiences = await prisma.experience.findMany({ orderBy: { order: 'asc' } })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 py-8">
      {/* Hero Section */}
      <section className="relative flex flex-col lg:flex-row items-center justify-between gap-12 pt-6">
        {/* Left Intro Text */}
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{profile?.status || 'Available for Architecture Consulting'}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Hi, I&apos;m <span className="gradient-text">{profile?.name || 'Gebretsadik M. Engida'}</span>
          </h1>

          <p className="text-xl font-medium text-indigo-300">
            {profile?.title || 'Senior Software Engineer & Distributed Systems Architect'}
          </p>

          <p className="text-gray-400 text-base sm:text-lg max-w-2xl leading-relaxed">
            {profile?.brandingStatement ||
              'Building fault-tolerant enterprise architectures & high-impact digital experiences for modern tech leaders.'}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
            <Link
              href="/contact"
              className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 transition-all duration-200"
            >
              <Mail className="w-4 h-4" />
              <span>Get in Touch</span>
            </Link>

            <Link
              href="/resume"
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/15 backdrop-blur-md flex items-center gap-2 transition-all duration-200"
            >
              <Download className="w-4 h-4 text-blue-400" />
              <span>Download CV</span>
            </Link>

            <Link
              href="/projects"
              className="px-6 py-3.5 rounded-xl text-gray-300 hover:text-white font-medium text-sm flex items-center gap-1.5 transition-colors"
            >
              <span>Explore Projects</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Social Links */}
          {profile?.socialLinks && profile.socialLinks.length > 0 && (
            <div className="flex items-center justify-center lg:justify-start gap-3 pt-4">
              <span className="text-xs text-gray-500 font-mono mr-2">CONNECT:</span>
              {profile.socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-gray-300 hover:text-white transition-all duration-200"
                  title={link.platform}
                >
                  <DynamicIcon name={link.iconName} className="w-4 h-4" />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Right Avatar Card */}
        <div className="relative w-full max-w-md">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-xl opacity-30 animate-pulse"></div>
          <GlassCard className="relative p-6 flex flex-col items-center text-center gap-6">
            <div className="relative w-44 h-44 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl">
              <Image
                src={
                  profile?.avatarUrl ||
                  '/images/avatar.svg'
                }
                alt={profile?.name || 'Gebretsadik'}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">{profile?.name}</h3>
              <p className="text-xs font-mono text-blue-400">{profile?.location || 'San Francisco, CA'}</p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 w-full pt-2 border-t border-white/10 text-center">
              <div>
                <p className="text-xl font-extrabold text-white">9+</p>
                <p className="text-[10px] font-mono text-gray-400">YRS EXP</p>
              </div>
              <div>
                <p className="text-xl font-extrabold text-blue-400">{featuredProjects.length}+</p>
                <p className="text-[10px] font-mono text-gray-400">PROJECTS</p>
              </div>
              <div>
                <p className="text-xl font-extrabold text-purple-400">{skillsCount}</p>
                <p className="text-[10px] font-mono text-gray-400">SKILLS</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <GlassCard className="space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Cpu className="w-5 h-5" />
          </div>
          <h4 className="text-lg font-semibold text-white">Distributed Architecture</h4>
          <p className="text-xs text-gray-400 leading-relaxed">
            High-throughput event streaming, fault-tolerant microservices, and gRPC mesh networking.
          </p>
        </GlassCard>

        <GlassCard className="space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Code className="w-5 h-5" />
          </div>
          <h4 className="text-lg font-semibold text-white">Full-Stack SaaS</h4>
          <p className="text-xs text-gray-400 leading-relaxed">
            React 19, Next.js 16, TypeScript, Node.js, and modern state-driven user interfaces.
          </p>
        </GlassCard>

        <GlassCard className="space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Zap className="w-5 h-5" />
          </div>
          <h4 className="text-lg font-semibold text-white">AI Agent Intelligence</h4>
          <p className="text-xs text-gray-400 leading-relaxed">
            LLM agent integration, RAG vector indexing, and automated technical decision systems.
          </p>
        </GlassCard>

        <GlassCard className="space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="text-lg font-semibold text-white">Security & Cloud DevOps</h4>
          <p className="text-xs text-gray-400 leading-relaxed">
            Kubernetes orchestration, zero-trust security compliance, and automated CI/CD automation.
          </p>
        </GlassCard>
      </section>

      {/* Featured Projects Showcase Teaser */}
      <section className="space-y-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-white">Featured Engineering Showcase</h2>
            <p className="text-sm text-gray-400 mt-1">High-impact platforms designed and architected by Gebretsadik</p>
          </div>
          <Link href="/projects" className="text-sm font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1">
            View All Projects <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProjects.map((project) => (
            <GlassCard key={project.id} className="flex flex-col justify-between group" glowOnHover>
              <div className="space-y-4">
                <div className="relative h-48 rounded-xl overflow-hidden border border-white/10">
                  <Image
                    src={project.thumbnail}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-mono text-blue-400 border border-white/10">
                    {project.category}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{project.summary}</p>
              </div>

              <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span key={tech.id} className="px-2 py-0.5 rounded bg-white/5 text-[10px] font-mono text-gray-300">
                      {tech.name}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/projects/${project.id}`}
                  className="p-2 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white transition-all"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>
    </div>
  )
}
