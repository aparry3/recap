import { GeneratedReminderDraft, Reminder, ReminderDraftInput } from '@/lib/types/Reminder'

export interface ReminderWithDeliveries extends Reminder {
  deliveries: Record<string, number>
}

async function parse<T>(response: Response): Promise<T> {
  const data = await response.json()
  if (!response.ok) throw new Error(data.error || 'Reminder request failed')
  return data as T
}

export async function fetchReminders(galleryId: string): Promise<{
  reminders: ReminderWithDeliveries[]
  audience: { email: number; sms: number }
}> {
  return parse(await fetch(`/api/galleries/${galleryId}/reminders`))
}

export async function createReminder(galleryId: string, input: ReminderDraftInput): Promise<Reminder> {
  const data = await parse<{ reminder: Reminder }>(await fetch(`/api/galleries/${galleryId}/reminders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  }))
  return data.reminder
}

export async function updateReminder(galleryId: string, reminderId: string, version: number, input: ReminderDraftInput): Promise<Reminder> {
  const data = await parse<{ reminder: Reminder }>(await fetch(`/api/galleries/${galleryId}/reminders/${reminderId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...input, version }),
  }))
  return data.reminder
}

export async function reminderAction(galleryId: string, reminderId: string, version: number, action: 'schedule' | 'send_now' | 'cancel'): Promise<Reminder> {
  const data = await parse<{ reminder: Reminder }>(await fetch(`/api/galleries/${galleryId}/reminders/${reminderId}/action`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, version }),
  }))
  return data.reminder
}

export async function deleteReminder(galleryId: string, reminderId: string): Promise<void> {
  await parse(await fetch(`/api/galleries/${galleryId}/reminders/${reminderId}`, { method: 'DELETE' }))
}

export async function generateReminders(galleryId: string, input: {
  prompt?: string
  websiteUrl?: string
  invitation?: File
  sendEmail: boolean
  sendSms: boolean
}): Promise<{ drafts: GeneratedReminderDraft[]; globalWarnings: string[] }> {
  const formData = new FormData()
  if (input.prompt) formData.set('prompt', input.prompt)
  if (input.websiteUrl) formData.set('websiteUrl', input.websiteUrl)
  if (input.invitation) formData.set('invitation', input.invitation)
  formData.set('sendEmail', String(input.sendEmail))
  formData.set('sendSms', String(input.sendSms))
  return parse(await fetch(`/api/galleries/${galleryId}/reminders/generate`, { method: 'POST', body: formData }))
}
