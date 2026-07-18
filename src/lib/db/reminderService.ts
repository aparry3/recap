import { v4 as uuidv4 } from 'uuid'
import { db } from '.'
import { CommunicationChannel } from '../types/Communication'
import { NewReminderDelivery, Reminder, ReminderDelivery, ReminderDraftInput, ReminderUpdate } from '../types/Reminder'

export async function insertReminder(galleryId: string, createdBy: string, input: ReminderDraftInput): Promise<Reminder> {
  const now = new Date()
  return db.insertInto('reminder').values({
    id: uuidv4(),
    galleryId,
    createdBy,
    title: input.title,
    sendAt: input.sendAt ? new Date(input.sendAt) : null,
    status: 'draft',
    sendEmail: input.sendEmail,
    sendSms: input.sendSms,
    emailSubject: input.emailSubject ?? null,
    emailBody: input.emailBody ?? null,
    smsBody: input.smsBody ?? null,
    source: input.source ?? 'manual',
    sourceDetails: input.sourceDetails ?? null,
    version: 1,
    createdAt: now,
    updatedAt: now,
    sentAt: null,
  }).returningAll().executeTakeFirstOrThrow()
}

export async function selectGalleryReminders(galleryId: string): Promise<Reminder[]> {
  return db.selectFrom('reminder')
    .where('galleryId', '=', galleryId)
    .selectAll()
    .orderBy('sendAt', 'asc')
    .orderBy('createdAt', 'desc')
    .execute()
}

export async function selectReminder(reminderId: string): Promise<Reminder> {
  return db.selectFrom('reminder').where('id', '=', reminderId).selectAll().executeTakeFirstOrThrow()
}

export async function updateReminderDraft(reminderId: string, expectedVersion: number, input: ReminderDraftInput): Promise<Reminder> {
  const reminder = await db.updateTable('reminder').set({
    title: input.title,
    sendAt: input.sendAt ? new Date(input.sendAt) : null,
    sendEmail: input.sendEmail,
    sendSms: input.sendSms,
    emailSubject: input.emailSubject ?? null,
    emailBody: input.emailBody ?? null,
    smsBody: input.smsBody ?? null,
    source: input.source ?? 'manual',
    sourceDetails: input.sourceDetails ?? null,
    status: 'draft',
    version: expectedVersion + 1,
    updatedAt: new Date(),
  }).where('id', '=', reminderId)
    .where('version', '=', expectedVersion)
    .where('status', 'in', ['draft', 'scheduled'])
    .returningAll()
    .executeTakeFirst()

  if (!reminder) throw new Error('Reminder changed or can no longer be edited')
  return reminder
}

export async function scheduleReminder(reminderId: string, expectedVersion: number, sendAt?: Date): Promise<Reminder> {
  const patch: ReminderUpdate = {
    status: 'scheduled',
    updatedAt: new Date(),
    version: expectedVersion + 1,
  }
  if (sendAt) patch.sendAt = sendAt

  const reminder = await db.updateTable('reminder').set(patch)
    .where('id', '=', reminderId)
    .where('version', '=', expectedVersion)
    .where('status', 'in', ['draft', 'scheduled'])
    .returningAll()
    .executeTakeFirst()
  if (!reminder) throw new Error('Reminder changed or can no longer be scheduled')
  return reminder
}

export async function cancelReminder(reminderId: string, expectedVersion: number): Promise<Reminder> {
  const reminder = await db.updateTable('reminder').set({ status: 'canceled', version: expectedVersion + 1, updatedAt: new Date() })
    .where('id', '=', reminderId)
    .where('version', '=', expectedVersion)
    .where('status', 'in', ['draft', 'scheduled'])
    .returningAll()
    .executeTakeFirst()
  if (!reminder) throw new Error('Reminder changed or can no longer be canceled')
  return reminder
}

export async function deleteReminder(reminderId: string): Promise<void> {
  const result = await db.deleteFrom('reminder')
    .where('id', '=', reminderId)
    .where('status', 'in', ['draft', 'canceled'])
    .executeTakeFirst()
  if (!result.numDeletedRows) throw new Error('Only draft or canceled reminders can be deleted')
}

