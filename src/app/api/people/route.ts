// src/app/api/people/route.ts
import { insertGalleryPerson, insertPerson } from '@/lib/db/personService';
import { NewPersonData } from '@/lib/types/Person';
import { NextResponse } from 'next/server';

export const POST = async (req: Request) => {
    const {galleryId, ...newPerson}: NewPersonData & {galleryId: string} = await req.json()
    const person = await insertPerson(newPerson)
    try {
        await insertGalleryPerson(galleryId, person.id)
    } catch (error) {
        return NextResponse.json({person}, {status: 209})
    }

    return NextResponse.json({person}, {status: 200})
};
