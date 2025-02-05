// src/app/api/people/route.ts
import { selectGallery } from '@/lib/db/galleryService';
import { insertPerson, insertVerification, selectPersonByEmail } from '@/lib/db/personService';
import { sendGridClient } from '@/lib/email';
import { NewPersonData } from '@/lib/types/Person';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';


export const POST = async (req: Request) => {
    const {personId, galleryName, email, name}: {personId: string, email: string, galleryName: string, name: string} = await req.json()
    console.log(email)
    try {
        const verification = await insertVerification(personId)
        
        sendGridClient.sendTemplateEmail(email, {
            galleryName: galleryName,
            name,
            buttonUrl: `${process.env.BASE_URL}/verification/${verification.id}`
        })
        return NextResponse.json({verification}, {status: 200})
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 400})
    }
};
