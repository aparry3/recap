import { optOutDestinationGlobally, unsuppressDestination } from '@/lib/db/communicationService'
import { selectLatestGalleryForDestination } from '@/lib/db/personService'
import { buildInboundSourceId, inboundFileExtension, isSupportedInboundContentType, normalizeInboundContentType, uploadInboundMedia } from '@/lib/inbound/media'
import { buildInboundReply, escapeXml } from '@/lib/inbound/message'
import { downloadTwilioMedia, validateTwilioWebhook } from '@/lib/sms'
import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 60

function twiml(message?: string): NextResponse {
  const body = message
    ? `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${escapeXml(message)}</Message></Response>`
    : '<?xml version="1.0" encoding="UTF-8"?><Response></Response>'
  return new NextResponse(body, { headers: { 'Content-Type': 'text/xml' } })
}

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const params: Record<string, string> = {}
  formData.forEach((value, key) => { params[key] = value.toString() })
  const validationUrl = new URL(`${request.nextUrl.pathname}${request.nextUrl.search}`, process.env.BASE_URL || request.nextUrl.origin).toString()
  if (!validateTwilioWebhook(request.headers.get('x-twilio-signature'), validationUrl, params)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const from = params.From
  const command = params.Body?.trim().toUpperCase()
  if (!from) return twiml()
  if (['STOP', 'STOPALL', 'UNSUBSCRIBE', 'CANCEL', 'END', 'QUIT'].includes(command)) {
    await optOutDestinationGlobally('sms', from, 'twilio_stop')
    return twiml()
  }
  if (['START', 'UNSTOP'].includes(command)) {
    await unsuppressDestination('sms', from)
    return twiml('Recap texts are available again. Re-enable updates for a gallery from its communication preferences page.')
  }
  if (command === 'HELP' || command === 'INFO') {
    return twiml('Recap wedding gallery updates and uploads. Reply with photos/videos to add them to your latest gallery. Reply STOP to stop. Visit ourweddingrecap.com for support.')
  }
  if (process.env.MESSAGING_ENABLED !== 'true') return twiml()

  const destination = await selectLatestGalleryForDestination('sms', from)
  const requestedMediaCount = Number.parseInt(params.NumMedia || '0', 10)
  const attachmentCount = Number.isFinite(requestedMediaCount) ? Math.min(Math.max(requestedMediaCount, 0), 10) : 0
  let uploadedCount = 0

  try {
    if (destination) {
      const providerMessageId = params.MessageSid || params.SmsSid || 'unknown-message'
      for (let index = 0; index < attachmentCount; index += 1) {
        const mediaUrl = params[`MediaUrl${index}`]
        const declaredContentType = normalizeInboundContentType(params[`MediaContentType${index}`])
        if (!mediaUrl || (declaredContentType && !isSupportedInboundContentType(declaredContentType))) continue

        const downloaded = await downloadTwilioMedia(mediaUrl)
        const contentType = declaredContentType || downloaded.contentType
        if (!isSupportedInboundContentType(contentType)) continue
        const attachmentId = new URL(mediaUrl).pathname.split('/').filter(Boolean).at(-1) || String(index)
        await uploadInboundMedia({
          provider: 'twilio',
          sourceId: buildInboundSourceId(providerMessageId, attachmentId, downloaded.data),
          galleryId: destination.gallery.id,
          personId: destination.person.id,
          name: `twilio-${providerMessageId}-${index + 1}.${inboundFileExtension(contentType)}`,
          contentType,
          data: downloaded.data,
        })
        uploadedCount += 1
      }
    }
  } catch (error) {
    console.error('Inbound Twilio media upload failed', error)
    return new NextResponse('Inbound media processing failed', { status: 500 })
  }

  return twiml(buildInboundReply({ destination, attachmentCount, uploadedCount }))
}
