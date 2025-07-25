// src/app/api/people/route.ts
import { insertPerson, selectPersonByEmail } from '@/lib/db/personService';
import { NewPersonData } from '@/lib/types/Person';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';


export const POST = async (req: Request) => {
    const url = new URL(req.url);
    const admin = url.searchParams.get('admin');
    const {...newPerson}: NewPersonData & {galleryId: string} = await req.json()
    try {
        const person = await insertPerson(newPerson)
        if (!admin) {
            cookies().set('personId', person.id, {
                secure: process.env.NODE_ENV === 'production', // HTTPS-only in production
                sameSite: 'lax', // Helps with CSRF protection
                maxAge: 60 * 60 * 24 * 365, // 1 year
                path: '/',
                });
        }
        return NextResponse.json({person}, {status: 200})
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 400})
    }
};


export const GET = async (req: NextRequest) => {
    const searchParams = req.nextUrl.searchParams
    const email = searchParams.get('email')

    if (!email) return NextResponse.json({error: 'No email provided'}, {status: 400})

    try {
        const person = await selectPersonByEmail(email)
        return NextResponse.json({person}, {status: 200})
    } catch (error) {
        return NextResponse.json({error: 'Person not found'}, {status: 404})
    }
};

