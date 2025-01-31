'use client';
import React, { FC, useEffect } from 'react';
import { Column, Container, Row, Text } from 'react-web-layout-components';
import Image from 'next/image';
import styles from './Create.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { xIcon } from '@/lib/icons';
import { Person } from '@/lib/types/Person';
import { fetchVerification, updatePerson } from '@/helpers/api/personClient';


const ValidateUser: FC<{verificationId: string, person: {personId: string, name: string, email?: string}, confirm: (person: Person) => void, onBack: () => void, skip: () => void}> = ({person, verificationId, confirm, onBack, skip}) => {

  useEffect(() => {
    const checkVerification = async () => {
      try {
        const verification = await fetchVerification(verificationId);
        if (verification?.verified) {
          const {personId, ...p} = person
          const _person = await updatePerson(verification.personId, p);
          confirm(_person); // Call confirm with the verified person data
          
        }
      } catch (error) {
        console.error("Error checking verification status:", error);
      }
    };

    const interval = setInterval(() => {
      checkVerification();
    }, 3000);

    return () => clearInterval(interval); // Cleanup on unmount

  }, [verificationId, confirm]);

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
          <Text size={1.8}>Welcome back, {person.name}!</Text>
        </Column>
      </Column>
      <Container className={styles.contentContainer}>
        <Column className={styles.content}>
          <Container className={styles.validationTextContainer}>
            <Text className={styles.validationText}>
              Check your inbox! We've sent a verification email to <Text weight={700}>{person.email}</Text>. Follow the link to sync the gallery.
            </Text>
          </Container>
          <Container className={styles.validationTextContainer}>
            <Text className={styles.validationText}>
              Didn't get an email?
            </Text>
            <Text className={`${styles.validationText} ${styles.validationLink}`}>
              Click here to resend.
            </Text>
          </Container>
          <Container className={styles.validationTextContainer}>
            <Text className={`${styles.validationText} ${styles.validationLink}`} onClick={skip}>
              Skip
            </Text>
          </Container>
        </Column>
      </Container>
    </Column>
  );
};

export default ValidateUser;