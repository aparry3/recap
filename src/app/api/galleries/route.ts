// src/app/api/galleries/route.ts
import { insertGallery } from '@/lib/db/galleryService';
import { insertGalleryPerson, insertVerification, selectPerson } from '@/lib/db/personService';
import { sendGridClient } from '@/lib/email';
import { NewGalleryData } from '@/lib/types/Gallery';
import { handleWeddingWebsites } from '@/lib/web';
import { NextResponse } from 'next/server';
import { WeddingEvent } from '@/lib/types/WeddingEvent';

export const maxDuration = 60; // This function can run for a maximum of 5 seconds

export const POST = async (req: Request) => {
    const newGallery: NewGalleryData = await req.json()
    if (!newGallery.personId) {
        return NextResponse.json({error: 'No personId provided'}, {status: 400})
    }
    
    // Add the creator (same as person for regular users, admin for admin-created)
    newGallery.createdBy = newGallery.createdBy || newGallery.personId;
    
    const person = await selectPerson(newGallery.personId)

    if (!person ||  !person.email) {
        return NextResponse.json({error: 'Email is required'}, {status: 400})
    }
    const gallery = await insertGallery(newGallery)

    let images: string[] = []
    let events: WeddingEvent[] = []
    if (gallery.theknot || gallery.zola) {
        const webResults = await handleWeddingWebsites(gallery)
        images = webResults.images
        events = webResults.events
    }
    
    try {
        await insertGalleryPerson(gallery.id, gallery.personId)
        const verification = await insertVerification(gallery.personId, gallery.id)
        
        await Promise.all([
            sendGridClient.sendCreationEmail(person.email, person.name, `${process.env.BASE_URL}/${gallery.path}`, gallery.password),
            sendGridClient.sendOrderNotification({
                customerName: person.name,
                customerEmail: person.email,
                galleryName: gallery.name,
                galleryUrl: `${process.env.BASE_URL}/${gallery.path}`,
                orderDate: new Date().toISOString()
            })
        ])

        
    } catch (error: any) {

        return NextResponse.json({gallery, error: error.message}, {status: 209})
    }

    return NextResponse.json({gallery, images, events}, {status: 200})
};
