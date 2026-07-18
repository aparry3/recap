import { selectGallery } from '@/lib/db/galleryService'
import { selectPerson } from '@/lib/db/personService'
import {
  countGallerySmsMessages,
  isRecipientEligible,
  isDestinationSuppressed,
  normalizeEmail,
  normalizeUsPhone,
  selectGalleryConsents,
  selectEligibleRecipients,
  smsReservationExceedsLimit,
} from '@/lib/db/communicationService'
import {
  claimDeliveryForSubmission,
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
import { buildReminderSmsBody } from '@/lib/reminders/message'

export function messagingEnabled(): boolean {
  return process.env.MESSAGING_ENABLED === 'true'
}

function galleryUrl(gallery: Gallery): string {
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000'
  return new URL(`/${gallery.path}`, baseUrl).toString()
}

async function submitEmail(input: {
  gallery: Gallery
  person: Pick<Person, 'id' | 'name' | 'email'>
  subject: string
  body: string
  deliveryId: string
  confirmation?: boolean
}): Promise<void> {
  if (!messagingEnabled()) throw new Error('Messaging is disabled')
  const email = normalizeEmail(input.person.email)
  if (!email) throw new Error('Guest has no email address')
  const data = {
    email,
    name: input.person.name,
    galleryName: input.gallery.name,
    galleryUrl: galleryUrl(input.gallery),
    preferenceUrl: preferenceUrl(input.gallery.id, input.person.id),
    deliveryId: input.deliveryId,
  }
  const providerMessageId = input.confirmation
    ? await sendGridClient.sendReminderConfirmation(data)
    : await sendGridClient.sendReminderEmail({ ...data, subject: input.subject, body: input.body })
  await updateDelivery(input.deliveryId, { status: 'submitted', providerMessageId, submittedAt: new Date() })
}

async function submitSms(input: {
  gallery: Gallery
  person: Pick<Person, 'id' | 'name' | 'phone'>
  body: string
  deliveryId: string
}): Promise<void> {
  if (!messagingEnabled()) throw new Error('Messaging is disabled')
  const phone = normalizeUsPhone(input.person.phone)
  if (!phone) throw new Error('Guest has no valid US phone number')
  const galleryLink = galleryUrl(input.gallery)
  const providerMessageId = await sendSms({
    to: phone,
    deliveryId: input.deliveryId,
    body: buildReminderSmsBody(input.body, galleryLink),
  })
  await updateDelivery(input.deliveryId, { status: 'submitted', providerMessageId, submittedAt: new Date() })
}

export async function sendConsentConfirmations(
  gallery: Gallery,
  person: Pick<Person, 'id' | 'name' | 'email' | 'phone'>,
  consents: CommunicationConsent[],
): Promise<void> {
  if (!messagingEnabled()) return
  for (const consent of consents.filter((item) => item.status === 'opted_in')) {
    if (!await isRecipientEligible(gallery.id, person.id, consent.channel)) continue
    const delivery = await insertDelivery({
      reminderId: null,
      galleryId: gallery.id,
      personId: person.id,
      channel: consent.channel,
      purpose: 'consent_confirmation',
      status: 'pending',
      providerMessageId: null,
      idempotencyKey: `consent:${consent.id}:${consent.updatedAt.getTime()}`,
      attemptCount: 0,
      lastError: null,
      submittedAt: null,
      deliveredAt: null,
    })
    if (!delivery) continue
    try {
      if (consent.channel === 'email') {
        const email = normalizeEmail(person.email)
        if (!email || await isDestinationSuppressed('email', email)) {
          await updateDelivery(delivery.id, { status: 'suppressed', lastError: 'Email is unavailable or suppressed' })
          continue
        }
        if (!await claimDeliveryForSubmission(delivery.id)) continue
        await submitEmail({ gallery, person, subject: '', body: '', deliveryId: delivery.id, confirmation: true })
      } else {
        const phone = normalizeUsPhone(person.phone)
        if (!phone || await isDestinationSuppressed('sms', phone)) {
          await updateDelivery(delivery.id, { status: 'suppressed', lastError: 'Phone is unavailable or suppressed' })
          continue
        }
        const used = await countGallerySmsMessages(gallery.id, person.id)
        if (smsReservationExceedsLimit(used)) {
          await updateDelivery(delivery.id, { status: 'suppressed', lastError: 'SMS message limit reached' })
          continue
        }
        if (!await claimDeliveryForSubmission(delivery.id)) continue
        await submitSms({
          gallery,
          person,
          deliveryId: delivery.id,
          body: `You're subscribed to up to 10 automated ${gallery.name} updates from Recap. Msg & data rates may apply.`,
        })
      }
    } catch (error) {
      await updateDelivery(delivery.id, { status: 'unknown', lastError: error instanceof Error ? error.message : 'Confirmation submission is uncertain' })
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
      if (smsReservationExceedsLimit(used)) {
        await updateDelivery(delivery.id, { status: 'suppressed', lastError: 'SMS message limit reached' })
        return
      }
    }

    try {
      if (!await claimDeliveryForSubmission(delivery.id)) return
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
        status: 'unknown',
        lastError: error instanceof Error ? error.message : 'Provider submission is uncertain',
      })
    }
  })

  for (let index = 0; index < tasks.length; index += 10) {
    await Promise.all(tasks.slice(index, index + 10).map((task) => task()))
  }
}

export async function dispatchReminder(reminder: Reminder): Promise<void> {
  if (!messagingEnabled()) return
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
