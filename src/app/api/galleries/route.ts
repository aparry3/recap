// src/app/api/galleries/route.ts
import { insertGallery } from '@/lib/db/galleryService';
import { insertGalleryPerson, insertVerification, selectPerson } from '@/lib/db/personService';
import { sendGridClient } from '@/lib/email';
import { NewGalleryData } from '@/lib/types/Gallery';
import { NextResponse } from 'next/server';

export const POST = async (req: Request) => {
    const newGallery: NewGalleryData = await req.json()
    if (!newGallery.personId) {
        return NextResponse.json({error: 'No personId provided'}, {status: 400})
    }
    const person = await selectPerson(newGallery.personId)

    if (!person ||  !person.email) {
        return NextResponse.json({error: 'Email is required'}, {status: 400})
    }

    const gallery = await insertGallery(newGallery)

    try {
        await insertGalleryPerson(gallery.id, gallery.personId)
        const verification = await insertVerification(gallery.personId, gallery.id)
        
        sendGridClient.sendCreationEmail(person.email, {
            galleryName: gallery.name,
            name: person.name,
            buttonUrl: `${process.env.BASE_URL}/verification/${verification.id}`
        })
        
    } catch (error: any) {
        return NextResponse.json({gallery, error: error.message}, {status: 209})
    }

    return NextResponse.json({gallery}, {status: 200})
};
