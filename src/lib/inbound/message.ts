import type { InboundGalleryDestination } from '@/lib/db/personService'

export function galleryUrl(destination: InboundGalleryDestination): string {
  const configuredBaseUrl = process.env.BASE_URL
  const baseUrl = configuredBaseUrl && URL.canParse(configuredBaseUrl)
    ? configuredBaseUrl
    : 'http://localhost:3000'
  return new URL(`/${destination.gallery.path}`, baseUrl).toString()
}

export function buildInboundReply(input: {
  destination: InboundGalleryDestination | null
  attachmentCount: number
  uploadedCount: number
}): string {
  if (!input.destination) {
    return 'We could not match this contact to a Recap gallery. Join the gallery with this phone number or email first, then send your photos or videos again.'
  }
  const name = input.destination.gallery.name
  const url = galleryUrl(input.destination)
  if (input.uploadedCount > 0) {
    const noun = input.uploadedCount === 1 ? 'photo/video' : 'photos/videos'
    return `Added ${input.uploadedCount} ${noun} to ${name}. Keep replying with more anytime. View the gallery: ${url}`
  }
  if (input.attachmentCount > 0) {
    return `We could not find a supported photo or video in that message. Please send an image or video attachment to add it to ${name}. View the gallery: ${url}`
  }
  return `Thanks for messaging Recap. Reply with photos or videos to add them to ${name}. View the gallery: ${url}`
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
  return sanitized ? `Re: ${sanitized}` : 'Your Recap gallery upload'
}

export function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}
