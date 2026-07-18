import { selectGallery } from '@/lib/db/galleryService'
import { isDestinationSuppressed, isGalleryMember, selectGalleryConsents, setGalleryConsents } from '@/lib/db/communicationService'
import { selectPerson } from '@/lib/db/personService'
import { verifyPreferenceToken } from '@/lib/preferences'
import { sendConsentConfirmations } from '@/lib/reminders/dispatch'
import { NextResponse } from 'next/server'
import { z } from 'zod'

async function context(token: string) {
  const payload = verifyPreferenceToken(token)
  if (!payload) throw new Error('This preference link is invalid or expired')
  const [gallery, person, consents] = await Promise.all([
    selectGallery(payload.galleryId),
    selectPerson(payload.personId),
    selectGalleryConsents(payload.galleryId, payload.personId),
  ])
  if (!await isGalleryMember(payload.galleryId, payload.personId)) {
    throw new Error('This guest is no longer a member of the gallery')
  }
  const [emailSuppressed, smsSuppressed] = await Promise.all([
    person.email ? isDestinationSuppressed('email', person.email) : false,
    person.phone ? isDestinationSuppressed('sms', person.phone) : false,
  ])
  return { payload, gallery, person, consents, suppressions: { email: emailSuppressed, sms: smsSuppressed } }
}

export async function GET(_: Request, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params
    const { gallery, person, consents, suppressions } = await context(token)
    return NextResponse.json({
      gallery: { id: gallery.id, name: gallery.name },
      person: { name: person.name, email: person.email, phone: person.phone },
      preferences: {
        email: !suppressions.email && consents.some((consent) => consent.channel === 'email' && consent.status === 'opted_in'),
        sms: !suppressions.sms && consents.some((consent) => consent.channel === 'sms' && consent.status === 'opted_in'),
      },
      suppressions,
    })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Preferences unavailable' }, { status: 404 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params
    const { payload, gallery, person, suppressions } = await context(token)
    const input = z.object({ email: z.boolean(), sms: z.boolean() }).parse(await request.json())
    if (input.email && !person.email) throw new Error('Add an email address before enabling email reminders')
    if (input.sms && !person.phone) throw new Error('Add a phone number before enabling SMS reminders')
    if (input.email && suppressions.email) throw new Error('This email address is unsubscribed or suppressed and cannot be re-enabled here')
    if (input.sms && suppressions.sms) throw new Error('Reply START from this phone before re-enabling SMS reminders')
    const consents = await setGalleryConsents({
      galleryId: payload.galleryId,
      personId: payload.personId,
      emailOptIn: input.email,
      smsOptIn: input.sms,
      source: 'preference_center',
      userAgent: request.headers.get('user-agent'),
      ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim(),
    })
    await sendConsentConfirmations(gallery, person, consents)
    return NextResponse.json({ success: true, preferences: input })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Could not update preferences' }, { status: 400 })
  }
}
