import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createAdminMiddleware } from '@/lib/admin/middleware';

export const middleware = createAdminMiddleware();

export const config = {
  matcher: '/admin/:path*',
};