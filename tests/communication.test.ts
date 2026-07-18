import { describe, expect, it } from 'vitest'
import { normalizeEmail, normalizeUsPhone } from '@/lib/db/communicationService'
import { createPreferenceToken, verifyPreferenceToken } from '@/lib/preferences'
import { createAuthSessionToken, verifyAuthSessionToken } from '@/lib/auth/session'

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
