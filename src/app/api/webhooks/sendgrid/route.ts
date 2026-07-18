import { EventWebhook } from '@sendgrid/eventwebhook'
import { optOutDestinationGlobally } from '@/lib/db/communicationService'
import { updateDelivery, updateDeliveryByProviderId } from '@/lib/db/reminderService'
import { DeliveryStatus } from '@/lib/types/Reminder'
import { NextRequest, NextResponse } from 'next/server'

interface SendGridEvent {
  event: string
  email?: string
  sg_message_id?: string
  delivery_id?: string
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text()
  const signature = request.headers.get('x-twilio-email-event-webhook-signature')
  const timestamp = request.headers.get('x-twilio-email-event-webhook-timestamp')
  const verificationKey = process.env.SENDGRID_EVENT_WEBHOOK_VERIFICATION_KEY
  if (!signature || !timestamp || !verificationKey) {
    return NextResponse.json({ error: 'Webhook signature is not configured' }, { status: 401 })
  }

  const webhook = new EventWebhook()
  const publicKey = webhook.convertPublicKeyToECDSA(verificationKey)
  if (!webhook.verifySignature(publicKey, rawBody, signature, timestamp)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const events = JSON.parse(rawBody) as SendGridEvent[]
  for (const event of events) {
    const mapping: Record<string, DeliveryStatus> = {
      delivered: 'delivered',
      processed: 'submitted',
      deferred: 'unknown',
      bounce: 'failed',
      dropped: 'failed',
      spamreport: 'failed',
      unsubscribe: 'suppressed',
      group_unsubscribe: 'suppressed',
    }
    const status = mapping[event.event]
    if (status && event.delivery_id) {
      await updateDelivery(event.delivery_id, { status, deliveredAt: status === 'delivered' ? new Date() : undefined })
    } else if (status && event.sg_message_id) {
      await updateDeliveryByProviderId(event.sg_message_id, status)
    }
    if (event.email && ['bounce', 'dropped', 'spamreport', 'unsubscribe', 'group_unsubscribe'].includes(event.event)) {
      await optOutDestinationGlobally('email', event.email, `sendgrid_${event.event}`)
    }
  }
  return new NextResponse(null, { status: 204 })
}
