import { db } from ".";
import { Gallery, NewGallery, GalleryUpdate, NewGalleryData, GalleryMedia } from "../types/Gallery";
import {v4 as uuidv4} from 'uuid';


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

export const selectGallery = async (galleryId: string): Promise<Gallery> => {
    const gallery = await db.selectFrom('gallery').where('id', '=', galleryId).selectAll().executeTakeFirstOrThrow();
    return gallery;
}

export const selectGalleryByPath = async (path: string): Promise<Gallery> => {
    const gallery = await db.selectFrom('gallery').where('path', '=', path).selectAll().executeTakeFirstOrThrow();
    return gallery;
}

export const selectGalleries = async (): Promise<Gallery[]> => {
    const galleries = await db.selectFrom('gallery').selectAll().execute();
    return galleries;
}

export const insertGalleryMedia = async (galleryId: string, mediaId: string): Promise<GalleryMedia> => {

    const galleryMedia = await db.insertInto('galleryMedia').values({galleryId, mediaId}).returningAll().executeTakeFirstOrThrow();
    return galleryMedia;
}

export const selectGalleriesForAdmin = async (adminId: string, page: number = 1, search?: string, limit: number = 20) => {
    const offset = (page - 1) * limit;
    
    let query = db
        .selectFrom('gallery')
        .leftJoin('galleryPerson', 'gallery.id', 'galleryPerson.galleryId')
        .leftJoin('galleryMedia', 'gallery.id', 'galleryMedia.galleryId')
        .select([
            'gallery.id',
            'gallery.name',
            'gallery.path',
            'gallery.password',
            'gallery.created',
            'gallery.date as weddingDate',
            db.fn.count('galleryPerson.personId').distinct().as('contributorsCount'),
            db.fn.count('galleryMedia.mediaId').distinct().as('photosCount'),
        ])
        .where('gallery.createdBy', '=', adminId)
        .groupBy(['gallery.id']);

    if (search) {
        query = query.where('gallery.name', 'ilike', `%${search}%`);
    }

    const galleries = await query
        .orderBy('gallery.created', 'desc')
        .limit(limit)
        .offset(offset)
        .execute();

    return {
        galleries: galleries.map(g => ({
            ...g,
            contributorsCount: Number(g.contributorsCount) || 0,
            photosCount: Number(g.photosCount) || 0,
        })),
        page,
        limit,
    };
}
