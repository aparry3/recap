import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

const mocks = vi.hoisted(() => ({
  consumeVerification: vi.fn(),
  consumeVerificationAndCreateGallery: vi.fn(),
  selectGallery: vi.fn(),
  selectPerson: vi.fn(),
  setAuthSessionCookie: vi.fn(),
  verifyGalleryCreationToken: vi.fn(),
  cookieSet: vi.fn(),
  sendCreationEmail: vi.fn(),
  sendOrderNotification: vi.fn(),
  handleWeddingWebsites: vi.fn(),
}))

vi.mock('@/lib/auth/session', () => ({setAuthSessionCookie: mocks.setAuthSessionCookie}))
vi.mock('@/lib/auth/galleryCreationToken', () => ({verifyGalleryCreationToken: mocks.verifyGalleryCreationToken}))
vi.mock('@/lib/db/galleryService', () => ({selectGallery: mocks.selectGallery}))
vi.mock('@/lib/db/personService', () => ({
  consumeVerification: mocks.consumeVerification,
  consumeVerificationAndCreateGallery: mocks.consumeVerificationAndCreateGallery,
  selectPerson: mocks.selectPerson,
}))
vi.mock('@/lib/email', () => ({
  emailClient: {
    sendCreationEmail: mocks.sendCreationEmail,
    sendOrderNotification: mocks.sendOrderNotification,
  },
}))
vi.mock('@/lib/web', () => ({handleWeddingWebsites: mocks.handleWeddingWebsites}))
vi.mock('next/headers', () => ({cookies: async () => ({set: mocks.cookieSet})}))

import { POST } from '@/app/api/auth/verify/[verificationId]/route'

describe('email verification redirects', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.setAuthSessionCookie.mockResolvedValue(undefined)
    mocks.sendCreationEmail.mockResolvedValue(true)
    mocks.sendOrderNotification.mockResolvedValue(true)
  })

  it('uses See Other so a verification POST becomes a GET to galleries', async () => {
    mocks.consumeVerification.mockResolvedValue({personId: 'person-1'})
    mocks.selectPerson.mockResolvedValue({id: 'person-1', isAdmin: false})
    const request = new NextRequest('https://ourweddingrecap.com/api/auth/verify/verification-1', {method: 'POST'})

    const response = await POST(request, {params: Promise.resolve({verificationId: 'verification-1'})})

    expect(response.status).toBe(303)
    expect(new URL(response.headers.get('location')!).pathname).toBe('/galleries')
  })

  it('creates and redirects directly to the gallery represented by the signed email link', async () => {
    const pendingGallery = {
      personId: 'person-1',
      personName: 'Taylor',
      name: 'Taylor & Morgan',
      path: 'taylor-&-morgan',
      password: 'A1B2',
      expiresAt: Math.floor(Date.now() / 1000) + 3600,
    }
    mocks.verifyGalleryCreationToken.mockReturnValue(pendingGallery)
    mocks.consumeVerificationAndCreateGallery.mockResolvedValue({
      verification: {personId: 'person-1'},
      gallery: {id: 'gallery-1', path: pendingGallery.path, password: pendingGallery.password},
      person: {id: 'person-1', name: 'Taylor', email: 'taylor@example.com'},
    })
    const request = new NextRequest('https://ourweddingrecap.com/api/auth/verify/verification-1?gallery=signed-token', {method: 'POST'})

    const response = await POST(request, {params: Promise.resolve({verificationId: 'verification-1'})})

    expect(mocks.consumeVerificationAndCreateGallery).toHaveBeenCalledWith('verification-1', pendingGallery)
    expect(response.status).toBe(303)
    expect(new URL(response.headers.get('location')!).pathname).toBe('/taylor-&-morgan')
  })
})
