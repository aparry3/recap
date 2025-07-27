import { NextRequest, NextResponse } from 'next/server';
import { selectVerification, updateVerification, selectPerson } from '@/lib/db/personService';

export async function GET(
  request: NextRequest,
  { params }: { params: { verificationId: string } }
) {
  try {
    const { verificationId } = params;
    
    // Fetch the verification record
    let verification;
    try {
      verification = await selectVerification(verificationId);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid or expired verification link' },
        { status: 404 }
      );
    }
    
    // Check if already verified
    if (verification.verified) {
      return NextResponse.json(
        { error: 'This verification link has already been used' },
        { status: 400 }
      );
    }
    
    // Verify the person has admin privileges
    const person = await selectPerson(verification.personId);
    if (!person.isAdmin) {
      return NextResponse.json(
        { error: 'This verification is not for an admin user' },
        { status: 403 }
      );
    }
    
    // Mark verification as used
    await updateVerification(verificationId, true);
    
    // Return success with personId for frontend to set cookie
    return NextResponse.json({
      success: true,
      personId: person.id,
      name: person.name,
      email: person.email
    });
    
  } catch (error) {
    console.error('Admin verification error:', error);
    return NextResponse.json(
      { error: 'Failed to process verification' },
      { status: 500 }
    );
  }
}