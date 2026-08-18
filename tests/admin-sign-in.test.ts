import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {NextRequest} from 'next/server'

const mocks = vi.hoisted(() => ({
  insertVerification: vi.fn(),
  selectAdminPersonByEmail: vi.fn(),
  sendAdminSignInEmail: vi.fn(),
}))

vi.mock('@/lib/db/personService', () => ({
  insertVerification: mocks.insertVerification,
  selectAdminPersonByEmail: mocks.selectAdminPersonByEmail,
}))
vi.mock('@/lib/email', () => ({
  emailClient: {sendAdminSignInEmail: mocks.sendAdminSignInEmail},
}))

import {POST} from '@/app/api/admin/sign-in/route'

describe('admin sign in', () => {
  const originalBaseUrl = process.env.BASE_URL

  beforeEach(() => {
    vi.clearAllMocks()
    process.env.BASE_URL = 'https://ourweddingrecap.com'
    mocks.selectAdminPersonByEmail.mockResolvedValue({
      id: 'admin-1',
      name: 'Taylor Parry',
      email: 'momentstomems@gmail.com',
      isAdmin: true,
    })
    mocks.insertVerification.mockResolvedValue({id: 'verification-1', personId: 'admin-1'})
    mocks.sendAdminSignInEmail.mockResolvedValue(true)
  })

  afterEach(() => {
    if (originalBaseUrl === undefined) delete process.env.BASE_URL
    else process.env.BASE_URL = originalBaseUrl
  })

  it('uses the admin-only lookup when duplicate guest records share the email', async () => {
    const request = new NextRequest('https://ourweddingrecap.com/api/admin/sign-in', {
      method: 'POST',
      body: JSON.stringify({email: ' MomentstoMems@gmail.com '}),
    })

    const response = await POST(request)

    expect(response.status).toBe(200)
    expect(mocks.selectAdminPersonByEmail).toHaveBeenCalledWith('MomentstoMems@gmail.com')
    expect(mocks.insertVerification).toHaveBeenCalledWith('admin-1')
    expect(mocks.sendAdminSignInEmail).toHaveBeenCalledWith({
      name: 'Taylor Parry',
      email: 'momentstomems@gmail.com',
      verificationUrl: 'https://ourweddingrecap.com/admin/verify/verification-1',
    })
  })

  it('keeps the response generic when the email does not belong to an admin', async () => {
    mocks.selectAdminPersonByEmail.mockRejectedValue(new Error('No result'))
    const request = new NextRequest('https://ourweddingrecap.com/api/admin/sign-in', {
      method: 'POST',
      body: JSON.stringify({email: 'guest@example.com'}),
    })

    const response = await POST(request)

    expect(response.status).toBe(200)
    expect(mocks.insertVerification).not.toHaveBeenCalled()
    expect(mocks.sendAdminSignInEmail).not.toHaveBeenCalled()
    await expect(response.json()).resolves.toEqual({
      message: 'If that email belongs to an admin, a secure sign-in link is on its way.',
    })
  })
})
