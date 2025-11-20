import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Allow verification page, API routes, Next assets, and common static files without checks
  if (
    pathname.startsWith('/verify') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico' ||
    pathname.startsWith('/assets') ||
    pathname.startsWith('/public')
  ) {
    return NextResponse.next();
  }

  const verified = request.cookies.get('is_uic_verified')?.value === 'true';
  if (!verified) {
    const url = request.nextUrl.clone();
    url.pathname = '/verify';
    url.searchParams.set('next', pathname + search);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next).*)'],
};
