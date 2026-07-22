import { upsertConsent } from '@/lib/db/communicationService'
import { verifyPreferenceToken } from '@/lib/preferences'
import { NextResponse } from 'next/server'

// RFC 8058 one-click unsubscribe target for the List-Unsubscribe email headers.
// Mail providers POST here without user interaction, so the body is ignored and
// only the email channel for this gallery is opted out.
export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params
    const payload = verifyPreferenceToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'This unsubscribe link is invalid or expired' }, { status: 404 })
    }
    await upsertConsent({
      galleryId: payload.galleryId,
      personId: payload.personId,
      channel: 'email',
      status: 'opted_out',
      source: 'one_click_unsubscribe',
      userAgent: request.headers.get('user-agent'),
      ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim(),
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Could not unsubscribe' }, { status: 400 })
  }
}

export async function GET(_: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const baseUrl = process.env.BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  return NextResponse.redirect(`${baseUrl}/preferences/${token}`, 307)
}