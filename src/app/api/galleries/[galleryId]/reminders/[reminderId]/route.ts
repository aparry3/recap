import { AuthorizationError, requireGalleryManager } from '@/lib/auth/gallery'
import { deleteReminder, selectReminder, updateReminderDraft } from '@/lib/db/reminderService'
import { reminderUpdateSchema } from '@/lib/validation/reminder'
import { NextResponse } from 'next/server'

function errorResponse(error: unknown) {
  if (error instanceof AuthorizationError) return NextResponse.json({ error: error.message }, { status: error.status })
  return NextResponse.json({ error: error instanceof Error ? error.message : 'Reminder request failed' }, { status: 400 })
}

async function authorizeReminder(galleryId: string, reminderId: string) {
  await requireGalleryManager(galleryId)
  const reminder = await selectReminder(reminderId)
  if (reminder.galleryId !== galleryId) throw new AuthorizationError('Reminder does not belong to this gallery', 404)
  return reminder
}

export async function PUT(request: Request, { params }: { params: Promise<{ galleryId: string; reminderId: string }> }) {
  try {
    const { galleryId, reminderId } = await params
    await authorizeReminder(galleryId, reminderId)
    const input = reminderUpdateSchema.parse(await request.json())
    const { version, ...draft } = input
    const reminder = await updateReminderDraft(reminderId, version, draft)
    return NextResponse.json({ reminder })
  } catch (error) {
    return errorResponse(error)
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ galleryId: string; reminderId: string }> }) {
  try {
    const { galleryId, reminderId } = await params
    await authorizeReminder(galleryId, reminderId)
    await deleteReminder(reminderId)
    return NextResponse.json({ success: true })
  } catch (error) {
    return errorResponse(error)
  }
}
