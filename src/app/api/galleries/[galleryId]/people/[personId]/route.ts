// src/app/api/galleries/route.ts
import { updateGalleryPerson } from '@/lib/db/personService';
import { NextResponse } from 'next/server';

export const PUT = async (req: Request, ctx: { params: { galleryId: string, personId: string } }) => {
    const {mediaId}  = await req.json()
    const { galleryId, personId } = ctx.params
    try {
        const galleryPerson = await updateGalleryPerson(galleryId, personId, mediaId)
        return NextResponse.json({galleryPerson}, {status: 200})
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 400})
    }
};
