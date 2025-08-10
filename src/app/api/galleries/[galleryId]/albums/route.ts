// src/app/api/galleries/route.ts
import { insertAlbum, selectGalleryAlbums } from '@/lib/db/albumService';
import { NewAlbumData } from '@/lib/types/Album';
import { NextResponse } from 'next/server';
import { selectGallery } from '@/lib/db/galleryService';

export const POST = async (req: Request, ctx: { params: { galleryId: string } }) => {
    const newAlbum: NewAlbumData = await req.json()
    const { galleryId } = ctx.params

    // Guard
    try {
        await selectGallery(galleryId);
    } catch {
        return NextResponse.json({ error: 'Gallery not found' }, { status: 404 });
    }

    try {
        const album = await insertAlbum(galleryId, newAlbum)

        return NextResponse.json({album}, {status: 200})
    } catch (e: any) {
        return NextResponse.json({error: e.message}, {status: 400})

    }
};

export const GET = async (_: Request, ctx: { params: { galleryId: string } }) => {
    const { galleryId } = ctx.params

    // Guard
    try {
        await selectGallery(galleryId);
    } catch {
        return NextResponse.json({ error: 'Gallery not found' }, { status: 404 });
    }

    try {
        const albums = await selectGalleryAlbums(galleryId)
        return NextResponse.json({albums}, {status: 200})
    } catch (error) {
        return NextResponse.json({error: 'Albums not found'}, {status: 404})
    }

};
