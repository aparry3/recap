import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin/middleware';
import { updatePerson } from '@/lib/db/personService';
import { logAdminAction } from '@/lib/db/adminService';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { personId: string } }
) {
  try {
    const admin = await requireAdmin();
    const { personId } = params;

    if (admin.id === personId) {
      return NextResponse.json(
        { error: 'Cannot remove your own admin access' },
        { status: 400 }
      );
    }

    // Remove admin status
    const updatedPerson = await updatePerson(personId, { isAdmin: false });

    await logAdminAction(
      admin.id,
      'REVOKE_ADMIN',
      'person',
      personId,
      { revokedFrom: updatedPerson.email }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Remove admin error:', error);
    return NextResponse.json(
      { error: 'Failed to remove admin' },
      { status: 500 }
    );
  }
}