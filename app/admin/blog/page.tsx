import React from 'react'
import { prisma } from '@/lib/prisma'
import { GlassCard } from '@/components/ui/glass-card'
import { AdminBlogStudio } from '@/components/admin-blog-studio'
import { BookOpen } from 'lucide-react'

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
    include: { category: true },
  })
  const categories = await prisma.blogCategory.findMany()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Tech Blog Studio</h1>
        <p className="text-xs text-gray-400 font-mono mt-1">Publish markdown articles, manage tags, categories, and review reader comments</p>
      </div>

      <AdminBlogStudio initialPosts={posts} categories={categories} />
    </div>
  )
}
