import { createHmac, timingSafeEqual } from 'crypto'

interface PreferenceTokenPayload {
  galleryId: string
  personId: string
  expiresAt: number
}

function secret(): string {
  const value = process.env.PREFERENCE_TOKEN_SECRET || process.env.AUTH_SESSION_SECRET
  if (value) return value
  if (process.env.NODE_ENV === 'production') throw new Error('PREFERENCE_TOKEN_SECRET or AUTH_SESSION_SECRET is required')
  return 'recap-local-development-preference-secret'
}

function signature(payload: string): string {
  return createHmac('sha256', secret()).update(payload).digest('base64url')
}

export function createPreferenceToken(galleryId: string, personId: string): string {
  const payload: PreferenceTokenPayload = {
    galleryId,
    personId,
    expiresAt: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365,
  }
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url')
  return `${encoded}.${signature(encoded)}`
}

export function verifyPreferenceToken(token: string): PreferenceTokenPayload | null {
  try {
    const [encoded, actualSignature] = token.split('.')
    if (!encoded || !actualSignature) return null
    const expected = Uint8Array.from(Buffer.from(signature(encoded)))
    const actual = Uint8Array.from(Buffer.from(actualSignature))
    if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString()) as PreferenceTokenPayload
    if (!payload.galleryId || !payload.personId || payload.expiresAt <= Math.floor(Date.now() / 1000)) return null
    return payload
  } catch {
    return null
  }
}

export function preferenceUrl(galleryId: string, personId: string): string {
  const baseUrl = process.env.BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  return `${baseUrl}/preferences/${createPreferenceToken(galleryId, personId)}`
}
