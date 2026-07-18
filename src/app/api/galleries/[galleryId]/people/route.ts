// src/app/api/galleries/route.ts
import { insertGalleryPerson, selectPeopleMedia, selectPerson } from '@/lib/db/personService';
import { NextResponse } from 'next/server';
import { selectGallery } from '@/lib/db/galleryService';
import { setGalleryConsents } from '@/lib/db/communicationService';
import { sendConsentConfirmations } from '@/lib/reminders/dispatch';
import { getAuthenticatedPersonId } from '@/lib/auth/session';

export const POST = async (req: Request, ctx: { params: Promise<{ galleryId: string }> }) => {
    const {personId, emailOptIn = false, smsOptIn = false}  = await req.json()
    const { galleryId } = await ctx.params

    // Guard
    try {
        await selectGallery(galleryId);
    } catch {
        return NextResponse.json({ error: 'Gallery not found' }, { status: 404 });
    }

    try {
        const person = await selectPerson(personId)
        const authenticatedPersonId = await getAuthenticatedPersonId()
        if (authenticatedPersonId !== person.id) {
            return NextResponse.json({error: 'A verified guest session is required to set communication preferences'}, {status: 401})
        }
        if (emailOptIn && !person.email) return NextResponse.json({error: 'Email is required for email reminders'}, {status: 400})
        if (smsOptIn && !person.phone) return NextResponse.json({error: 'A valid phone number is required for SMS reminders'}, {status: 400})

        const galleryPerson = await insertGalleryPerson(galleryId, personId, false)
        const forwardedFor = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
        const consents = await setGalleryConsents({
            galleryId,
            personId,
            emailOptIn: Boolean(emailOptIn),
            smsOptIn: Boolean(smsOptIn),
            source: 'gallery_join',
            ipAddress: forwardedFor,
            userAgent: req.headers.get('user-agent'),
        })
        const gallery = await selectGallery(galleryId)
        await sendConsentConfirmations(gallery, person, consents)
        return NextResponse.json({galleryPerson, consents}, {status: 200})
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 400})
    }
};


export const GET = async (_: Request, ctx: { params: Promise<{ galleryId: string }> }) => {
    const { galleryId } = await ctx.params

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
