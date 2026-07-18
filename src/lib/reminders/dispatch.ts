import { selectGallery } from '@/lib/db/galleryService'
import { selectPerson } from '@/lib/db/personService'
import {
  countGallerySmsMessages,
  isRecipientEligible,
  isDestinationSuppressed,
  selectGalleryConsents,
  selectEligibleRecipients,
  SMS_MESSAGE_LIMIT,
} from '@/lib/db/communicationService'
import {
  finishReminder,
  insertDelivery,
  updateDelivery,
} from '@/lib/db/reminderService'
import { CommunicationConsent } from '@/lib/types/Communication'
import { Gallery } from '@/lib/types/Gallery'
import { Person } from '@/lib/types/Person'
import { Reminder } from '@/lib/types/Reminder'
import { sendGridClient } from '@/lib/email'
import { preferenceUrl } from '@/lib/preferences'
import { sendSms } from '@/lib/sms'

export function messagingEnabled(): boolean {
  return process.env.MESSAGING_ENABLED === 'true'
}

function galleryUrl(gallery: Gallery): string {
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000'
  return `${baseUrl}/${gallery.path}`
}

async function submitEmail(input: {
  gallery: Gallery
  person: Pick<Person, 'id' | 'name' | 'email'>
  subject: string
  body: string
  deliveryId: string
  confirmation?: boolean
}): Promise<void> {
  if (!input.person.email) throw new Error('Guest has no email address')
  const data = {
    email: input.person.email,
    name: input.person.name,
    galleryName: input.gallery.name,
    galleryUrl: galleryUrl(input.gallery),
    preferenceUrl: preferenceUrl(input.gallery.id, input.person.id),
    deliveryId: input.deliveryId,
  }
  const providerMessageId = input.confirmation
    ? await sendGridClient.sendReminderConfirmation(data)
    : await sendGridClient.sendReminderEmail({ ...data, subject: input.subject, body: input.body })
  await updateDelivery(input.deliveryId, { status: 'submitted', providerMessageId, submittedAt: new Date(), incrementAttempts: true })
}

async function submitSms(input: {
  gallery: Gallery
  person: Pick<Person, 'id' | 'name' | 'phone'>
  body: string
  deliveryId: string
}): Promise<void> {
  if (!input.person.phone) throw new Error('Guest has no phone number')
  const galleryLink = galleryUrl(input.gallery)
  const providerMessageId = await sendSms({
    to: input.person.phone,
    deliveryId: input.deliveryId,
    body: `${input.body}\n\nView & upload: ${galleryLink}\nReply STOP to stop, HELP for help.`,
  })
  await updateDelivery(input.deliveryId, { status: 'submitted', providerMessageId, submittedAt: new Date(), incrementAttempts: true })
}

export async function sendConsentConfirmations(
  gallery: Gallery,
  person: Pick<Person, 'id' | 'name' | 'email' | 'phone'>,
  consents: CommunicationConsent[],
): Promise<void> {
  if (!messagingEnabled()) return
  for (const consent of consents.filter((item) => item.status === 'opted_in')) {
    const delivery = await insertDelivery({
      reminderId: null,
      galleryId: gallery.id,
      personId: person.id,
      channel: consent.channel,
      purpose: 'consent_confirmation',
      status: 'pending',
      providerMessageId: null,
      idempotencyKey: `consent:${gallery.id}:${person.id}:${consent.channel}:${consent.disclosureVersion}`,
      attemptCount: 0,
      lastError: null,
      submittedAt: null,
      deliveredAt: null,
    })
    if (!delivery) continue
    try {
      if (consent.channel === 'email') {
        if (!person.email || await isDestinationSuppressed('email', person.email)) {
          await updateDelivery(delivery.id, { status: 'suppressed', lastError: 'Email is unavailable or suppressed' })
          continue
        }
        await submitEmail({ gallery, person, subject: '', body: '', deliveryId: delivery.id, confirmation: true })
      } else {
        if (!person.phone || await isDestinationSuppressed('sms', person.phone)) {
          await updateDelivery(delivery.id, { status: 'suppressed', lastError: 'Phone is unavailable or suppressed' })
          continue
        }
        const used = await countGallerySmsMessages(gallery.id, person.id)
        if (used > SMS_MESSAGE_LIMIT) {
          await updateDelivery(delivery.id, { status: 'suppressed', lastError: 'SMS message limit reached' })
          continue
        }
        await submitSms({
          gallery,
          person,
          deliveryId: delivery.id,
          body: `You're subscribed to up to 10 automated ${gallery.name} updates from Recap. Msg & data rates may apply.`,
        })
      }
    } catch (error) {
      await updateDelivery(delivery.id, { status: 'failed', lastError: error instanceof Error ? error.message : 'Confirmation failed', incrementAttempts: true })
    }
  }
}

