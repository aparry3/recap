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
