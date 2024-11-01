'use client';
import React, { FC, useEffect } from 'react';
import { Column, Container, Row, Text } from 'react-web-layout-components';
import Image from 'next/image';
import styles from './Welcome.module.scss';
import Button from '@/components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { linkIcon, qrcodeIcon } from '@/lib/icons';
import { useRouter } from 'next/navigation';

const Welcome: FC<{url: string, name: string, email: string}> = ({url, name, email}) => {
  const router = useRouter()
  useEffect(() => {
    console.log(name)
  }, [name])

  const handleNext = () => {
    router.push(url)
  }

  return (
    <Container as='main' className={styles.page}>
      <Column className={styles.titleContainer}>
        <Row as='header'padding={1}>
          <Image src='/branding/wordmark.png' alt='wordmark' layout='intrinsic' height={100} width={100}/>
        </Row>
        <Column as='header' className={styles.header}>
          <Text size={1.4}>Welcome to</Text>
          <Text size={2.5} weight={500}>{name}</Text>
        </Column>
        <Container className={styles.buttonContainer} padding={[2, 0]}>
          <Button onClick={handleNext} type='submit'>
            <Text size={1.2} weight={600}>Next</Text>
          </Button>
        </Container>
      </Column>
      <Container className={styles.contentContainer}>
        <Column className={styles.content}>
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
                  {url}
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
          <Container className={styles.buttonContainer} padding={[4, 0]}>
            <Button type='submit' onClick={handleNext}>
              <Text size={1.2} weight={600}>Next</Text>
            </Button>
          </Container>
        </Column>
      </Container>
    </Container>
  );
};

export default Welcome;