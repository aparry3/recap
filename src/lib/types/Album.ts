import { Insertable, Selectable, Updateable } from "kysely"

export interface AlbumTable {
    id: string
    name: string
    date?: Date
    galleryId: string
}

export type Album = Selectable<AlbumTable>
export type AlbumUpdate = Updateable<AlbumTable>
export type NewAlbum = Insertable<AlbumTable>
export type NewAlbumData = Omit<NewAlbum, 'id'>
