import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow the login page through without auth
  if (pathname === '/admin-login') {
    return NextResponse.next()
  }

  // Protect all other /admin routes
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('auth_token')?.value
    if (!token) {
      const loginUrl = new URL('/admin-login', request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
