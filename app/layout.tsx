import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { prisma } from '@/lib/prisma'
import { getActiveSpecialDayTheme } from '@/lib/special-day'

export async function generateMetadata(): Promise<Metadata> {
  const website = await prisma.websiteSettings.findUnique({ where: { id: 'default' } })
  return {
    title: website?.metaTitle || 'Gebretsadik | Senior Architect & Tech Entrepreneur',
    description: website?.metaDescription || 'Enterprise Portfolio CMS SaaS platform',
    keywords: ['Software Engineer', 'Systems Architect', 'Freelancer', 'Cloud Native', 'Next.js 16', 'React 19'],
    authors: [{ name: 'Gebretsadik M. Engida' }],
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const theme = await prisma.themeSettings.findUnique({ where: { id: 'default' } })
  const specialDay = await getActiveSpecialDayTheme()

  const initialTheme = {
    themeMode: (theme?.themeMode as 'dark' | 'light' | 'system') || 'dark',
    primaryColor: theme?.primaryColor || '#3b82f6',
    accentColor: theme?.accentColor || '#8b5cf6',
    fontSans: theme?.fontSans || 'Inter',
    borderRadius: theme?.borderRadius || '0.75rem',
    glassOpacity: theme?.glassOpacity || 0.15,
    animationPreset: theme?.animationPreset || 'smooth',
    specialDay: specialDay || null,
  }

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen selection:bg-blue-600 selection:text-white" suppressHydrationWarning>
        <ThemeProvider initialTheme={initialTheme}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
