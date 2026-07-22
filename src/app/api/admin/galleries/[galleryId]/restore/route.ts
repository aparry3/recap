import { NextRequest, NextResponse } from 'next/server';
import { adminErrorResponse, logUnexpectedAdminError, requireAdmin } from '@/lib/admin/middleware';
import { restoreGallery } from '@/lib/db/galleryService';

export async function PUT(_request: NextRequest, context: { params: Promise<{ galleryId: string }> }) {
  try {
    const admin = await requireAdmin();
    const { galleryId } = await context.params;

    const success = await restoreGallery(galleryId, admin.id);
    if (!success) {
      return NextResponse.json({ error: 'Gallery not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logUnexpectedAdminError('Admin restore gallery error:', error);
    return adminErrorResponse(error, 'Failed to restore gallery');
  }
}
