import { Selectable, Updateable, Insertable } from "kysely"
import { Media } from "./Media"

export interface PersonTable {
    id: string
    name: string
    email?: string
    phone?: string
    created: Date
    isAdmin: boolean
}

export type Person = Selectable<PersonTable>
export type PersonUpdate = Updateable<PersonTable>
export type NewPerson = Insertable<PersonTable>
export type NewPersonData = Omit<NewPerson, 'id'|'created'>

export type GalleryPersonData = Person & { count: number; recentMedia?: Media[]}

export interface VerificationTable {
    id: string
    personId: string
    galleryId?: string
    verified: boolean
}

export type Verification = Selectable<VerificationTable>
export type VerificationUpdate = Updateable<VerificationTable>
export type NewVerification = Insertable<VerificationTable>
