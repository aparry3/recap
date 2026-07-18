// src/app/api/galleries/route.ts
import { selectGallery, updateGallery } from '@/lib/db/galleryService';
import { GalleryUpdate } from '@/lib/types/Gallery';
import { WeddingEvent } from '@/lib/types/WeddingEvent';
import { handleWeddingWebsites } from '@/lib/web';
import { NextResponse } from 'next/server';
import { AuthorizationError, requireGalleryManager } from '@/lib/auth/gallery';
import { IANAZone } from 'luxon';


export const PUT = async (req: Request, ctx: { params: Promise<{ galleryId: string }> }) => {
    const requestedUpdate: GalleryUpdate = await req.json()
    const { galleryId } = await ctx.params

    try {
        await requireGalleryManager(galleryId)
    } catch (error) {
        const status = error instanceof AuthorizationError ? error.status : 401
        return NextResponse.json({error: error instanceof Error ? error.message : 'Unauthorized'}, {status})
    }

    if (requestedUpdate.timezone && !IANAZone.isValidZone(requestedUpdate.timezone)) {
        return NextResponse.json({error: 'Enter a valid IANA timezone such as America/New_York'}, {status: 400})
    }
    const galleryUpdate: GalleryUpdate = {
        ...(requestedUpdate.name !== undefined ? {name: requestedUpdate.name} : {}),
        ...(requestedUpdate.path !== undefined ? {path: requestedUpdate.path} : {}),
        ...(requestedUpdate.theknot !== undefined ? {theknot: requestedUpdate.theknot} : {}),
        ...(requestedUpdate.zola !== undefined ? {zola: requestedUpdate.zola} : {}),
        ...(requestedUpdate.timezone !== undefined ? {timezone: requestedUpdate.timezone} : {}),
    }
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

export const GET = async (_req: Request, ctx: { params: Promise<{ galleryId: string }> }) => {
    const { galleryId } = await ctx.params
    try {
        const gallery = await selectGallery(galleryId)
        return NextResponse.json({ gallery }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({ error: 'Gallery not found' }, { status: 404 })
    }
};
