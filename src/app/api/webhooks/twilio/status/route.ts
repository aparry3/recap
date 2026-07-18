import { updateDeliveryByProviderId } from '@/lib/db/reminderService'
import { validateTwilioWebhook } from '@/lib/sms'
import { DeliveryStatus } from '@/lib/types/Reminder'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const params: Record<string, string> = {}
  formData.forEach((value, key) => { params[key] = value.toString() })
  const validationUrl = `${process.env.BASE_URL || request.nextUrl.origin}${request.nextUrl.pathname}`
  if (!validateTwilioWebhook(request.headers.get('x-twilio-signature'), validationUrl, params)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const messageId = params.MessageSid
  if (messageId) {
    const mapping: Record<string, DeliveryStatus> = {
      delivered: 'delivered',
      sent: 'submitted',
      queued: 'submitted',
      accepted: 'submitted',
      failed: 'failed',
      undelivered: 'failed',
    }
    const status = mapping[params.MessageStatus]
    if (status) await updateDeliveryByProviderId(messageId, status)
  }
  return new NextResponse(null, { status: 204 })
}
