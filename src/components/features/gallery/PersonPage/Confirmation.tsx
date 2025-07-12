"use client"
import React, { FC, useEffect } from 'react';
import { Column, Container, Row, Text } from 'react-web-layout-components';
import Image from 'next/image';
import styles from './Create.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { checkIcon } from '@/lib/icons';
import { Gallery } from '@/lib/types/Gallery';
import { Person } from '@/lib/types/Person';
import useLocalStorage, { setCookie } from '@/helpers/hooks/localStorage';
import { useRouter } from 'next/navigation';

const Confirmation: FC<{person: Person, gallery?: Gallery}> = ({person, gallery}) => {
  const router = useRouter()
  const [_, setPersonId] = useLocalStorage<string>('personId', person.id);
  useEffect(() => {
    setPersonId(person.id)
    setCookie('personId', person.id)
    if (gallery) {
      router.push(`/${gallery.path}?password=${gallery.password}`)
    }
  }, [person, router])
  return (
    <Column as='main' className={styles.personPage} justify='center'>
      <Column className={styles.titleContainer}>
        <Row as='header'padding={1}>
          <Image src='/branding/wordmark.png' alt='wordmark' layout='intrinsic' height={100} width={100}/>
        </Row>
        <Container className={styles.validationTextContainer}>
            <FontAwesomeIcon icon={checkIcon} className={styles.confirmIcon} />
          </Container>
        <Column as='header' className={styles.heading}>
          <Text size={1.8}>Thank you, {person.name}!</Text>
        </Column>
      </Column>
      <Container className={styles.contentContainer}>
        <Column className={styles.content}>
          <Container className={styles.validationTextContainer}>
            <Text className={styles.validationText}>
              Your email has been confirmed and your previous galleries have been synced!
            </Text>
          </Container>
          <Container className={styles.validationTextContainer}>
            <Text className={styles.validationText}>
              Head back to the previous window.
            </Text>
          </Container>
        </Column>
      </Container>
    </Column>
  );
};

export default Confirmation;