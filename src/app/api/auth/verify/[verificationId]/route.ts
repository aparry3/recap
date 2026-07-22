import { setAuthSessionCookie } from '@/lib/auth/session'
import { selectGallery } from '@/lib/db/galleryService'
import { consumeVerification } from '@/lib/db/personService'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: Promise<{ verificationId: string }> }) {
  const { verificationId } = await params
  return NextResponse.redirect(new URL(`/verification/${verificationId}`, request.url))
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ verificationId: string }> }) {
  try {
    const { verificationId } = await params
    const verification = await consumeVerification(verificationId)
    await setAuthSessionCookie(verification.personId)

    if (verification.galleryId) {
      const gallery = await selectGallery(verification.galleryId)
      return NextResponse.redirect(new URL(`/${gallery.path}?password=${encodeURIComponent(gallery.password)}`, request.url))
    }
    return NextResponse.redirect(new URL('/galleries', request.url))
  } catch {
    return NextResponse.redirect(new URL('/?verification=invalid', request.url))
  }
}
