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
    if (!person.isAdmin) {
      return NextResponse.json({authenticated: true, isAdmin: false}, {status: 403});
    }
    return NextResponse.json({
      authenticated: true,
      isAdmin: true,
      isSuperAdmin: person.isSuperAdmin,
      person: {
        id: person.id,
        name: person.name,
        email: person.email,
      },
    });
  } catch {
    return NextResponse.json({authenticated: false}, {status: 401});
  }
}
