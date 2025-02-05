// src/app/api/people/[personId]/route.ts
import { selectPerson, updatePerson } from '@/lib/db/personService';
import { PersonUpdate } from '@/lib/types/Person';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const PUT = async (req: Request, ctx: { params: { personId: string } }) => {
    const personUpdate: PersonUpdate = await req.json()
    const { personId } = ctx.params
    try {
        const person = await updatePerson(personId, personUpdate)
        return NextResponse.json({person}, {status: 200})
    } catch (error) {
        return NextResponse.json({error: 'Error updating person'}, {status: 400})
    }
};

export const GET = async (_req: Request, ctx: { params: { personId: string } }) => {
    const { personId } = ctx.params
    cookies().set('personId', personId, {
        httpOnly: false, // Prevents client-side JS access
        secure: process.env.NODE_ENV === 'production', // HTTPS-only in production
        sameSite: 'lax', // Helps with CSRF protection
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: '/',
      });
    
    try {
        const person = await selectPerson(personId)
        return NextResponse.json({person}, {status: 200})
    } catch (error) {
        return NextResponse.json({error: 'Person not found'}, {status: 404})
    }
};

