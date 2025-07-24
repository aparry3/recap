import { Selectable, Updateable, Insertable } from "kysely"

export interface AdminActionTable {
    id: string
    adminId: string
    action: string
    targetType?: string
    targetId?: string
    metadata?: any
    created: Date
}

export type AdminAction = Selectable<AdminActionTable>
export type AdminActionUpdate = Updateable<AdminActionTable>
export type NewAdminAction = Insertable<AdminActionTable>
export type NewAdminActionData = Omit<NewAdminAction, 'id' | 'created'>