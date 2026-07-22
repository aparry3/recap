import { describe, expect, it } from 'vitest'
import { SUPPRESSING_EVENT_TYPES, extractResendTag, firstRecipient, mapResendEventToDeliveryStatus } from '@/lib/email/resend'

describe('Resend event mapping', () => {
  it.each([
    ['email.sent', 'submitted'],
    ['email.delivered', 'delivered'],
    ['email.delivery_delayed', 'unknown'],
    ['email.bounced', 'failed'],
    ['email.complained', 'failed'],
    ['email.failed', 'failed'],
    ['email.suppressed', 'suppressed'],
  ])('maps %s to delivery status %s', (event, status) => {
    expect(mapResendEventToDeliveryStatus(event)).toBe(status)
  })

  it.each(['email.opened', 'email.clicked', 'email.received', 'contact.created', 'unknown.event'])(
    'ignores %s',
    (event) => expect(mapResendEventToDeliveryStatus(event)).toBeNull(),
  )

  it('only suppresses destinations for bounces and complaints', () => {
    expect(SUPPRESSING_EVENT_TYPES.has('email.bounced')).toBe(true)
    expect(SUPPRESSING_EVENT_TYPES.has('email.complained')).toBe(true)
    expect(SUPPRESSING_EVENT_TYPES.has('email.failed')).toBe(false)
    expect(SUPPRESSING_EVENT_TYPES.has('email.delivered')).toBe(false)
  })
})

describe('Resend webhook payload extraction', () => {
  it('reads tags in the array shape', () => {
    expect(extractResendTag([{ name: 'delivery_id', value: 'delivery-1' }], 'delivery_id')).toBe('delivery-1')
    expect(extractResendTag([{ name: 'other', value: 'x' }], 'delivery_id')).toBeUndefined()
  })

  it('reads tags in the record shape', () => {
    expect(extractResendTag({ delivery_id: 'delivery-2' }, 'delivery_id')).toBe('delivery-2')
    expect(extractResendTag({ other: 'x' }, 'delivery_id')).toBeUndefined()
  })

  it('tolerates missing or malformed tags', () => {
    expect(extractResendTag(undefined, 'delivery_id')).toBeUndefined()
    expect(extractResendTag(null, 'delivery_id')).toBeUndefined()
    expect(extractResendTag('garbage', 'delivery_id')).toBeUndefined()
    expect(extractResendTag([{ name: 'delivery_id', value: 42 }], 'delivery_id')).toBeUndefined()
    expect(extractResendTag({ delivery_id: 42 }, 'delivery_id')).toBeUndefined()
  })

  it('extracts the first recipient from string or array', () => {
    expect(firstRecipient('guest@example.com')).toBe('guest@example.com')
    expect(firstRecipient(['a@example.com', 'b@example.com'])).toBe('a@example.com')
    expect(firstRecipient([])).toBeUndefined()
    expect(firstRecipient(undefined)).toBeUndefined()
  })
})
