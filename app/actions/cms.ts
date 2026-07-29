'use server'

import { prisma } from '@/lib/prisma'
import { getAuthSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

async function checkAdminAuth() {
  const session = await getAuthSession()
  if (!session || (session.role !== 'ADMIN' && session.role !== 'OWNER')) {
    throw new Error('Unauthorized access')
  }
  return session
}

// ================= PROFILE ACTIONS =================
export async function updateProfileAction(data: {
  name: string
  title: string
  bio: string
  brandingStatement: string
  avatarUrl: string
  heroImageUrl?: string
  location?: string
  email?: string
  phone?: string
  status?: string
  cvPdfUrl?: string
}) {
  await checkAdminAuth()
  const profile = await prisma.profile.findFirst()
  if (!profile) throw new Error('Profile not found')

  const updated = await prisma.profile.update({
    where: { id: profile.id },
    data,
  })

  revalidatePath('/')
  revalidatePath('/about')
  revalidatePath('/admin/profile')
  return { success: true, profile: updated }
}

// ================= PROJECT ACTIONS =================
export async function createProjectAction(data: {
  title: string
  slug: string
  summary: string
  description: string
  category: string
  featured: boolean
  rank: number
  thumbnail: string
  liveUrl?: string
  githubUrl?: string
  demoVideoUrl?: string
  architectureDiagram?: string
  features: string[]
  challenges: string[]
  solutions: string[]
  technologies: string[]
}) {
  await checkAdminAuth()

  const project = await prisma.project.create({
    data: {
      title: data.title,
      slug: data.slug,
      summary: data.summary,
      description: data.description,
      category: data.category,
      featured: data.featured,
      rank: data.rank,
      thumbnail: data.thumbnail,
      liveUrl: data.liveUrl,
      githubUrl: data.githubUrl,
      demoVideoUrl: data.demoVideoUrl,
      architectureDiagram: data.architectureDiagram,
      featuresJson: JSON.stringify(data.features || []),
      challengesJson: JSON.stringify(data.challenges || []),
      solutionsJson: JSON.stringify(data.solutions || []),
      technologies: {
        create: data.technologies.map((t) => ({ name: t })),
      },
    },
  })

  revalidatePath('/projects')
  revalidatePath('/admin/projects')
  return { success: true, project }
}

export async function updateProjectAction(
  id: string,
  data: {
    title?: string
    slug?: string
    summary?: string
    description?: string
    category?: string
    featured?: boolean
    rank?: number
    thumbnail?: string
    liveUrl?: string
    githubUrl?: string
    demoVideoUrl?: string
    architectureDiagram?: string
    features?: string[]
    challenges?: string[]
    solutions?: string[]
    technologies?: string[]
  }
) {
  await checkAdminAuth()

  // Update main project data
  const updated = await prisma.project.update({
    where: { id },
    data: {
      title: data.title,
      slug: data.slug,
      summary: data.summary,
      description: data.description,
      category: data.category,
      featured: data.featured,
      rank: data.rank,
      thumbnail: data.thumbnail,
      liveUrl: data.liveUrl,
      githubUrl: data.githubUrl,
      demoVideoUrl: data.demoVideoUrl,
      architectureDiagram: data.architectureDiagram,
      featuresJson: data.features ? JSON.stringify(data.features) : undefined,
      challengesJson: data.challenges ? JSON.stringify(data.challenges) : undefined,
      solutionsJson: data.solutions ? JSON.stringify(data.solutions) : undefined,
    },
  })

  if (data.technologies) {
    await prisma.projectTechnology.deleteMany({ where: { projectId: id } })
    await prisma.projectTechnology.createMany({
      data: data.technologies.map((t) => ({ projectId: id, name: t })),
    })
  }

  revalidatePath('/projects')
  revalidatePath(`/projects/${id}`)
  revalidatePath('/admin/projects')
  return { success: true, project: updated }
}

export async function deleteProjectAction(id: string) {
  await checkAdminAuth()
  await prisma.project.delete({ where: { id } })
  revalidatePath('/projects')
  revalidatePath('/admin/projects')
  return { success: true }
}

// ================= SKILLS ACTIONS =================
export async function createSkillCategoryAction(name: string) {
  await checkAdminAuth()
  const cat = await prisma.skillCategory.create({ data: { name } })
  revalidatePath('/skills')
  revalidatePath('/admin/skills')
  return { success: true, category: cat }
}

export async function createSkillAction(data: {
  categoryId: string
  name: string
  iconName: string
  level: number
  experienceYears: number
  description: string
}) {
  await checkAdminAuth()
  const skill = await prisma.skill.create({ data })
  revalidatePath('/skills')
  revalidatePath('/admin/skills')
  return { success: true, skill }
}

export async function deleteSkillAction(id: string) {
  await checkAdminAuth()
  await prisma.skill.delete({ where: { id } })
  revalidatePath('/skills')
  revalidatePath('/admin/skills')
  return { success: true }
}

// ================= BLOG ACTIONS =================
export async function createBlogPostAction(data: {
  title: string
  slug: string
  summary: string
  content: string
  coverImage: string
  categoryId?: string
  readTimeMinutes: number
  tags: string[]
}) {
  await checkAdminAuth()
  const post = await prisma.blogPost.create({
    data: {
      title: data.title,
      slug: data.slug,
      summary: data.summary,
      content: data.content,
      coverImage: data.coverImage,
      categoryId: data.categoryId,
      readTimeMinutes: data.readTimeMinutes,
      published: true,
      tagsJson: JSON.stringify(data.tags || []),
    },
  })
  revalidatePath('/blog')
  revalidatePath('/admin/blog')
  return { success: true, post }
}

export async function deleteBlogPostAction(id: string) {
  await checkAdminAuth()
  await prisma.blogPost.delete({ where: { id } })
  revalidatePath('/blog')
  revalidatePath('/admin/blog')
  return { success: true }
}

// ================= SPECIAL DAY THEME ACTIONS =================
export async function getSpecialDayThemesAction() {
  return prisma.specialDayTheme.findMany({
    orderBy: [{ month: 'asc' }, { day: 'asc' }],
  })
}

export async function createSpecialDayThemeAction(data: {
  name: string
  month: number
  day: number
  isActive: boolean
  primaryColor: string
  accentColor: string
  backgroundGradient: string
  particleEffect: string
  greetingMessage: string
  celebrationBanner?: string
  animationPreset: string
}) {
  await checkAdminAuth()
  const theme = await prisma.specialDayTheme.create({ data })
  revalidatePath('/admin/theme')
  return { success: true, theme }
}

export async function updateSpecialDayThemeAction(
  id: string,
  data: {
    name?: string
    month?: number
    day?: number
    isActive?: boolean
    primaryColor?: string
    accentColor?: string
    backgroundGradient?: string
    particleEffect?: string
    greetingMessage?: string
    celebrationBanner?: string
    animationPreset?: string
  }
) {
  await checkAdminAuth()
  const theme = await prisma.specialDayTheme.update({ where: { id }, data })
  revalidatePath('/admin/theme')
  revalidatePath('/', 'layout')
  return { success: true, theme }
}

export async function deleteSpecialDayThemeAction(id: string) {
  await checkAdminAuth()
  await prisma.specialDayTheme.delete({ where: { id } })
  revalidatePath('/admin/theme')
  revalidatePath('/', 'layout')
  return { success: true }
}

// ================= THEME & WEBSITE SETTINGS ACTIONS =================
export async function updateThemeSettingsAction(data: {
  themeMode: string
  primaryColor: string
  accentColor: string
  fontSans: string
  borderRadius: string
  glassOpacity: number
  animationPreset: string
}) {
  await checkAdminAuth()
  const settings = await prisma.themeSettings.upsert({
    where: { id: 'default' },
    update: data,
    create: { id: 'default', ...data },
  })
  revalidatePath('/', 'layout')
  return { success: true, settings }
}

export async function updateWebsiteSettingsAction(data: {
  siteName: string
  metaTitle: string
  metaDescription: string
  navItemsJson: string
  sectionsConfigJson: string
}) {
  await checkAdminAuth()
  const website = await prisma.websiteSettings.upsert({
    where: { id: 'default' },
    update: data,
    create: { id: 'default', ...data },
  })
  revalidatePath('/', 'layout')
  return { success: true, website }
}

// ================= RESUME ACTIONS =================
export async function incrementResumeDownloadAction(resumeId: string) {
  try {
    await prisma.resume.update({
      where: { id: resumeId },
      data: { downloadsCount: { increment: 1 } },
    })
    await prisma.notification.create({
      data: {
        title: 'Resume CV Downloaded',
        message: `A visitor downloaded resume version: ${resumeId}`,
        type: 'CV_DOWNLOAD',
      },
    })
    return { success: true }
  } catch (error) {
    console.error('Error incrementing download:', error)
    return { success: false }
  }
}