async function dispatchChannel(reminder: Reminder, channel: 'email' | 'sms'): Promise<void> {
  const gallery = await selectGallery(reminder.galleryId)
  const recipients = await selectEligibleRecipients(reminder.galleryId, channel)

  const tasks = recipients.map((recipient) => async () => {
    const destination = channel === 'email' ? recipient.email : recipient.phone
    const consent = (await selectGalleryConsents(reminder.galleryId, recipient.personId))
      .find((item) => item.channel === channel && item.status === 'opted_in')
    if (!consent) return
    await sendConsentConfirmations(gallery, {
      id: recipient.personId,
      name: recipient.name,
      email: recipient.email ?? undefined,
      phone: recipient.phone ?? undefined,
    }, [consent])
    const delivery = await insertDelivery({
      reminderId: reminder.id,
      galleryId: reminder.galleryId,
      personId: recipient.personId,
      channel,
      purpose: 'reminder',
      status: 'pending',
      providerMessageId: null,
      idempotencyKey: `reminder:${reminder.id}:${recipient.personId}:${channel}`,
      attemptCount: 0,
      lastError: null,
      submittedAt: null,
      deliveredAt: null,
    })
    if (!delivery) return
    if (!destination || await isDestinationSuppressed(channel, destination)) {
      await updateDelivery(delivery.id, { status: 'suppressed', lastError: 'Destination is unavailable or suppressed' })
      return
    }
    if (!await isRecipientEligible(reminder.galleryId, recipient.personId, channel)) {
      await updateDelivery(delivery.id, { status: 'suppressed', lastError: 'Guest is no longer opted in to this gallery' })
      return
    }
    if (channel === 'sms') {
      const used = await countGallerySmsMessages(reminder.galleryId, recipient.personId)
      if (used > SMS_MESSAGE_LIMIT) {
        await updateDelivery(delivery.id, { status: 'suppressed', lastError: 'SMS message limit reached' })
        return
      }
    }

    try {
      if (channel === 'email') {
        await submitEmail({
          gallery,
          person: { id: recipient.personId, name: recipient.name, email: recipient.email ?? undefined },
          subject: reminder.emailSubject!,
          body: reminder.emailBody!,
          deliveryId: delivery.id,
        })
      } else {
        await submitSms({
          gallery,
          person: { id: recipient.personId, name: recipient.name, phone: recipient.phone ?? undefined },
          body: reminder.smsBody!,
          deliveryId: delivery.id,
        })
      }
    } catch (error) {
      await updateDelivery(delivery.id, {
        status: 'failed',
        lastError: error instanceof Error ? error.message : 'Provider submission failed',
        incrementAttempts: true,
      })
    }
  })

  for (let index = 0; index < tasks.length; index += 10) {
    await Promise.all(tasks.slice(index, index + 10).map((task) => task()))
  }
}

export async function dispatchReminder(reminder: Reminder): Promise<void> {
  try {
    if (reminder.sendEmail) await dispatchChannel(reminder, 'email')
    if (reminder.sendSms) await dispatchChannel(reminder, 'sms')
    await finishReminder(reminder.id)
  } catch (error) {
    console.error(`Reminder ${reminder.id} dispatch failed`, error)
    await finishReminder(reminder.id, true)
  }
}

export async function hydrateConfirmationContext(galleryId: string, personId: string) {
  return Promise.all([selectGallery(galleryId), selectPerson(personId)])
}
