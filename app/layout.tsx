import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { prisma } from '@/lib/prisma'
import { getActiveSpecialDayTheme } from '@/lib/special-day'

export async function generateMetadata(): Promise<Metadata> {
  try {
    return {
      title: 'Gebretsadik Woldesenbet | Full-Stack Software Engineer',
      description: 'Portfolio of Gebretsadik Woldesenbet, Computer Science graduate and full-stack, mobile, and AI software engineer seeking software engineering roles.',
      keywords: ['Software Engineer', 'Full-Stack Developer', 'Backend Engineer', 'Mobile Developer', 'AI Systems', 'Next.js', 'React'],
      authors: [{ name: 'Gebretsadik Woldesenbet' }],
    }
  } catch {
    return {
      title: 'Gebretsadik Woldesenbet | Full-Stack Software Engineer',
      description: 'Portfolio of Gebretsadik Woldesenbet, full-stack, mobile, and AI software engineer.',
    }
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  let initialTheme: import('@/components/theme-provider').ThemeConfig = {
    themeMode: 'dark',
    primaryColor: '#3b82f6',
    accentColor: '#8b5cf6',
    fontSans: 'Inter',
    borderRadius: '0.75rem',
    glassOpacity: 0.15,
    animationPreset: 'smooth',
    specialDay: null,
  }

  try {
    const [theme, specialDay] = await Promise.all([
      prisma.themeSettings.findUnique({ where: { id: 'default' } }),
      getActiveSpecialDayTheme(),
    ])
    if (theme) {
      initialTheme = {
        themeMode: (theme?.themeMode as 'dark' | 'light' | 'system') || 'dark',
        primaryColor: theme?.primaryColor || '#3b82f6',
        accentColor: theme?.accentColor || '#8b5cf6',
        fontSans: theme?.fontSans || 'Inter',
        borderRadius: theme?.borderRadius || '0.75rem',
        glassOpacity: theme?.glassOpacity || 0.15,
        animationPreset: theme?.animationPreset || 'smooth',
        specialDay: specialDay || null,
      }
    }
  } catch {
    // DB unavailable — use defaults
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
