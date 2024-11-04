import { Selectable, Updateable, Insertable } from "kysely"

export interface TagTable {
    personId: string
    mediaId: string
}

export type Tag = Selectable<TagTable>
export type TagUpdate = Updateable<TagTable>
export type NewTag = Insertable<TagTable>