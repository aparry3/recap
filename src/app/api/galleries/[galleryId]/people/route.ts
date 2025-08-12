// src/app/api/galleries/route.ts
import { insertGalleryPerson, selectPeopleMedia } from '@/lib/db/personService';
import { NextResponse } from 'next/server';
import { selectGallery } from '@/lib/db/galleryService';

export const POST = async (req: Request, ctx: { params: { galleryId: string } }) => {
    const {personId, receiveMessages}  = await req.json()
    const { galleryId } = ctx.params

    // Guard
    try {
        await selectGallery(galleryId);
    } catch {
        return NextResponse.json({ error: 'Gallery not found' }, { status: 404 });
    }

    try {
        const galleryPerson = await insertGalleryPerson(galleryId, personId, receiveMessages)
        return NextResponse.json({galleryPerson}, {status: 200})
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 400})
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
        const people = await selectPeopleMedia(galleryId)
        return NextResponse.json({people}, {status: 200})
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 400})
    }
};

