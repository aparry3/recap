import { db } from ".";
import { Album, NewAlbum, AlbumUpdate } from "../types/Album";

export const insertAlbum = async (newAlbum: NewAlbum): Promise<Album> => {
  const album = await db.insertInto('album').values(newAlbum).returningAll().executeTakeFirstOrThrow();
  return album;
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