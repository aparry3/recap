import { db } from ".";
import { Gallery, GalleryPerson } from "../types/Gallery";
import { Person, NewPerson, PersonUpdate, NewPersonData, GalleryPersonData, Verification, NewVerification } from "../types/Person";
import {v4 as uuidv4} from 'uuid';
import { sql } from 'kysely';
import { selectGalleryPersonMedia } from "./mediaService";
import { normalizeEmail, normalizeUsPhone, optOutPersonChannelConsents } from './communicationService';
import { DEFAULT_ALBUM_NAMES } from './albumService';
import { PendingGalleryCreation } from '../auth/galleryCreationToken';

const CLOUDFRONT_URL = process.env.AWS_CLOUDFRONT_URL || ''
export const insertPerson = async (newPersonData: NewPersonData): Promise<Person> => {
    const newPerson = {
      ...newPersonData,
      email: normalizeEmail(newPersonData.email) ?? undefined,
      phone: normalizeUsPhone(newPersonData.phone) ?? undefined,
      id: uuidv4(),
    } as NewPerson
    const person = await db.insertInto('person').values(newPerson).returningAll().executeTakeFirstOrThrow();
    return person;
}

export const updatePerson = async (personId: string, personUpdate: PersonUpdate): Promise<Person> => {
  const currentPerson = await selectPerson(personId)
  if (personUpdate.email !== undefined && normalizeEmail(personUpdate.email) !== normalizeEmail(currentPerson.email)) {
    await optOutPersonChannelConsents(personId, 'email', 'contact_changed')
  }
  if (personUpdate.phone !== undefined && normalizeUsPhone(personUpdate.phone) !== normalizeUsPhone(currentPerson.phone)) {
    await optOutPersonChannelConsents(personId, 'sms', 'contact_changed')
  }
  const normalizedUpdate: PersonUpdate = {
    ...personUpdate,
    ...(personUpdate.email !== undefined ? {email: normalizeEmail(personUpdate.email) ?? undefined} : {}),
    ...(personUpdate.phone !== undefined ? {phone: normalizeUsPhone(personUpdate.phone) ?? undefined} : {}),
  }
  const person = await db.updateTable('person').set(normalizedUpdate).where('id', '=', personId).returningAll().executeTakeFirstOrThrow();
  return person;
}

export const selectPerson = async (personId: string): Promise<Person> => {
  const person = await db.selectFrom('person').where('id', '=', personId).selectAll().executeTakeFirstOrThrow();
  return person;
}

export const selectPersonByEmail = async (email: string): Promise<Person> => {
  const normalizedEmail = normalizeEmail(email)
  if (!normalizedEmail) throw new Error('Email is required')
  const person = await db.selectFrom('person')
    .where(sql<boolean>`lower(trim(${sql.ref('person.email')})) = ${normalizedEmail}`)
    .selectAll()
    .executeTakeFirstOrThrow();
  return person;
}

export const selectAdminPersonByEmail = async (email: string): Promise<Person> => {
  const normalizedEmail = normalizeEmail(email)
  if (!normalizedEmail) throw new Error('Email is required')
  return db.selectFrom('person')
    .where(sql<boolean>`lower(trim(${sql.ref('person.email')})) = ${normalizedEmail}`)
    .where('isAdmin', '=', true)
    .selectAll()
    .executeTakeFirstOrThrow()
}

export interface InboundGalleryDestination {
  person: Pick<Person, 'id' | 'name' | 'email' | 'phone'>
  gallery: Pick<Gallery, 'id' | 'name' | 'path'>
}

