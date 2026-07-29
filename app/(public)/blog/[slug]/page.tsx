import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { GlassCard } from '@/components/ui/glass-card'
import { BlogCommentSection } from '@/components/blog-comment-section'
import { ArrowLeft, ArrowRight, Clock, Calendar, User, MessageSquare } from 'lucide-react'

export default async function BlogPostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: {
      category: true,
      comments: {
        where: { approved: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!post) {
    notFound()
  }

  const [prevPost, nextPost] = await Promise.all([
    prisma.blogPost.findFirst({
      where: { published: true, createdAt: { lt: post.createdAt } },
      orderBy: { createdAt: 'desc' },
      select: { slug: true, title: true, coverImage: true, createdAt: true },
    }),
    prisma.blogPost.findFirst({
      where: { published: true, createdAt: { gt: post.createdAt } },
      orderBy: { createdAt: 'asc' },
      select: { slug: true, title: true, coverImage: true, createdAt: true },
    }),
  ])

  let tags: string[] = []
  try {
    tags = JSON.parse(post.tagsJson)
  } catch (e) {
    console.error(e)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 py-8">
      {/* Back button */}
      <Link href="/blog" className="inline-flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>BACK TO TECH BLOG</span>
      </Link>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          {post.category && (
            <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono">
              {post.category.name}
            </span>
          )}
          <span className="flex items-center gap-1 text-xs font-mono text-gray-400">
            <Clock className="w-3.5 h-3.5" /> {post.readTimeMinutes} min read
          </span>
          <span className="flex items-center gap-1 text-xs font-mono text-gray-400">
            <Calendar className="w-3.5 h-3.5" /> {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
          {post.title}
        </h1>

        <p className="text-lg text-gray-300 leading-relaxed">{post.summary}</p>
      </div>

      {/* Main Cover Image */}
      <div className="relative h-72 sm:h-[400px] w-full rounded-2xl overflow-hidden border border-white/15 shadow-2xl">
        <Image src={post.coverImage} alt={post.title} fill className="object-cover" priority />
      </div>

      {/* Article Content */}
      <GlassCard className="p-8 sm:p-12 space-y-6">
        <div className="prose prose-invert max-w-none text-gray-200 space-y-4 font-mono text-sm leading-relaxed whitespace-pre-wrap">
          {post.content}
        </div>

        {/* Tags */}
        <div className="pt-6 border-t border-white/10 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-gray-300">
              #{tag}
            </span>
          ))}
        </div>
      </GlassCard>

      {/* Interactive Reader Comments Section */}
      <BlogCommentSection postId={post.id} initialComments={post.comments} />

      {/* Prev / Next Blog Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-white/10">
        {prevPost ? (
          <Link
            href={`/blog/${prevPost.slug}`}
            className="glass-card group flex items-center gap-4 p-4 hover:border-blue-500/30 transition-all"
          >
            <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-white/10">
              <Image src={prevPost.coverImage} alt={prevPost.title} fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <ArrowLeft className="w-3 h-3" /> Previous
              </span>
              <h4 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                {prevPost.title}
              </h4>
            </div>
          </Link>
        ) : (
          <div />
        )}

        {nextPost ? (
          <Link
            href={`/blog/${nextPost.slug}`}
            className="glass-card group flex items-center gap-4 p-4 hover:border-blue-500/30 transition-all md:justify-end md:text-right"
          >
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider flex items-center gap-1 justify-end">
                Next <ArrowRight className="w-3 h-3" />
              </span>
              <h4 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                {nextPost.title}
              </h4>
            </div>
            <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-white/10">
              <Image src={nextPost.coverImage} alt={nextPost.title} fill className="object-cover" />
            </div>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  )
}
