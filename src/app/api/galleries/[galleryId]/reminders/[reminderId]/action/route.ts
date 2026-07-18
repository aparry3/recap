import { AuthorizationError, requireGalleryManager } from '@/lib/auth/gallery'
import { cancelReminder, scheduleReminder, selectReminder } from '@/lib/db/reminderService'
import { reminderActionSchema } from '@/lib/validation/reminder'
import { NextResponse } from 'next/server'

export async function POST(request: Request, { params }: { params: Promise<{ galleryId: string; reminderId: string }> }) {
  try {
    const { galleryId, reminderId } = await params
    await requireGalleryManager(galleryId)
    const reminder = await selectReminder(reminderId)
    if (reminder.galleryId !== galleryId) throw new AuthorizationError('Reminder does not belong to this gallery', 404)
    const input = reminderActionSchema.parse(await request.json())

    if (input.action === 'cancel') {
      return NextResponse.json({ reminder: await cancelReminder(reminderId, input.version) })
    }
    if (!reminder.sendAt && input.action === 'schedule') throw new Error('Choose a send date and time')
    if (reminder.sendEmail && (!reminder.emailSubject || !reminder.emailBody)) throw new Error('Email subject and message are required')
    if (reminder.sendSms && !reminder.smsBody) throw new Error('SMS message is required')
    if (!reminder.sendEmail && !reminder.sendSms) throw new Error('Choose at least one channel')

    const sendAt = input.action === 'send_now' ? new Date() : reminder.sendAt!
    if (input.action === 'schedule' && sendAt <= new Date()) throw new Error('Scheduled time must be in the future')
    return NextResponse.json({ reminder: await scheduleReminder(reminderId, input.version, sendAt) })
  } catch (error) {
    if (error instanceof AuthorizationError) return NextResponse.json({ error: error.message }, { status: error.status })
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Reminder action failed' }, { status: 400 })
  }
}
