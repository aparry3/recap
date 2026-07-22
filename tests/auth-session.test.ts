import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createAuthSessionToken, verifyAuthSessionToken } from '@/lib/auth/session'

describe('signed auth sessions', () => {
  const originalSecret = process.env.AUTH_SESSION_SECRET

  beforeEach(() => {
    process.env.AUTH_SESSION_SECRET = 'test-session-secret-with-sufficient-entropy'
  })

  afterEach(() => {
    vi.restoreAllMocks()
    if (originalSecret === undefined) delete process.env.AUTH_SESSION_SECRET
    else process.env.AUTH_SESSION_SECRET = originalSecret
  })

  it('accepts a signed, unexpired session', () => {
    const token = createAuthSessionToken('person-123')
    expect(verifyAuthSessionToken(token)).toBe('person-123')
  })

  it('does not accept a tampered browser identifier as a session', () => {
    const token = createAuthSessionToken('person-123')
    expect(verifyAuthSessionToken(token.replace('person-123', 'person-456'))).toBeNull()
    expect(verifyAuthSessionToken('person-123')).toBeNull()
  })

  it('rejects expired sessions', () => {
    vi.spyOn(Date, 'now').mockReturnValue(Date.now() + 91 * 24 * 60 * 60 * 1000)
    expect(verifyAuthSessionToken(createAuthSessionToken('person-123'))).toBe('person-123')
    vi.restoreAllMocks()

    const token = createAuthSessionToken('person-123')
    vi.spyOn(Date, 'now').mockReturnValue(Date.now() + 91 * 24 * 60 * 60 * 1000)
    expect(verifyAuthSessionToken(token)).toBeNull()
  })
})
