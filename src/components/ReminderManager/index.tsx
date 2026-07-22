'use client'

import Button from '@/components/Button'
import Input from '@/components/Input'
import {
  createReminder,
  deleteReminder,
  fetchReminders,
  generateReminders,
  reminderAction,
  ReminderWithDeliveries,
  updateReminder,
} from '@/helpers/api/reminderClient'
import { Gallery } from '@/lib/types/Gallery'
import { GeneratedReminderDraft, ReminderDraftInput } from '@/lib/types/Reminder'
import { resolveGalleryLocalDateTime } from '@/lib/reminders/time'
import { buildReminderSmsBody, estimateSmsSegments } from '@/lib/reminders/message'
import { DateTime } from 'luxon'
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { Column, Container, Row, Text } from 'react-web-layout-components'
import styles from './ReminderManager.module.scss'

const emptyDraft = (): ReminderDraftInput => ({
  title: '',
  sendAt: null,
  sendEmail: true,
  sendSms: true,
  emailSubject: '',
  emailBody: '',
  smsBody: '',
  source: 'manual',
})

function localInputValue(sendAt: string | Date | null | undefined, timezone: string): string {
  if (!sendAt) return ''
  return DateTime.fromISO(typeof sendAt === 'string' ? sendAt : sendAt.toISOString())
    .setZone(timezone)
    .toFormat("yyyy-MM-dd'T'HH:mm")
}

