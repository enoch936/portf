import React from 'react'
import { Navbar, NavItem } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ScrollToTop } from '@/components/scroll-to-top'
import { prisma } from '@/lib/prisma'
import { SITE } from '@/lib/site-config'

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: SITE.name,
  jobTitle: 'Full-Stack Software Engineer',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://portf-theta-tan.vercel.app',
  email: `mailto:${SITE.email}`,
  address: { '@type': 'PostalAddress', addressLocality: 'Gondar', addressCountry: 'ET' },
  alumniOf: { '@type': 'CollegeOrUniversity', name: 'University of Gondar' },
  sameAs: [SITE.github, SITE.linkedin],
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const website = await prisma.websiteSettings.findUnique({ where: { id: 'default' } }).catch(() => null)
  let navItems: NavItem[] = []
  let sections: Record<string, boolean> = {}

  try {
    if (website?.navItemsJson) {
      navItems = JSON.parse(website.navItemsJson)
    }
  } catch (e) {
    console.error('Error parsing nav items json:', e)
  }

  try {
    sections = JSON.parse(website?.sectionsConfigJson || '{}')
  } catch (e) {
    console.error('Error parsing public section settings:', e)
  }

  const sectionByRoute: Record<string, string> = {
    '/': 'showHero',
    '/about': 'showAbout',
    '/skills': 'showSkills',
    '/projects': 'showProjects',
    '/resume': 'showResume',
    '/blog': 'showBlog',
    '/contact': 'showContact',
  }
  const visibleNavItems = navItems.filter((item) => sections[sectionByRoute[item.href]] !== false)

  return (
    <div className="relative isolate flex flex-col min-h-screen gradient-bg-hero">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, '\\u003c') }}
      />
      <div className="site-backdrop" aria-hidden="true">
        <div className="grid-lines" />
        <span className="blob blob-1" />
        <span className="blob blob-2" />
        <span className="blob blob-3" />
      </div>
      <Navbar navItems={visibleNavItems.length > 0 ? visibleNavItems : undefined} />
      <main className="flex-1 pt-28">{children}</main>
      <Footer />
      <ScrollToTop />
    </div>
  )
}
