import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin/middleware';
import { db } from '@/lib/db';
import { logAdminAction } from '@/lib/db/adminService';

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search') || '';
    const limit = 20;
    const offset = (page - 1) * limit;

    let query = db
      .selectFrom('gallery')
      .leftJoin('galleryPerson', 'gallery.id', 'galleryPerson.galleryId')
      .leftJoin('galleryMedia', 'gallery.id', 'galleryMedia.galleryId')
      .select([
        'gallery.id',
        'gallery.name',
        'gallery.path',
        'gallery.password',
        'gallery.created',
        'gallery.date as weddingDate',
        db.fn.count('galleryPerson.personId').distinct().as('contributorsCount'),
        db.fn.count('galleryMedia.mediaId').distinct().as('photosCount'),
      ])
      .groupBy(['gallery.id']);

    if (search) {
      query = query.where('gallery.name', 'ilike', `%${search}%`);
    }

    const galleries = await query
      .orderBy('gallery.created', 'desc')
      .limit(limit)
      .offset(offset)
      .execute();

    // Log the search action
    await logAdminAction(
      admin.id,
      'VIEW_GALLERIES',
      'gallery_list',
      undefined,
      { search, page }
    );

    return NextResponse.json({
      galleries: galleries.map(g => ({
        ...g,
        contributorsCount: Number(g.contributorsCount) || 0,
        photosCount: Number(g.photosCount) || 0,
      })),
      page,
      limit,
    });
  } catch (error) {
    console.error('Admin galleries error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch galleries' },
      { status: 500 }
    );
  }
}