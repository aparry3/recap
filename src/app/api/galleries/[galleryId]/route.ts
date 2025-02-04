// src/app/api/galleries/route.ts
import { updateGallery } from '@/lib/db/galleryService';
import { GalleryUpdate } from '@/lib/types/Gallery';
import { NextResponse } from 'next/server';


export const PUT = async (req: Request, ctx: { params: { galleryId: string } }) => {
    const galleryUpdate: GalleryUpdate = await req.json()
    const { galleryId } = ctx.params
    try {
        const gallery = await updateGallery(galleryId, galleryUpdate)
        return NextResponse.json({gallery}, {status: 200})
    } catch (error: any) {
        return NextResponse.json({messgae: error.message}, {status: 500})
    }
};

export const GET = async (req: Request, ctx: { params: { galleryId: string } }) => {
    const galleryUpdate: GalleryUpdate = await req.json()
    const { galleryId } = ctx.params
};

