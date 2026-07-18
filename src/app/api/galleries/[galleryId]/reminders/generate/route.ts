import { generateReminderDrafts } from '@/lib/ai/reminderAgent'
import { AuthorizationError, requireGalleryManager } from '@/lib/auth/gallery'
import { NextResponse } from 'next/server'

export const maxDuration = 60

export async function POST(request: Request, { params }: { params: Promise<{ galleryId: string }> }) {
  try {
    const { galleryId } = await params
    const { gallery } = await requireGalleryManager(galleryId)
    const formData = await request.formData()
    const websiteUrl = formData.get('websiteUrl')?.toString().trim() || undefined
    const prompt = formData.get('prompt')?.toString().trim() || undefined
    const invitationValue = formData.get('invitation')
    const invitation = invitationValue instanceof File && invitationValue.size ? invitationValue : undefined
    const sendEmail = formData.get('sendEmail') === 'true'
    const sendSms = formData.get('sendSms') === 'true'

    const result = await generateReminderDrafts({ gallery, prompt, websiteUrl, invitation, sendEmail, sendSms })
    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof AuthorizationError) return NextResponse.json({ error: error.message }, { status: error.status })
    console.error('Reminder generation failed:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Reminder generation failed' }, { status: 400 })
  }
}
