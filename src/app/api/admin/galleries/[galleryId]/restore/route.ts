import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin/middleware';
import { restoreGallery } from '@/lib/db/galleryService';

export async function PUT(_request: NextRequest, context: { params: { galleryId: string } }) {
  try {
    await requireAdmin();
    const { galleryId } = context.params;

    const success = await restoreGallery(galleryId);
    if (!success) {
      return NextResponse.json({ error: 'Gallery not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin restore gallery error:', error);
    return NextResponse.json({ error: 'Failed to restore gallery' }, { status: 500 });
  }
}