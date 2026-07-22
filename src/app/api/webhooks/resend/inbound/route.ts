import { selectLatestGalleryForDestination } from '@/lib/db/personService'
import { emailClient } from '@/lib/email'
import { verifyResendWebhook } from '@/lib/email/resend'
import { buildInboundSourceId, inboundFileExtension, isSupportedInboundEmailContentType, isWithinInboundEmailMediaLimit, normalizeInboundContentType, uploadInboundMedia } from '@/lib/inbound/media'
import { buildInboundReply, extractEmailAddress, isAutomatedEmail, safeReplySubject } from '@/lib/inbound/message'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export const maxDuration = 60
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const rawBody = await request.text()
  const event = verifyResendWebhook(rawBody, request.headers, process.env.RESEND_INBOUND_WEBHOOK_SECRET)
  if (!event) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }
  if (event.type !== 'email.received') return new NextResponse(null, { status: 204 })
  if (process.env.MESSAGING_ENABLED !== 'true') return new NextResponse(null, { status: 204 })

  const sender = extractEmailAddress(event.data.from)
  if (!sender) return NextResponse.json({ error: 'Sender email is missing' }, { status: 400 })
  if ([process.env.EMAIL_FROM_ADDRESS, process.env.EMAIL_INBOUND_ADDRESS].some((email) => email?.trim().toLowerCase() === sender)) {
    return new NextResponse(null, { status: 204 })
  }

  // The webhook carries metadata only. Fetch the stored email once for the
  // authentication headers and attachment sizes before downloading content.
  const resend = new Resend(process.env.RESEND_API_KEY)
  const emailId = event.data.email_id
  const { data: received, error: receivedError } = await resend.emails.receiving.get(emailId)
  if (receivedError || !received) {
    console.error('Failed to fetch received email from Resend', receivedError)
    return NextResponse.json({ error: 'Could not fetch received email' }, { status: 500 })
  }
  const headerLines = received.headers
    ? Object.entries(received.headers).map(([name, value]) => `${name}: ${value}`).join('\n')
    : null
  if (isAutomatedEmail(headerLines)) return new NextResponse(null, { status: 204 })

  const destination = await selectLatestGalleryForDestination('email', sender)
  const attachments = received.attachments || []
  let uploadedCount = 0

  try {
    if (destination) {
      for (const attachment of attachments) {
        if (!isWithinInboundEmailMediaLimit(attachment.size)) continue
        const contentType = normalizeInboundContentType(attachment.content_type)
        if (!isSupportedInboundEmailContentType(contentType)) continue
        const { data: content, error: contentError } = await resend.emails.receiving.attachments.get({ emailId, id: attachment.id })
        if (contentError || !content) {
          throw new Error(`Could not fetch attachment ${attachment.id}: ${contentError?.message || 'no content returned'}`)
        }
        const download = await fetch(content.download_url)
        if (!download.ok) throw new Error(`Attachment download failed with status ${download.status}`)
        const data = new Uint8Array(await download.arrayBuffer())
        if (!isWithinInboundEmailMediaLimit(data.byteLength)) continue
        await uploadInboundMedia({
          provider: 'resend',
          sourceId: buildInboundSourceId(emailId, attachment.id, data),
          galleryId: destination.gallery.id,
          personId: destination.person.id,
          name: attachment.filename || `resend-${emailId}-${attachment.id}.${inboundFileExtension(contentType)}`,
          contentType,
          data,
        })
        uploadedCount += 1
      }
    }

    await emailClient.sendInboundReply({
      email: sender,
      subject: safeReplySubject(event.data.subject),
      body: buildInboundReply({
        provider: 'resend',
        destination,
        attachmentCount: attachments.length,
        uploadedCount,
      }),
    })
  } catch (error) {
    console.error('Inbound Resend media upload failed', error)
    return NextResponse.json({ error: 'Inbound media processing failed' }, { status: 500 })
  }

  return new NextResponse(null, { status: 204 })
}
