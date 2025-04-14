import { Insertable, Selectable, Updateable } from "kysely"
import { WeddingEvent } from "./WeddingEvent"

export interface GalleryTable {
    id: string
    name: string
    path: string
    date?: Date
    personId: string
    created: Date
    password: string
    zola?: string
    theknot?: string
}

export interface GalleryMediaTable {
    galleryId: string
    mediaId: string
}

export interface GalleryPersonTable {
    galleryId: string
    personId: string
    coverPhotoId?: string
    receiveMessages?: boolean
}

export type GalleryWithImagesAndEvents =Gallery & {images: string[], events?: WeddingEvent[]}


export type Gallery = Selectable<GalleryTable>
export type GalleryUpdate = Updateable<GalleryTable>
export type NewGallery = Insertable<GalleryTable>
export type NewGalleryData = Omit<NewGallery, 'id'|'personId'|'created'> & {personId?: string}

export type GalleryMedia = Selectable<GalleryMediaTable>
export type GalleryMediaUpdate = Updateable<GalleryMediaTable>
export type NewGalleryMedia = Insertable<GalleryMediaTable>

export type GalleryPerson = Selectable<GalleryPersonTable>
export type GalleryPersonUpdate = Updateable<GalleryPersonTable>
export type NewGalleryPerson = Insertable<GalleryPersonTable>

