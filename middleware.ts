import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = ['/dashboard', '/presentation', '/excel']
const authRoutes = ['/login', '/signup']

export async function middleware(req: NextRequest) {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req, res })
    const { data: { session } } = await supabase.auth.getSession()

    const { pathname } = req.nextUrl

    // Redirect unauthenticated users away from protected routes
    const isProtected = protectedRoutes.some(r => pathname.startsWith(r))
    if (isProtected && !session) {
        const redirectUrl = req.nextUrl.clone()
        redirectUrl.pathname = '/login'
        redirectUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(redirectUrl)
    }

    // Redirect authenticated users away from auth pages
    const isAuthRoute = authRoutes.some(r => pathname.startsWith(r))
    if (isAuthRoute && session) {
        const redirectUrl = req.nextUrl.clone()
        redirectUrl.pathname = '/dashboard'
        return NextResponse.redirect(redirectUrl)
    }

    return res
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}
