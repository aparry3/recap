import 'server-only'

import { agntz, ContentBlock, LocalClient } from '@agntz/sdk'
import { DateTime } from 'luxon'
import pdf from 'pdf-parse'
import path from 'path'
import sharp from 'sharp'
import { z } from 'zod'
import { getUrlBody } from '@/lib/web'
import { Gallery } from '@/lib/types/Gallery'
import { GeneratedReminderDraft, ReminderSource } from '@/lib/types/Reminder'

const MAX_INVITATION_BYTES = 4 * 1024 * 1024
const SUPPORTED_WEBSITE_HOSTS = ['theknot.com', 'www.theknot.com', 'zola.com', 'www.zola.com']

const agentOutputSchema = z.object({
  reminders: z.array(z.object({
    title: z.string().min(1).max(160),
    send_at_local: z.string(),
    email_subject: z.string().max(200),
    email_body: z.string().max(10000),
    sms_body: z.string().max(1400),
    evidence: z.array(z.string().max(500)).max(20),
    warnings: z.array(z.string().max(500)).max(20),
  })).min(1).max(3),
  global_warnings: z.array(z.string().max(500)).max(20),
})

let clientPromise: Promise<LocalClient> | null = null

function getAgentClient(): Promise<LocalClient> {
  if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY is not configured')
  clientPromise ??= agntz({ agents: path.join(process.cwd(), 'agents') })
  return clientPromise
}

function websiteSource(urlString: string): ReminderSource {
  const url = new URL(urlString)
  const hostname = url.hostname.toLowerCase()
  if (url.protocol !== 'https:' || !SUPPORTED_WEBSITE_HOSTS.includes(hostname)) {
    throw new Error('Only The Knot and Zola website URLs are supported')
  }
  return hostname.includes('theknot') ? 'theknot' : 'zola'
}

async function invitationBlocks(file: File): Promise<ContentBlock[]> {
  if (file.size > MAX_INVITATION_BYTES) throw new Error('Invitation files must be 4 MB or smaller')
  const buffer = Buffer.from(await file.arrayBuffer())
  const mime = file.type.toLowerCase()

  if (mime === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
    const parsed = await pdf(buffer)
    if (!parsed.text.trim()) throw new Error('No readable text was found in the PDF invitation')
    return [{ type: 'text', text: `Invitation PDF text:\n${parsed.text.slice(0, 50000)}` }]
  }

  if (mime.includes('heic') || mime.includes('heif') || /\.(heic|heif)$/i.test(file.name)) {
    const jpeg = await sharp(buffer).jpeg({ quality: 90 }).toBuffer()
    return [{ type: 'image', base64: jpeg.toString('base64'), mediaType: 'image/jpeg' }]
  }

  const supportedMime = ['image/jpeg', 'image/png', 'image/webp'] as const
  const normalizedMime = mime === 'image/jpg' ? 'image/jpeg' : mime
  if (!supportedMime.includes(normalizedMime as typeof supportedMime[number])) {
    throw new Error('Supported invitation formats are PDF, JPEG, PNG, WebP, HEIC, and HEIF')
  }
  return [{
    type: 'image',
    base64: buffer.toString('base64'),
    mediaType: normalizedMime as 'image/jpeg' | 'image/png' | 'image/webp',
  }]
}

function resolveSendAt(sendAtLocal: string, timezone: string): { utc: string | null; local: string | null; warning?: string } {
  if (!sendAtLocal.trim()) return { utc: null, local: null, warning: 'A send date and time must be selected manually.' }
  let value = DateTime.fromISO(sendAtLocal, { setZone: true })
  if (!value.isValid) value = DateTime.fromISO(sendAtLocal, { zone: timezone })
  if (!value.isValid) return { utc: null, local: null, warning: 'The generated send timestamp was invalid.' }
  const inGalleryZone = value.setZone(timezone)
  return {
    utc: inGalleryZone.toUTC().toISO(),
    local: inGalleryZone.toISO({ suppressMilliseconds: true }),
  }
}

export async function generateReminderDrafts(input: {
  gallery: Gallery
  prompt?: string
  websiteUrl?: string
  invitation?: File
  sendEmail: boolean
  sendSms: boolean
}): Promise<{ drafts: GeneratedReminderDraft[]; source: ReminderSource; globalWarnings: string[] }> {
  if (!input.sendEmail && !input.sendSms) throw new Error('Choose email, SMS, or both')
  if (!input.prompt?.trim() && !input.websiteUrl && !input.invitation) {
    throw new Error('Add instructions, a supported wedding website, or an invitation')
  }

  const ownerPrompt = input.prompt?.trim().slice(0, 5000)
  let source: ReminderSource = ownerPrompt ? 'prompt' : 'manual'
  const content: ContentBlock[] = [{
    type: 'text',
    text: [
      'TRUSTED APPLICATION CONTEXT',
      `Gallery: ${input.gallery.name}`,
      `IANA timezone: ${input.gallery.timezone}`,
      `Current time: ${DateTime.now().setZone(input.gallery.timezone).toISO()}`,
      `Generate email: ${input.sendEmail}`,
      `Generate SMS: ${input.sendSms}`,
      `Owner instructions: ${ownerPrompt || 'Create the most useful reminders supported by the source.'}`,
      'UNTRUSTED SOURCE CONTENT FOLLOWS',
    ].join('\n'),
  }]

  if (input.websiteUrl) {
    source = websiteSource(input.websiteUrl)
    const body = await getUrlBody(input.websiteUrl)
    if (!body) throw new Error('No readable wedding website content was found')
    content.push({ type: 'text', text: `Wedding website text:\n${body.slice(0, 50000)}` })
  }

  if (input.invitation) {
    source = 'invitation'
    content.push(...await invitationBlocks(input.invitation))
  }

  const client = await getAgentClient()
  const result = await client.agents.run({
    agentId: 'wedding-reminder-planner',
    input: content,
  })
  const parsed = agentOutputSchema.parse(result.output)

  const drafts = parsed.reminders.map((reminder): GeneratedReminderDraft => {
    const resolved = resolveSendAt(reminder.send_at_local, input.gallery.timezone)
    const warnings = [...reminder.warnings]
    if (resolved.warning) warnings.push(resolved.warning)
    if (resolved.utc && DateTime.fromISO(resolved.utc) <= DateTime.utc()) {
      warnings.push('The proposed time is in the past. Select a new send time before scheduling.')
      resolved.utc = null
      resolved.local = null
    }
    return {
      title: reminder.title,
      sendAt: resolved.utc,
      sendAtLocal: resolved.local,
      timezone: input.gallery.timezone,
      sendEmail: input.sendEmail,
      sendSms: input.sendSms,
      emailSubject: input.sendEmail ? reminder.email_subject : '',
      emailBody: input.sendEmail ? reminder.email_body : '',
      smsBody: input.sendSms ? reminder.sms_body : '',
      source,
      sourceDetails: {
        evidence: reminder.evidence,
        warnings,
        prompt: ownerPrompt,
        websiteUrl: input.websiteUrl,
        fileName: input.invitation?.name,
      },
      evidence: reminder.evidence,
      warnings,
    }
  })

  return { drafts, source, globalWarnings: parsed.global_warnings }
}
