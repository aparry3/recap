import { setAuthSessionCookie } from '@/lib/auth/session'
import { verifyGalleryCreationToken } from '@/lib/auth/galleryCreationToken'
import { selectGallery } from '@/lib/db/galleryService'
import { consumeVerification, consumeVerificationAndCreateGallery, selectPerson } from '@/lib/db/personService'
import { emailClient } from '@/lib/email'
import { handleWeddingWebsites } from '@/lib/web'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export const maxDuration = 60

export async function GET(request: NextRequest, { params }: { params: Promise<{ verificationId: string }> }) {
  const { verificationId } = await params
  return NextResponse.redirect(new URL(`/verification/${verificationId}`, request.url))
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ verificationId: string }> }) {
  try {
    const { verificationId } = await params
    const galleryToken = request.nextUrl.searchParams.get('gallery')
    const pendingGallery = galleryToken ? verifyGalleryCreationToken(galleryToken) : null
    if (galleryToken && !pendingGallery) throw new Error('The gallery verification details are invalid or expired')

    if (pendingGallery) {
      const {verification, gallery, person} = await consumeVerificationAndCreateGallery(verificationId, pendingGallery)
      await setVerifiedPersonCookies(verification.personId)

      if (gallery.theknot || gallery.zola) {
        try {
          await handleWeddingWebsites(gallery)
        } catch (error) {
          console.error(`Wedding website import failed for verified gallery ${gallery.id}:`, error)
        }
      }
      if (person.email) {
        const [creationEmailSent, orderNotificationSent] = await Promise.all([
          emailClient.sendCreationEmail(person.email, person.name, `${process.env.BASE_URL}/${gallery.path}`, gallery.password),
          emailClient.sendOrderNotification({
            customerName: person.name,
            customerEmail: person.email,
            galleryName: gallery.name,
            galleryUrl: `${process.env.BASE_URL}/${gallery.path}`,
            orderDate: new Date().toISOString(),
          }),
        ])
        if (!creationEmailSent || !orderNotificationSent) {
          console.error(`Verified gallery ${gallery.id} created but email delivery failed: creationEmail=${creationEmailSent} orderNotification=${orderNotificationSent}`)
        }
      }

      return NextResponse.redirect(new URL(`/${gallery.path}?password=${encodeURIComponent(gallery.password)}`, request.url), 303)
    }

    const verification = await consumeVerification(verificationId)
    await setVerifiedPersonCookies(verification.personId)

    if (verification.galleryId) {
      const gallery = await selectGallery(verification.galleryId)
      return NextResponse.redirect(new URL(`/${gallery.path}?password=${encodeURIComponent(gallery.password)}`, request.url), 303)
    }
    const person = await selectPerson(verification.personId)
    return NextResponse.redirect(new URL(person.isAdmin ? '/admin' : '/galleries', request.url), 303)
  } catch (error) {
    console.error('Email verification failed:', error)
    return NextResponse.redirect(new URL('/?verification=invalid', request.url), 303)
  }
}

async function setVerifiedPersonCookies(personId: string): Promise<void> {
  await setAuthSessionCookie(personId)
  const cookieStore = await cookies()
  cookieStore.set('personId', personId, {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
  })
}
