import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { GlassCard } from '@/components/ui/glass-card'
import { DynamicIcon } from '@/components/icon'
import { ArrowRight, Download, Mail, Code2, ShieldCheck, Layers3, MapPin } from 'lucide-react'

export default async function HomePage() {
  const [profile, featuredProjects, skillsCount, experiences] = await Promise.all([
    prisma.profile.findFirst({ include: { socialLinks: { orderBy: { order: 'asc' } } } }),
    prisma.project.findMany({ where: { featured: true }, orderBy: { rank: 'asc' }, take: 3, include: { technologies: true } }),
    prisma.skill.count(),
    prisma.experience.findMany({ orderBy: { order: 'asc' } }),
  ])

  const name = profile?.name || 'Gebretsadik M. Engida'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-24">
      <section className="relative grid lg:grid-cols-[1.18fr_.82fr] gap-10 lg:gap-16 items-center min-h-[580px]">
        <div className="space-y-7 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-500/10 border border-blue-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            {profile?.status || 'Available for selected engagements'}
          </div>

          <div className="space-y-5">
            <p className="text-sm font-semibold tracking-[.18em] uppercase text-gray-500">Independent software engineer</p>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-[-.055em] leading-[.98] text-white">
              Building digital products that <span className="gradient-text">hold up.</span>
            </h1>
            <p className="text-lg sm:text-xl font-medium text-blue-700 dark:text-blue-300">{profile?.title || 'Full-Stack Engineer & Systems Builder'}</p>
            <p className="max-w-2xl mx-auto lg:mx-0 text-base sm:text-lg leading-8 text-gray-500 dark:text-gray-400">
              {profile?.brandingStatement || 'I design thoughtful software, dependable platforms, and clear user experiences for ambitious teams.'}
            </p>
          </div>

          <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-1">
            <Link href="/contact" className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold inline-flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-colors">
              <Mail className="w-4 h-4" /> Start a conversation
            </Link>
            <Link href="/projects" className="px-5 py-3 rounded-xl border border-black/10 dark:border-white/15 bg-white/70 dark:bg-white/5 text-slate-800 dark:text-white text-sm font-semibold inline-flex items-center gap-2 transition-colors hover:bg-white dark:hover:bg-white/10">
              Explore work <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/resume" className="px-4 py-3 text-sm font-semibold text-gray-500 hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-2">
              <Download className="w-4 h-4" /> Résumé
            </Link>
          </div>

          {profile?.socialLinks && profile.socialLinks.length > 0 && (
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-3">
              <span className="mr-2 text-xs font-medium uppercase tracking-[.14em] text-gray-500">Find me</span>
              {profile.socialLinks.map((link) => (
                <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" title={link.platform} className="p-2.5 rounded-xl control-surface text-gray-500 hover:text-blue-600 transition-colors">
                  <DynamicIcon name={link.iconName} className="w-4 h-4" />
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="relative mx-auto w-full max-w-md">
          <div className="absolute inset-x-10 -top-8 h-40 rounded-full bg-blue-500/20 blur-3xl" />
          <GlassCard className="relative p-5 sm:p-6 space-y-6">
            <div className="relative aspect-[4/4.25] overflow-hidden rounded-2xl border border-black/5 dark:border-white/10 bg-slate-100">
              <Image src={profile?.avatarUrl || '/images/avatar.svg'} alt={name} fill priority className="object-cover" />
              <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/70 to-transparent text-left">
                <p className="font-bold text-white text-lg">{name}</p>
                <p className="mt-1 text-xs text-white/70 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{profile?.location || 'Available remotely'}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 divide-x divide-black/10 dark:divide-white/10 text-center">
              <div><p className="text-2xl font-extrabold text-white">{experiences.length || '9'}+</p><p className="mt-1 text-[10px] tracking-wider uppercase text-gray-500">Roles</p></div>
              <div><p className="text-2xl font-extrabold text-white">{featuredProjects.length}+</p><p className="mt-1 text-[10px] tracking-wider uppercase text-gray-500">Selected work</p></div>
              <div><p className="text-2xl font-extrabold text-white">{skillsCount}</p><p className="mt-1 text-[10px] tracking-wider uppercase text-gray-500">Tools</p></div>
            </div>
          </GlassCard>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: Layers3, title: 'Product-minded engineering', text: 'From early direction to a focused, maintainable release.' },
          { icon: Code2, title: 'Built for real use', text: 'Interfaces and services designed around people, performance, and clarity.' },
          { icon: ShieldCheck, title: 'Reliable by design', text: 'Security, maintainability, and scale considered from the first decision.' },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-2xl border border-black/8 dark:border-white/10 bg-white/50 dark:bg-white/[.035] p-6">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-300 grid place-items-center"><Icon className="w-5 h-5" /></div>
            <h2 className="mt-5 text-base font-bold text-white">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">{text}</p>
          </div>
        ))}
      </section>

      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row gap-5 sm:items-end justify-between">
          <div><p className="text-sm font-semibold tracking-[.15em] uppercase text-gray-500">Selected work</p><h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-white">A few things I&apos;ve helped bring to life.</h2></div>
          <Link href="/projects" className="text-sm font-semibold text-blue-600 dark:text-blue-300 hover:underline inline-flex items-center gap-1">See all projects <ArrowRight className="w-4 h-4" /></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProjects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`} className="group block rounded-2xl overflow-hidden border border-black/8 dark:border-white/10 bg-white/60 dark:bg-white/[.035] hover:border-blue-500/40 transition-colors">
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100"><Image src={project.thumbnail} alt={project.title} fill className="object-cover" /><span className="absolute top-3 left-3 rounded-full bg-white/90 dark:bg-slate-950/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">{project.category}</span></div>
              <div className="p-5"><h3 className="text-lg font-bold text-white group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">{project.title}</h3><p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400 line-clamp-2">{project.summary}</p><div className="mt-5 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-300">View case study <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" /></div></div>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-3xl bg-slate-950 text-white px-6 py-10 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl shadow-slate-950/15">
        <div><p className="text-blue-300 text-sm font-semibold">Have a project in mind?</p><h2 className="mt-2 text-3xl font-bold tracking-tight">Let&apos;s make it simple, useful, and durable.</h2></div>
        <Link href="/contact" className="shrink-0 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950 inline-flex items-center gap-2 hover:bg-blue-50">Get in touch <ArrowRight className="w-4 h-4" /></Link>
      </section>
    </div>
  )
}
