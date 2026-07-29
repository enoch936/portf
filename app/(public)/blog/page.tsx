import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { GlassCard } from '@/components/ui/glass-card'
import { BookOpen, Clock, ArrowRight } from 'lucide-react'

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    include: { category: true },
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 py-8">
      {/* Header */}
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono">
          <BookOpen className="w-3.5 h-3.5" />
          <span>TECHNICAL WRITING & ARCHITECTURE PAPERS</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
          Engineering <span className="gradient-text">Blog</span>
        </h1>
        <p className="text-gray-400 text-base sm:text-lg">
          Insights on distributed algorithms, React 19, Next.js 16, gRPC microservices, and AI system design.
        </p>
      </div>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.map((post) => {
          let tags: string[] = []
          try {
            tags = JSON.parse(post.tagsJson)
          } catch (e) {
            console.error(e)
          }

          return (
            <GlassCard key={post.id} className="flex flex-col justify-between group" glowOnHover>
              <div className="space-y-4">
                <div className="relative h-56 rounded-xl overflow-hidden border border-white/10">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                  {post.category && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md text-[10px] font-mono text-purple-300 border border-white/10">
                      {post.category.name}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs font-mono text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {post.readTimeMinutes} min read
                  </span>
                  <span>•</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>

                <h2 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
                  {post.title}
                </h2>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed line-clamp-3">{post.summary}</p>
              </div>

              <div className="pt-4 mt-6 border-t border-white/10 flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded bg-white/5 text-[10px] font-mono text-gray-300">
                      #{tag}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/blog/${post.slug}`}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition-all flex items-center gap-1"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </GlassCard>
          )
        })}
      </div>
    </div>
  )
}
