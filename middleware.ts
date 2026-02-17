import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export function middleware(request: NextRequest) {
    // Check if the request is for the /edit route
    if (request.nextUrl.pathname.startsWith('/edit')) {
        // Get the auth token from cookies
        const token = request.cookies.get('auth-token')?.value;

        // If no token, redirect to login
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // Verify the token
        const decoded = verifyToken(token);
        if (!decoded) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
  matcher: ['/edit/:path*'],
};
