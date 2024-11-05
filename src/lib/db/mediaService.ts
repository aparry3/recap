import { db } from ".";
import { Media, NewMedia, MediaUpdate, NewMediaData } from "../types/Media";
import {v4 as uuidv4} from 'uuid';


export const insertMedia = async (newMediaData: NewMediaData): Promise<Media> => {
    const newMedia = {...newMediaData, id: uuidv4()} as NewMedia
    const media = await db.insertInto('media').values(newMedia).returningAll().executeTakeFirstOrThrow();
    return media;
}

export const updateMedia = async (mediaId: string, mediaUpdate: MediaUpdate): Promise<Media> => {
  const media = await db.updateTable('media').set(mediaUpdate).where('id', '=', mediaId).returningAll().executeTakeFirstOrThrow();
  return media;
}

export const selectMedia = async (mediaId: string): Promise<Media> => {
  const media = await db.selectFrom('media').where('id', '=', mediaId).selectAll().executeTakeFirstOrThrow();
  return media;
}

export const selectGalleryMedia = async (galleryId: string): Promise<Media[]> => {
  const media = await db.selectFrom('galleryMedia').where('galleryId', '=', galleryId).fullJoin('media', 'galleryMedia.mediaId', 'media.id').selectAll('media').execute();
  return media as Media[];
}

export const selectAlbumMedia = async (albumId: string): Promise<Media[]> => {
    const media = await db.selectFrom('albumMedia').where('albumId', '=', albumId).fullJoin('media', 'albumMedia.mediaId', 'media.id').selectAll('media').execute();
    return media as Media[];
  }