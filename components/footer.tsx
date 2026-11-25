import React from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SITE } from '@/lib/site-config'

const contactLinks = [
  { label: 'GitHub', href: SITE.github },
  { label: 'LinkedIn', href: SITE.linkedin },
  { label: 'Email', href: `mailto:${SITE.email}` },
]

const links = [
  { label: 'About', href: '/about' },
  { label: 'Skills', href: '/skills' },
  { label: 'Projects', href: '/projects' },
  { label: 'Resume', href: '/resume' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
]

export function Footer() {
  return (
    <footer className="site-footer relative mt-28 px-4 sm:px-6 lg:px-8 pt-14 pb-8">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--brand-1)] to-transparent opacity-60" />
      <div className="max-w-7xl mx-auto grid gap-10 md:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="brand-mark" aria-hidden="true">GE</div>
            <p className="font-bold text-lg text-slate-950 dark:text-white">Gebretsadik Woldesenbet</p>
          </div>
          <p className="max-w-sm text-sm leading-6 text-gray-500 dark:text-gray-400">
            Computer Science graduate and full-stack software engineer. Building software that holds up in the real world.
          </p>
          <Link href="/contact" className="btn btn-primary !py-2.5 !px-4 !text-xs">
            Start a conversation <ArrowUpRight className="w-3.5 h-3.5 arrow" />
          </Link>
        </div>

        <div>
          <p className="eyebrow mb-4">Explore</p>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm text-gray-500 dark:text-gray-400">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="link-underline hover:text-slate-950 dark:hover:text-white transition-colors">{l.label}</Link>
              </li>
            ))}
          </ul>
          <p className="eyebrow mt-8 mb-4">Connect</p>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm text-gray-500 dark:text-gray-400">
            {contactLinks.map((l) => (
              <li key={l.label}>
                <a href={l.href} {...(l.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="link-underline hover:text-slate-950 dark:hover:text-white transition-colors">{l.label}</a>
              </li>
            ))}
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-[var(--line)] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
        <span>&copy; {new Date().getFullYear()} Gebretsadik Woldesenbet. All rights reserved.</span>
        <span className="font-mono">Crafted with Next.js &amp; care</span>
      </div>
    </footer>
  )
}
