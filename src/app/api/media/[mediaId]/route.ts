// src/app/api/galleries/route.ts
import { deleteObject } from '@/lib/aws/s3';
import { deleteAlbumMedia, deleteGalleryMedia, deleteMedia, selectMedia } from '@/lib/db/mediaService';
import { NextResponse } from 'next/server';

export const DELETE = async (_: Request, ctx: { params: { mediaId: string } }) => {
    const { mediaId } = ctx.params
    try {
        const media = await selectMedia(mediaId)
        await Promise.all([deleteObject(media.url), deleteObject(media.preview)])

        await Promise.all([deleteGalleryMedia(mediaId), deleteAlbumMedia(mediaId)])
        const deleted = await deleteMedia(mediaId)

        return NextResponse.json({success: deleted}, {status: 200})
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 400})
    }
};
