// src/app/api/people/route.ts
import { normalizeEmail } from '@/lib/db/communicationService';
import { insertVerification, selectPerson } from '@/lib/db/personService';
import { emailClient } from '@/lib/email';
import { createGalleryCreationToken } from '@/lib/auth/galleryCreationToken';
import { generateRandomString } from '@/helpers/utils';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const optionalLink = z.preprocess(
    (value) => typeof value === 'string' && !value.trim() ? undefined : value,
    z.string().trim().max(2048).optional(),
)

const verificationRequestSchema = z.object({
    personId: z.string().uuid(),
    galleryName: z.string().max(200),
    email: z.string().trim().email().max(320),
    name: z.string().trim().min(1).max(200),
    createGallery: z.boolean().optional().default(false),
    theKnot: optionalLink,
    zola: optionalLink,
}).strict();


export const POST = async (req: Request) => {
    try {
        const requestBody = await req.json()
        const isLegacyGalleryRequest = Object.prototype.hasOwnProperty.call(requestBody, 'theKnot')
            || Object.prototype.hasOwnProperty.call(requestBody, 'zola')
        const {personId, galleryName, email, name, createGallery, theKnot, zola} = verificationRequestSchema.parse(requestBody)
        // Gallery-creation pages opened before this API rollout sent the two
        // optional link keys, but not the explicit createGallery discriminator.
        const shouldCreateGallery = createGallery || isLegacyGalleryRequest
        const person = await selectPerson(personId)
        if (!person.email || normalizeEmail(email) !== normalizeEmail(person.email)) {
            return NextResponse.json({error: 'The email address does not match this account'}, {status: 403})
        }
        if (shouldCreateGallery && !galleryName.trim()) {
            return NextResponse.json({error: 'A gallery name is required'}, {status: 400})
        }
        const verification = await insertVerification(personId)
        const galleryToken = shouldCreateGallery ? createGalleryCreationToken({
            personId,
            personName: name,
            name: galleryName.trim(),
            path: galleryName.trim().toLowerCase().replaceAll(' ', '-'),
            password: generateRandomString(4),
            ...(theKnot ? {theknot: theKnot} : {}),
            ...(zola ? {zola} : {}),
        }) : undefined
        const verificationUrl = new URL(`/verification/${verification.id}`, process.env.BASE_URL)
        if (galleryToken) verificationUrl.searchParams.set('gallery', galleryToken)
        const sent = await emailClient.sendVerificationEmail(person.email, {
            galleryName: galleryName,
            name: person.name,
            buttonUrl: verificationUrl.toString()
        })
        if (!sent) throw new Error('The verification email could not be sent')
        return NextResponse.json({verification}, {status: 200})
    } catch (error) {
        const message = error instanceof z.ZodError
            ? 'This verification request is out of date. Refresh the page and try again.'
            : error instanceof Error ? error.message : 'We could not create the verification request'
        return NextResponse.json({error: message}, {status: 400})
    }
};
