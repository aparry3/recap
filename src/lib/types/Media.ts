import { OrientationImage } from "@/helpers/providers/gallery"
import { Selectable, Updateable, Insertable } from "kysely"

export interface MediaTable {
    id: string
    key: string
    height?: number
    width?: number
    personId: string
    latitude?: number
    longitude?: number
    contentType: string
}

export interface AlbumMediaTable {
    albumId: string
    mediaId: string
}


export type Media = Selectable<MediaTable>
export type MediaUpdate = Updateable<MediaTable>
export type NewMedia = Insertable<MediaTable>
export type NewMediaData = Omit<OrientationImage, 'url' | 'isVertical'> & {personId: string}
export type MediaWithUrl = Media & {url: string}

export type AlbumMedia = Selectable<AlbumMediaTable>
export type AlbumMediaUpdate = Updateable<AlbumMediaTable>
export type NewAlbumMedia = Insertable<AlbumMediaTable>