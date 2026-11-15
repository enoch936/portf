// Public contact details shown on the portfolio.
// These take priority over database values so the site always shows correct, reachable details.
export const SITE = {
  name: 'Gebretsadik Woldesenbet',
  shortName: 'Gebretsadik',
  role: 'Software Engineer',
  tagline: 'Computer Science graduate and full-stack software engineer',
  email: 'enoch3696@gmail.com',
  linkedin: 'https://www.linkedin.com/in/gebretsadik-alehegn-3a7999430',
  github: 'https://github.com/enoch936',
  photo: '/images/photo_2026-07-29_02-24-06.jpg',
} as const

type SocialLinkLike = { id: string; platform: string; url: string; iconName: string }

// Fixes generic or placeholder social links coming from the database.
export function resolveSocialLinks<T extends SocialLinkLike>(links: T[]): T[] {
  return links.map((link) => {
    const platform = link.platform.toLowerCase()
    if (platform === 'linkedin') return { ...link, url: SITE.linkedin }
    if (platform === 'github') return { ...link, url: SITE.github }
    if (platform === 'email') return { ...link, url: `mailto:${SITE.email}` }
    return link
  })
}
