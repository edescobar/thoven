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

  const pathname = req.nextUrl.pathname

  // Allow access to auth page
  if (pathname === '/auth') {
    // If already logged in, redirect to appropriate dashboard
    if (session) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (profile) {
        if (profile.role === 'parent' || profile.role === 'student') {
          return NextResponse.redirect(new URL('/app/student/dashboard', req.url))
        } else if (profile.role === 'teacher') {
          return NextResponse.redirect(new URL('/app/teacher/dashboard', req.url))
        }
      }
      return NextResponse.redirect(new URL('/app/dashboard', req.url))
    }
    return res
  }

  // Protected routes - everything under /app
  const isProtectedPath = pathname.startsWith('/app')

  if (isProtectedPath && !session) {
    // Redirect to auth page if trying to access protected route without session
    return NextResponse.redirect(new URL('/auth', req.url))
  }

  // If user is logged in and hits /app root, redirect based on role
  if (session && pathname === '/app') {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (profile) {
      if (profile.role === 'parent' || profile.role === 'student') {
        return NextResponse.redirect(new URL('/app/student/dashboard', req.url))
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
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',]
}