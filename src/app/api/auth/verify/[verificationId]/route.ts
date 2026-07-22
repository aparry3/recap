import { setAuthSessionCookie } from '@/lib/auth/session'
import { selectGallery } from '@/lib/db/galleryService'
import { consumeVerification } from '@/lib/db/personService'
import { selectPerson } from '@/lib/db/personService'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest, { params }: { params: Promise<{ verificationId: string }> }) {
  const { verificationId } = await params
  return NextResponse.redirect(new URL(`/verification/${verificationId}`, request.url))
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ verificationId: string }> }) {
  try {
    const { verificationId } = await params
    const verification = await consumeVerification(verificationId)
    await setAuthSessionCookie(verification.personId)
    const cookieStore = await cookies()
    cookieStore.set('personId', verification.personId, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
    })

    if (verification.galleryId) {
      const gallery = await selectGallery(verification.galleryId)
      return NextResponse.redirect(new URL(`/${gallery.path}?password=${encodeURIComponent(gallery.password)}`, request.url), 303)
    }
    const person = await selectPerson(verification.personId)
    return NextResponse.redirect(new URL(person.isAdmin ? '/admin' : '/galleries', request.url), 303)
  } catch {
    return NextResponse.redirect(new URL('/?verification=invalid', request.url), 303)
  }
}
