// src/app/api/galleries/route.ts
import { generatePresignedUrl } from '@/lib/aws/s3';
import { insertGalleryMedia } from '@/lib/db/galleryService';
import { insertMedia, selectGalleryMedia } from '@/lib/db/mediaService';
import { NewMediaData } from '@/lib/types/Media';
import { NextResponse } from 'next/server';

export const POST = async (req: Request, ctx: { params: { galleryId: string } }) => {
    const newMedia: NewMediaData = await req.json()
    const { galleryId } = ctx.params

    const media = await insertMedia(newMedia)
    const presignedUrl = await generatePresignedUrl(media.key, media.contentType)
    try {
        await insertGalleryMedia(galleryId, media.id)
    } catch (error) {
        return NextResponse.json({media, presignedUrl}, {status: 209})
    }

    return NextResponse.json({media, presignedUrl}, {status: 200})
};

export const GET = async (_: Request, ctx: { params: { galleryId: string } }) => {
    const { galleryId } = ctx.params

    try {
        const media = await selectGalleryMedia(galleryId)
        return NextResponse.json({media}, {status: 200})
    } catch (error) {
        return NextResponse.json({error: 'Media not found'}, {status: 404})
    }

};