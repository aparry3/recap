// src/app/api/galleries/route.ts
import { insertGallery } from '@/lib/db/galleryService';
import { NewGalleryData } from '@/lib/types/Gallery';
import { NextResponse } from 'next/server';

export const POST = async (req: Request) => {
    const newGallery: NewGalleryData = await req.json()
    const gallery = await insertGallery(newGallery)

    return NextResponse.json({gallery}, {status: 200})
};
