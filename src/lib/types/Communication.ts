import { Insertable, Selectable, Updateable } from 'kysely'

export type CommunicationChannel = 'email' | 'sms'
export type ConsentStatus = 'opted_in' | 'opted_out'

export interface CommunicationConsentTable {
  id: string
  galleryId: string
  personId: string
  channel: CommunicationChannel
  status: ConsentStatus
  disclosureVersion: string
  source: string
  ipAddress: string | null
  userAgent: string | null
  createdAt: Date
  updatedAt: Date
}

export interface CommunicationSuppressionTable {
  id: string
  channel: CommunicationChannel
  destinationHash: string
  reason: string
  active: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CommunicationConsentEventTable {
  id: string
  consentId: string
  galleryId: string
  personId: string
  channel: CommunicationChannel
  status: ConsentStatus
  disclosureVersion: string
  source: string
  ipAddress: string | null
  userAgent: string | null
  createdAt: Date
}

export type CommunicationConsent = Selectable<CommunicationConsentTable>
export type NewCommunicationConsent = Insertable<CommunicationConsentTable>
export type CommunicationConsentUpdate = Updateable<CommunicationConsentTable>
export type CommunicationSuppression = Selectable<CommunicationSuppressionTable>
export type NewCommunicationSuppression = Insertable<CommunicationSuppressionTable>
export type CommunicationConsentEvent = Selectable<CommunicationConsentEventTable>
export type NewCommunicationConsentEvent = Insertable<CommunicationConsentEventTable>
