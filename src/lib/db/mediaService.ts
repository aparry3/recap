import { db } from ".";
import { NewMedia, MediaUpdate, NewMediaData, MediaWithUrl, Media } from "../types/Media";
import {v4 as uuidv4} from 'uuid';

const CLOUDFRONT_URL = process.env.AWS_CLOUDFRONT_URL || ''

export const insertMedia = async (newMediaData: NewMediaData): Promise<Media> => {
    const id = uuidv4()
    const newMedia = {...newMediaData, id, key: `${newMediaData.personId}/${id}`} as NewMedia
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
  return media.map(m => ({...m, url: `${CLOUDFRONT_URL}/${m.key}`})) as MediaWithUrl[];
}

export const selectAlbumMedia = async (albumId: string): Promise<Media[]> => {
    const media = await db.selectFrom('albumMedia').where('albumId', '=', albumId).fullJoin('media', 'albumMedia.mediaId', 'media.id').selectAll('media').execute();
    return media as Media[];
  }