import React from 'react';
import { Column, Container, Text, Row } from 'react-web-layout-components';
import styles from './privacy.module.scss';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Privacy Policy - Recap',
  description: 'Privacy Policy for Recap photo gallery services',
};

const Header = () => {
  return (
    <Container as='header' className={styles.header} justify='space-between'>
      <Container className={styles.wordmarkContainer} padding={0.5}>
        <Link href="/">
          <Image src='/branding/wordmark.png' alt='wordmark' layout='intrinsic' height={100} width={100}/>
        </Link>
      </Container>
    </Container>
  );
};

const PrivacyPage = () => {
  return (
    <main className={styles.main}>
      <Header />
      <Column className={styles.contentContainer}>
        <Container className={styles.heading}>
          <Text as="h1" weight={700} size={2.5}>Privacy Policy</Text>
        </Container>
        
        <Container className={styles.section}>
          <Text as="h2" weight={600} size={1.8}>1. Introduction</Text>
          <Text>At Recap, we respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.</Text>
        </Container>
        
        <Container className={styles.section}>
          <Text as="h2" weight={600} size={1.8}>2. Information We Collect</Text>
          <Text>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</Text>
          <ul className={styles.list}>
            <li><Text><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</Text></li>
            <li><Text><strong>Contact Data</strong> includes email address and telephone numbers.</Text></li>
            <li><Text><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</Text></li>
            <li><Text><strong>User Content</strong> includes photos, videos, and other media that you upload to our service.</Text></li>
          </ul>
        </Container>
        
        <Container className={styles.section}>
          <Text as="h2" weight={600} size={1.8}>3. How We Use Your Information</Text>
          <Text>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</Text>
          <ul className={styles.list}>
            <li><Text>To provide our services to you</Text></li>
            <li><Text>To process and complete transactions</Text></li>
            <li><Text>To send administrative information</Text></li>
            <li><Text>To respond to your inquiries and requests</Text></li>
            <li><Text>To improve our website and present its contents to you</Text></li>
          </ul>
        </Container>
        
        <Container className={styles.section}>
          <Text as="h2" weight={600} size={1.8}>4. Data Security</Text>
          <Text>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. We limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.</Text>
        </Container>
        
        <Container className={styles.section}>
          <Text as="h2" weight={600} size={1.8}>5. Data Retention</Text>
          <Text>We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements.</Text>
        </Container>
        
        <Container className={styles.section}>
          <Text as="h2" weight={600} size={1.8}>6. Your Rights</Text>
          <Text>Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, restriction, transfer, to object to processing, to portability of data and (where the lawful ground of processing is consent) to withdraw consent.</Text>
        </Container>
        
        <Container className={styles.section}>
          <Text as="h2" weight={600} size={1.8}>7. Third-Party Links</Text>
          <Text>This website may include links to third-party websites, plug-ins and applications. Clicking on those links or enabling those connections may allow third parties to collect or share data about you. We do not control these third-party websites and are not responsible for their privacy statements.</Text>
        </Container>
        
        <Container className={styles.section}>
          <Text as="h2" weight={600} size={1.8}>8. Changes to the Privacy Policy</Text>
          <Text>We may update our privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page.</Text>
        </Container>
        
        <Container className={styles.section}>
          <Text as="h2" weight={600} size={1.8}>9. Contact Information</Text>
          <Text>If you have any questions about this privacy policy, please contact us through our website.</Text>
        </Container>
      </Column>
      
      <Container as='footer' className={styles.footer} padding={2}>
        <Container style={{flexGrow: 1}}></Container>
        <Column className={styles.branding}>
          <Row className={styles.brandingRow}>
            <Link href="/">
              <Image src='/branding/wordmarkInverse.png' alt='wordmark' layout='intrinsic' height={100} width={100}/>
            </Link>
          </Row>
          <Row className={styles.brandingRow}>
            <Link href="/" className={styles.footerLink}>Home</Link>
            <Link href="/terms" className={styles.footerLink}>Terms</Link>
            <Link href="/privacy" className={styles.footerLink}>Privacy</Link>
          </Row>
        </Column>
      </Container>
    </main>
  );
};

export default PrivacyPage; 