import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin/middleware';
import { db } from '@/lib/db';
import { updatePerson, insertPerson, selectPersonByEmail, insertVerification } from '@/lib/db/personService';
import { sendGridClient } from '@/lib/email';

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin();

    const admins = await db
      .selectFrom('person')
      .selectAll()
      .where('isAdmin', '=', true)
      .orderBy('created', 'desc')
      .execute();

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
    let personResult;
    let isNewUser = false;
    
    try {
      const existingPerson = await selectPersonByEmail(email);
      if (existingPerson) {
        // Update existing person to be admin
        if (existingPerson.isAdmin) {
          return NextResponse.json(
            { message: 'User is already an admin', person: existingPerson },
            { status: 200 }
          );
        }
        
        // Update existing user to admin
        personResult = await updatePerson(existingPerson.id, { 
          isAdmin: true,
          // Update name and phone if provided
          name,
          phone: phone || existingPerson.phone
        });
      } else {
        // Person not found, create new
        isNewUser = true;
      }
    } catch (error) {
      // Person not found, create new
      isNewUser = true;
    }
    
    if (isNewUser) {
      // Create new admin user
      personResult = await insertPerson({
        name,
        email,
        phone: phone || undefined,
        isAdmin: true
      });
    }
    
    // Send admin invitation email
    try {
      const verification = await insertVerification(personResult!.id);
      const verificationUrl = `${process.env.BASE_URL}/admin/verify/${verification.id}`;
      
      await sendGridClient.sendAdminInvitationEmail({
        name: personResult!.name,
        email: personResult!.email!,
        verificationUrl
      });
      
      console.log(`Admin invitation email sent to ${personResult!.email}`);
    } catch (emailError) {
      console.error('Failed to send admin invitation email:', emailError);
      // Don't fail the entire operation if email fails
    }
    
    return NextResponse.json(personResult, { status: isNewUser ? 201 : 200 });
  } catch (error) {
    console.error('Create admin error:', error);
    return NextResponse.json(
      { error: 'Failed to create admin' },
      { status: 500 }
    );
  }
}