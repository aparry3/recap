import { Selectable, Updateable, Insertable } from "kysely"

export interface LikeTable {
    id: string
    mediaId: string
    personId: string
    created: Date
}

export type Like = Selectable<LikeTable>
export type NewLike = Insertable<LikeTable>
export type LikeUpdate = Updateable<LikeTable> 