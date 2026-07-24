import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Column, Container, Row, Text } from 'react-web-layout-components'
import styles from './page.module.scss'

export const metadata: Metadata = {
  title: 'SMS Opt-In Process | Our Wedding Recap',
  description: 'Screenshots and step-by-step documentation of how wedding guests opt in to Our Wedding Recap text messages.',
}

const OptInPage = () => {
  return (
    <Column className={styles.page}>
      <Container className={styles.header}>
        <Link href="/" aria-label="Our Wedding Recap home">
          <Image src="/branding/wordmark.png" alt="Our Wedding Recap" width={100} height={40} />
        </Link>
      </Container>

      <Column className={styles.content}>
        <Column className={styles.intro}>
          <Text as="p" className={styles.eyebrow}>SMS OPT-IN</Text>
          <Text as="h1" size={2.7} weight={700} className={styles.title}>
            The Our Wedding Recap SMS opt-in process
          </Text>
          <Text as="p" size={1.1} className={styles.lede}>
            This page shows, with unedited screenshots of the live product, exactly how a wedding guest consents to Our Wedding Recap text messages. Our Wedding Recap is owned and operated by Parry Technology and Media, LLC. Guests are never enrolled automatically: texting requires a guest to enter their own phone number and separately check an unchecked consent box.
          </Text>
        </Column>

        <Column className={styles.section}>
          <Text as="h2" size={1.8} weight={600}>How a guest opts in, step by step</Text>
          <ol className={styles.steps}>
            <li>A couple shares their private Our Wedding Recap gallery link with their wedding guests.</li>
            <li>When a guest first opens the gallery, the join form asks for their name. The email and phone fields are optional, and leaving them blank changes nothing about gallery access.</li>
            <li>To receive texts, the guest enters their mobile number and then checks the separate <strong>&ldquo;Text me wedding updates&rdquo;</strong> box. The box is unchecked by default, cannot be checked until a valid phone number is entered, and sits directly beside the full consent disclosure shown below.</li>
            <li>The guest submits the form. Our Wedding Recap records the consent for that specific gallery and sends one enrollment confirmation text, which repeats the STOP and HELP instructions.</li>
            <li>The guest can opt out at any time by replying STOP or from their signed communication-preferences page. Replying HELP returns support information.</li>
          </ol>
          <Text as="p" className={styles.note}>
            Our Wedding Recap does not support initial opt-in by texting a keyword, does not purchase contact lists, and does not send marketing. Messages are limited to wedding-gallery updates for a gallery the guest has personally joined.
          </Text>
        </Column>

        <Column className={styles.section}>
          <Text as="h2" size={1.8} weight={600}>Screenshot: the gallery join form</Text>
          <Text as="p" className={styles.sectionLede}>
            The screen where consent is collected, exactly as a guest sees it on a phone. Note the optional phone field, the unchecked consent checkbox, and the complete disclosure beside it.
          </Text>
          <figure className={styles.figure}>
            <Image
              src="/compliance/sms-opt-in-form.png"
              alt="Our Wedding Recap gallery join form showing the optional phone field, the unchecked 'Text me wedding updates' checkbox, and the full SMS consent disclosure"
              width={430}
              height={932}
              className={styles.mobileShot}
              unoptimized
            />
            <figcaption className={styles.caption}>
              The gallery join form. The SMS checkbox is unchecked by default and disabled until the guest enters a valid phone number.
            </figcaption>
          </figure>
        </Column>

        <Column className={styles.section}>
          <Text as="h2" size={1.8} weight={600}>The consent language, verbatim</Text>
          <blockquote className={styles.quote}>
            By checking this box, you agree to receive up to 10 automated wedding update texts about this gallery, including a confirmation. If you message Our Wedding Recap, we may send additional service responses to your request. Message and data rates may apply. Reply STOP to stop or HELP for help. Consent is optional and is not a condition of purchase. See our Terms and Privacy Policy.
          </blockquote>
        </Column>

        <Column className={styles.section}>
          <Text as="h2" size={1.8} weight={600}>Screenshot: the public SMS program page</Text>
          <Text as="p" className={styles.sectionLede}>
            The consent experience is also documented publicly at <Link href="/sms-consent">ourweddingrecap.com/sms-consent</Link>, including program details, message frequency, cost, and opt-out instructions.
          </Text>
          <figure className={styles.figure}>
            <Image
              src="/compliance/sms-consent-page.png"
              alt="The public Our Wedding Recap SMS consent page describing the opt-in flow, a read-only example of the join form, and program details"
              width={1100}
              height={1672}
              className={styles.desktopShot}
              unoptimized
            />
            <figcaption className={styles.caption}>
              The public program page at /sms-consent.
            </figcaption>
          </figure>
        </Column>

        <Column className={styles.section}>
          <Text as="h2" size={1.8} weight={600}>Program summary</Text>
          <dl className={styles.details}>
            <div><dt>Program and sender</dt><dd>Our Wedding Recap</dd></div>
            <div><dt>Owner and operator</dt><dd>Parry Technology and Media, LLC</dd></div>
            <div><dt>Opt-in method</dt><dd>Web form only: an unchecked checkbox on the gallery join form, shown with the full disclosure, after the guest enters their own phone number. No keyword enrollment.</dd></div>
            <div><dt>Message frequency</dt><dd>Up to 10 business-initiated automated wedding updates per gallery, including the enrollment confirmation. Additional service responses may be sent only after a guest messages Our Wedding Recap.</dd></div>
            <div><dt>Cost</dt><dd>Message and data rates may apply.</dd></div>
            <div><dt>Opt out</dt><dd>Reply STOP to stop. Guests can also disable SMS from their signed communication-preferences page.</dd></div>
            <div><dt>Help</dt><dd>Reply HELP or email <a href="mailto:aaron@ourweddingrecap.com">aaron@ourweddingrecap.com</a>.</dd></div>
          </dl>
        </Column>

        <Column className={styles.section}>
          <Text as="h2" size={1.8} weight={600}>Direct links for reviewers</Text>
          <ul className={styles.linkList}>
            <li><a href="/compliance/sms-opt-in-form.png">ourweddingrecap.com/compliance/sms-opt-in-form.png</a> — the join form where consent is collected</li>
            <li><a href="/compliance/sms-consent-page.png">ourweddingrecap.com/compliance/sms-consent-page.png</a> — the public SMS program page</li>
          </ul>
        </Column>

        <Row className={styles.policyLinks}>
          <Link href="/sms-consent">SMS Consent</Link>
          <span aria-hidden="true">·</span>
          <Link href="/terms">Terms and Conditions</Link>
          <span aria-hidden="true">·</span>
          <Link href="/privacy">Privacy Policy</Link>
        </Row>
      </Column>
    </Column>
  )
}

export default OptInPage
