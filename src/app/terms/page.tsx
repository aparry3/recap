import React from 'react';
import { Column, Container, Text, Row } from 'react-web-layout-components';
import styles from './terms.module.scss';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Terms and Conditions - Recap',
  description: 'Terms and Conditions for using Recap photo gallery services',
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

const TermsPage = () => {
  return (
    <main className={styles.main}>
      <Header />
      <Column className={styles.contentContainer}>
        <Container className={styles.heading}>
          <Text as="h1" weight={700} size={2.5}>Terms and Conditions</Text>
        </Container>
        
        <Container className={styles.section}>
          <Text as="h2" weight={600} size={1.8}>1. Acceptance of Terms</Text>
          <Text>By accessing or using Recap's services, you agree to be bound by these Terms and Conditions and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</Text>
        </Container>
        
        <Container className={styles.section}>
          <Text as="h2" weight={600} size={1.8}>2. Use License</Text>
          <Text>Permission is granted to temporarily use Recap's services for personal, non-commercial purposes. This is the grant of a license, not a transfer of title, and under this license you may not:</Text>
          <ul className={styles.list}>
            <li><Text>Modify or copy the materials</Text></li>
            <li><Text>Use the materials for any commercial purpose</Text></li>
            <li><Text>Transfer the materials to another person or "mirror" the materials on any other server</Text></li>
          </ul>
          <Text>This license shall automatically terminate if you violate any of these restrictions and may be terminated by Recap at any time.</Text>
        </Container>
        
        <Container className={styles.section}>
          <Text as="h2" weight={600} size={1.8}>3. User Content</Text>
          <Text>Users are solely responsible for the content they upload, share, or otherwise make available through our services. You retain all ownership rights to your content, but grant Recap a worldwide, non-exclusive, royalty-free license to use, reproduce, and display such content in connection with providing our services.</Text>
        </Container>
        
        <Container className={styles.section}>
          <Text as="h2" weight={600} size={1.8}>4. Privacy</Text>
          <Text>Your use of Recap's services is also governed by our <Link href="/privacy" className={styles.link}>Privacy Policy</Link>.</Text>
        </Container>
        
        <Container className={styles.section}>
          <Text as="h2" weight={600} size={1.8}>5. Disclaimer</Text>
          <Text>The materials on Recap's website are provided on an 'as is' basis. Recap makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</Text>
        </Container>
        
        <Container className={styles.section}>
          <Text as="h2" weight={600} size={1.8}>6. Limitations</Text>
          <Text>In no event shall Recap or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use Recap's services, even if Recap or a Recap authorized representative has been notified orally or in writing of the possibility of such damage.</Text>
        </Container>
        
        <Container className={styles.section}>
          <Text as="h2" weight={600} size={1.8}>7. Revisions and Errata</Text>
          <Text>The materials appearing on Recap's website could include technical, typographical, or photographic errors. Recap does not warrant that any of the materials on its website are accurate, complete or current. Recap may make changes to the materials contained on its website at any time without notice.</Text>
        </Container>
        
        <Container className={styles.section}>
          <Text as="h2" weight={600} size={1.8}>8. Governing Law</Text>
          <Text>These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that location.</Text>
        </Container>
        
        <Container className={styles.section}>
          <Text as="h2" weight={600} size={1.8}>9. Contact Information</Text>
          <Text>If you have any questions about these Terms and Conditions, please contact us through our website.</Text>
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

export default TermsPage; 