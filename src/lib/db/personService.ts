import { db } from ".";
import { GalleryPerson } from "../types/Gallery";
import { Person, NewPerson, PersonUpdate, NewPersonData, GalleryPersonData } from "../types/Person";
import {v4 as uuidv4} from 'uuid';

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

export const selectGalleryPeople = async (galleryId: string): Promise<GalleryPersonData[]> => {
    const media = await db.selectFrom('galleryPerson')
    .innerJoin('person', 'person.id', 'galleryPerson.personId')
    .leftJoin('media as CoverMedia', 'CoverMedia.id', 'galleryPerson.coverPhotoId')
    .leftJoin('media', 'media.personId', 'person.id') // Join to count media for each person
    .select([
      'person.id',
      'person.name',
      'person.email',
      'CoverMedia.preview as preview',
      'CoverMedia.created as created',
      db.fn.count('media.id').as('count')
    ])
    .where('galleryPerson.galleryId', '=', galleryId)
    .groupBy(['person.id', 'CoverMedia.preview', 'CoverMedia.created']) // Only group by person ID
    .execute();

    return  media.map(m => ({...m, preview: `${CLOUDFRONT_URL}/${m.preview}`} as GalleryPersonData));
}

export const insertGalleryPerson = async (galleryId: string, personId: string): Promise<GalleryPerson> => {
  const galleryPerson = await db.insertInto('galleryPerson').values({galleryId, personId}).returningAll().executeTakeFirstOrThrow();
  return galleryPerson;
}

export const updateGalleryPerson = async (galleryId: string, personId: string, mediaId: string): Promise<GalleryPerson> => {
  const galleryPerson = await db.updateTable('galleryPerson').where('galleryId', '=', galleryId).where('personId', '=', personId).set({coverPhotoId: mediaId}).returningAll().executeTakeFirstOrThrow();
  return galleryPerson;
}