import React from 'react'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { GlassCard } from '@/components/ui/glass-card'
import { Briefcase, GraduationCap, Award, Compass, CheckCircle2, Calendar, MapPin } from 'lucide-react'

export default async function AboutPage() {
  const [profile, experiences, educations, certifications] = await Promise.all([
    prisma.profile.findFirst().catch(() => null),
    prisma.experience.findMany({ orderBy: { order: 'asc' } }).catch(() => []),
    prisma.education.findMany({ orderBy: { order: 'asc' } }).catch(() => []),
    prisma.certification.findMany({ orderBy: { order: 'asc' } }).catch(() => []),
  ])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 py-8">
      {/* Page Title */}
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono">
          <Compass className="w-3.5 h-3.5" />
          <span>CAREER JOURNEY & PHILOSOPHY</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
          About <span className="gradient-text">{profile?.name || 'Gebretsadik'}</span>
        </h1>
        <p className="text-gray-400 text-base sm:text-lg">
          Senior Software Engineer, System Architect, Freelance Advisory Consultant, and Tech Entrepreneur.
        </p>
      </div>

      {/* Bio & Philosophy Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <GlassCard className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Compass className="w-4 h-4" />
            </span>
            Biography & Engineering Background
          </h2>

          <div className="prose prose-invert max-w-none text-gray-300 space-y-4 text-sm sm:text-base leading-relaxed">
            <p>{profile?.bio}</p>
            <p>
              Throughout my 9+ years in technology, I have specialized in building distributed control planes, high-throughput microservices, edge routing networks, and AI-assisted developer platforms.
            </p>
            <p>
              I believe in clean code architectures, strict type safety, zero-trust security design, and ruthless performance optimization. When I am not designing fault-tolerant backends, I write technical articles and advise high-growth tech startups.
            </p>
          </div>
        </GlassCard>

        <GlassCard className="space-y-6">
          <h3 className="text-xl font-bold text-white">Engineering Philosophy</h3>
          <ul className="space-y-4 text-xs text-gray-300">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span><strong>Design for Failure:</strong> Distributed systems will partition. Build resilient consensus and graceful fallbacks.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <span><strong>Type-Safe Contracts:</strong> Enforce strict schemas with TypeScript, Zod, and gRPC across all service boundaries.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Sub-Millisecond SLAs:</strong> Optimize cache locality, database indexes, and network packet serialization.</span>
            </li>
          </ul>

          <div className="relative h-40 rounded-xl overflow-hidden border border-white/10 mt-4">
            <Image
              src={profile?.heroImageUrl || '/images/about-engineering.svg'}
              alt="Engineering work"
              fill
              className="object-cover"
            />
          </div>
        </GlassCard>
      </div>

      {/* Experience Timeline */}
      <section className="space-y-8">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Briefcase className="w-4 h-4" />
          </span>
          Professional Work Experience
        </h2>

        <div className="space-y-6 relative border-l-2 border-white/10 ml-4 pl-6">
          {experiences.map((exp) => {
            let achievements: string[] = []
            try {
              achievements = JSON.parse(exp.achievements)
            } catch (e) {
              console.error(e)
            }

            return (
              <div key={exp.id} className="relative group">
                <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-blue-600 border-4 border-slate-950 group-hover:scale-125 transition-transform" />
                <GlassCard className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-xl font-bold text-white">{exp.position}</h3>
                      <p className="text-sm font-semibold text-blue-400">{exp.company}</p>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-mono text-gray-400">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {exp.period}</span>
                      {exp.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {exp.location}</span>}
                    </div>
                  </div>

                  <p className="text-xs text-gray-300">{exp.description}</p>

                  {achievements.length > 0 && (
                    <ul className="space-y-1.5 pt-2 border-t border-white/10 text-xs text-gray-400">
                      {achievements.map((ach, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-blue-400 font-bold">•</span>
                          <span>{ach}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </GlassCard>
              </div>
            )
          })}
        </div>
      </section>

      {/* Education & Certifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Education */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <GraduationCap className="w-4 h-4" />
            </span>
            Education & Degrees
          </h2>
          <div className="space-y-4">
            {educations.map((edu) => (
              <GlassCard key={edu.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">{edu.institution}</h3>
                  <span className="text-xs font-mono text-gray-400">{edu.period}</span>
                </div>
                <p className="text-xs font-semibold text-purple-400">{edu.degree} in {edu.field}</p>
                {edu.description && <p className="text-xs text-gray-400">{edu.description}</p>}
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Certifications */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Award className="w-4 h-4" />
            </span>
            Industry Certifications
          </h2>
          <div className="space-y-4">
            {certifications.map((cert) => (
              <GlassCard key={cert.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">{cert.title}</h3>
                  <span className="text-xs font-mono text-emerald-400">{cert.issueDate}</span>
                </div>
                <p className="text-xs text-gray-400">Issuer: {cert.issuer} {cert.credentialId && `(${cert.credentialId})`}</p>
              </GlassCard>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
