import { Selectable, Updateable, Insertable } from "kysely"

export interface PersonTable {
    id: string
    name: string
    email?: string
}

export type Person = Selectable<PersonTable>
export type PersonUpdate = Updateable<PersonTable>
export type NewPerson = Insertable<PersonTable>
export type NewPersonData = Omit<NewPerson, 'id'>

