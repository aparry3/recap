// src/app/api/galleries/route.ts
import { selectGallery, updateGallery } from '@/lib/db/galleryService';
import { GalleryUpdate } from '@/lib/types/Gallery';
import { WeddingEvent } from '@/lib/types/WeddingEvent';
import { handleWeddingWebsites } from '@/lib/web';
import { NextResponse } from 'next/server';


export const PUT = async (req: Request, ctx: { params: { galleryId: string } }) => {
    const galleryUpdate: GalleryUpdate = await req.json()
    const { galleryId } = ctx.params

    let images: string[] = []
    let events: WeddingEvent[] = []
    let gallery = await selectGallery(galleryId)
    const isNewWeddingSite = (galleryUpdate.theknot && !gallery.theknot) || (galleryUpdate.zola && !gallery.zola)
    try {
        gallery = await updateGallery(galleryId, galleryUpdate)
        if (isNewWeddingSite) {
            const webResults = await handleWeddingWebsites(gallery)
            images = webResults.images
            events = webResults.events
        }    
        return NextResponse.json({gallery, images, events}, {status: 200})
    } catch (error: any) {
        return NextResponse.json({messgae: error.message}, {status: 500})
    }
};

export const GET = async (_req: Request, ctx: { params: { galleryId: string } }) => {
    const { galleryId } = ctx.params
    try {
        const gallery = await selectGallery(galleryId)
        return NextResponse.json({ gallery }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({ error: 'Gallery not found' }, { status: 404 })
    }
};

