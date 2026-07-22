import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createGalleryCreationToken, verifyGalleryCreationToken } from '@/lib/auth/galleryCreationToken'

describe('gallery creation verification tokens', () => {
  const originalSecret = process.env.AUTH_SESSION_SECRET
  const input = {
    personId: '4c474643-2a7f-4f62-9237-2901a2b55f8b',
    personName: 'Taylor Example',
    name: 'Taylor & Morgan',
    path: 'taylor-&-morgan',
    password: 'A1B2',
    theknot: 'https://www.theknot.com/example',
  }

  beforeEach(() => {
    process.env.AUTH_SESSION_SECRET = 'test-session-secret-with-sufficient-entropy'
  })

  afterEach(() => {
    vi.restoreAllMocks()
    if (originalSecret === undefined) delete process.env.AUTH_SESSION_SECRET
    else process.env.AUTH_SESSION_SECRET = originalSecret
  })

  it('round trips a signed gallery request', () => {
    const token = createGalleryCreationToken(input)
    expect(verifyGalleryCreationToken(token)).toMatchObject(input)
  })

  it('rejects tampered and expired gallery requests', () => {
    const token = createGalleryCreationToken(input)
    expect(verifyGalleryCreationToken(`${token.slice(0, -1)}x`)).toBeNull()

    vi.spyOn(Date, 'now').mockReturnValue(Date.now() + 25 * 60 * 60 * 1000)
    expect(verifyGalleryCreationToken(token)).toBeNull()
  })
})
