import { Insertable, JSONColumnType, Selectable, Updateable } from 'kysely'
import { CommunicationChannel } from './Communication'

export type ReminderStatus = 'draft' | 'scheduled' | 'sending' | 'sent' | 'canceled'
export type ReminderSource = 'manual' | 'prompt' | 'invitation' | 'theknot' | 'zola'
export type DeliveryStatus = 'pending' | 'submitted' | 'delivered' | 'failed' | 'suppressed' | 'unknown'
export type DeliveryPurpose = 'consent_confirmation' | 'reminder'

export interface ReminderSourceDetails {
  evidence?: string[]
  warnings?: string[]
  prompt?: string
  websiteUrl?: string
  fileName?: string
}

export interface ReminderTable {
  id: string
  galleryId: string
  createdBy: string
  title: string
  sendAt: Date | null
  status: ReminderStatus
  sendEmail: boolean
  sendSms: boolean
  emailSubject: string | null
  emailBody: string | null
  smsBody: string | null
  source: ReminderSource
  sourceDetails: JSONColumnType<ReminderSourceDetails, ReminderSourceDetails, ReminderSourceDetails> | null
  version: number
  createdAt: Date
  updatedAt: Date
  sentAt: Date | null
}

export interface ReminderDeliveryTable {
  id: string
  reminderId: string | null
  galleryId: string
  personId: string
  channel: CommunicationChannel
  purpose: DeliveryPurpose
  status: DeliveryStatus
  providerMessageId: string | null
  idempotencyKey: string
  attemptCount: number
  lastError: string | null
  createdAt: Date
  updatedAt: Date
  submittedAt: Date | null
  deliveredAt: Date | null
}

export type Reminder = Selectable<ReminderTable>
export type NewReminder = Insertable<ReminderTable>
export type ReminderUpdate = Updateable<ReminderTable>
export type ReminderDelivery = Selectable<ReminderDeliveryTable>
export type NewReminderDelivery = Insertable<ReminderDeliveryTable>
export type ReminderDeliveryUpdate = Updateable<ReminderDeliveryTable>

export interface ReminderDraftInput {
  title: string
  sendAt?: string | null
  sendEmail: boolean
  sendSms: boolean
  emailSubject?: string | null
  emailBody?: string | null
  smsBody?: string | null
  source?: ReminderSource
  sourceDetails?: ReminderSourceDetails | null
}

export interface GeneratedReminderDraft extends ReminderDraftInput {
  sendAtLocal: string | null
  timezone: string
  evidence: string[]
  warnings: string[]
}
