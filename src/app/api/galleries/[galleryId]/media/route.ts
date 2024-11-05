// src/app/api/galleries/route.ts
import { insertGalleryMedia } from '@/lib/db/galleryService';
import { insertMedia } from '@/lib/db/mediaService';
import { NewMediaData } from '@/lib/types/Media';
import { NextResponse } from 'next/server';

export const POST = async (req: Request, ctx: { params: { galleryId: string } }) => {
    const newMedia: NewMediaData = await req.json()
    const { galleryId } = ctx.params

    const media = await insertMedia(newMedia)
    try {
        await insertGalleryMedia(galleryId, media.id)
    } catch (error) {
        return NextResponse.json({media}, {status: 209})
    }

    return NextResponse.json({media}, {status: 200})
};
