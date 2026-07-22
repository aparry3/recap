import { createHash } from 'crypto'
import { sql } from 'kysely'
import { v4 as uuidv4 } from 'uuid'
import { db } from '.'
import { CommunicationChannel, CommunicationConsent, ConsentStatus } from '../types/Communication'

export const CONSENT_DISCLOSURE_VERSION = 'guest-reminders-us-v2'
export const SMS_MESSAGE_LIMIT = 10

export function smsReservationExceedsLimit(countIncludingReservation: number): boolean {
  return countIncludingReservation > SMS_MESSAGE_LIMIT
}

export function normalizeEmail(email?: string | null): string | null {
  const normalized = email?.trim().toLowerCase()
  return normalized || null
}

export function normalizeUsPhone(phone?: string | null): string | null {
  if (!phone) return null
  let digits = phone.replace(/\D/g, '')
  if (digits.length === 11 && digits.startsWith('1')) digits = digits.slice(1)
  if (digits.length !== 10) return null
  return `+1${digits}`
}

export function hashDestination(destination: string): string {
  return createHash('sha256').update(destination.trim().toLowerCase()).digest('hex')
}

function canonicalDestination(channel: CommunicationChannel, destination: string): string {
  return (channel === 'email' ? normalizeEmail(destination) : normalizeUsPhone(destination)) || destination.trim().toLowerCase()
}

export async function upsertConsent(input: {
  galleryId: string
  personId: string
  channel: CommunicationChannel
  status: ConsentStatus
  source: string
  ipAddress?: string | null
  userAgent?: string | null
}): Promise<CommunicationConsent> {
  const now = new Date()
  return db.transaction().execute(async (trx) => {
    // The gallery membership row serializes consent changes for this guest and
    // gallery, including simultaneous email/SMS preference submissions.
    await trx.selectFrom('galleryPerson')
      .where('galleryId', '=', input.galleryId)
      .where('personId', '=', input.personId)
      .select('personId')
      .forUpdate()
      .executeTakeFirst()

    const existing = await trx.selectFrom('communicationConsent')
      .where('galleryId', '=', input.galleryId)
      .where('personId', '=', input.personId)
      .where('channel', '=', input.channel)
      .selectAll()
      .forUpdate()
      .executeTakeFirst()

    let consent: CommunicationConsent
    if (!existing) {
      consent = await trx.insertInto('communicationConsent').values({
        id: uuidv4(),
        galleryId: input.galleryId,
        personId: input.personId,
        channel: input.channel,
        status: input.status,
        disclosureVersion: CONSENT_DISCLOSURE_VERSION,
        source: input.source,
        ipAddress: input.ipAddress ?? null,
        userAgent: input.userAgent ?? null,
        createdAt: now,
        updatedAt: now,
      }).returningAll().executeTakeFirstOrThrow()
    } else if (existing.status !== input.status || existing.disclosureVersion !== CONSENT_DISCLOSURE_VERSION) {
      consent = await trx.updateTable('communicationConsent').set({
        status: input.status,
        disclosureVersion: CONSENT_DISCLOSURE_VERSION,
        source: input.source,
        ipAddress: input.ipAddress ?? null,
        userAgent: input.userAgent ?? null,
        updatedAt: now,
      }).where('id', '=', existing.id).returningAll().executeTakeFirstOrThrow()
    } else {
      // Preserve updatedAt when the effective choice is unchanged. Confirmation
      // idempotency uses it to send once per actual opt-in transition.
      consent = existing
    }

    await trx.insertInto('communicationConsentEvent').values({
      id: uuidv4(),
      consentId: consent.id,
      galleryId: input.galleryId,
      personId: input.personId,
      channel: input.channel,
      status: input.status,
      disclosureVersion: CONSENT_DISCLOSURE_VERSION,
      source: input.source,
      ipAddress: input.ipAddress ?? null,
      userAgent: input.userAgent ?? null,
      createdAt: now,
    }).execute()
    return consent
  })
}

export async function setGalleryConsents(input: {
  galleryId: string
  personId: string
  emailOptIn: boolean
  smsOptIn: boolean
  source: string
  ipAddress?: string | null
  userAgent?: string | null
}): Promise<CommunicationConsent[]> {
  const choices = ([
    ['email', input.emailOptIn],
    ['sms', input.smsOptIn],
  ] as const)
  const consents: CommunicationConsent[] = []
  for (const [channel, optedIn] of choices) {
    consents.push(await upsertConsent({
      galleryId: input.galleryId,
      personId: input.personId,
      channel,
      status: optedIn ? 'opted_in' : 'opted_out',
      source: input.source,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
    }))
  }
  return consents
}

export async function selectGalleryConsents(galleryId: string, personId: string): Promise<CommunicationConsent[]> {
  return db.selectFrom('communicationConsent')
    .where('galleryId', '=', galleryId)
    .where('personId', '=', personId)
    .selectAll()
    .execute()
}

export async function suppressDestination(channel: CommunicationChannel, destination: string, reason: string): Promise<void> {
  const now = new Date()
  const destinationHash = hashDestination(canonicalDestination(channel, destination))
  await db.insertInto('communicationSuppression').values({
    id: uuidv4(),
    channel,
    destinationHash,
    reason,
    active: true,
    createdAt: now,
    updatedAt: now,
  }).onConflict((oc) => oc.columns(['channel', 'destinationHash']).doUpdateSet({
    reason,
    active: true,
    updatedAt: now,
  })).execute()
}

