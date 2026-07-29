import React from 'react'
import { prisma } from '@/lib/prisma'
import { GlassCard } from '@/components/ui/glass-card'
import { ResumeDownloadButton } from '@/components/resume-download-button'
import { ResumeViewButton } from '@/components/resume-view-button'
import { FileText, Download, Briefcase, GraduationCap, Award, Cpu, ShieldCheck } from 'lucide-react'

export default async function ResumePage() {
  const profile = await prisma.profile.findFirst()
  const resume = await prisma.resume.findFirst({ where: { isDefault: true } })
  const experiences = await prisma.experience.findMany({ orderBy: { order: 'asc' } })
  const educations = await prisma.education.findMany({ orderBy: { order: 'asc' } })
  const certifications = await prisma.certification.findMany({ orderBy: { order: 'asc' } })
  const skills = await prisma.skill.findMany({ orderBy: { order: 'asc' }, take: 10 })

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono">
            <FileText className="w-3.5 h-3.5" />
            <span>EXECUTIVE CURRICULUM VITAE</span>
          </div>
          <h1 className="text-3xl font-bold text-white">{profile?.name} - Resume</h1>
          <p className="text-xs text-gray-400 font-mono">Downloads Count: {resume?.downloadsCount || 0} tracked downloads</p>
        </div>

        <div className="flex items-center gap-3">
          <ResumeViewButton />
          <ResumeDownloadButton
            resumeId={resume?.id || ''}
            pdfUrl={resume?.pdfUrl || profile?.cvPdfUrl || '/documents/Gebretsadik_Senior_Architect_CV.pdf'}
          />
        </div>
      </div>

      {/* Resume Document Wrapper */}
      <GlassCard className="p-8 sm:p-12 space-y-10 border-white/20">
        {/* Document Header */}
        <div className="border-b border-white/10 pb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-white">{profile?.name}</h2>
            <p className="text-base font-semibold text-blue-400 mt-1">{profile?.title}</p>
          </div>
          <div className="text-xs font-mono text-gray-400 space-y-1 sm:text-right">
            <p>{profile?.email}</p>
            <p>{profile?.phone}</p>
            <p>{profile?.location}</p>
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-3">
          <h3 className="text-sm font-mono text-blue-400 uppercase tracking-wider font-bold">Executive Summary</h3>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            {resume?.summary || profile?.bio}
          </p>
        </div>

        {/* Work Experience */}
        <div className="space-y-6">
          <h3 className="text-sm font-mono text-blue-400 uppercase tracking-wider font-bold flex items-center gap-2">
            <Briefcase className="w-4 h-4" /> Work Experience
          </h3>
          <div className="space-y-6">
            {experiences.map((exp) => {
              let achievements: string[] = []
              try {
                achievements = JSON.parse(exp.achievements)
              } catch (e) {
                console.error(e)
              }
              return (
                <div key={exp.id} className="space-y-2 border-l-2 border-blue-500/40 pl-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs">
                    <span className="font-bold text-white text-sm">{exp.position} — <span className="text-blue-400">{exp.company}</span></span>
                    <span className="font-mono text-gray-400">{exp.period}</span>
                  </div>
                  <p className="text-xs text-gray-300">{exp.description}</p>
                  {achievements.length > 0 && (
                    <ul className="space-y-1 text-xs text-gray-400 list-disc list-inside pt-1">
                      {achievements.map((ach, idx) => (
                        <li key={idx}>{ach}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Skills */}
        <div className="space-y-4">
          <h3 className="text-sm font-mono text-blue-400 uppercase tracking-wider font-bold flex items-center gap-2">
            <Cpu className="w-4 h-4" /> Key Proficiencies
          </h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span key={skill.id} className="px-3 py-1 rounded bg-white/5 border border-white/10 text-xs font-mono text-gray-200">
                {skill.name} ({skill.experienceYears}y)
              </span>
            ))}
          </div>
        </div>

        {/* Education & Certifications */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4 border-t border-white/10">
          <div className="space-y-3">
            <h3 className="text-sm font-mono text-blue-400 uppercase tracking-wider font-bold flex items-center gap-2">
              <GraduationCap className="w-4 h-4" /> Education
            </h3>
            {educations.map((edu) => (
              <div key={edu.id} className="text-xs space-y-0.5">
                <p className="font-bold text-white">{edu.degree} in {edu.field}</p>
                <p className="text-gray-400">{edu.institution} ({edu.period})</p>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-mono text-blue-400 uppercase tracking-wider font-bold flex items-center gap-2">
              <Award className="w-4 h-4" /> Certifications
            </h3>
            {certifications.map((cert) => (
              <div key={cert.id} className="text-xs space-y-0.5">
                <p className="font-bold text-white">{cert.title}</p>
                <p className="text-gray-400">{cert.issuer} ({cert.issueDate})</p>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
