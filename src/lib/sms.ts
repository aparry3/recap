import twilio, { Twilio } from 'twilio'

const MAX_TWILIO_MEDIA_BYTES = 30 * 1024 * 1024

let client: Twilio | null = null

function getClient(): Twilio {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  if (!accountSid || !authToken || !process.env.TWILIO_MESSAGING_SERVICE_SID) {
    throw new Error('Twilio messaging environment variables are not configured')
  }
  client ??= twilio(accountSid, authToken)
  return client
}

export async function sendSms(input: { to: string; body: string; deliveryId: string }): Promise<string> {
  const message = await getClient().messages.create({
    to: input.to,
    messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID,
    body: input.body,
    statusCallback: buildTwilioStatusCallbackUrl(input.deliveryId),
  })
  return message.sid
}

export function buildTwilioStatusCallbackUrl(deliveryId: string): string {
  if (!process.env.BASE_URL) throw new Error('BASE_URL is required for Twilio status callbacks')
  const statusCallback = new URL('/api/webhooks/twilio/status', process.env.BASE_URL)
  if (process.env.VERCEL_ENV === 'preview' && process.env.VERCEL_AUTOMATION_BYPASS_SECRET) {
    statusCallback.searchParams.set('x-vercel-protection-bypass', process.env.VERCEL_AUTOMATION_BYPASS_SECRET)
  }
  statusCallback.searchParams.set('deliveryId', deliveryId)
  return statusCallback.toString()
}

export function validateTwilioWebhook(signature: string | null, url: string, params: Record<string, string>): boolean {
  const authToken = process.env.TWILIO_AUTH_TOKEN
  if (!authToken || !signature) return false
  return twilio.validateRequest(authToken, signature, url, params)
}

export async function downloadTwilioMedia(mediaUrl: string): Promise<{ data: Uint8Array; contentType: string }> {
  const url = new URL(mediaUrl)
  if (
    url.protocol !== 'https:'
    || url.hostname !== 'api.twilio.com'
    || !/^\/2010-04-01\/Accounts\/[^/]+\/Messages\/[^/]+\/Media\/[^/]+$/.test(url.pathname)
  ) {
    throw new Error('Twilio supplied an unexpected media URL')
  }
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const apiKey = process.env.TWILIO_API_KEY
  const apiSecret = process.env.TWILIO_API_SECRET
  const username = apiKey && apiSecret ? apiKey : accountSid
  const password = apiKey && apiSecret ? apiSecret : authToken
  if (!username || !password) throw new Error('Twilio media credentials are not configured')

  const response = await fetch(url, {
    headers: { Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}` },
  })
  if (!response.ok) throw new Error(`Twilio media download failed with status ${response.status}`)
  const declaredLength = Number(response.headers.get('content-length') || 0)
  if (declaredLength > MAX_TWILIO_MEDIA_BYTES) throw new Error('Twilio media exceeds the 30 MB limit')
  const data = new Uint8Array(await response.arrayBuffer())
  if (data.byteLength > MAX_TWILIO_MEDIA_BYTES) throw new Error('Twilio media exceeds the 30 MB limit')
  return {
    data,
    contentType: response.headers.get('content-type')?.split(';')[0]?.trim().toLowerCase() || '',
  }
}
