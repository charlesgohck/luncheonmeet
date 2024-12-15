// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

const allowedOrigins = [
  'http://localhost:3000',
  'https://luncheonmeet.com',
  'https://lunchonemeat.com'
];

export function middleware(req: NextRequest) {
  const origin = req.headers.get('origin');

  console.log("Middleware hit.")

  if (origin && allowedOrigins.includes(origin)) {
    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    return response;
  }

  return new NextResponse('Forbidden', { status: 403 });
}

export const config = {
  matcher: '/api/:path*',
};
