import { describe, expect, it } from 'vitest'
import {
  buildInboundReply,
  classifyTwilioKeyword,
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
    const message = buildReminderSmsBody('The ceremony starts at five.', 'https://example.com/gallery')
    expect(message).toContain('reply here with photos/videos')
    expect(message).toMatch(/^Our Wedding Recap:/)
  })

  it('confirms media uploads and points to the matched gallery', () => {
    const reply = buildInboundReply({ provider: 'twilio', destination, attachmentCount: 2, uploadedCount: 2 })
    expect(reply).toContain('Added 2 photos/videos to Alex & Sam')
    expect(reply).toContain('/alex-and-sam')
    expect(reply).toMatch(/^Our Wedding Recap:/)
  })

  it('explains how to upload when a message has no media', () => {
    expect(buildInboundReply({ provider: 'twilio', destination, attachmentCount: 0, uploadedCount: 0 }))
      .toContain('Reply with photos or videos')
  })

  it('does not expose a gallery when the sender is unknown', () => {
    const reply = buildInboundReply({ provider: 'twilio', destination: null, attachmentCount: 1, uploadedCount: 0 })
    expect(reply).toContain('could not match this contact')
    expect(reply).not.toContain('/alex-and-sam')
  })

  it('directs email uploads above the conservative ingress limit to the gallery', () => {
    const reply = buildInboundReply({ provider: 'sendgrid', destination, attachmentCount: 1, uploadedCount: 0 })
    expect(reply).toContain('one supported photo under 2 MB')
    expect(reply).toContain('use the gallery for videos, larger photos, or multiple files')
  })
})

describe('Twilio provider keywords', () => {
  it.each(['STOP', 'STOPALL', 'UNSUBSCRIBE', 'CANCEL', 'END', 'QUIT', 'REVOKE', 'OPTOUT'])(
    'recognizes %s as an opt-out command',
    (keyword) => expect(classifyTwilioKeyword(` ${keyword.toLowerCase()} `)).toBe('stop'),
  )

  it.each(['START', 'YES', 'UNSTOP'])(
    'recognizes %s as a restart command',
    (keyword) => expect(classifyTwilioKeyword(keyword)).toBe('start'),
  )

  it.each(['HELP', 'INFO'])(
    'recognizes %s as a help command',
    (keyword) => expect(classifyTwilioKeyword(keyword)).toBe('help'),
  )

  it('prefers Twilio Advanced Opt-Out metadata and ignores conversational text', () => {
    expect(classifyTwilioKeyword('something custom', 'STOP')).toBe('stop')
    expect(classifyTwilioKeyword('photos from today')).toBeNull()
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
