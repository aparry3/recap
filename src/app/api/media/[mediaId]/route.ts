// src/app/api/galleries/route.ts
import { beginMultipartUpload, CLOUDFRONT_URL, deleteObject, generatePresignedUrl, WEBP_TYPE } from '@/lib/aws/s3';
import { deleteAlbumMedia, deleteGalleryMedia, deleteMedia, selectMedia, updateMedia } from '@/lib/db/mediaService';
import { MediaUpdate } from '@/lib/types/Media';
import { NextResponse } from 'next/server';

export const DELETE = async (_: Request, ctx: { params: Promise<{ mediaId: string }> }) => {
    const { mediaId } = await ctx.params
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

export const GET = async (_: Request, ctx: { params: Promise<{ mediaId: string }> }) => {
    const { mediaId } = await ctx.params
    try {
        const media = await selectMedia(mediaId)

        const presignedUrlPromise = media.contentType.startsWith('image') ? generatePresignedUrl(media.url, media.contentType) : Promise.resolve(null)
        const uploadIdPromise = media.contentType.startsWith('video') ? beginMultipartUpload(media.url, media.contentType) : Promise.resolve(null)
    
        const [presignedUrl, webpPresignedUrl, uploadId] = await Promise.all([presignedUrlPromise, generatePresignedUrl(media.preview, WEBP_TYPE), uploadIdPromise])
        
        return NextResponse.json({...media, url: `${CLOUDFRONT_URL}/${media.url}`, preview: `${CLOUDFRONT_URL}/${media.preview}`, presignedUrls: {large: presignedUrl, small: webpPresignedUrl, uploadId, key: media.url}}, {status: 209})
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 400})
    }
};

export const PUT = async (req: Request, ctx: { params: Promise<{ mediaId: string }> }) => {
    const body = await req.json() as {uploaded?: unknown}
    if (body.uploaded !== true) {
        return NextResponse.json({error: 'uploaded must be true'}, {status: 400})
    }
    const mediaUpdate: MediaUpdate = {uploaded: true}
    const { mediaId } = await ctx.params

    const media = await updateMedia(mediaId, mediaUpdate)

    return NextResponse.json({...media, url: `${CLOUDFRONT_URL}/${media.url}`, preview: `${CLOUDFRONT_URL}/${media.preview}`}, {status: 209})
};
