import { createHmac, timingSafeEqual } from 'crypto'
import { z } from 'zod'

const TOKEN_DURATION_SECONDS = 60 * 60 * 24

const pendingGalleryCreationSchema = z.object({
  personId: z.string().uuid(),
  personName: z.string().trim().min(1).max(200),
  name: z.string().trim().min(1).max(200),
  path: z.string().min(1).max(200),
  password: z.string().min(4).max(32),
  theknot: z.string().max(2048).optional(),
  zola: z.string().max(2048).optional(),
  expiresAt: z.number().int().positive(),
}).strict()

export type PendingGalleryCreation = z.infer<typeof pendingGalleryCreationSchema>
export type NewPendingGalleryCreation = Omit<PendingGalleryCreation, 'expiresAt'>

function secret(): string {
  const value = process.env.AUTH_SESSION_SECRET
  if (value) return value
  if (process.env.NODE_ENV === 'production') throw new Error('AUTH_SESSION_SECRET is required in production')
  return 'recap-local-development-session-secret'
}

function signature(payload: string): string {
  return createHmac('sha256', secret()).update(payload).digest('base64url')
}

export function createGalleryCreationToken(input: NewPendingGalleryCreation): string {
  const payload: PendingGalleryCreation = {
    ...input,
    expiresAt: Math.floor(Date.now() / 1000) + TOKEN_DURATION_SECONDS,
  }
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url')
  return `${encoded}.${signature(encoded)}`
}

export function verifyGalleryCreationToken(token: string): PendingGalleryCreation | null {
  try {
    const [encoded, actualSignature] = token.split('.')
    if (!encoded || !actualSignature) return null
    const expected = Uint8Array.from(Buffer.from(signature(encoded)))
    const actual = Uint8Array.from(Buffer.from(actualSignature))
    if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null

    const parsed = pendingGalleryCreationSchema.safeParse(JSON.parse(Buffer.from(encoded, 'base64url').toString()))
    if (!parsed.success || parsed.data.expiresAt <= Math.floor(Date.now() / 1000)) return null
    return parsed.data
  } catch {
    return null
  }
}
