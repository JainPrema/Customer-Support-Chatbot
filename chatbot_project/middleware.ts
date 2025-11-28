import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith('/admin')) {
    const auth = req.headers.get('authorization');
    if (!auth) {
      return new NextResponse('Auth required', { status: 401, headers: { 'WWW-Authenticate': 'Basic realm="Admin"' }});
    }
    const [, enc] = auth.split(' ');
    try {
      const [u, p] = Buffer.from(enc, 'base64').toString().split(':');
      if (u === process.env.ADMIN_USER && p === process.env.ADMIN_PASS) return NextResponse.next();
      return new NextResponse('Forbidden', { status: 403 });
    } catch (e) {
      return new NextResponse('Invalid auth', { status: 400 });
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ['/admin/:path*'] };
