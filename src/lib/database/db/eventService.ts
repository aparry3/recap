import { db } from ".";
import { MediaUpdate } from "../types/Media";
import {v4 as uuidv4} from 'uuid';
import { NewWeddingEventData, WeddingEvent, WeddingEventDetails } from "../types/WeddingEvent";

const CLOUDFRONT_URL = process.env.AWS_CLOUDFRONT_URL || ''

export const insertEvents = async (galleryId: string, newEventData: WeddingEventDetails[]): Promise<WeddingEvent[]> => {
    const newEvents = newEventData.map(e => ({...e, id: uuidv4(), galleryId}))
    const events = await db.insertInto('weddingEvent').values(newEvents).returningAll().execute();
    return events;
}

export const updateEvent = async (eventId: string, eventUpdate: MediaUpdate): Promise<WeddingEvent> => {
  const event = await db.updateTable('weddingEvent').set(eventUpdate).where('id', '=', eventId).returningAll().executeTakeFirstOrThrow();
  return event;
}

export const selectGalleryEvents = async (galleryId: string): Promise<WeddingEvent[]> => {
  const events = await db.selectFrom('weddingEvent').where('galleryId', '=', galleryId).selectAll().execute();
  return events;
}
export const deleteEvent = async (eventId: string): Promise<boolean> => {
  const results = await db.deleteFrom('weddingEvent').where('id', '=', eventId).executeTakeFirst();
  return results.numDeletedRows > 0;
}