export async function unsuppressDestination(channel: CommunicationChannel, destination: string): Promise<void> {
  await db.updateTable('communicationSuppression')
    .set({ active: false, updatedAt: new Date() })
    .where('channel', '=', channel)
    .where('destinationHash', '=', hashDestination(canonicalDestination(channel, destination)))
    .execute()
}

export async function isDestinationSuppressed(channel: CommunicationChannel, destination: string): Promise<boolean> {
  const row = await db.selectFrom('communicationSuppression')
    .where('channel', '=', channel)
    .where('destinationHash', '=', hashDestination(canonicalDestination(channel, destination)))
    .where('active', '=', true)
    .select('id')
    .executeTakeFirst()
  return Boolean(row)
}

export async function optOutDestinationGlobally(channel: CommunicationChannel, destination: string, reason: string): Promise<void> {
  await suppressDestination(channel, destination, reason)
  const normalized = channel === 'email' ? normalizeEmail(destination) : normalizeUsPhone(destination)
  if (!normalized) return

  const destinationMatch = channel === 'email'
    ? sql<boolean>`lower(trim(${sql.ref('person.email')})) = ${normalized}`
    : sql<boolean>`right(regexp_replace(${sql.ref('person.phone')}, '[^0-9]', '', 'g'), 10) = ${normalized.slice(-10)}`
  const people = await db.selectFrom('person')
    .where(destinationMatch)
    .select('id')
    .execute()
  const personIds = people.map((person) => person.id)
  if (!personIds.length) return

  const consents = await db.selectFrom('communicationConsent')
    .where('channel', '=', channel)
    .where('personId', 'in', personIds)
    .selectAll()
    .execute()
  for (const consent of consents) {
    await upsertConsent({
      galleryId: consent.galleryId,
      personId: consent.personId,
      channel,
      status: 'opted_out',
      source: reason,
    })
  }
}

export async function optOutPersonChannelConsents(personId: string, channel: CommunicationChannel, source: string): Promise<void> {
  const consents = await db.selectFrom('communicationConsent')
    .where('personId', '=', personId)
    .where('channel', '=', channel)
    .where('status', '=', 'opted_in')
    .selectAll()
    .execute()
  for (const consent of consents) {
    await upsertConsent({
      galleryId: consent.galleryId,
      personId,
      channel,
      status: 'opted_out',
      source,
    })
  }
}

export async function isGalleryMember(galleryId: string, personId: string): Promise<boolean> {
  const row = await db.selectFrom('galleryPerson')
    .where('galleryId', '=', galleryId)
    .where('personId', '=', personId)
    .select('personId')
    .executeTakeFirst()
  return Boolean(row)
}

export interface EligibleReminderRecipient {
  personId: string
  name: string
  email: string | null
  phone: string | null
}

export async function selectEligibleRecipients(galleryId: string, channel: CommunicationChannel): Promise<EligibleReminderRecipient[]> {
  const rows = await db.selectFrom('galleryPerson')
    .innerJoin('person', 'person.id', 'galleryPerson.personId')
    .innerJoin('communicationConsent', (join) => join
      .onRef('communicationConsent.galleryId', '=', 'galleryPerson.galleryId')
      .onRef('communicationConsent.personId', '=', 'galleryPerson.personId')
      .on('communicationConsent.channel', '=', channel)
      .on('communicationConsent.status', '=', 'opted_in'))
    .where('galleryPerson.galleryId', '=', galleryId)
    .select([
      'person.id as personId',
      'person.name as name',
      'person.email as email',
      'person.phone as phone',
    ])
    .execute()

  return rows.map((row) => ({
    personId: row.personId,
    name: row.name,
    email: normalizeEmail(row.email),
    phone: normalizeUsPhone(row.phone),
  }))
}

export async function isRecipientEligible(galleryId: string, personId: string, channel: CommunicationChannel): Promise<boolean> {
  const row = await db.selectFrom('galleryPerson')
    .innerJoin('communicationConsent', (join) => join
      .onRef('communicationConsent.galleryId', '=', 'galleryPerson.galleryId')
      .onRef('communicationConsent.personId', '=', 'galleryPerson.personId')
      .on('communicationConsent.channel', '=', channel)
      .on('communicationConsent.status', '=', 'opted_in'))
    .where('galleryPerson.galleryId', '=', galleryId)
    .where('galleryPerson.personId', '=', personId)
    .select('galleryPerson.personId')
    .executeTakeFirst()
  return Boolean(row)
}

export async function countGallerySmsMessages(galleryId: string, personId: string): Promise<number> {
  const row = await db.selectFrom('reminderDelivery')
    .where('galleryId', '=', galleryId)
    .where('personId', '=', personId)
    .where('channel', '=', 'sms')
    .where('status', 'in', ['pending', 'submitting', 'submitted', 'delivered', 'unknown', 'failed'])
    .select((eb) => eb.fn.countAll<number>().as('count'))
    .executeTakeFirst()
  return Number(row?.count ?? 0)
}

export async function countEligibleReminderRecipients(galleryId: string, channel: CommunicationChannel): Promise<number> {
  const recipients = await selectEligibleRecipients(galleryId, channel)
  let count = 0
  for (let index = 0; index < recipients.length; index += 25) {
    const eligibility = await Promise.all(recipients.slice(index, index + 25).map(async (recipient) => {
      const destination = channel === 'email' ? recipient.email : recipient.phone
      if (!destination || await isDestinationSuppressed(channel, destination)) return false
      if (channel === 'sms') {
        return await countGallerySmsMessages(galleryId, recipient.personId) < SMS_MESSAGE_LIMIT
      }
      return true
    }))
    count += eligibility.filter(Boolean).length
  }
  return count
}
