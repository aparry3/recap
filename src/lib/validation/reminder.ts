import { z } from 'zod'

export const reminderDraftSchema = z.object({
  title: z.string().trim().min(1).max(160),
  sendAt: z.string().datetime().nullable().optional(),
  sendEmail: z.boolean(),
  sendSms: z.boolean(),
  emailSubject: z.string().trim().max(200).refine((value) => !/[\r\n]/.test(value), 'Email subject cannot contain line breaks').nullable().optional(),
  emailBody: z.string().trim().max(10000).nullable().optional(),
  smsBody: z.string().trim().max(1400).nullable().optional(),
  source: z.enum(['manual', 'prompt', 'invitation', 'theknot', 'zola']).optional(),
  sourceDetails: z.object({
    evidence: z.array(z.string()).optional(),
    warnings: z.array(z.string()).optional(),
    prompt: z.string().optional(),
    websiteUrl: z.string().url().optional(),
    fileName: z.string().optional(),
  }).nullable().optional(),
}).superRefine((value, context) => {
  if (!value.sendEmail && !value.sendSms) {
    context.addIssue({ code: 'custom', message: 'Choose email, SMS, or both', path: ['sendEmail'] })
  }
  if (value.sendEmail && (!value.emailSubject || !value.emailBody)) {
    context.addIssue({ code: 'custom', message: 'Email subject and message are required', path: ['emailBody'] })
  }
  if (value.sendSms && !value.smsBody) {
    context.addIssue({ code: 'custom', message: 'SMS message is required', path: ['smsBody'] })
  }
})

export const reminderUpdateSchema = reminderDraftSchema.and(z.object({
  version: z.number().int().positive(),
}))

export const reminderActionSchema = z.object({
  action: z.enum(['schedule', 'send_now', 'cancel']),
  version: z.number().int().positive(),
})
