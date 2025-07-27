import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin/middleware';
import { db } from '@/lib/db';
import { updatePerson, insertPerson, selectPersonByEmail } from '@/lib/db/personService';
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
    const body = await request.json();
    
    // Check if this is the old format (personId) or new format (name, email)
    if (body.personId) {
      // Legacy support: Update existing person to be admin
      const updatedPerson = await updatePerson(body.personId, { isAdmin: true });
      
      await logAdminAction(
        admin.id,
        'GRANT_ADMIN',
        'person',
        body.personId,
        { grantedTo: updatedPerson.email }
      );
      
      return NextResponse.json(updatedPerson);
    }
    
    // New format: Create new admin user
    const { name, email, phone } = body;
    
    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    // Check if email already exists
    try {
      const existingPerson = await selectPersonByEmail(email);
      if (existingPerson) {
        return NextResponse.json(
          { error: 'A user with this email already exists' },
          { status: 409 }
        );
      }
    } catch (error) {
      // Person not found, which is what we want
    }
    
    // Create new admin user
    const newAdmin = await insertPerson({
      name,
      email,
      phone: phone || undefined,
      isAdmin: true
    });
    
    await logAdminAction(
      admin.id,
      'CREATE_ADMIN',
      'person',
      newAdmin.id,
      { 
        createdAdmin: {
          name: newAdmin.name,
          email: newAdmin.email
        }
      }
    );
    
    return NextResponse.json(newAdmin, { status: 201 });
  } catch (error) {
    console.error('Create admin error:', error);
    return NextResponse.json(
      { error: 'Failed to create admin' },
      { status: 500 }
    );
  }
}