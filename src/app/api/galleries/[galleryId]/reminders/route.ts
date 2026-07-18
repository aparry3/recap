import { AuthorizationError, requireGalleryManager } from '@/lib/auth/gallery'
import { countEligibleAudience, insertReminder, selectGalleryReminders, selectReminderDeliveries } from '@/lib/db/reminderService'
import { reminderDraftSchema } from '@/lib/validation/reminder'
import { NextResponse } from 'next/server'

function errorResponse(error: unknown) {
  if (error instanceof AuthorizationError) return NextResponse.json({ error: error.message }, { status: error.status })
  return NextResponse.json({ error: error instanceof Error ? error.message : 'Reminder request failed' }, { status: 400 })
}

export async function GET(_: Request, { params }: { params: Promise<{ galleryId: string }> }) {
  try {
    const { galleryId } = await params
    await requireGalleryManager(galleryId)
    const reminders = await selectGalleryReminders(galleryId)
    const [emailAudience, smsAudience, deliveries] = await Promise.all([
      countEligibleAudience(galleryId, 'email'),
      countEligibleAudience(galleryId, 'sms'),
      Promise.all(reminders.map((reminder) => selectReminderDeliveries(reminder.id))),
    ])
    return NextResponse.json({
      reminders: reminders.map((reminder, index) => ({
        ...reminder,
        deliveries: deliveries[index].reduce<Record<string, number>>((summary, delivery) => {
          summary[delivery.status] = (summary[delivery.status] ?? 0) + 1
          return summary
        }, {}),
      })),
      audience: { email: emailAudience, sms: smsAudience },
    })
  } catch (error) {
    return errorResponse(error)
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ galleryId: string }> }) {
  try {
    const { galleryId } = await params
    const { person } = await requireGalleryManager(galleryId)
    const input = reminderDraftSchema.parse(await request.json())
    const reminder = await insertReminder(galleryId, person.id, input)
    return NextResponse.json({ reminder }, { status: 201 })
  } catch (error) {
    return errorResponse(error)
  }
}
