import { brandCommunication } from '@/lib/brand'
import type { InboundGalleryDestination } from '@/lib/db/personService'

export type TwilioKeyword = 'stop' | 'start' | 'help'

const TWILIO_STOP_KEYWORDS = new Set([
  'STOP',
  'STOPALL',
  'UNSUBSCRIBE',
  'CANCEL',
  'END',
  'QUIT',
  'REVOKE',
  'OPTOUT',
])
const TWILIO_START_KEYWORDS = new Set(['START', 'YES', 'UNSTOP'])
const TWILIO_HELP_KEYWORDS = new Set(['HELP', 'INFO'])

export function classifyTwilioKeyword(body?: string | null, optOutType?: string | null): TwilioKeyword | null {
  const providerType = optOutType?.trim().toUpperCase()
  if (providerType === 'STOP') return 'stop'
  if (providerType === 'START') return 'start'
  if (providerType === 'HELP') return 'help'

  const command = body?.trim().toUpperCase()
  if (!command) return null
  if (TWILIO_STOP_KEYWORDS.has(command)) return 'stop'
  if (TWILIO_START_KEYWORDS.has(command)) return 'start'
  if (TWILIO_HELP_KEYWORDS.has(command)) return 'help'
  return null
}

export function galleryUrl(destination: InboundGalleryDestination): string {
  const configuredBaseUrl = process.env.BASE_URL
  const baseUrl = configuredBaseUrl && URL.canParse(configuredBaseUrl)
    ? configuredBaseUrl
    : 'http://localhost:3000'
  return new URL(`/${destination.gallery.path}`, baseUrl).toString()
}

export function buildInboundReply(input: {
  provider: 'twilio' | 'sendgrid'
  destination: InboundGalleryDestination | null
  attachmentCount: number
  uploadedCount: number
}): string {
  if (!input.destination) {
    return brandCommunication('We could not match this contact to a gallery on Our Wedding Recap. Join the gallery with this phone number or email first, then send your photos or videos again.')
  }
  const name = input.destination.gallery.name
  const url = galleryUrl(input.destination)
  if (input.uploadedCount > 0) {
    const noun = input.uploadedCount === 1 ? 'photo/video' : 'photos/videos'
    const nextUpload = input.provider === 'sendgrid'
      ? 'Email one photo under 2 MB at a time, or use the gallery for videos, larger photos, or multiple files.'
      : 'Keep replying with more anytime.'
    return brandCommunication(`Added ${input.uploadedCount} ${noun} to ${name}. ${nextUpload} View the gallery: ${url}`)
  }
  if (input.attachmentCount > 0) {
    const expectedMedia = input.provider === 'sendgrid'
      ? 'Please email one supported photo under 2 MB, or use the gallery for videos, larger photos, or multiple files.'
      : 'Please send an image or video attachment.'
    return brandCommunication(`We could not find supported media in that message. ${expectedMedia} Add it to ${name}: ${url}`)
  }
  const replyInstructions = input.provider === 'sendgrid'
    ? 'Reply with one photo under 2 MB, or use the gallery for videos, larger photos, or multiple files.'
    : 'Reply with photos or videos.'
  return brandCommunication(`Thanks for messaging Our Wedding Recap. ${replyInstructions} Add them to ${name}: ${url}`)
}

export function extractEmailAddress(value?: string | null): string | null {
  if (!value) return null
  const angleAddress = value.match(/<([^<>]+)>/)?.[1]
  const match = (angleAddress || value).match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)
  return match?.[0]?.trim().toLowerCase() || null
}

export function extractEnvelopeSender(envelope?: string | null, fallbackFrom?: string | null): string | null {
  if (envelope) {
    try {
      const parsed = JSON.parse(envelope) as { from?: string }
      const sender = extractEmailAddress(parsed.from)
      if (sender) return sender
    } catch {
      // Fall through to the decoded From header.
    }
  }
  return extractEmailAddress(fallbackFrom)
}

export function isAutomatedEmail(headers?: string | null): boolean {
  if (!headers) return false
  const autoSubmitted = headers.match(/^auto-submitted:\s*(.+)$/im)?.[1]?.trim().toLowerCase()
  if (autoSubmitted && autoSubmitted !== 'no') return true
  const precedence = headers.match(/^precedence:\s*(.+)$/im)?.[1]?.trim().toLowerCase()
  return Boolean(precedence && ['bulk', 'junk', 'list'].includes(precedence))
}

export function hasPassingSpf(value?: string | null): boolean {
  return value?.trim().toLowerCase() === 'pass'
}

export function extractMessageId(headers?: string | null): string | null {
  return headers?.match(/^message-id:\s*(.+)$/im)?.[1]?.trim() || null
}

export function safeReplySubject(subject?: string | null): string {
  const sanitized = subject?.replace(/[\r\n]+/g, ' ').trim().slice(0, 180)
  return sanitized ? `Re: ${sanitized}` : 'Your gallery upload | Our Wedding Recap'
}

export function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}
