import { createHash } from 'crypto'
import { EventWebhook } from '@sendgrid/eventwebhook'
import { selectLatestGalleryForDestination } from '@/lib/db/personService'
import { sendGridClient } from '@/lib/email'
import { buildInboundSourceId, isSupportedInboundContentType, normalizeInboundContentType, uploadInboundMedia } from '@/lib/inbound/media'
import { buildInboundReply, extractEnvelopeSender, extractMessageId, hasPassingSpf, isAutomatedEmail, safeReplySubject } from '@/lib/inbound/message'
import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 60
export const runtime = 'nodejs'

interface AttachmentInfo {
  filename?: string
  type?: string
}

function field(formData: FormData, key: string): string | null {
  const value = formData.get(key)
  return typeof value === 'string' ? value : null
}

function verifySignature(rawBody: Buffer, request: NextRequest): boolean {
  const signature = request.headers.get('x-twilio-email-event-webhook-signature')
  const timestamp = request.headers.get('x-twilio-email-event-webhook-timestamp')
  const verificationKey = process.env.SENDGRID_INBOUND_PARSE_VERIFICATION_KEY
  if (!signature || !timestamp || !verificationKey) return false
  try {
    const webhook = new EventWebhook()
    const publicKey = webhook.convertPublicKeyToECDSA(verificationKey)
    return webhook.verifySignature(publicKey, rawBody, signature, timestamp)
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  const contentType = request.headers.get('content-type')
  if (!contentType?.toLowerCase().startsWith('multipart/form-data')) {
    return NextResponse.json({ error: 'Expected multipart form data' }, { status: 415 })
  }
  const rawArrayBuffer = await request.arrayBuffer()
  const rawBody = Buffer.from(rawArrayBuffer)
  if (!verifySignature(rawBody, request)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }
  if (process.env.MESSAGING_ENABLED !== 'true') return new NextResponse(null, { status: 204 })

  const formData = await new Response(rawArrayBuffer, { headers: { 'Content-Type': contentType } }).formData()
  const headers = field(formData, 'headers')
  if (isAutomatedEmail(headers)) return new NextResponse(null, { status: 204 })
  if (!hasPassingSpf(field(formData, 'SPF') || field(formData, 'spf'))) {
    console.warn('Ignoring inbound email without a passing SPF result')
    return new NextResponse(null, { status: 204 })
  }
  const sender = extractEnvelopeSender(field(formData, 'envelope'), null)
  if (!sender) return NextResponse.json({ error: 'Sender email is missing' }, { status: 400 })
  if ([process.env.SENDGRID_EMAIL, process.env.SENDGRID_INBOUND_EMAIL].some((email) => email?.trim().toLowerCase() === sender)) {
    return new NextResponse(null, { status: 204 })
  }

  let attachmentInfo: Record<string, AttachmentInfo> = {}
  try {
    attachmentInfo = JSON.parse(field(formData, 'attachment-info') || '{}') as Record<string, AttachmentInfo>
  } catch {
    // File metadata is advisory; each multipart File also carries a name/type.
  }

  const destination = await selectLatestGalleryForDestination('email', sender)
  const attachments = Array.from(formData.entries()).filter(
    ([key, value]) => key.startsWith('attachment') && typeof value !== 'string',
  ) as Array<[string, File]>
  let uploadedCount = 0

  try {
    if (destination) {
      const providerMessageId = extractMessageId(headers)
        || createHash('sha256').update(new Uint8Array(rawArrayBuffer)).digest('hex')
      for (const [key, file] of attachments) {
        const metadata = attachmentInfo[key] || {}
        const fileContentType = normalizeInboundContentType(file.type)
        const metadataContentType = normalizeInboundContentType(metadata.type)
        const contentType = isSupportedInboundContentType(fileContentType) ? fileContentType : metadataContentType
        if (!isSupportedInboundContentType(contentType)) continue
        const data = new Uint8Array(await file.arrayBuffer())
        await uploadInboundMedia({
          provider: 'sendgrid',
          sourceId: buildInboundSourceId(providerMessageId, key, data),
          galleryId: destination.gallery.id,
          personId: destination.person.id,
          name: metadata.filename || file.name || key,
          contentType,
          data,
        })
        uploadedCount += 1
      }
    }

    await sendGridClient.sendInboundReply({
      email: sender,
      subject: safeReplySubject(field(formData, 'subject')),
      body: buildInboundReply({
        destination,
        attachmentCount: attachments.length,
        uploadedCount,
      }),
    })
  } catch (error) {
    console.error('Inbound SendGrid media upload failed', error)
    return NextResponse.json({ error: 'Inbound media processing failed' }, { status: 500 })
  }

  return new NextResponse(null, { status: 204 })
}
