import { db } from ".";
import { Person, NewPerson, PersonUpdate, NewPersonData } from "../types/Person";
import {v4 as uuidv4} from 'uuid';
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

export const selectGalleryPeople = async (galleryId: string): Promise<Person[]> => {
    const media = await db.selectFrom('galleryPerson').where('galleryId', '=', galleryId).fullJoin('person', 'galleryPerson.personId', 'person.id').selectAll('person').execute();
    return media as Person[];
}