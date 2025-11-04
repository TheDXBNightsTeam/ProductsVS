import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import { jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-change-in-production")
const TOKEN_NAME = "admin_token"

async function verifyAdminToken(request: NextRequest): Promise<boolean> {
  try {
    const token = request.cookies.get(TOKEN_NAME)?.value
    if (!token) return false
    
    await jwtVerify(token, JWT_SECRET)
    return true
  } catch {
    return false
  }
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // In Edge Runtime, we need to access env vars at runtime
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables in middleware')
    return supabaseResponse
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch (error) {
    // Silently handle auth errors for public routes
    // Only log if it's an admin route
    if (request.nextUrl.pathname.startsWith("/admin")) {
      console.error("Auth error in middleware:", error)
    }
  }

  // Protect admin routes - check for admin JWT token
  if (request.nextUrl.pathname.startsWith("/admin") && !request.nextUrl.pathname.startsWith("/admin/login")) {
    const isAdminAuthenticated = await verifyAdminToken(request)
    
    if (!isAdminAuthenticated) {
      const url = request.nextUrl.clone()
      url.pathname = "/admin/login"
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
