import { db } from ".";
import { NewMedia, MediaUpdate, NewMediaData, Media } from "../types/Media";
import {v4 as uuidv4} from 'uuid';

const CLOUDFRONT_URL = process.env.AWS_CLOUDFRONT_URL || ''

export const insertMedia = async (newMediaData: NewMediaData): Promise<Media> => {
    const id = uuidv4()
    const url = `${newMediaData.personId}/${id}`
    const newMedia = {...newMediaData, id, url, preview: `${url}-preview`} as NewMedia
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
  return media.map(m => ({...m, url: `${CLOUDFRONT_URL}/${m.url}`, preview: `${CLOUDFRONT_URL}/${m.preview}`})) as Media[];
}

export const selectAlbumMedia = async (albumId: string): Promise<Media[]> => {
    const media = await db.selectFrom('albumMedia').where('albumId', '=', albumId).fullJoin('media', 'albumMedia.mediaId', 'media.id').selectAll('media').execute();
    return media as Media[];
  }