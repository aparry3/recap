import { insertVerification, selectAdminPersonByEmail } from '@/lib/db/personService';
import { emailClient } from '@/lib/email';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const requestSchema = z.object({email: z.string().trim().email().max(320)}).strict();
const genericResponse = {
  message: 'If that email belongs to an admin, a secure sign-in link is on its way.',
};

export async function POST(request: Request) {
  try {
    const {email} = requestSchema.parse(await request.json());
    try {
      const person = await selectAdminPersonByEmail(email);
      if (person.email) {
        const verification = await insertVerification(person.id);
        const sent = await emailClient.sendAdminSignInEmail({
          name: person.name,
          email: person.email,
          verificationUrl: `${process.env.BASE_URL}/admin/verify/${verification.id}`,
        });
        if (!sent) console.error(`Could not deliver admin sign-in email for person ${person.id}`);
      }
    } catch {
      // Keep the public response identical so this endpoint cannot enumerate admins.
    }
    return NextResponse.json(genericResponse);
  } catch {
    return NextResponse.json({error: 'Enter a valid email address'}, {status: 400});
  }
}
