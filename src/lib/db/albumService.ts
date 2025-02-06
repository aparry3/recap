import { db } from ".";
import { Album, AlbumUpdate, NewAlbumData, AlbumMediaData } from "../types/Album";
import {v4 as uuidv4} from 'uuid';
import { AlbumMedia, Media } from "../types/Media";

const CLOUDFRONT_URL = process.env.AWS_CLOUDFRONT_URL || ''

export const insertAlbum = async (galleryId: string, newAlbum: NewAlbumData): Promise<Album> => {
  const id = uuidv4()
  const album = await db.insertInto('album').values({...newAlbum, id, galleryId, created: new Date()}).returningAll().executeTakeFirstOrThrow();
  return album;
}

export const insertAlbumMedia = async (albumId: string, mediaIds: string[]): Promise<Media[]> => {
  const albumMedia = await db.insertInto('albumMedia')
  .values(mediaIds.map(id => ({albumId, mediaId: id})))
  .onConflict(oc => oc.constraint('album_media_pk').doNothing())
  .returningAll()
  .execute();

  const media = await db
  .selectFrom('media')
  .innerJoin('albumMedia', 'albumMedia.mediaId', 'media.id')
  .where('albumMedia.albumId', '=', albumId)
  .where('albumMedia.mediaId', 'in', albumMedia.map(row => row.mediaId)) // Fetch only the inserted media
  .selectAll('media')
  .execute();

  return media;
}

export const deleteAlbumMedia = async (albumId: string): Promise<number> => {
  const results = await db.deleteFrom('albumMedia').where('albumId', '=', albumId).executeTakeFirst();
  return Number(results.numDeletedRows);
}

export const deleteAlbum = async (albumId: string): Promise<boolean> => {
  const results = await db.deleteFrom('album').where('id', '=', albumId).executeTakeFirst();
  return !!results.numDeletedRows;
}


export const updateAlbum = async (albumId: string, albumUpdate: AlbumUpdate): Promise<Album> => {
  const album = await db.updateTable('album').set(albumUpdate).where('id', '=', albumId).returningAll().executeTakeFirstOrThrow();
  return album;
}

export const selectAlbum = async (albumId: string): Promise<AlbumMediaData | undefined> => {
  const album = await db.selectFrom('album')
  .leftJoin('albumMedia', 'albumMedia.albumId', 'album.id')
  .leftJoin('media', 'media.id', 'albumMedia.mediaId') // Join to count media for each person
  .selectAll('album')
  .select([
    db.fn.count('media.id').as('count'),
  ])
  .where('album.id', '=', albumId)
  .groupBy(['album.id']) // Only group by person ID
  .executeTakeFirst();

  if (!album) return undefined
  const recentMedia = await selectAlbumMedia(album.id, 100)

  return {
      ...album,
      count: Number(album.count || 0),
      recentMedia: recentMedia || []
    }
}

// export const selectAlbum = async (albumId: string): Promise<Album> => {
//   const album = await db.selectFrom('album').where('id', '=', albumId).selectAll().executeTakeFirstOrThrow();
//   return album;
// }

export const selectGalleryAlbums = async (galleryId: string): Promise<AlbumMediaData[]> => {
    const albums = await db.selectFrom('album')
    .leftJoin('albumMedia', 'albumMedia.albumId', 'album.id')
    .leftJoin('media', 'media.id', 'albumMedia.mediaId') // Join to count media for each person
    .selectAll('album')
    .select([
      db.fn.count('media.id').as('count'),
    ])
    .where('album.galleryId', '=', galleryId)
    .groupBy(['album.id']) // Only group by person ID
    .execute();

    const albumPromises = albums.map(async a => {
      const recentMedia = await selectAlbumMedia(a.id, 100)
      return {
        ...a,
        recentMedia
      }
    })

    return await Promise.all(albumPromises) as AlbumMediaData[];
}

  export const selectAlbumMedia = async (albumId: string, limit?: number): Promise<Media[]> => {
    let mediaQuery = db.selectFrom('albumMedia').where('albumId', '=',  albumId).fullJoin('media', 'albumMedia.mediaId', 'media.id').selectAll('media').orderBy('media.created', 'desc')
    if (limit) {
      mediaQuery = mediaQuery.limit(limit)

    }
    const media = await mediaQuery.execute();
    return media.map(m => ({...m, url: `${CLOUDFRONT_URL}/${m.url}`, preview: `${CLOUDFRONT_URL}/${m.preview}`})) as Media[];
  }

