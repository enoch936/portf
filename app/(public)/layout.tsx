import React from 'react'
import { Navbar, NavItem } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ScrollToTop } from '@/components/scroll-to-top'
import { prisma } from '@/lib/prisma'

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const website = await prisma.websiteSettings.findUnique({ where: { id: 'default' } })
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
    <div className="flex flex-col min-h-screen gradient-bg-hero">
      <Navbar navItems={visibleNavItems.length > 0 ? visibleNavItems : undefined} />
      <main className="flex-1 pt-24">{children}</main>
      <Footer />
      <ScrollToTop />
    </div>
  )
}
