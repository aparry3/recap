import { afterEach, describe, expect, it, vi } from 'vitest'
import { buildTwilioStatusCallbackUrl, downloadTwilioMedia } from '@/lib/sms'

afterEach(() => {
  vi.unstubAllGlobals()
  delete process.env.TWILIO_API_KEY
  delete process.env.TWILIO_API_SECRET
  delete process.env.TWILIO_ACCOUNT_SID
  delete process.env.TWILIO_AUTH_TOKEN
  delete process.env.BASE_URL
  delete process.env.VERCEL_ENV
  delete process.env.VERCEL_AUTOMATION_BYPASS_SECRET
})

describe('Twilio status callback URLs', () => {
  it('adds the Vercel automation bypass only for protected preview deployments', () => {
    process.env.BASE_URL = 'https://staging.ourweddingrecap.com'
    process.env.VERCEL_ENV = 'preview'
    process.env.VERCEL_AUTOMATION_BYPASS_SECRET = 'preview-secret'

    const callback = new URL(buildTwilioStatusCallbackUrl('delivery-1'))
    expect(callback.pathname).toBe('/api/webhooks/twilio/status')
    expect(callback.searchParams.get('deliveryId')).toBe('delivery-1')
    expect(callback.searchParams.get('x-vercel-protection-bypass')).toBe('preview-secret')
  })

  it('never leaks a configured bypass secret into a production callback', () => {
    process.env.BASE_URL = 'https://www.ourweddingrecap.com'
    process.env.VERCEL_ENV = 'production'
    process.env.VERCEL_AUTOMATION_BYPASS_SECRET = 'preview-secret'

    const callback = new URL(buildTwilioStatusCallbackUrl('delivery-2'))
    expect(callback.searchParams.get('deliveryId')).toBe('delivery-2')
    expect(callback.searchParams.has('x-vercel-protection-bypass')).toBe(false)
  })
})

describe('Twilio media downloads', () => {
  it('rejects media URLs outside the Twilio API host', async () => {
    await expect(downloadTwilioMedia('https://example.com/photo.jpg'))
      .rejects.toThrow('unexpected media URL')
  })

  it('uses production API key credentials and returns provider media bytes', async () => {
    process.env.TWILIO_API_KEY = 'SK_test'
    process.env.TWILIO_API_SECRET = 'secret_test'
    const fetchMock = vi.fn().mockResolvedValue(new Response(new Uint8Array([1, 2, 3]), {
      status: 200,
      headers: { 'Content-Type': 'image/jpeg' },
    }))
    vi.stubGlobal('fetch', fetchMock)

    const result = await downloadTwilioMedia('https://api.twilio.com/2010-04-01/Accounts/AC1/Messages/MM1/Media/ME1')

    expect(Array.from(result.data)).toEqual([1, 2, 3])
    expect(result.contentType).toBe('image/jpeg')
    expect(fetchMock).toHaveBeenCalledWith(expect.any(URL), {
      headers: { Authorization: `Basic ${Buffer.from('SK_test:secret_test').toString('base64')}` },
    })
  })
})
