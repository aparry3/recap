import { createHmac, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'

const SESSION_COOKIE = 'recapSession'
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 90

function getSessionSecret(): string {
  const secret = process.env.AUTH_SESSION_SECRET
  if (secret) return secret
  if (process.env.NODE_ENV === 'production') {
    throw new Error('AUTH_SESSION_SECRET is required in production')
  }
  return 'recap-local-development-session-secret'
}

function sign(payload: string): string {
  return createHmac('sha256', getSessionSecret()).update(payload).digest('base64url')
}

export function createAuthSessionToken(personId: string): string {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS
  const payload = `${personId}.${expiresAt}`
  return `${payload}.${sign(payload)}`
}

export function verifyAuthSessionToken(token?: string): string | null {
  if (!token) return null
  const [personId, expiresAtString, signature] = token.split('.')
  if (!personId || !expiresAtString || !signature) return null
  const expiresAt = Number(expiresAtString)
  if (!Number.isFinite(expiresAt) || expiresAt <= Math.floor(Date.now() / 1000)) return null

  const payload = `${personId}.${expiresAtString}`
  const expected = Uint8Array.from(Buffer.from(sign(payload)))
  const actual = Uint8Array.from(Buffer.from(signature))
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null
  return personId
}

export async function setAuthSessionCookie(personId: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, createAuthSessionToken(personId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION_SECONDS,
    path: '/',
  })
}

export async function getAuthenticatedPersonId(): Promise<string | null> {
  const cookieStore = await cookies()
  return verifyAuthSessionToken(cookieStore.get(SESSION_COOKIE)?.value)
}
