import { db } from ".";
import { Album, NewAlbum, AlbumUpdate, NewAlbumData } from "../types/Album";
import {v4 as uuidv4} from 'uuid';
import { AlbumMedia } from "../types/Media";

export const insertAlbum = async (galleryId: string, newAlbum: NewAlbumData): Promise<Album> => {
  const id = uuidv4()
  const album = await db.insertInto('album').values({...newAlbum, id, galleryId, created: new Date()}).returningAll().executeTakeFirstOrThrow();
  return album;
}

export const insertAlbumMedia = async (albumId: string, mediaIds: string[]): Promise<AlbumMedia[]> => {
  const albumMedia = await db.insertInto('albumMedia').values(mediaIds.map(id => ({albumId, mediaId: id}))).returningAll().execute();
  return albumMedia;
}


export const updateAlbum = async (albumId: string, albumUpdate: AlbumUpdate): Promise<Album> => {
  const album = await db.updateTable('album').set(albumUpdate).where('id', '=', albumId).returningAll().executeTakeFirstOrThrow();
  return album;
}

export const selectAlbum = async (albumId: string): Promise<Album> => {
  const album = await db.selectFrom('album').where('id', '=', albumId).selectAll().executeTakeFirstOrThrow();
  return album;
}

export const selectAlbums = async (): Promise<Album[]> => {
  const albums = await db.selectFrom('album').selectAll().execute();
  return albums;
}

export const selectGalleryAlbums = async (galleryId: string): Promise<Album[]> => {
  const albums = await db.selectFrom('album').where('galleryId', '=', galleryId).selectAll().execute();
  return albums;
}