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

  try {
    if (website?.navItemsJson) {
      navItems = JSON.parse(website.navItemsJson)
    }
  } catch (e) {
    console.error('Error parsing nav items json:', e)
  }

  return (
    <div className="flex flex-col min-h-screen gradient-bg-hero">
      <Navbar navItems={navItems.length > 0 ? navItems : undefined} />
      <main className="flex-1 pt-24">{children}</main>
      <Footer />
      <ScrollToTop />
    </div>
  )
}
