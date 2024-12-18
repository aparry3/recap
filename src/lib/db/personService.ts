import { db } from ".";
import { Gallery, GalleryPerson } from "../types/Gallery";
import { Person, NewPerson, PersonUpdate, NewPersonData, GalleryPersonData } from "../types/Person";
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
      const recentMedia = await selectGalleryPersonMedia(galleryId, p.id, 25)
      return {
        ...p,
        recentMedia
      }
    })

    return await Promise.all(personPromises) as GalleryPersonData[];
}

export const insertGalleryPerson = async (galleryId: string, personId: string): Promise<GalleryPerson> => {
  const galleryPerson = await db.insertInto('galleryPerson').values({galleryId, personId}).returningAll().executeTakeFirstOrThrow();
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