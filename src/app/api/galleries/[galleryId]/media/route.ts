// src/app/api/galleries/route.ts
import { beginMultipartUpload, CLOUDFRONT_URL, generatePresignedUrl, WEBP_TYPE } from '@/lib/aws/s3';
import { insertAlbum, insertAlbumMedia } from '@/lib/db/albumService';
import { insertGalleryMedia } from '@/lib/db/galleryService';
import { insertMedia, selectGalleryMedia } from '@/lib/db/mediaService';
import { updateGalleryPerson } from '@/lib/db/personService';
import { NewMediaData } from '@/lib/types/Media';
import { NextResponse } from 'next/server';
import { selectGallery } from '@/lib/db/galleryService';


export const POST = async (req: Request, ctx: { params: { galleryId: string } }) => {
    const newMedia: NewMediaData & {albumId: string} = await req.json()
    const { galleryId } = ctx.params

    // Guard: block uploads to deleted/non-existent galleries
    try {
        await selectGallery(galleryId);
    } catch {
        return NextResponse.json({ error: 'Gallery not found' }, { status: 404 });
    }

    const {albumId, ..._newMedia} = newMedia
    const media = await insertMedia(_newMedia)
    const presignedUrlPromise = media.contentType.startsWith('image') ? generatePresignedUrl(media.url, media.contentType) : Promise.resolve(null)
    const uploadIdPromise = media.contentType.startsWith('video') ? beginMultipartUpload(media.url, media.contentType) : Promise.resolve(null)

    const [presignedUrl, webpPresignedUrl, uploadId] = await Promise.all([presignedUrlPromise, generatePresignedUrl(media.preview, WEBP_TYPE), uploadIdPromise])
    try {
        await insertGalleryMedia(galleryId, media.id)
        if (albumId) {
            await insertAlbumMedia(albumId, [media.id])
        }
        await updateGalleryPerson(galleryId, media.personId, media.id)
    } catch (error) {
        console.error(error)
        return NextResponse.json({...media, url: `${CLOUDFRONT_URL}/${media.url}`, preview: `${CLOUDFRONT_URL}/${media.preview}`, presignedUrls: {large: presignedUrl, small: webpPresignedUrl, uploadId, key: media.url}}, {status: 209})
    }

    return NextResponse.json({...media, url: `${CLOUDFRONT_URL}/${media.url}`, preview: `${CLOUDFRONT_URL}/${media.preview}`, presignedUrls: {large: presignedUrl, small: webpPresignedUrl, uploadId, key: media.url}}, {status: 200})
};

export const GET = async (_: Request, ctx: { params: { galleryId: string } }) => {
    const { galleryId } = ctx.params

    // Guard: block reads for deleted/non-existent galleries
    try {
        await selectGallery(galleryId);
    } catch {
        return NextResponse.json({ error: 'Gallery not found' }, { status: 404 });
    }

    try {
        const media = await selectGalleryMedia(galleryId)
        return NextResponse.json({media}, {status: 200})
    } catch (error) {
        return NextResponse.json({error: 'Media not found'}, {status: 404})
    }

};
