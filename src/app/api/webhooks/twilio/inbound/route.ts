import { optOutDestinationGlobally, unsuppressDestination } from '@/lib/db/communicationService'
import { validateTwilioWebhook } from '@/lib/sms'
import { NextRequest, NextResponse } from 'next/server'

function twiml(message?: string): NextResponse {
  const body = message
    ? `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${message}</Message></Response>`
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
    return twiml('Recap wedding gallery updates. Reply STOP to stop. Visit ourweddingrecap.com for support.')
  }
  return twiml()
}
