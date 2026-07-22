import { optOutDestinationGlobally } from '@/lib/db/communicationService'
import { recordProviderDeliveryStatus } from '@/lib/db/reminderService'
import { SUPPRESSING_EVENT_TYPES, extractResendTag, firstRecipient, mapResendEventToDeliveryStatus, verifyResendWebhook } from '@/lib/email/resend'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const rawBody = await request.text()
  const event = verifyResendWebhook(rawBody, request.headers, process.env.RESEND_EVENT_WEBHOOK_SECRET)
  if (!event) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const data = event.data as { email_id?: string; to?: string | string[]; tags?: unknown }
  const status = mapResendEventToDeliveryStatus(event.type)
  if (status) {
    await recordProviderDeliveryStatus({
      deliveryId: extractResendTag(data.tags, 'delivery_id'),
      providerMessageId: data.email_id,
      status,
    })
  }
  if (SUPPRESSING_EVENT_TYPES.has(event.type)) {
    const recipient = firstRecipient(data.to)
    if (recipient) await optOutDestinationGlobally('email', recipient, `resend_${event.type.replace('email.', '')}`)
  }
  return new NextResponse(null, { status: 204 })
}
