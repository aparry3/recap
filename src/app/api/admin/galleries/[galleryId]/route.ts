import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin/middleware';
import { softDeleteGallery } from '@/lib/db/galleryService';

export async function DELETE(_request: NextRequest, context: { params: { galleryId: string } }) {
  try {
    await requireAdmin();
    const { galleryId } = context.params;

    const success = await softDeleteGallery(galleryId);
    if (!success) {
      return NextResponse.json({ error: 'Gallery not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin delete gallery error:', error);
    return NextResponse.json({ error: 'Failed to delete gallery' }, { status: 500 });
  }
}