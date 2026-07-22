'use client'

import Button from '@/components/Button'
import { useEffect, useState } from 'react'
import { Column, Container, Row, Text } from 'react-web-layout-components'
import styles from './Preferences.module.scss'

interface PreferenceData {
  gallery: { name: string }
  person: { name: string; email?: string; phone?: string }
  preferences: { email: boolean; sms: boolean }
  suppressions: { email: boolean; sms: boolean }
}

export default function PreferenceCenter({ token }: { token: string }) {
  const [data, setData] = useState<PreferenceData | null>(null)
  const [email, setEmail] = useState(false)
  const [sms, setSms] = useState(false)
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch(`/api/preferences/${encodeURIComponent(token)}`).then(async (response) => {
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error)
      setData(payload)
      setEmail(payload.preferences.email)
      setSms(payload.preferences.sms)
    }).catch((error) => setMessage(error.message))
  }, [token])

  const save = async () => {
    setSaving(true)
    setMessage('')
    try {
      const response = await fetch(`/api/preferences/${encodeURIComponent(token)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, sms }),
      })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error)
      setMessage('Your communication preferences have been saved.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not save preferences')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Container as="main" className={styles.page}>
      <Column className={styles.card}>
        <Text size={1.1} className={styles.eyebrow}>Recap</Text>
        <Text size={2.2} weight={600}>Communication preferences</Text>
        {data && <Text size={1.2}>{data.person.name}, choose how you hear about {data.gallery.name}.</Text>}
        {data && (
          <Column className={styles.options}>
            <Row className={styles.option}>
              <input id="email-reminders" type="checkbox" checked={email} disabled={!data.person.email || data.suppressions.email} onChange={(event) => setEmail(event.target.checked)} />
              <label htmlFor="email-reminders">Email reminders {data.person.email ? `to ${data.person.email}` : '(no email available)'}</label>
            </Row>
            {data.suppressions.email && <Text size={0.9}>This email address is unsubscribed or suppressed and cannot be re-enabled here.</Text>}
            <Row className={styles.option}>
              <input id="sms-reminders" type="checkbox" checked={sms} disabled={!data.person.phone || data.suppressions.sms} onChange={(event) => setSms(event.target.checked)} />
              <label htmlFor="sms-reminders">SMS reminders {data.person.phone ? `to ${data.person.phone}` : '(no phone available)'}</label>
            </Row>
            {data.suppressions.sms && <Text size={0.9}>Reply START from this phone, then reload this page to make SMS available again.</Text>}
            <Text size={0.9}>SMS updates are limited to 10 messages for this gallery. Message and data rates may apply. Reply STOP to stop or HELP for help.</Text>
            <Button onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save preferences'}</Button>
          </Column>
        )}
        {message && <Text className={styles.message}>{message}</Text>}
      </Column>
    </Container>
  )
}
