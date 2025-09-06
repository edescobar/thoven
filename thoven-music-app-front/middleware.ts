import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  let res = NextResponse.next()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          res.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          res.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Log middleware activity
  console.log(`[Middleware] Path: ${req.nextUrl.pathname}, Session: ${session ? 'Yes' : 'No'}`)

  // Protected routes - everything under /app
  const isProtectedPath = req.nextUrl.pathname.startsWith('/app')

  if (isProtectedPath && !session) {
    console.log('[Middleware] Redirecting to login - no session')
    // Redirect to home page if trying to access protected route without session
    return NextResponse.redirect(new URL('/', req.url))
  }

  // If user is logged in and hits /app root, redirect based on role
  if (session && req.nextUrl.pathname === '/app') {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (profile) {
      if (profile.role === 'parent') {
        return NextResponse.redirect(new URL('/app/parent/dashboard', req.url))
      } else if (profile.role === 'teacher') {
        return NextResponse.redirect(new URL('/app/teacher/dashboard', req.url))
      }
    }
    // Default redirect if no specific role
    return NextResponse.redirect(new URL('/app/dashboard', req.url))
  }

  return res
}

export const config = {
  matcher: ['/app/:path*']
}