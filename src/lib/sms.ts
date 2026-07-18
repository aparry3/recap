import twilio, { Twilio } from 'twilio'

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
  if (!process.env.BASE_URL) throw new Error('BASE_URL is required for Twilio status callbacks')
  const statusCallback = new URL('/api/webhooks/twilio/status', process.env.BASE_URL)
  statusCallback.searchParams.set('deliveryId', input.deliveryId)
  const message = await getClient().messages.create({
    to: input.to,
    messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID,
    body: input.body,
    statusCallback: statusCallback.toString(),
  })
  return message.sid
}

export function validateTwilioWebhook(signature: string | null, url: string, params: Record<string, string>): boolean {
  const authToken = process.env.TWILIO_AUTH_TOKEN
  if (!authToken || !signature) return false
  return twilio.validateRequest(authToken, signature, url, params)
}
