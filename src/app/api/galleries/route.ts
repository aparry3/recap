// src/app/api/galleries/route.ts
import { insertGallery } from '@/lib/db/galleryService';
import { insertGalleryPerson, insertVerification, selectPerson } from '@/lib/db/personService';
import { sendGridClient } from '@/lib/email';
import { NewGalleryData } from '@/lib/types/Gallery';
import { getUrlBody, getUrlImages } from '@/lib/web';
import { NextResponse } from 'next/server';
import gemini from '@/lib/gemini'
import { WeddingEvent, WeddingEventDetails } from '@/lib/types/WeddingEvent';
import { insertEvents } from '@/lib/db/eventService';

export const maxDuration = 60; // This function can run for a maximum of 5 seconds

export const POST = async (req: Request) => {
    const newGallery: NewGalleryData = await req.json()
    if (!newGallery.personId) {
        return NextResponse.json({error: 'No personId provided'}, {status: 400})
    }
    const person = await selectPerson(newGallery.personId)

    if (!person ||  !person.email) {
        return NextResponse.json({error: 'Email is required'}, {status: 400})
    }
    const gallery = await insertGallery(newGallery)

    let images: string[] = []
    let details: WeddingEventDetails[] = []
    let events: WeddingEvent[] = []
    if (newGallery.theknot || newGallery.zola) {
        console.log(newGallery.theknot)
        const photoUrl = newGallery.theknot ? `${newGallery.theknot}/photos` : `${newGallery.zola}/photo`
        const eventUrl = newGallery.theknot ? newGallery.theknot : `${newGallery.zola}/event`

        console.log(photoUrl, eventUrl)
        const [webContent, _images] = await Promise.all([getUrlBody(eventUrl), getUrlImages(photoUrl)])
        images = _images
        if (webContent) {
            details = await gemini.extractEvents(webContent)
            events = await insertEvents(gallery.id, details)
        }
    }
    
    try {
        await insertGalleryPerson(gallery.id, gallery.personId)
        const verification = await insertVerification(gallery.personId, gallery.id)
        
        // sendGridClient.sendCreationEmail(person.email, {
        //     galleryName: gallery.name,
        //     name: person.name,
        //     buttonUrl: `${process.env.BASE_URL}/verification/${verification.id}`
        // })
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
