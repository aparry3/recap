import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Column, Container, Row, Text } from 'react-web-layout-components'
import styles from './page.module.scss'

export const metadata: Metadata = {
  title: 'SMS Consent | Our Wedding Recap',
  description: 'How wedding guests optionally consent to Our Wedding Recap wedding gallery text messages.',
}

const SmsConsentPage = () => {
  return (
    <Column className={styles.page}>
      <Container className={styles.header}>
        <Link href="/" aria-label="Our Wedding Recap home">
          <Image src="/branding/wordmark.png" alt="Our Wedding Recap" width={100} height={40} />
        </Link>
      </Container>

      <Column className={styles.content}>
        <Column className={styles.intro}>
          <Text as="p" className={styles.eyebrow}>SMS CONSENT</Text>
          <Text as="h1" size={2.7} weight={700} className={styles.title}>
            How wedding guests opt in to Our Wedding Recap texts
          </Text>
          <Text as="p" size={1.1} className={styles.lede}>
            Our Wedding Recap sends optional, low-volume wedding updates only after a guest enters their own phone number and separately chooses SMS updates for a specific gallery.
          </Text>
        </Column>

        <Column className={styles.section}>
          <Text as="h2" size={1.8} weight={600}>The opt-in flow</Text>
          <ol className={styles.steps}>
            <li>The couple shares a password-protected Our Wedding Recap gallery link with their guests.</li>
            <li>A guest joins the gallery and enters their name. Email and phone fields are optional.</li>
            <li>The guest may check the separate, unchecked SMS consent box shown below.</li>
            <li>After submission, Our Wedding Recap records the consent and sends an enrollment confirmation.</li>
          </ol>
        </Column>

        <Column className={styles.demoSection}>
          <Text as="p" className={styles.demoLabel}>READ-ONLY EXAMPLE OF THE GALLERY JOIN FORM</Text>
          <Column className={styles.formCard}>
            <Column className={styles.field}>
              <label htmlFor="sms-demo-phone">Your Phone (Optional)</label>
              <input id="sms-demo-phone" type="tel" placeholder="(555) 555-1234" disabled />
            </Column>

            <Row className={styles.checkboxRow}>
              <input id="sms-demo-consent" type="checkbox" disabled />
              <Column className={styles.consentCopy}>
                <label htmlFor="sms-demo-consent">Text me wedding updates</label>
                <Text as="p">
                  By checking this box, you agree to receive automated wedding update texts about this gallery, including a confirmation. Message frequency varies. If you message Our Wedding Recap, we may send additional service responses to your request. Message and data rates may apply. Reply STOP to stop or HELP for help. Consent is optional and is not a condition of purchase. See our <Link href="/terms">Terms</Link> and <Link href="/privacy">Privacy Policy</Link>.
                </Text>
              </Column>
            </Row>
          </Column>
          <Text as="p" className={styles.note}>
            This page documents the consent experience for reviewers and guests; it does not collect a phone number or create an SMS subscription. Actual opt-in occurs inside a joined wedding gallery. Our Wedding Recap does not support initial opt-in by texting a keyword.
          </Text>
        </Column>

        <Column className={styles.section}>
          <Text as="h2" size={1.8} weight={600}>Program details</Text>
          <dl className={styles.details}>
            <div><dt>Program and sender</dt><dd>Our Wedding Recap</dd></div>
            <div><dt>Owner and operator</dt><dd>Parry Technology and Media, LLC</dd></div>
            <div><dt>Message frequency</dt><dd>Message frequency varies. Business-initiated automated updates cluster around the wedding — an enrollment confirmation, schedule reminders, and a post-event thank-you. Additional service responses may be sent only after a guest messages Our Wedding Recap.</dd></div>
            <div><dt>Cost</dt><dd>Message and data rates may apply.</dd></div>
            <div><dt>Opt out</dt><dd>Reply STOP to stop. Guests can also disable SMS from their signed communication-preferences page.</dd></div>
            <div><dt>Help</dt><dd>Reply HELP or email <a href="mailto:aaron@ourweddingrecap.com">aaron@ourweddingrecap.com</a>.</dd></div>
          </dl>
        </Column>

        <Row className={styles.policyLinks}>
          <Link href="/terms">Terms and Conditions</Link>
          <span aria-hidden="true">·</span>
          <Link href="/privacy">Privacy Policy</Link>
        </Row>
      </Column>
    </Column>
  )
}

export default SmsConsentPage
