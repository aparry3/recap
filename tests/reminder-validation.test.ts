import { describe, expect, it } from 'vitest'
import { reminderDraftSchema } from '@/lib/validation/reminder'

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
})
