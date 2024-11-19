import { OrientationImage } from "@/helpers/providers/gallery"
import { Selectable, Updateable, Insertable } from "kysely"

export interface MediaTable {
    id: string
    url: string
    preview: string
    height?: number
    width?: number
    personId: string
    latitude?: number
    longitude?: number
    contentType: string
    created?: Date
}

export interface AlbumMediaTable {
    albumId: string
    mediaId: string
}


export type Media = Selectable<MediaTable>
export type MediaUpdate = Updateable<MediaTable>
export type NewMedia = Insertable<MediaTable>
export type NewMediaData = Omit<OrientationImage, 'url' | 'isVertical'|'created'> & {personId: string}
export type AlbumMedia = Selectable<AlbumMediaTable>
export type AlbumMediaUpdate = Updateable<AlbumMediaTable>
export type NewAlbumMedia = Insertable<AlbumMediaTable>
