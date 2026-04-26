import { NextResponse, type NextRequest } from 'next/server';

// Routes that require user approval
const protectedRoutes = [
  '/browse',
  '/connections',
  '/messages',
  '/dashboard',
  '/edit-profile',
  '/your-profile',
  '/kundli-milan',
];

export async function checkApprovalStatus(
  request: NextRequest,
  userId: string
) {
  try {
    // Check if user is approved
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/profiles/user`,
      {
        headers: {
          Authorization: `Bearer ${request.cookies.get('auth-token')?.value}`,
        },
      }
    );

    if (!response.ok) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const user = await response.json();

    // If user is not approved, redirect to approval pending page
    if (!user.is_approved && user.approval_status === 'pending') {
      return NextResponse.redirect(new URL('/approval-pending', request.url));
    }

    if (user.approval_status === 'rejected') {
      return NextResponse.redirect(new URL('/approval-rejected', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('[v0] Approval check error:', error);
    return NextResponse.next();
  }
}

export function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some((route) => pathname.startsWith(route));
}
