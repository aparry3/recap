// src/app/api/galleries/route.ts
import { insertGallery } from '@/lib/db/galleryService';
import { insertGalleryPerson } from '@/lib/db/personService';
import { NewGalleryData } from '@/lib/types/Gallery';
import { NextResponse } from 'next/server';

export const POST = async (req: Request) => {
    const newGallery: NewGalleryData = await req.json()
    const gallery = await insertGallery(newGallery)
    try {
        await insertGalleryPerson(gallery.id, gallery.personId)
    } catch (error) {
        return NextResponse.json({gallery}, {status: 209})
    }

    return NextResponse.json({gallery}, {status: 200})
};
