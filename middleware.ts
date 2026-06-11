import { NextRequest, NextResponse } from 'next/server'

async function sha256Hex(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect /admin/* routes except the login page itself
  if (pathname.startsWith('/admin') && pathname !== '/admin') {
    const token = request.cookies.get('admin_token')?.value
    if (!token) {
      // For API routes under /admin, return 401
      if (pathname.startsWith('/api/admin') && pathname !== '/api/admin/login') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      return NextResponse.redirect(new URL('/admin', request.url))
    }

    const adminPassword = process.env.ADMIN_PASSWORD || ''
    const expected = await sha256Hex(adminPassword)

    if (token !== expected) {
      if (pathname.startsWith('/api/admin') && pathname !== '/api/admin/login') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
