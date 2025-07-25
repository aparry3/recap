import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin/middleware';
import { selectGalleriesForAdmin } from '@/lib/db/galleryService';

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search') || '';

    const result = await selectGalleriesForAdmin(admin.id, page, search);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Admin galleries error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch galleries' },
      { status: 500 }
    );
  }
}