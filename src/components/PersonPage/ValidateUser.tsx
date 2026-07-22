'use client';
import React, { FC, useEffect, useRef, useState } from 'react';
import { Column, Container, Row, Text } from 'react-web-layout-components';
import Image from 'next/image';
import styles from './Create.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { xIcon } from '@/lib/icons';
import { Verification } from '@/lib/types/Person';
import { fetchVerification } from '@/helpers/api/personClient';


const ValidateUser: FC<{verificationId: string, person: {personId: string, name: string, email?: string, phone?: string}, confirm: (verification: Verification) => Promise<void> | void, onBack: () => void, resend?: () => Promise<void> | void, newUser?: boolean}> = ({person, verificationId, confirm, onBack, resend, newUser = false}) => {
  const [resendState, setResendState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const confirmRef = useRef(confirm)
  const completedRef = useRef(false)

  useEffect(() => {
    confirmRef.current = confirm
  }, [confirm])

  useEffect(() => {
    completedRef.current = false
    const checkVerification = async () => {
      try {
        const verification = await fetchVerification(verificationId);
        if (verification?.verified && !completedRef.current) {
          completedRef.current = true
          await confirmRef.current(verification)
        }
      } catch (error) {
        completedRef.current = false
        console.error("Error checking verification status:", error);
      }
    };

    const interval = setInterval(() => {
      checkVerification();
    }, 3000);

    return () => clearInterval(interval); // Cleanup on unmount

  }, [verificationId]);

  const handleResend = async () => {
    if (!resend || resendState === 'sending' || resendState === 'sent') return
    setResendState('sending')
    try {
      await resend()
      setResendState('sent')
      setTimeout(() => setResendState('idle'), 30000)
    } catch (error) {
      console.error('Error resending verification email:', error)
      setResendState('error')
    }
  }

  return (
    <Column as='main' className={styles.personPage} justify='center'>
      <Row className={styles.headerBar}>
        <Container className={styles.back} onClick={onBack}>
          <FontAwesomeIcon icon={xIcon} />
        </Container>
      </Row>
      <Column className={styles.titleContainer}>
        <Row as='header'padding={1}>
          <Image src='/branding/wordmark.png' alt='wordmark' layout='intrinsic' height={100} width={100}/>
        </Row>
        <Column as='header' className={styles.heading}>
          <Text size={1.8}>{newUser ? `Almost there, ${person.name}!` : `Welcome back, ${person.name}!`}</Text>
        </Column>
      </Column>
      <Container className={styles.contentContainer}>
        <Column className={styles.content}>
          <Container className={styles.validationTextContainer}>
            <Text className={styles.validationText}>
              Check your inbox! We’ve sent a verification email to <Text weight={700}>{person.email}</Text>. Click the link in the email to continue — this page will update automatically.
            </Text>
          </Container>
          {resend && (
            <Container className={styles.validationTextContainer}>
              <Text className={styles.validationText}>
                Didn’t get an email?
              </Text>
              {resendState === 'sent' ? (
                <Text className={styles.validationText} weight={700}>
                  Verification email resent!
                </Text>
              ) : (
                <Text className={`${styles.validationText} ${styles.validationLink}`} onClick={handleResend}>
                  {resendState === 'sending' ? 'Sending…' : resendState === 'error' ? 'Something went wrong. Try again.' : 'Click here to resend.'}
                </Text>
              )}
            </Container>
          )}
        </Column>
      </Container>
    </Column>
  );
};

export default ValidateUser;
