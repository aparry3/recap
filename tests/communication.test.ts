import { describe, expect, it } from 'vitest'
import { normalizeEmail, normalizeUsPhone, smsReservationExceedsLimit } from '@/lib/db/communicationService'
import { createPreferenceToken, verifyPreferenceToken } from '@/lib/preferences'
import { createAuthSessionToken, verifyAuthSessionToken } from '@/lib/auth/session'
import { newGuestPersonSchema, personContactUpdateSchema } from '@/lib/validation/person'

describe('communication normalization', () => {
  it('normalizes email addresses', () => {
    expect(normalizeEmail('  Guest@Example.COM ')).toBe('guest@example.com')
    expect(normalizeEmail('')).toBeNull()
  })

  it('normalizes supported US phone formats to E.164', () => {
    expect(normalizeUsPhone('(617) 555-0123')).toBe('+16175550123')
    expect(normalizeUsPhone('1-617-555-0123')).toBe('+16175550123')
    expect(normalizeUsPhone('555')).toBeNull()
  })

  it('allows exactly ten reserved SMS messages and rejects the eleventh', () => {
    expect(smsReservationExceedsLimit(10)).toBe(false)
    expect(smsReservationExceedsLimit(11)).toBe(true)
  })
})

describe('signed tokens', () => {
  it('round trips preference tokens and rejects tampering', () => {
    const token = createPreferenceToken('gallery-1', 'person-1')
    expect(verifyPreferenceToken(token)).toMatchObject({ galleryId: 'gallery-1', personId: 'person-1' })
    expect(verifyPreferenceToken(`${token}tampered`)).toBeNull()
  })

  it('round trips auth sessions and rejects tampering', () => {
    const token = createAuthSessionToken('person-1')
    expect(verifyAuthSessionToken(token)).toBe('person-1')
    expect(verifyAuthSessionToken(`${token}tampered`)).toBeNull()
  })
})

describe('guest profile updates', () => {
  it('accepts contact fields and rejects privilege changes', () => {
    expect(personContactUpdateSchema.parse({ name: 'Guest', phone: '(617) 555-0123' })).toMatchObject({ name: 'Guest' })
    expect(() => personContactUpdateSchema.parse({ isAdmin: true })).toThrow()
    expect(newGuestPersonSchema.parse({ name: 'Guest', isAdmin: false })).toMatchObject({ isAdmin: false })
    expect(newGuestPersonSchema.parse({ name: 'Guest', email: '', phone: '' })).toEqual({ name: 'Guest' })
    expect(() => newGuestPersonSchema.parse({ name: 'Guest', isAdmin: true })).toThrow()
  })
})
