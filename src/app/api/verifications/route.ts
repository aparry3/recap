// src/app/api/people/route.ts
import { normalizeEmail } from '@/lib/db/communicationService';
import { insertVerification, selectPerson } from '@/lib/db/personService';
import { sendGridClient } from '@/lib/email';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const verificationRequestSchema = z.object({
    personId: z.string().uuid(),
    galleryName: z.string().max(200),
    email: z.string().trim().email().max(320),
    name: z.string().trim().min(1).max(200),
}).strict();


export const POST = async (req: Request) => {
    try {
        const {personId, galleryName, email} = verificationRequestSchema.parse(await req.json())
        const person = await selectPerson(personId)
        if (!person.email || normalizeEmail(email) !== normalizeEmail(person.email)) {
            return NextResponse.json({error: 'The email address does not match this account'}, {status: 403})
        }
        const verification = await insertVerification(personId)
        const sent = await sendGridClient.sendVerificationEmail(person.email, {
            galleryName: galleryName,
            name: person.name,
            buttonUrl: `${process.env.BASE_URL}/verification/${verification.id}`
        })
        if (!sent) throw new Error('The verification email could not be sent')
        return NextResponse.json({verification}, {status: 200})
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 400})
    }
};
