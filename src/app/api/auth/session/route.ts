import { getAuthenticatedPersonId } from '@/lib/auth/session';
import { selectPerson } from '@/lib/db/personService';
import { NextResponse } from 'next/server';

export async function GET() {
  const personId = await getAuthenticatedPersonId();
  if (!personId) {
    return NextResponse.json({authenticated: false}, {status: 401});
  }

  try {
    const person = await selectPerson(personId);
    return NextResponse.json({authenticated: true, person});
  } catch {
    return NextResponse.json({authenticated: false}, {status: 401});
  }
}
