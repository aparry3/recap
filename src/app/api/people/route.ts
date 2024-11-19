// src/app/api/people/route.ts
import { insertGalleryPerson, insertPerson } from '@/lib/db/personService';
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
