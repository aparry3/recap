'use client';
import React, { FC } from 'react';
import { Column, Container, Text } from 'react-web-layout-components';
import Image from 'next/image';
import styles from './Page.module.scss';
import Button from '@/components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { linkIcon, qrcodeIcon } from '@/lib/icons';

const ThanksPage: FC = () => {
  return (
    <Column as='main'>
      <Container as='header' padding={0.5}>
        <Image src='/branding/wordmark.png' alt='wordmark' layout='intrinsic' height={100} width={100}/>
      </Container>
      <Column as='header' className={styles.header}>
        <Text size={1.4}>Welcome to</Text>
        <Text size={2.5} weight={500}>The Dion Wedding</Text>
      </Column>
      <Column className={styles.content} padding={0.5}>
        <Container className={styles.section}>
          <Text size={1}>This is the QR code for your gallery! Share this with friends and family to grant them access to this gallery.</Text>
        </Container>
        <Container className={styles.section}>
          <Image src='/qrcode.png' alt='qr code' layout='responsive' height={200} width={200} className={styles.qrcode}/>
        </Container>
        <Container className={styles.section}>
          <Text size={1}>You may also share this link with your guests to skip the QR code.</Text>
        </Container>
        <Container className={styles.section}>
          <Container className={styles.linkContainer}>
            <Container className={styles.linkIcon}>
              <FontAwesomeIcon icon={linkIcon} className={styles.icon}/>
            </Container>
            <Container>
              <Text>
                /the-dion-wedding
              </Text>
            </Container>
          </Container>
        </Container>
        <Container className={styles.section}>
          <Text size={1}>Don’t worry, you can always access your QR and Link from your dashboard by pressing:</Text>
        </Container>
        <Container className={styles.section}>
          <FontAwesomeIcon icon={qrcodeIcon} className={styles.qrCode}/>
        </Container>
      </Column>
      <Container className={styles.buttonContainer}>
        <Button onClick={() => {}} type='submit'>
          <Text size={1.2} weight={600}>Next</Text>
        </Button>
      </Container>
    </Column>
  );
};

export default ThanksPage;