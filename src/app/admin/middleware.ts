import { createAdminMiddleware } from '@/lib/admin/middleware';

export const middleware = createAdminMiddleware();

export const config = {
  matcher: '/admin/:path*',
};