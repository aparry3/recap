import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin/middleware';
import { selectGalleriesForAdmin, insertGallery } from '@/lib/db/galleryService';
import { selectPersonByEmail, insertPerson, insertGalleryPerson } from '@/lib/db/personService';
import { generateRandomString } from '@/helpers/utils';
import { sendGridClient } from '@/lib/email';
import { handleWeddingWebsites } from '@/lib/web';
import { NewGalleryData } from '@/lib/types/Gallery';
import { Person } from '@/lib/types/Person';

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search') || '';

    const result = await selectGalleriesForAdmin(admin.id, page, search);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Admin galleries error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch galleries' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin();
    
    const body = await request.json();
    const { ownerName, ownerEmail, galleryName, weddingDate, theKnot, zola } = body;

    // Validate required fields
    if (!ownerName || !ownerEmail || !galleryName) {
      return NextResponse.json(
        { error: 'Owner name, email, and gallery name are required' },
        { status: 400 }
      );
    }

    // Find or create person by email
    let person: Person;
    try {
    person = await selectPersonByEmail(ownerEmail);
  } catch (error) {
      person = await insertPerson({
        name: ownerName,
        email: ownerEmail,
        isAdmin: false
      });
    }


    // Create gallery data
    const galleryPath = galleryName.toLowerCase().replaceAll(' ', '-');
    const password = generateRandomString(4);
    
    const newGalleryData: NewGalleryData = {
      name: galleryName,
      path: galleryPath,
      password,
      personId: person.id,
      createdBy: admin.id,
      date: weddingDate,
      theknot: theKnot,
      zola: zola
    };

    // Create gallery
    const gallery = await insertGallery(newGalleryData);

    console.log('gallery', gallery)
    // Handle wedding website scraping if URLs provided
    let images: string[] = [];
    let events: any[] = [];
    
    if (theKnot || zola) {
      try {
        const webResults = await handleWeddingWebsites(gallery);
        images = webResults.images;
        events = webResults.events;
      } catch (error) {
        console.error('Wedding website scraping error:', error);
      }
    }

    // Add person to gallery
    await insertGalleryPerson(gallery.id, person.id);

    console.log('person', person)
    // Send welcome email
    let emailStatus = 'not_sent';
    try {
      await sendGridClient.sendCreationEmail(
        person.email!,
        person.name,
        `${process.env.BASE_URL}/${gallery.path}`,
        gallery.password
      );
      emailStatus = 'sent';
    } catch (emailError) {
      console.error('Email send error:', emailError);
      emailStatus = 'failed';
    }

    return NextResponse.json({
      gallery,
      images,
      events,
      emailStatus,
      message: `Gallery created successfully for ${person.name}`
    });

  } catch (error) {
    console.error('Admin create gallery error:', error);
    return NextResponse.json(
      { error: 'Failed to create gallery' },
      { status: 500 }
    );
  }
}