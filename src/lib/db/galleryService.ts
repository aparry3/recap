import { db } from ".";
import { Gallery, NewGallery, GalleryUpdate, NewGalleryData, GalleryMedia } from "../types/Gallery";
import {v4 as uuidv4} from 'uuid';
import { sql } from 'kysely';


export const insertGallery = async (newGalleryData: NewGalleryData): Promise<Gallery> => {
    const newGallery = {
        ...newGalleryData, 
        id: uuidv4(),
        createdBy: newGalleryData.createdBy // Include creator if provided
    } as NewGallery

    const gallery = await db.insertInto('gallery').values(newGallery).returningAll().executeTakeFirstOrThrow();
    return gallery;
}

export const updateGallery = async (galleryId: string, galleryUpdate: GalleryUpdate): Promise<Gallery> => {
    const gallery = await db.updateTable('gallery').set(galleryUpdate).where('id', '=', galleryId).returningAll().executeTakeFirstOrThrow();
    return gallery;
}

export const selectGallery = async (galleryId: string, includeDeleted: boolean = false): Promise<Gallery> => {
    const query = db.selectFrom('gallery').where('id', '=', galleryId);
    const filtered = includeDeleted ? query : query.where('deletedAt', 'is', null as any);
    const gallery = await filtered.selectAll().executeTakeFirstOrThrow();
    return gallery;
}

export const selectGalleryByPath = async (path: string, includeDeleted: boolean = false): Promise<Gallery> => {
    const query = db.selectFrom('gallery').where('path', '=', path);
    const filtered = includeDeleted ? query : query.where('deletedAt', 'is', null as any);
    const gallery = await filtered.selectAll().executeTakeFirstOrThrow();
    return gallery;
}

export const selectGalleries = async (): Promise<Gallery[]> => {
    const galleries = await db.selectFrom('gallery').where('deletedAt', 'is', null as any).selectAll().execute();
    return galleries;
}

export const insertGalleryMedia = async (galleryId: string, mediaId: string): Promise<GalleryMedia> => {

    const galleryMedia = await db.insertInto('galleryMedia').values({galleryId, mediaId}).returningAll().executeTakeFirstOrThrow();
    return galleryMedia;
}

export type AdminGalleryScope = 'owned' | 'all';

export const selectGalleriesForAdmin = async (
    adminId: string,
    page: number = 1,
    search?: string,
    limit: number = 20,
    status: 'active' | 'deleted' = 'active',
    scope: AdminGalleryScope = 'owned',
) => {
    const offset = (page - 1) * limit;
    
    let query = db
        .selectFrom('gallery')
        .leftJoin('galleryPerson', 'gallery.id', 'galleryPerson.galleryId')
        .leftJoin('galleryMedia', 'gallery.id', 'galleryMedia.galleryId')
        .leftJoin('media', 'galleryMedia.mediaId', 'media.id')
        .leftJoin('album', 'gallery.id', 'album.galleryId')
        .leftJoin('person as owner', 'gallery.personId', 'owner.id')
        .select([
            'gallery.id',
            'gallery.name',
            'gallery.path',
            'gallery.password',
            'gallery.created',
            'gallery.createdBy',
            'gallery.date as weddingDate',
            'owner.name as ownerName',
            'owner.email as ownerEmail',
            db.fn.count('galleryPerson.personId').distinct().as('contributorsCount'),
            sql<number>`count(distinct case when ${sql.ref('media.uploaded')} = true then ${sql.ref('media.id')} end)`.as('photosCount'),
            db.fn.count('album.id').distinct().as('albumsCount'),
            sql<number>`count(*) over()`.as('totalCount'),
        ])
        .groupBy(['gallery.id', 'owner.id']);

    if (scope === 'owned') {
        query = query.where('gallery.createdBy', '=', adminId);
    }

    // Filter by deletion status
    if (status === 'active') {
        query = query.where('gallery.deletedAt', 'is', null);
    } else if (status === 'deleted') {
        query = query.where('gallery.deletedAt', 'is not', null);
    }

    if (search) {
        query = query.where('gallery.name', 'ilike', `%${search}%`);
    }

    const galleries = await query
        .orderBy('gallery.created', 'desc')
        .limit(limit)
        .offset(offset)
        .execute();

    return {
        galleries: galleries.map(({totalCount: _totalCount, createdBy, ...gallery}) => ({
            ...gallery,
            contributorsCount: Number(gallery.contributorsCount) || 0,
            photosCount: Number(gallery.photosCount) || 0,
            albumsCount: Number(gallery.albumsCount) || 0,
            canManage: createdBy === adminId,
        })),
        page,
        limit,
        total: Number(galleries[0]?.totalCount) || 0,
    };
}

export const softDeleteGallery = async (galleryId: string, adminId: string): Promise<boolean> => {
    const result = await db
      .updateTable('gallery')
      .set({ deletedAt: new Date() })
      .where('id', '=', galleryId)
      .where('createdBy', '=', adminId)
      .executeTakeFirst();
    return !!result.numUpdatedRows;
}

export const restoreGallery = async (galleryId: string, adminId: string): Promise<boolean> => {
    const result = await db
      .updateTable('gallery')
      .set({ deletedAt: null })
      .where('id', '=', galleryId)
      .where('createdBy', '=', adminId)
      .executeTakeFirst();
    return !!result.numUpdatedRows;
}
