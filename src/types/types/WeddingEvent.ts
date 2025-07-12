import { Selectable, Updateable, Insertable } from "kysely"

export interface WeddingEventDetails {
    name: string
    location: string
    start: Date
    end: Date
    attire: string
}

export interface WeddingEventTable extends WeddingEventDetails{
    id: string
    galleryId: string
}


export type WeddingEvent = Selectable<WeddingEventTable>
export type WeddingEventUpdate = Updateable<WeddingEventTable>
export type NewWeddingEvent = Insertable<WeddingEventTable>

export type NewWeddingEventData = Omit<WeddingEventDetails, 'id'>