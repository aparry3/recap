import React, { FC } from 'react';
import { Column, Container, Row, Text } from 'react-web-layout-components';
import Image from 'next/image';
import styles from './Create.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { checkIcon } from '@/lib/icons';

const Confirmation: FC<{name: string}> = ({name}) => {
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
          <Text size={1.8}>Thank you, {name}!</Text>
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