import { NextRequest, NextResponse } from 'next/server';
import { adminErrorResponse, logUnexpectedAdminError, requireAdmin } from '@/lib/admin/middleware';
import { softDeleteGallery } from '@/lib/db/galleryService';

export async function DELETE(_request: NextRequest, context: { params: Promise<{ galleryId: string }> }) {
  try {
    const admin = await requireAdmin();
    const { galleryId } = await context.params;

    const success = await softDeleteGallery(galleryId, admin.id);
    if (!success) {
      return NextResponse.json({ error: 'Gallery not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logUnexpectedAdminError('Admin delete gallery error:', error);
    return adminErrorResponse(error, 'Failed to delete gallery');
  }
}
