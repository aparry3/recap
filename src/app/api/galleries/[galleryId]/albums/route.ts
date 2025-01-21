// src/app/api/galleries/route.ts
import { insertAlbum, selectAlbums, selectGalleryAlbums } from '@/lib/db/albumService';
import { selectGalleryMedia } from '@/lib/db/mediaService';
import { NewAlbumData } from '@/lib/types/Album';
import { NextResponse } from 'next/server';

export const POST = async (req: Request, ctx: { params: { galleryId: string } }) => {
    const newAlbum: NewAlbumData = await req.json()
    const { galleryId } = ctx.params

    try {
        const album = await insertAlbum(galleryId, newAlbum)

        return NextResponse.json({album}, {status: 200})
    } catch (e: any) {
        return NextResponse.json({error: e.message}, {status: 400})

    }
};

export const GET = async (_: Request, ctx: { params: { galleryId: string } }) => {
    const { galleryId } = ctx.params

    try {
        const albums = await selectGalleryAlbums(galleryId)
        return NextResponse.json({albums}, {status: 200})
    } catch (error) {
        return NextResponse.json({error: 'Albums not found'}, {status: 404})
    }

};
