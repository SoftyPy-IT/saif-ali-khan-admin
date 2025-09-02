import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const accessToken = request.cookies.get('accessToken')?.value;
  console.log('Middleware Pathname:', pathname);
  console.log('Access Token:', accessToken);

  // If no access token and not already on the login page
  if (!accessToken && pathname !== '/') {
    console.log('No Access Token, redirecting to login...');
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If access token exists and user is on the login page, redirect to dashboard
  if (accessToken && pathname === '/') {
    console.log('Access Token found, redirecting to dashboard...');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  console.log('Access allowed');
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard/:path*'], 
};
