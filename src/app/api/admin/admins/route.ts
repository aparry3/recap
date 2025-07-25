import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin/middleware';
import { db } from '@/lib/db';
import { updatePerson } from '@/lib/db/personService';
import { logAdminAction } from '@/lib/db/adminService';

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin();

    const admins = await db
      .selectFrom('person')
      .selectAll()
      .where('isAdmin', '=', true)
      .orderBy('created', 'desc')
      .execute();

    await logAdminAction(admin.id, 'VIEW_ADMINS');

    return NextResponse.json(admins);
  } catch (error) {
    console.error('Admin list error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin list' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin();
    const { personId } = await request.json();

    if (!personId) {
      return NextResponse.json(
        { error: 'Person ID is required' },
        { status: 400 }
      );
    }

    // Update person to be admin
    const updatedPerson = await updatePerson(personId, { isAdmin: true });

    await logAdminAction(
      admin.id,
      'GRANT_ADMIN',
      'person',
      personId,
      { grantedTo: updatedPerson.email }
    );

    return NextResponse.json(updatedPerson);
  } catch (error) {
    console.error('Create admin error:', error);
    return NextResponse.json(
      { error: 'Failed to create admin' },
      { status: 500 }
    );
  }
}