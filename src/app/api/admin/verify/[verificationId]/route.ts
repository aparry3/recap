import { NextRequest, NextResponse } from 'next/server';
import { consumeVerification, selectVerification, selectPerson } from '@/lib/db/personService';
import { setAuthSessionCookie } from '@/lib/auth/session';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ verificationId: string }> }
) {
  try {
    const { verificationId } = await params;
    
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
    if (verification.expiresAt <= new Date()) {
      return NextResponse.json(
        { error: 'This verification link has expired' },
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
    
    // Consume only after confirming this link belongs to an admin.
    await consumeVerification(verificationId);
    await setAuthSessionCookie(person.id);
    return NextResponse.redirect(new URL('/admin', request.url), 303);
    
  } catch (error) {
    console.error('Admin verification error:', error);
    return NextResponse.json(
      { error: 'Failed to process verification' },
      { status: 500 }
    );
  }
}