/** Selects the gallery this contact joined most recently, across duplicate person records. */
export const selectLatestGalleryForDestination = async (
  channel: 'email' | 'sms',
  destination: string,
): Promise<InboundGalleryDestination | null> => {
  const normalized = channel === 'email' ? normalizeEmail(destination) : normalizeUsPhone(destination)
  if (!normalized) return null

  const destinationMatch = channel === 'email'
    ? sql<boolean>`lower(trim(${sql.ref('person.email')})) = ${normalized}`
    : sql<boolean>`right(regexp_replace(${sql.ref('person.phone')}, '[^0-9]', '', 'g'), 10) = ${normalized.slice(-10)}`
  const row = await db.selectFrom('person')
    .innerJoin('galleryPerson', 'galleryPerson.personId', 'person.id')
    .innerJoin('gallery', 'gallery.id', 'galleryPerson.galleryId')
    .where(destinationMatch)
    .where('gallery.deletedAt', 'is', null)
    .select([
      'person.id as personId',
      'person.name as personName',
      'person.email as personEmail',
      'person.phone as personPhone',
      'gallery.id as galleryId',
      'gallery.name as galleryName',
      'gallery.path as galleryPath',
    ])
    .orderBy('galleryPerson.joinedAt', 'desc')
    .orderBy('gallery.created', 'desc')
    .orderBy('person.created', 'desc')
    .executeTakeFirst()
  if (!row) return null

  return {
    person: {
      id: row.personId,
      name: row.personName,
      email: row.personEmail ?? undefined,
      phone: row.personPhone ?? undefined,
    },
    gallery: {
      id: row.galleryId,
      name: row.galleryName,
      path: row.galleryPath,
    },
  }
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
  const inserted = await db.insertInto('galleryPerson').values({galleryId, personId, receiveMessages})
    .onConflict((oc) => oc.columns(['galleryId', 'personId']).doNothing())
    .returningAll().executeTakeFirst();
  const galleryPerson = inserted ?? await db.selectFrom('galleryPerson')
    .where('galleryId', '=', galleryId)
    .where('personId', '=', personId)
    .selectAll()
    .executeTakeFirstOrThrow();
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
  .where('gallery.deletedAt', 'is', null as any)
  .execute() as Gallery[];
  return galleries
}

export const insertVerification = async (personId: string, galleryId?: string): Promise<Verification> => {
  const newVerification = {
    personId,
    id: uuidv4(),
    verified: false,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  } as NewVerification
  if (galleryId) {
    newVerification.galleryId = galleryId
  }
  const verification = await db.insertInto('verification').values(newVerification).returningAll().executeTakeFirstOrThrow();
  return verification;
}

export const consumeVerification = async (verificationId: string): Promise<Verification> => {
  const verification = await db.updateTable('verification')
    .set({verified: true})
    .where('id', '=', verificationId)
    .where('verified', '=', false)
    .where('expiresAt', '>', new Date())
    .returningAll()
    .executeTakeFirst()
  if (!verification) throw new Error('This verification link is invalid, expired, or has already been used')
  return verification
}

export const consumeVerificationAndCreateGallery = async (
  verificationId: string,
  pendingGallery: PendingGalleryCreation,
): Promise<{verification: Verification, gallery: Gallery, person: Person}> => {
  return db.transaction().execute(async (trx) => {
    const current = await trx.selectFrom('verification')
      .where('id', '=', verificationId)
      .selectAll()
      .forUpdate()
      .executeTakeFirst()
    if (!current || current.verified || current.expiresAt <= new Date()) {
      throw new Error('This verification link is invalid, expired, or has already been used')
    }
    if (current.personId !== pendingGallery.personId) {
      throw new Error('The gallery request does not match this verification')
    }

    const person = await trx.updateTable('person')
      .set({name: pendingGallery.personName})
      .where('id', '=', current.personId)
      .returningAll()
      .executeTakeFirstOrThrow()
    const gallery = await trx.insertInto('gallery').values({
      id: uuidv4(),
      name: pendingGallery.name,
      path: pendingGallery.path,
      password: pendingGallery.password,
      personId: current.personId,
      createdBy: current.personId,
      created: new Date(),
      timezone: 'America/New_York',
      ...(pendingGallery.theknot ? {theknot: pendingGallery.theknot} : {}),
      ...(pendingGallery.zola ? {zola: pendingGallery.zola} : {}),
    }).returningAll().executeTakeFirstOrThrow()

    const created = new Date()
    await trx.insertInto('album').values(DEFAULT_ALBUM_NAMES.map((name) => ({
      id: uuidv4(),
      name,
      galleryId: gallery.id,
      personId: person.id,
      created,
    }))).execute()
    await trx.insertInto('galleryPerson').values({
      galleryId: gallery.id,
      personId: person.id,
    }).execute()
    const verification = await trx.updateTable('verification')
      .set({verified: true, galleryId: gallery.id})
      .where('id', '=', verificationId)
      .returningAll()
      .executeTakeFirstOrThrow()

    return {verification, gallery, person}
  })
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
      .where('deletedAt', 'is', null as any)
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
