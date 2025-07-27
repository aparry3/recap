import { db } from ".";
import { Gallery, GalleryPerson } from "../types/Gallery";
import { Person, NewPerson, PersonUpdate, NewPersonData, GalleryPersonData, Verification, NewVerification, VerificationUpdate } from "../types/Person";
import {v4 as uuidv4} from 'uuid';
import { selectGalleryPersonMedia } from "./mediaService";

const CLOUDFRONT_URL = process.env.AWS_CLOUDFRONT_URL || ''
export const insertPerson = async (newPersonData: NewPersonData): Promise<Person> => {
    const newPerson = {...newPersonData, id: uuidv4()} as NewPerson
    const person = await db.insertInto('person').values(newPerson).returningAll().executeTakeFirstOrThrow();
    return person;
}

export const updatePerson = async (personId: string, personUpdate: PersonUpdate): Promise<Person> => {
  const person = await db.updateTable('person').set(personUpdate).where('id', '=', personId).returningAll().executeTakeFirstOrThrow();
  return person;
}

export const selectPerson = async (personId: string): Promise<Person> => {
  const person = await db.selectFrom('person').where('id', '=', personId).selectAll().executeTakeFirstOrThrow();
  return person;
}

export const selectPersonByEmail = async (email: string): Promise<Person> => {
  const person = await db.selectFrom('person').where('email', '=', email).selectAll().executeTakeFirstOrThrow();
  return person;
}


export const selectPeopleMedia = async (galleryId: string): Promise<GalleryPersonData[]> => {
    const people = await db.selectFrom('person')
    .leftJoin('media', 'media.personId', 'person.id') // Join to count media for each person
    .leftJoin('galleryMedia', 'galleryMedia.mediaId', 'media.id')
    .select([
      'person.id',
      'person.name',
      'person.email',
      db.fn.count('media.id').as('count'),
    ])
    .where('galleryMedia.galleryId', '=', galleryId)
    .groupBy(['person.id']) // Only group by person ID
    .execute();

    const personPromises = people.map(async p => {
      const recentMedia = await selectGalleryPersonMedia(galleryId, p.id, 100)
      return {
        ...p,
        recentMedia
      }
    })

    return await Promise.all(personPromises) as GalleryPersonData[];
}

export const insertGalleryPerson = async (galleryId: string, personId: string, receiveMessages?: boolean): Promise<GalleryPerson> => {
  const galleryPerson = await db.insertInto('galleryPerson').values({galleryId, personId, receiveMessages}).returningAll().executeTakeFirstOrThrow();
  return galleryPerson;
}

export const updateGalleryPerson = async (galleryId: string, personId: string, mediaId: string): Promise<GalleryPerson> => {
  const galleryPerson = await db.updateTable('galleryPerson').where('galleryId', '=', galleryId).where('personId', '=', personId).set({coverPhotoId: mediaId}).returningAll().executeTakeFirstOrThrow();
  return galleryPerson;
}

export const selectPersonGalleries = async (personId: string): Promise<Gallery[]> => {
  const galleries = await db.selectFrom('galleryPerson')
  .leftJoin('gallery', 'gallery.id', 'galleryPerson.galleryId') // Join to count media for each person
  .selectAll('gallery')
  .where('galleryPerson.personId', '=', personId)
  .execute() as Gallery[];
  return galleries
}

export const insertVerification = async (personId: string, galleryId?: string): Promise<Verification> => {
  const newVerification = {personId, id: uuidv4(), verified: false} as NewVerification
  if (galleryId) {
    newVerification.galleryId = galleryId
  }
  newVerification
  const verification = await db.insertInto('verification').values(newVerification).returningAll().executeTakeFirstOrThrow();
  return verification;
}

export const updateVerification = async (verificationId: string, verified: boolean): Promise<Verification> => {
  const newVerification = {verified} as VerificationUpdate
  const verification = await db.updateTable('verification').set(newVerification).where('id', '=', verificationId).returningAll().executeTakeFirstOrThrow();
  return verification;
}


export const selectVerification = async (verificationId: string): Promise<Verification> => {
  const verification = await db.selectFrom('verification').where('id', '=', verificationId).selectAll().executeTakeFirstOrThrow();
  return verification;
}

export const isPersonAdmin = async (personId: string): Promise<boolean> => {
  const person = await db.selectFrom('person').where('id', '=', personId).select('isAdmin').executeTakeFirst();
  return person?.isAdmin || false;
}

export const updatePersonAdminStatus = async (personId: string, isAdmin: boolean): Promise<Person> => {
  const person = await db.updateTable('person').set({isAdmin}).where('id', '=', personId).returningAll().executeTakeFirstOrThrow();
  return person;
}

export const selectPersonWithGalleryStatus = async (personId: string): Promise<Person & { hasGalleries: boolean }> => {
  try {
    // Get person data
    const person = await selectPerson(personId);
    
    // Check if person owns any galleries or is the creator
    const ownedGalleries = await db.selectFrom('gallery')
      .select('id')
      .where(eb => eb.or([
        eb('personId', '=', personId),
        eb('createdBy', '=', personId)
      ]))
      .limit(1)
      .execute();
    
    // If they own galleries, no need to check membership
    if (ownedGalleries.length > 0) {
      return { ...person, hasGalleries: true };
    }
    
    // Check if person is a member of any galleries
    const galleryMemberships = await db.selectFrom('galleryPerson')
      .select('galleryId')
      .where('personId', '=', personId)
      .limit(1)
      .execute();
    
    return { ...person, hasGalleries: galleryMemberships.length > 0 };
  } catch (error) {
    console.error('Error in selectPersonWithGalleryStatus:', error);
    throw error;
  }
}

