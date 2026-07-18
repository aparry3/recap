import { describe, expect, it } from 'vitest'
import {
  buildInboundReply,
  escapeXml,
  extractEnvelopeSender,
  extractMessageId,
  hasPassingSpf,
  isAutomatedEmail,
  safeReplySubject,
} from '@/lib/inbound/message'
import type { InboundGalleryDestination } from '@/lib/db/personService'
import { buildReminderSmsBody } from '@/lib/reminders/message'

const destination: InboundGalleryDestination = {
  person: { id: 'person-1', name: 'Guest', email: 'guest@example.com', phone: '+16175550123' },
  gallery: { id: 'gallery-1', name: 'Alex & Sam', path: 'alex-and-sam' },
}

describe('inbound message replies', () => {
  it('advertises reply-to-upload in outgoing SMS messages', () => {
    expect(buildReminderSmsBody('The ceremony starts at five.', 'https://example.com/gallery'))
      .toContain('reply here with photos/videos')
  })

  it('confirms media uploads and points to the matched gallery', () => {
    expect(buildInboundReply({ destination, attachmentCount: 2, uploadedCount: 2 }))
      .toContain('Added 2 photos/videos to Alex & Sam')
    expect(buildInboundReply({ destination, attachmentCount: 2, uploadedCount: 2 }))
      .toContain('/alex-and-sam')
  })

  it('explains how to upload when a message has no media', () => {
    expect(buildInboundReply({ destination, attachmentCount: 0, uploadedCount: 0 }))
      .toContain('Reply with photos or videos')
  })

  it('does not expose a gallery when the sender is unknown', () => {
    const reply = buildInboundReply({ destination: null, attachmentCount: 1, uploadedCount: 0 })
    expect(reply).toContain('could not match this contact')
    expect(reply).not.toContain('/alex-and-sam')
  })
})

describe('inbound email parsing', () => {
  it('prefers the authenticated SMTP envelope sender', () => {
    expect(extractEnvelopeSender('{"from":"Guest@Example.COM","to":["uploads@example.com"]}', 'Other <other@example.com>'))
      .toBe('guest@example.com')
    expect(extractEnvelopeSender('invalid', 'Guest Name <guest@example.com>')).toBe('guest@example.com')
  })

  it('recognizes retry and loop-prevention headers', () => {
    expect(isAutomatedEmail('Auto-Submitted: auto-replied')).toBe(true)
    expect(isAutomatedEmail('Precedence: bulk')).toBe(true)
    expect(isAutomatedEmail('Auto-Submitted: no')).toBe(false)
    expect(hasPassingSpf(' PASS ')).toBe(true)
    expect(hasPassingSpf('fail')).toBe(false)
  })

  it('extracts message IDs and sanitizes reply subjects', () => {
    expect(extractMessageId('Message-ID: <message-1@example.com>')).toBe('<message-1@example.com>')
    expect(safeReplySubject('Photos\r\nBcc: attacker@example.com')).toBe('Re: Photos Bcc: attacker@example.com')
  })

  it('escapes gallery names before putting replies in TwiML', () => {
    expect(escapeXml('Alex & Sam <3')).toBe('Alex &amp; Sam &lt;3')
  })
})
