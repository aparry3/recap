import React from 'react';
import { Column, Container, Row, Text } from 'react-web-layout-components';
import Image from 'next/image';
import styles from './AdminVerification.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';

interface AdminVerificationProps {
  status: 'loading' | 'success' | 'error';
  errorMessage?: string;
  personName?: string;
}

const AdminVerification: React.FC<AdminVerificationProps> = ({ status, errorMessage, personName }) => {
  return (
    <Column as='main' className={styles.verificationPage} justify='center'>
      <Column className={styles.contentContainer}>
        <Row as='header' padding={1} justify='center'>
          <Image src='/branding/wordmark.png' alt='Recap' layout='intrinsic' height={100} width={100}/>
        </Row>
        
        <Container className={styles.verificationContent}>
          {status === 'loading' && (
            <Column align='center' className={styles.statusContainer}>
              <FontAwesomeIcon icon={faSpinner} className={styles.loadingIcon} spin />
              <Text size={1.5} className={styles.statusText}>
                Verifying your admin access...
              </Text>
            </Column>
          )}

          {status === 'success' && (
            <Column align='center' className={styles.statusContainer}>
              <Container className={styles.iconContainer}>
                <FontAwesomeIcon icon={faCheckCircle} className={styles.successIcon} />
              </Container>
              <Text size={1.8} weight={600} className={styles.welcomeText}>
                Welcome to the admin team, {personName}!
              </Text>
              <Text className={styles.statusText}>
                Your email has been verified and you now have admin access.
              </Text>
              <Text className={styles.redirectText}>
                Redirecting to admin dashboard...
              </Text>
            </Column>
          )}

          {status === 'error' && (
            <Column align='center' className={styles.statusContainer}>
              <Container className={styles.iconContainer}>
                <FontAwesomeIcon icon={faExclamationCircle} className={styles.errorIcon} />
              </Container>
              <Text size={1.8} weight={600} className={styles.errorTitle}>
                Verification Failed
              </Text>
              <Text className={styles.errorMessage}>
                {errorMessage || 'An error occurred during verification'}
              </Text>
              <Container className={styles.helpTextContainer}>
                <Text className={styles.helpText}>
                  If you continue to have issues, please contact support.
                </Text>
              </Container>
            </Column>
          )}
        </Container>
      </Column>
    </Column>
  );
};

export default AdminVerification;