export default function ReminderManager({ gallery }: { gallery: Gallery }) {
  const [reminders, setReminders] = useState<ReminderWithDeliveries[]>([])
  const [audience, setAudience] = useState({ email: 0, sms: 0 })
  const [draft, setDraft] = useState<ReminderDraftInput>(emptyDraft)
  const [sendAtLocal, setSendAtLocal] = useState('')
  const [editing, setEditing] = useState<ReminderWithDeliveries | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [showAi, setShowAi] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState(gallery.theknot || gallery.zola || '')
  const [invitation, setInvitation] = useState<File | undefined>()
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState<GeneratedReminderDraft[]>([])
  const [globalWarnings, setGlobalWarnings] = useState<string[]>([])

  const load = useCallback(async () => {
    try {
      const data = await fetchReminders(gallery.id)
      setReminders(data.reminders)
      setAudience(data.audience)
      setError('')
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Could not load reminders')
    } finally {
      setLoading(false)
    }
  }, [gallery.id])

  useEffect(() => { void load() }, [load])

  const sendAtResolution = useMemo(() => sendAtLocal
    ? resolveGalleryLocalDateTime(sendAtLocal, gallery.timezone)
    : { utc: null, local: null }, [gallery.timezone, sendAtLocal])
  const smsPreview = useMemo(() => buildReminderSmsBody(
    draft.smsBody || '',
    `${(process.env.NEXT_PUBLIC_BASE_URL || 'https://ourweddingrecap.com').replace(/\/$/, '')}/${gallery.path}`,
  ), [draft.smsBody, gallery.path])

  const payload = useMemo((): ReminderDraftInput => ({
    ...draft,
    sendAt: sendAtResolution.utc,
  }), [draft, sendAtResolution.utc])

  const reset = () => {
    setDraft(emptyDraft())
    setSendAtLocal('')
    setEditing(null)
  }

  const save = async () => {
    if (sendAtLocal && sendAtResolution.error) {
      setError(sendAtResolution.error)
      return
    }
    setSaving(true)
    setError('')
    try {
      if (editing) await updateReminder(gallery.id, editing.id, editing.version, payload)
      else await createReminder(gallery.id, payload)
      reset()
      await load()
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save reminder')
    } finally {
      setSaving(false)
    }
  }

  const edit = (reminder: ReminderWithDeliveries) => {
    setEditing(reminder)
    setDraft({
      title: reminder.title,
      sendAt: reminder.sendAt ? new Date(reminder.sendAt).toISOString() : null,
      sendEmail: reminder.sendEmail,
      sendSms: reminder.sendSms,
      emailSubject: reminder.emailSubject || '',
      emailBody: reminder.emailBody || '',
      smsBody: reminder.smsBody || '',
      source: reminder.source,
      sourceDetails: reminder.sourceDetails,
    })
    setSendAtLocal(localInputValue(reminder.sendAt, gallery.timezone))
    document.getElementById('reminder-editor')?.scrollIntoView({ behavior: 'smooth' })
  }

  const act = async (reminder: ReminderWithDeliveries, action: 'schedule' | 'send_now' | 'cancel') => {
    const prompt = action === 'send_now'
      ? `Send “${reminder.title}” now to all eligible guests? This cannot be recalled.`
      : action === 'schedule'
        ? `Schedule “${reminder.title}” for ${localInputValue(reminder.sendAt, gallery.timezone).replace('T', ' ')} ${gallery.timezone}?`
        : `Cancel “${reminder.title}”?`
    if (!window.confirm(prompt)) return
    try {
      await reminderAction(gallery.id, reminder.id, reminder.version, action)
      await load()
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : 'Reminder action failed')
    }
  }

  const remove = async (reminder: ReminderWithDeliveries) => {
    if (!window.confirm(`Delete “${reminder.title}”?`)) return
    try {
      await deleteReminder(gallery.id, reminder.id)
      await load()
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Could not delete reminder')
    }
  }

  const generate = async () => {
    setGenerating(true)
    setError('')
    try {
      const result = await generateReminders(gallery.id, {
        prompt: aiPrompt,
        websiteUrl: websiteUrl || undefined,
        invitation,
        sendEmail: draft.sendEmail,
        sendSms: draft.sendSms,
      })
      setGenerated(result.drafts)
      setGlobalWarnings(result.globalWarnings)
    } catch (generationError) {
      setError(generationError instanceof Error ? generationError.message : 'Could not generate reminders')
    } finally {
      setGenerating(false)
    }
  }

  const selectGeneratedDraft = (generatedDraft: GeneratedReminderDraft) => {
    setDraft({ ...generatedDraft, sendAt: generatedDraft.sendAt || null })
    setSendAtLocal(localInputValue(generatedDraft.sendAt, gallery.timezone))
    setShowAi(false)
    document.getElementById('reminder-editor')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <Column className={styles.manager}>
      <Column className={styles.heading}>
        <Text size={2} weight={600}>Reminders</Text>
        <Text>Send simple email and text updates to guests who opted in.</Text>
        <Text size={0.95}>Opted in now: {audience.email} email · {audience.sms} SMS</Text>
      </Column>

      {error && <Container className={styles.error}><Text>{error}</Text></Container>}

      <Column className={styles.list}>
        {loading && <Text>Loading reminders…</Text>}
        {!loading && reminders.length === 0 && <Text>No reminders yet. Create one below or ask AI to draft them.</Text>}
        {reminders.map((reminder) => (
          <Column key={reminder.id} className={styles.card}>
            <Row className={styles.cardHeader}>
              <Column className={styles.cardTitle}>
                <Text size={1.25} weight={600}>{reminder.title}</Text>
                <Text size={0.9}>{reminder.status.toUpperCase()} · {reminder.sendAt ? DateTime.fromISO(String(reminder.sendAt)).setZone(gallery.timezone).toLocaleString(DateTime.DATETIME_MED) : 'No send time'}</Text>
              </Column>
              <Text>{reminder.sendEmail ? 'Email' : ''}{reminder.sendEmail && reminder.sendSms ? ' + ' : ''}{reminder.sendSms ? 'SMS' : ''}</Text>
            </Row>
            {Object.keys(reminder.deliveries).length > 0 && <Text size={0.9}>Delivery: {Object.entries(reminder.deliveries).map(([status, count]) => `${status} ${count}`).join(' · ')}</Text>}
            <Row className={styles.actions}>
              {(reminder.status === 'draft' || reminder.status === 'scheduled') && <Button onClick={() => edit(reminder)}>Edit</Button>}
              {reminder.status === 'draft' && <Button onClick={() => act(reminder, 'schedule')}>Schedule</Button>}
              {reminder.status === 'draft' && <Button onClick={() => act(reminder, 'send_now')}>Send now</Button>}
              {reminder.status === 'scheduled' && <Button onClick={() => act(reminder, 'cancel')}>Cancel</Button>}
              {(reminder.status === 'draft' || reminder.status === 'canceled') && <Button onClick={() => remove(reminder)}>Delete</Button>}
            </Row>
          </Column>
        ))}
      </Column>

      <Column id="reminder-editor" className={styles.editor}>
        <Row className={styles.editorHeader}>
          <Text size={1.5} weight={600}>{editing ? 'Edit reminder' : 'Add reminder'}</Text>
          <Button onClick={() => setShowAi(!showAi)}>{showAi ? 'Close AI drafts' : 'Draft with AI'}</Button>
        </Row>

        {showAi && (
          <Column className={styles.aiPanel}>
            <Text weight={600}>Create drafts from an invitation, The Knot/Zola, or your instructions</Text>
            <textarea value={aiPrompt} onChange={(event) => setAiPrompt(event.target.value)} placeholder="Example: Create a welcome, day-of, and morning-after reminder." />
            <Input label="The Knot or Zola URL (Optional)" type="url" value={websiteUrl} onChange={(value) => setWebsiteUrl(value || '')} />
            <label className={styles.fileLabel}>Invitation (PDF, JPEG, PNG, WebP, HEIC, or HEIF; max 4 MB)
              <input type="file" accept=".pdf,.jpg,.jpeg,.png,.webp,.heic,.heif" onChange={(event: ChangeEvent<HTMLInputElement>) => setInvitation(event.target.files?.[0])} />
            </label>
            <Button onClick={generate} disabled={generating || (!aiPrompt && !websiteUrl && !invitation)}>{generating ? 'Creating drafts…' : 'Create drafts'}</Button>
            {globalWarnings.map((warning) => <Text key={warning} className={styles.warning}>Warning: {warning}</Text>)}
            {generated.map((item, index) => (
              <Column key={`${item.title}-${index}`} className={styles.generated}>
                <Text weight={600}>{item.title}</Text>
                <Text>{item.sendAtLocal ? `${DateTime.fromISO(item.sendAtLocal, { setZone: true }).toLocaleString(DateTime.DATETIME_MED)} (${gallery.timezone})` : 'Send time needs review'}</Text>
                {item.emailSubject && <Text size={0.95}>Email subject: {item.emailSubject}</Text>}
                {item.emailBody && <Text size={0.95} className={styles.preformatted}>Email: {item.emailBody}</Text>}
                {item.smsBody && <Text size={0.95}>SMS: {item.smsBody}</Text>}
                {item.evidence.length > 0 && (
                  <Column>
                    <Text size={0.9} weight={600}>Grounded in:</Text>
                    {item.evidence.map((evidence, evidenceIndex) => <Text key={`${evidence}-${evidenceIndex}`} size={0.85}>• {evidence}</Text>)}
                  </Column>
                )}
                {item.warnings.map((warning) => <Text key={warning} className={styles.warning}>{warning}</Text>)}
                <Button onClick={() => selectGeneratedDraft(item)}>Edit this draft</Button>
              </Column>
            ))}
          </Column>
        )}

        <Input label="Reminder title" value={draft.title} onChange={(value) => setDraft({ ...draft, title: value || '' })} />
        <label className={styles.nativeField}>Send date and time ({gallery.timezone})
          <input type="datetime-local" value={sendAtLocal} onChange={(event) => setSendAtLocal(event.target.value)} />
        </label>
        {sendAtLocal && sendAtResolution.error && <Text className={styles.error}>{sendAtResolution.error}</Text>}
        <Row className={styles.channels}>
          <label><input type="checkbox" checked={draft.sendEmail} onChange={(event) => setDraft({ ...draft, sendEmail: event.target.checked })} /> Email ({audience.email} opted in)</label>
          <label><input type="checkbox" checked={draft.sendSms} onChange={(event) => setDraft({ ...draft, sendSms: event.target.checked })} /> SMS ({audience.sms} opted in)</label>
        </Row>
        {draft.sendEmail && (
          <Column className={styles.channelFields}>
            <Input label="Email subject" value={draft.emailSubject || ''} onChange={(value) => setDraft({ ...draft, emailSubject: value || '' })} />
            <label>Email message<textarea value={draft.emailBody || ''} onChange={(event) => setDraft({ ...draft, emailBody: event.target.value })} /></label>
            <Text size={0.9}>Our Wedding Recap adds the branded layout, gallery button, address, and unsubscribe link.</Text>
          </Column>
        )}
        {draft.sendSms && (
          <Column className={styles.channelFields}>
            <label>SMS message<textarea value={draft.smsBody || ''} onChange={(event) => setDraft({ ...draft, smsBody: event.target.value })} /></label>
            <Text size={0.9}>{smsPreview.length} final characters · about {estimateSmsSegments(smsPreview)} segment(s), including the gallery link and STOP/HELP text.</Text>
          </Column>
        )}
        {(draft.emailBody || draft.smsBody) && (
          <Column className={styles.preview}>
            <Text weight={600}>Preview</Text>
            {draft.sendEmail && draft.emailBody && (
              <Column className={styles.emailPreview}>
                <Text size={0.85}>OUR WEDDING RECAP · {gallery.name}</Text>
                <Text weight={600}>{draft.emailSubject || 'Email subject'}</Text>
                <Text className={styles.preformatted}>{draft.emailBody}</Text>
                <Container className={styles.previewCta}>View &amp; upload photos</Container>
              </Column>
            )}
            {draft.sendSms && draft.smsBody && (
              <Container className={`${styles.smsPreview} ${styles.preformatted}`}>
                {smsPreview}
              </Container>
            )}
          </Column>
        )}
        <Row className={styles.actions}>
          <Button onClick={save} disabled={saving || !draft.title || (!draft.sendEmail && !draft.sendSms)}>{saving ? 'Saving…' : editing ? 'Save changes' : 'Save draft'}</Button>
          {editing && <Button onClick={reset}>Discard changes</Button>}
        </Row>
      </Column>
    </Column>
  )
}
