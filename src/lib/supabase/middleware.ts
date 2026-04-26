import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Define protected routes
  const protectedRoutes = ['/dashboard', '/browse', '/profile', '/edit-profile', '/messages', '/connections', '/admin'];
  const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];

  const pathname = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  // If user is not authenticated and trying to access protected routes, redirect to login
  if (!user && isProtectedRoute) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    return NextResponse.redirect(loginUrl);
  }

  if (user) {
    const { data: userData } = await supabase
      .from('users')
      .select('role, is_approved')
      .eq('auth_id', user.id)
      .single();

    // If user is authenticated and trying to access auth routes (login/register), redirect based on role
    if (isAuthRoute) {
      const redirectUrl = request.nextUrl.clone();
      if (userData?.role === 'admin') {
        redirectUrl.pathname = '/admin/dashboard';
      } else {
        redirectUrl.pathname = '/dashboard';
      }
      return NextResponse.redirect(redirectUrl);
    }

    // If regular user is not approved, redirect to pending page
    if (
      userData?.role !== 'admin' && 
      !userData?.is_approved && 
      isProtectedRoute && 
      pathname !== '/approval-pending' &&
      pathname !== '/approval-rejected'
    ) {
      const pendingUrl = request.nextUrl.clone();
      pendingUrl.pathname = '/approval-pending';
      return NextResponse.redirect(pendingUrl);
    }
  }

  return supabaseResponse;
}
