import { Insertable, Selectable, Updateable } from "kysely"
import { Media } from "./Media"

export interface AlbumTable {
    id: string
    name: string
    date?: Date
    personId: string
    galleryId: string
    created: Date
}

export type Album = Selectable<AlbumTable>
export type AlbumUpdate = Updateable<AlbumTable>
export type NewAlbum = Insertable<AlbumTable>
export type NewAlbumData = Omit<NewAlbum, 'id'|'created'>

export type AlbumMediaData = Album & { count: number; recentMedia?: Media[]}