export async function claimDueReminders(limit = 10): Promise<Reminder[]> {
  return db.transaction().execute(async (trx) => {
    const staleClaim = new Date(Date.now() - 10 * 60 * 1000)
    await trx.updateTable('reminder')
      .set({ status: 'scheduled', updatedAt: new Date() })
      .where('status', '=', 'sending')
      .where('updatedAt', '<', staleClaim)
      .execute()

    const due = await trx.selectFrom('reminder')
      .where('status', '=', 'scheduled')
      .where('sendAt', '<=', new Date())
      .selectAll()
      .forUpdate()
      .skipLocked()
      .limit(limit)
      .execute()
    if (!due.length) return []

    const ids = due.map((reminder) => reminder.id)
    await trx.updateTable('reminder')
      .set({ status: 'sending', updatedAt: new Date() })
      .where('id', 'in', ids)
      .execute()
    return due.map((reminder) => ({ ...reminder, status: 'sending' as const }))
  })
}

export async function finishReminder(reminderId: string, hadUnexpectedFailure = false): Promise<void> {
  await db.updateTable('reminder').set({
    status: hadUnexpectedFailure ? 'scheduled' : 'sent',
    sentAt: hadUnexpectedFailure ? null : new Date(),
    updatedAt: new Date(),
  }).where('id', '=', reminderId).where('status', '=', 'sending').execute()
}

export async function insertDelivery(input: Omit<NewReminderDelivery, 'id' | 'createdAt' | 'updatedAt'>): Promise<ReminderDelivery | null> {
  const now = new Date()
  const delivery = await db.insertInto('reminderDelivery').values({
    ...input,
    id: uuidv4(),
    createdAt: now,
    updatedAt: now,
  }).onConflict((oc) => oc.column('idempotencyKey').doNothing())
    .returningAll()
    .executeTakeFirst()
  return delivery ?? null
}

export async function updateDelivery(deliveryId: string, patch: {
  status: ReminderDelivery['status']
  providerMessageId?: string | null
  lastError?: string | null
  submittedAt?: Date | null
  deliveredAt?: Date | null
  incrementAttempts?: boolean
}): Promise<void> {
  const delivery = await db.selectFrom('reminderDelivery').where('id', '=', deliveryId).select('attemptCount').executeTakeFirstOrThrow()
  await db.updateTable('reminderDelivery').set({
    status: patch.status,
    providerMessageId: patch.providerMessageId,
    lastError: patch.lastError,
    submittedAt: patch.submittedAt,
    deliveredAt: patch.deliveredAt,
    attemptCount: delivery.attemptCount + (patch.incrementAttempts ? 1 : 0),
    updatedAt: new Date(),
  }).where('id', '=', deliveryId).execute()
}

export async function updateDeliveryByProviderId(providerMessageId: string, status: ReminderDelivery['status']): Promise<void> {
  await db.updateTable('reminderDelivery').set({
    status,
    deliveredAt: status === 'delivered' ? new Date() : undefined,
    updatedAt: new Date(),
  }).where('providerMessageId', '=', providerMessageId).execute()
}

export async function selectReminderDeliveries(reminderId: string): Promise<ReminderDelivery[]> {
  return db.selectFrom('reminderDelivery').where('reminderId', '=', reminderId).selectAll().execute()
}

export async function countEligibleAudience(galleryId: string, channel: CommunicationChannel): Promise<number> {
  const row = await db.selectFrom('galleryPerson')
    .innerJoin('communicationConsent', (join) => join
      .onRef('communicationConsent.galleryId', '=', 'galleryPerson.galleryId')
      .onRef('communicationConsent.personId', '=', 'galleryPerson.personId')
      .on('communicationConsent.channel', '=', channel)
      .on('communicationConsent.status', '=', 'opted_in'))
    .where('galleryPerson.galleryId', '=', galleryId)
    .select((eb) => eb.fn.countAll<number>().as('count'))
    .executeTakeFirst()
  return Number(row?.count ?? 0)
}
