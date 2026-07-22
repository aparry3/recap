import { NextRequest, NextResponse } from 'next/server';
import { adminErrorResponse, logUnexpectedAdminError, requireAdmin } from '@/lib/admin/middleware';
import { updatePerson } from '@/lib/db/personService';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ personId: string }> }
) {
  try {
    const admin = await requireAdmin();
    const { personId } = await params;

    if (admin.id === personId) {
      return NextResponse.json(
        { error: 'Cannot remove your own admin access' },
        { status: 400 }
      );
    }

    // Remove admin status
    const updatedPerson = await updatePerson(personId, { isAdmin: false });

    return NextResponse.json({ success: true });
  } catch (error) {
    logUnexpectedAdminError('Remove admin error:', error);
    return adminErrorResponse(error, 'Failed to remove admin');
  }
}
