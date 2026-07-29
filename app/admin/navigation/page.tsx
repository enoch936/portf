import { prisma } from '@/lib/prisma'
import { AdminNavigationBuilder } from '@/components/admin-navigation-builder'

export default async function AdminNavigationPage() {
  const website = await prisma.websiteSettings.findUnique({ where: { id: 'default' } })
  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-extrabold text-white">Navigation & page settings</h1><p className="mt-1 text-sm text-gray-500">Manage the public menu, page availability, and SEO essentials without editing code.</p></div>
      <AdminNavigationBuilder website={website} />
    </div>
  )
}
