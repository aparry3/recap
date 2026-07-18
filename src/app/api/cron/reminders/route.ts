import { claimDueReminders } from '@/lib/db/reminderService'
import { dispatchReminder, messagingEnabled } from '@/lib/reminders/dispatch'
import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 60

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!messagingEnabled()) {
    return NextResponse.json({ dispatched: 0, messagingEnabled: false })
  }

  const reminders = await claimDueReminders(10)
  await Promise.all(reminders.map(dispatchReminder))
  return NextResponse.json({ dispatched: reminders.length, reminderIds: reminders.map((reminder) => reminder.id) })
}
