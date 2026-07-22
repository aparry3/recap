import { NextRequest, NextResponse } from 'next/server';
import { adminErrorResponse, logUnexpectedAdminError, requireAdmin } from '@/lib/admin/middleware';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin();

    // Get total galleries
    const totalGalleries = await db
      .selectFrom('gallery')
      .select(db.fn.count('id').as('count'))
      .where('deletedAt', 'is', null as any)
      .executeTakeFirst();

    // Get total users
    const totalUsers = await db
      .selectFrom('person')
      .select(db.fn.count('id').as('count'))
      .executeTakeFirst();

    // Get total photos
    const totalPhotos = await db
      .selectFrom('media')
      .select(db.fn.count('id').as('count'))
      .executeTakeFirst();

    // For now, we'll return 0 for revenue as we don't have payment tracking yet
    const totalRevenue = 0;

    return NextResponse.json({
      totalGalleries: Number(totalGalleries?.count || 0),
      totalUsers: Number(totalUsers?.count || 0),
      totalPhotos: Number(totalPhotos?.count || 0),
      totalRevenue,
      recentActivity: [] // Empty array for now since we removed admin actions
    });
  } catch (error) {
    logUnexpectedAdminError('Admin stats error:', error);
    return adminErrorResponse(error, 'Failed to fetch admin stats');
  }
}
