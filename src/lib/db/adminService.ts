import { v4 as uuidv4 } from 'uuid'
import { db } from '.'
import { NewAdminAction, AdminAction } from '../types/AdminAction'

export async function insertAdminAction(action: NewAdminAction): Promise<AdminAction> {
  const result = await db
    .insertInto('adminActions')
    .values({
      id: action.id || uuidv4(),
      adminId: action.adminId,
      action: action.action,
      targetType: action.targetType,
      targetId: action.targetId,
      metadata: action.metadata,
      created: action.created || new Date()
    })
    .returningAll()
    .executeTakeFirstOrThrow()
  
  return result
}

export async function selectAdminActions(adminId?: string, limit = 100): Promise<AdminAction[]> {
  let query = db
    .selectFrom('adminActions')
    .selectAll()
    .orderBy('created', 'desc')
    .limit(limit)
  
  if (adminId) {
    query = query.where('adminId', '=', adminId)
  }
  
  return await query.execute()
}

export async function selectAdminActionsByTarget(targetType: string, targetId: string): Promise<AdminAction[]> {
  return await db
    .selectFrom('adminActions')
    .selectAll()
    .where('targetType', '=', targetType)
    .where('targetId', '=', targetId)
    .orderBy('created', 'desc')
    .execute()
}

export async function logAdminAction(
  adminId: string,
  action: string,
  targetType?: string,
  targetId?: string,
  metadata?: any
): Promise<AdminAction> {
  return await insertAdminAction({
    adminId,
    action,
    targetType,
    targetId,
    metadata
  })
}