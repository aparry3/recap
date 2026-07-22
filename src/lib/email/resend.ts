import { Resend } from 'resend'
import type { WebhookEventPayload } from 'resend'
import { DeliveryStatus } from '@/lib/types/Reminder'

// Delivery-status events that indicate the destination should stop receiving
// email everywhere.
export const SUPPRESSING_EVENT_TYPES = new Set(['email.bounced', 'email.complained'])

export function mapResendEventToDeliveryStatus(type: string): DeliveryStatus | null {
  const mapping: Record<string, DeliveryStatus> = {
    'email.sent': 'submitted',
    'email.delivered': 'delivered',
    'email.delivery_delayed': 'unknown',
    'email.bounced': 'failed',
    'email.complained': 'failed',
    // `email.failed` covers transient send-side errors rather than a
    // suppression verdict, so it never opts anyone out.
    'email.failed': 'failed',
    'email.suppressed': 'suppressed',
  }
  return mapping[type] || null
}

// Webhook payloads have shipped tags both as [{ name, value }] arrays and as
// plain records, so accept either shape.
export function extractResendTag(tags: unknown, name: string): string | undefined {
  if (!tags || typeof tags !== 'object') return undefined
  if (Array.isArray(tags)) {
    for (const tag of tags) {
      if (tag && typeof tag === 'object' && (tag as { name?: unknown }).name === name) {
        const value = (tag as { value?: unknown }).value
        if (typeof value === 'string') return value
      }
    }
    return undefined
  }
  const value = (tags as Record<string, unknown>)[name]
  return typeof value === 'string' ? value : undefined
}

export function firstRecipient(to: unknown): string | undefined {
  if (typeof to === 'string') return to
  if (Array.isArray(to) && typeof to[0] === 'string') return to[0]
  return undefined
}

export function verifyResendWebhook(rawBody: string, headers: Headers, webhookSecret?: string): WebhookEventPayload | null {
  const id = headers.get('svix-id')
  const timestamp = headers.get('svix-timestamp')
  const signature = headers.get('svix-signature')
  if (!webhookSecret || !id || !timestamp || !signature) return null
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    return resend.webhooks.verify({
      payload: rawBody,
      headers: { id, timestamp, signature },
      webhookSecret,
    })
  } catch {
    return null
  }
}
