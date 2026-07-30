import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gebretsadik.io'

  const staticPages = ['', '/about', '/skills', '/projects', '/resume', '/blog', '/contact']
  const staticEntries: MetadataRoute.Sitemap = staticPages.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }))

  const [posts, projects] = await Promise.all([
    prisma.blogPost.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }).catch(() => []),
    prisma.project.findMany({ select: { id: true, updatedAt: true } }).catch(() => []),
  ])
  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))
  const projectEntries: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${baseUrl}/projects/${p.id}`,
    lastModified: p.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  return [...staticEntries, ...blogEntries, ...projectEntries]
}
