import { describe, expect, it } from 'vitest'
import { reminderDraftSchema } from '@/lib/validation/reminder'
import { shouldApplyProviderStatus } from '@/lib/db/reminderService'
import { getReminderEmailTemplate } from '@/lib/email/templates/reminder'
import { buildReminderSmsBody, estimateSmsSegments } from '@/lib/reminders/message'
import { getUserVerificationEmailTemplate } from '@/lib/email/templates/user-verification'

const validDraft = {
  title: 'Wedding day details',
  sendAt: '2027-06-19T13:00:00.000Z',
  sendEmail: true,
  sendSms: true,
  emailSubject: 'Today’s wedding schedule',
  emailBody: 'The ceremony starts at 3:00 p.m.',
  smsBody: 'Ceremony starts at 3:00 p.m.',
}

describe('reminder validation', () => {
  it('accepts a timestamp-only reminder', () => {
    expect(reminderDraftSchema.parse(validDraft)).toMatchObject(validDraft)
  })

  it('requires at least one delivery channel', () => {
    expect(() => reminderDraftSchema.parse({ ...validDraft, sendEmail: false, sendSms: false })).toThrow()
  })

  it('requires copy for each enabled channel', () => {
    expect(() => reminderDraftSchema.parse({ ...validDraft, smsBody: '' })).toThrow()
    expect(() => reminderDraftSchema.parse({ ...validDraft, emailSubject: '' })).toThrow()
  })

  it('bounds AI source metadata saved with a draft', () => {
    expect(() => reminderDraftSchema.parse({
      ...validDraft,
      sourceDetails: { prompt: 'x'.repeat(5001) },
    })).toThrow()
  })
})

describe('provider delivery statuses', () => {
  it('allows progress and prevents terminal or out-of-order downgrades', () => {
    expect(shouldApplyProviderStatus('pending', 'submitted')).toBe(true)
    expect(shouldApplyProviderStatus('submitting', 'submitted')).toBe(true)
    expect(shouldApplyProviderStatus('submitted', 'delivered')).toBe(true)
    expect(shouldApplyProviderStatus('unknown', 'submitted')).toBe(false)
    expect(shouldApplyProviderStatus('delivered', 'submitted')).toBe(false)
  })
})

describe('branded reminder email', () => {
  it('escapes guest content and includes the gallery, preferences, and postal address', () => {
    process.env.BUSINESS_POSTAL_ADDRESS = '123 Main St & Suite 4'
    const html = getReminderEmailTemplate({
      galleryName: 'Alex & Sam',
      recipientName: '<Guest>',
      body: '<strong>Upload photos</strong>',
      galleryUrl: 'https://example.com/gallery',
      preferenceUrl: 'https://example.com/preferences',
    })
    expect(html).toContain('Alex &amp; Sam')
    expect(html).toContain('&lt;strong&gt;Upload photos&lt;/strong&gt;')
    expect(html).toContain('https://example.com/gallery')
    expect(html).toContain('https://example.com/preferences')
    expect(html).toContain('123 Main St &amp; Suite 4')
    expect(html).toContain('one photo under 2 MB')
    expect(html).toContain('Use the gallery link for videos, larger photos, or multiple files.')
  })
})

describe('final SMS copy', () => {
  it('adds the gallery CTA and required STOP/HELP language before estimating segments', () => {
    const message = buildReminderSmsBody('Ceremony at 3:00.', 'https://example.com/wedding')
    expect(message).toMatch(/^Recap by Our Wedding Recap:/)
    expect(message).toContain('View & upload: https://example.com/wedding')
    expect(message).toContain('Reply STOP to stop, HELP for help.')
    expect(estimateSmsSegments(message)).toBeGreaterThanOrEqual(1)
  })

  it('does not add the brand twice when approved copy already includes it', () => {
    const message = buildReminderSmsBody('Recap by Our Wedding Recap: Ceremony at 3:00.', 'https://example.com/wedding')
    expect(message.match(/Recap by Our Wedding Recap:/g)).toHaveLength(1)
  })
})

describe('verification email', () => {
  it('escapes names and gallery content before rendering', () => {
    const html = getUserVerificationEmailTemplate({
      name: '<Guest>',
      galleryName: 'Alex & Sam',
      verificationUrl: 'https://example.com/verification/token',
    })
    expect(html).toContain('Hi &lt;Guest&gt;')
    expect(html).toContain('Alex &amp; Sam')
    expect(html).not.toContain('Hi <Guest>')
  })
})
