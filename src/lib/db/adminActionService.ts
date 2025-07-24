import { db } from ".";
import { AdminAction, NewAdminAction, NewAdminActionData } from "../types/AdminAction";
import { v4 as uuidv4 } from 'uuid';

export const insertAdminAction = async (adminActionData: NewAdminActionData): Promise<AdminAction> => {
    const newAdminAction = {
        ...adminActionData, 
        id: uuidv4(),
        created: new Date()
    } as NewAdminAction;
    
    const adminAction = await db
        .insertInto('adminActions')
        .values(newAdminAction)
        .returningAll()
        .executeTakeFirstOrThrow();
    
    return adminAction;
}

export const logAdminAction = async (
    adminId: string,
    action: string,
    targetType?: string,
    targetId?: string,
    metadata?: any
): Promise<AdminAction> => {
    return await insertAdminAction({
        adminId,
        action,
        targetType,
        targetId,
        metadata
    });
}

export const selectAdminActions = async (
    limit: number = 50,
    offset: number = 0,
    adminId?: string
): Promise<AdminAction[]> => {
    let query = db
        .selectFrom('adminActions')
        .selectAll()
        .orderBy('created', 'desc')
        .limit(limit)
        .offset(offset);
    
    if (adminId) {
        query = query.where('adminId', '=', adminId);
    }
    
    const actions = await query.execute();
    return actions;
}

export const selectAdminActionsByTarget = async (
    targetType: string,
    targetId: string
): Promise<AdminAction[]> => {
    const actions = await db
        .selectFrom('adminActions')
        .selectAll()
        .where('targetType', '=', targetType)
        .where('targetId', '=', targetId)
        .orderBy('created', 'desc')
        .execute();
    
    return actions;
}

export const countAdminActions = async (adminId?: string): Promise<number> => {
    let query = db
        .selectFrom('adminActions')
        .select(db.fn.count('id').as('count'));
    
    if (adminId) {
        query = query.where('adminId', '=', adminId);
    }
    
    const result = await query.executeTakeFirst();
    return Number(result?.count || 0);
}