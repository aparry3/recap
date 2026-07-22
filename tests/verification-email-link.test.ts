import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

const mocks = vi.hoisted(() => ({
  insertVerification: vi.fn(),
  selectPerson: vi.fn(),
  sendVerificationEmail: vi.fn(),
}))

vi.mock('@/lib/db/personService', () => ({
  insertVerification: mocks.insertVerification,
  selectPerson: mocks.selectPerson,
}))
vi.mock('@/lib/email', () => ({
  emailClient: {sendVerificationEmail: mocks.sendVerificationEmail},
}))

import { POST } from '@/app/api/verifications/route'

describe('verification email links', () => {
  const originalBaseUrl = process.env.BASE_URL
  const originalSecret = process.env.AUTH_SESSION_SECRET
  const personId = '4c474643-2a7f-4f62-9237-2901a2b55f8b'

  beforeEach(() => {
    vi.clearAllMocks()
    process.env.BASE_URL = 'https://ourweddingrecap.com'
    process.env.AUTH_SESSION_SECRET = 'test-session-secret-with-sufficient-entropy'
    mocks.selectPerson.mockResolvedValue({id: personId, name: 'Taylor', email: 'taylor@example.com'})
    mocks.insertVerification.mockResolvedValue({id: 'verification-1', personId})
    mocks.sendVerificationEmail.mockResolvedValue(true)
  })

  afterEach(() => {
    if (originalBaseUrl === undefined) delete process.env.BASE_URL
    else process.env.BASE_URL = originalBaseUrl
    if (originalSecret === undefined) delete process.env.AUTH_SESSION_SECRET
    else process.env.AUTH_SESSION_SECRET = originalSecret
  })

  it('includes a signed gallery creation intent for a new-gallery verification', async () => {
    const request = new NextRequest('https://ourweddingrecap.com/api/verifications', {
      method: 'POST',
      body: JSON.stringify({
        personId,
        galleryName: 'Taylor & Morgan',
        email: 'taylor@example.com',
        name: 'Taylor',
        createGallery: true,
      }),
    })

    const response = await POST(request)

    expect(response.status).toBe(200)
    const emailData = mocks.sendVerificationEmail.mock.calls[0][1]
    const verificationUrl = new URL(emailData.buttonUrl)
    expect(verificationUrl.pathname).toBe('/verification/verification-1')
    expect(verificationUrl.searchParams.get('gallery')).toBeTruthy()
  })

  it('does not mistake a guest verification for a request to create another gallery', async () => {
    const request = new NextRequest('https://ourweddingrecap.com/api/verifications', {
      method: 'POST',
      body: JSON.stringify({
        personId,
        galleryName: 'An Existing Gallery',
        email: 'taylor@example.com',
        name: 'Taylor',
        createGallery: false,
      }),
    })

    const response = await POST(request)

    expect(response.status).toBe(200)
    const emailData = mocks.sendVerificationEmail.mock.calls[0][1]
    expect(new URL(emailData.buttonUrl).searchParams.has('gallery')).toBe(false)
  })
})
