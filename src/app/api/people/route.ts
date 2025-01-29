// src/app/api/people/route.ts
import { insertPerson, selectPersonByEmail } from '@/lib/db/personService';
import { NewPersonData } from '@/lib/types/Person';
import { NextResponse } from 'next/server';


export const POST = async (req: Request) => {
    const {...newPerson}: NewPersonData & {galleryId: string} = await req.json()
    try {
        const person = await insertPerson(newPerson)
        return NextResponse.json({person}, {status: 200})
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 400})
    }
};


export const GET = async (_req: Request, ctx: { searchParams: { email?: string } }) => {
    const { email } = ctx.searchParams
    if (!email) return NextResponse.json({error: 'No email provided'}, {status: 400})

    try {
        const person = await selectPersonByEmail(email)
        return NextResponse.json({person}, {status: 200})
    } catch (error) {
        return NextResponse.json({error: 'Person not found'}, {status: 404})
    }
};

