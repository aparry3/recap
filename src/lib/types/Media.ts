import { Selectable, Updateable, Insertable } from "kysely"

export interface MediaTable {
    id: string
    type: 'image' | 'video'
    url: string
    height?: number
    width?: number
    personId: string
    latitude?: number
    longitude?: number
}

export interface AlbumMediaTable {
    albumId: string
    mediaId: string
}


export type Media = Selectable<MediaTable>
export type MediaUpdate = Updateable<MediaTable>
export type NewMedia = Insertable<MediaTable>
export type NewMediaData = Omit<NewMedia, 'id'>

export type AlbumMedia = Selectable<AlbumMediaTable>
export type AlbumMediaUpdate = Updateable<AlbumMediaTable>
export type NewAlbumMedia = Insertable<AlbumMediaTable>
