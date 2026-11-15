import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { SITE, resolveSocialLinks } from '@/lib/site-config'
import { DynamicIcon } from '@/components/icon'
import { HeroVisual } from '@/components/hero-visual'
import { Reveal, Stagger, StaggerItem, WordReveal, Magnetic, CountUp, Marquee } from '@/components/motion'
import { ArrowRight, Download, Mail, Code2, ShieldCheck, Layers3 } from 'lucide-react'

const fallbackStack = ['Next.js', 'React', 'TypeScript', 'Node.js', 'Flutter', 'PostgreSQL', 'Docker', 'AI Systems', 'Real-Time', 'Cloud Native', 'GraphQL', 'Prisma']

export default async function HomePage() {
  const [profile, featuredProjects, skillsCount, projectsCount, topSkills] = await Promise.all([
    prisma.profile.findFirst({ include: { socialLinks: { orderBy: { order: 'asc' } } } }).catch(() => null),
    prisma.project.findMany({ where: { featured: true }, orderBy: { rank: 'asc' }, take: 3, include: { technologies: true } }).catch(() => []),
    prisma.skill.count().catch(() => 0),
    prisma.project.count().catch(() => 0),
    prisma.skill.findMany({ orderBy: { level: 'desc' }, take: 14, select: { name: true } }).catch(() => []),
  ])

  const name = profile?.name || SITE.name
  const socialLinks = resolveSocialLinks(profile?.socialLinks ?? [])
  const stack = topSkills.length >= 4 ? topSkills.map((s) => s.name) : fallbackStack
  const stats = [
    { label: 'Projects', value: projectsCount || featuredProjects.length, suffix: '+' },
    { label: 'Tools', value: skillsCount || 40 },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-24 sm:space-y-32">
      {/* ================= HERO ================= */}
      <section className="relative grid lg:grid-cols-[1.12fr_.88fr] gap-14 lg:gap-12 items-center min-h-[600px]">
        <div className="space-y-8 text-center lg:text-left">
          <Reveal y={16}>
            <div className="inline-flex items-center gap-2.5 rounded-full pl-3 pr-4 py-2 text-xs font-semibold control-surface text-gray-600 dark:text-gray-300">
              <span className="pulse-dot" />
              {profile?.status || 'Available for selected engagements'}
            </div>
          </Reveal>

          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white">
              Hi, I&apos;m Gebretsadik. I build web and mobile apps.
            </h1>
            <Reveal delay={0.55} y={14}>
              <p className="text-lg sm:text-xl font-semibold text-[var(--brand-1)]">Computer Science graduate, University of Gondar</p>
            </Reveal>
            <Reveal delay={0.65} y={14}>
              <p className="max-w-2xl mx-auto lg:mx-0 text-base sm:text-lg leading-8 text-gray-500 dark:text-gray-400">
                I recently graduated and I am looking for my first software engineering job. I like building things people actually use, like a freelancer marketplace, chat apps, an exam system, and mobile apps.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.8} y={14}>
            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-3">
              <Magnetic>
                <Link href="/contact" className="btn btn-primary">
                  <Mail className="w-4 h-4" /> Start a conversation
                </Link>
              </Magnetic>
              <Magnetic>
                <Link href="/projects" className="btn btn-ghost">
                  Explore work <ArrowRight className="w-4 h-4 arrow" />
                </Link>
              </Magnetic>
              <Link href="/resume" className="px-3 py-3 text-sm font-semibold text-gray-500 hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-2 link-underline">
                <Download className="w-4 h-4" /> Résumé
              </Link>
            </div>
          </Reveal>

          {socialLinks.length > 0 && (
            <Reveal delay={0.95} y={10}>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                <span className="mr-2 text-xs font-medium uppercase tracking-[.14em] text-gray-500">Find me</span>
                {socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={link.platform}
                    className="grid place-items-center w-10 h-10 rounded-xl control-surface text-gray-500 hover:text-[var(--brand-1)] transition-colors"
                  >
                    <DynamicIcon name={link.iconName} className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </Reveal>
          )}
        </div>

        <HeroVisual
          name={name}
          avatarUrl={SITE.photo}
          location={profile?.location || 'Available remotely'}
          stats={stats}
          chips={stack.slice(0, 2)}
        />
      </section>

      {/* ================= STACK MARQUEE ================= */}
      <section className="-mt-14 space-y-5">
        <p className="text-center text-xs font-semibold tracking-[.2em] uppercase text-gray-500">Tools I build with</p>
        <Marquee items={stack} />
      </section>

      {/* ================= VALUE BENTO ================= */}
      <section className="space-y-10">
        <Reveal className="max-w-2xl space-y-3">
          <p className="eyebrow">What I do</p>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">I build the whole app, front to back.</h2>
        </Reveal>
        <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { icon: Layers3, title: 'Web apps', text: 'Websites and dashboards with Next.js, React, Spring Boot, and NestJS, backed by PostgreSQL or MongoDB.' },
            { icon: Code2, title: 'Mobile apps', text: 'Android and iOS apps with React Native, including offline features and file sharing.' },
            { icon: ShieldCheck, title: 'Chat, calls and login', text: 'Real-time chat and video calls with WebSocket and WebRTC, and secure login with JWT and two-factor codes.' },
          ].map(({ icon: Icon, title, text }, i) => (
            <StaggerItem key={title}>
              <div className="glass-card card-gradient group relative h-full p-7 overflow-hidden"
                  >
                <div className="icon-tile"><Icon className="w-5 h-5" /></div>
                <h3 className="mt-6 text-xl font-bold text-white">{title}</h3>
                <p className="mt-2.5 text-sm leading-7 text-gray-500 dark:text-gray-400">{text}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* ================= SELECTED WORK ================= */}
      <section className="space-y-10">
        <Reveal className="flex flex-col sm:flex-row gap-5 sm:items-end justify-between">
          <div className="space-y-3">
            <p className="eyebrow">Selected work</p>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-xl">Projects I built</h2>
          </div>
          <Link href="/projects" className="btn btn-ghost !py-2.5 shrink-0">
            See all projects <ArrowRight className="w-4 h-4 arrow" />
          </Link>
        </Reveal>

        <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProjects.map((project) => (
            <StaggerItem key={project.id}>
              <Link
                href={`/projects/${project.id}`}
                className="glass-card card-gradient group relative block h-full overflow-hidden hover:-translate-y-2 transition-transform duration-500"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-200 dark:bg-slate-800">
                  <Image src={project.thumbnail} alt={project.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
                  <span className="absolute top-3 left-3 rounded-full float-chip !rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">{project.category}</span>
                </div>
                <div className="relative p-6">
                  <h3 className="text-xl font-bold text-white group-hover:text-[var(--brand-1)] transition-colors">{project.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400 line-clamp-2">{project.summary}</p>
                  {project.technologies.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {project.technologies.slice(0, 3).map((t) => (
                        <span key={t.id} className="px-2.5 py-1 rounded-md bg-black/[.04] dark:bg-white/[.06] text-[10px] font-mono text-gray-500 dark:text-gray-300">{t.name}</span>
                      ))}
                    </div>
                  )}
                  <div className="mt-5 flex items-center justify-between text-sm font-semibold text-[var(--brand-1)]">
                    View case study
                    <span className="grid place-items-center w-8 h-8 rounded-full bg-[var(--brand-1)]/10 group-hover:bg-[var(--brand-1)] group-hover:text-white transition-all duration-300">
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* ================= NUMBERS ================= */}
      <section>
        <Reveal>
          <div className="glass-card grid grid-cols-2 divide-x divide-y md:divide-y-0 divide-[var(--line)] overflow-hidden">
            {stats.map((s) => (
              <div key={s.label} className="p-7 sm:p-9 text-center">
                <p className="text-4xl sm:text-5xl font-extrabold gradient-text font-[family-name:var(--font-display)]"><CountUp to={s.value} suffix={s.suffix} /></p>
                <p className="mt-2 text-xs tracking-[.16em] uppercase text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ================= CTA ================= */}
      <section>
        <Reveal>
          <div className="cta-surface px-7 py-14 sm:px-14 sm:py-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
            <div className="max-w-2xl space-y-4">
              <p className="text-sm font-semibold tracking-wide text-white/70">Want to work together?</p>
              <h2 className="on-dark text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.08]">I am open to software engineering jobs. Send me a message.</h2>
            </div>
            <Magnetic strength={0.35}>
              <Link href="/contact" className="btn btn-light !px-7 !py-4 text-base">
                Get in touch <ArrowRight className="w-4 h-4 arrow" />
              </Link>
            </Magnetic>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
