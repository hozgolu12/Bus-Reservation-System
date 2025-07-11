import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = new URL(request.url);
  const normalizedPathname = pathname === '/' ? '/' : pathname.replace(/\/$/, '');

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/register'];
  
  // Admin routes that require specific roles
  const superAdminRoutes = ['/superadmin'];
  const operatorRoutes = ['/operator'];
  const userRoutes = ['/account'];

  // Check if route is public
  if (publicRoutes.includes(normalizedPathname)) {
    return NextResponse.next();
  }

  // Redirect to login if no token and not already on login page
  if (!token && normalizedPathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Decode JWT to check role (simplified - in production use proper JWT verification)
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userRole = payload.role || 'user';

    // Check Super Admin access
    if (superAdminRoutes.some(route => pathname.startsWith(route))) {
      if (userRole !== 'superadmin') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }

    // Check Operator access
    if (operatorRoutes.some(route => pathname.startsWith(route))) {
      if (userRole !== 'operator' && userRole !== 'superadmin') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }

    // Check User account access
    if (userRoutes.some(route => pathname.startsWith(route))) {
      if (!['user', 'operator', 'superadmin'].includes(userRole)) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    // Invalid token, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};