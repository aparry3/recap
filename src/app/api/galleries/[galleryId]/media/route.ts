// src/app/api/galleries/route.ts
import { beginMultipartUpload, generatePresignedUrl } from '@/lib/aws/s3';
import { insertGalleryMedia } from '@/lib/db/galleryService';
import { insertMedia, selectGalleryMedia } from '@/lib/db/mediaService';
import { updateGalleryPerson } from '@/lib/db/personService';
import { NewMediaData } from '@/lib/types/Media';
import { NextResponse } from 'next/server';

const WEBP_TYPE = 'image/webp'
const CLOUDFRONT_URL = process.env.AWS_CLOUDFRONT_URL || ''

export const POST = async (req: Request, ctx: { params: { galleryId: string } }) => {
    const newMedia: NewMediaData = await req.json()
    const { galleryId } = ctx.params

    const media = await insertMedia(newMedia)
    const presignedUrlPromise = media.contentType.startsWith('image') ? generatePresignedUrl(media.url, media.contentType) : Promise.resolve(null)
    const uploadIdPromise = media.contentType.startsWith('video') ? beginMultipartUpload(media.url, media.contentType) : Promise.resolve(null)

    const [presignedUrl, webpPresignedUrl, uploadId] = await Promise.all([presignedUrlPromise, generatePresignedUrl(media.preview, WEBP_TYPE), uploadIdPromise])
    try {
        await insertGalleryMedia(galleryId, media.id)
        await updateGalleryPerson(galleryId, media.personId, media.id)
    } catch (error) {
        return NextResponse.json({...media, url: `${CLOUDFRONT_URL}/${media.url}`, preview: `${CLOUDFRONT_URL}/${media.preview}`, presignedUrls: {large: presignedUrl, small: webpPresignedUrl, uploadId, key: media.url}}, {status: 209})
    }

    return NextResponse.json({...media, url: `${CLOUDFRONT_URL}/${media.url}`, preview: `${CLOUDFRONT_URL}/${media.preview}`, presignedUrls: {large: presignedUrl, small: webpPresignedUrl, uploadId, key: media.url}}, {status: 209})
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
