'use client';
import React from 'react';
import { Container, Row, Text } from 'react-web-layout-components';
import styles from './Toast.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  isVisible: boolean;
}

export default function Toast({ message, type, isVisible }: ToastProps) {
  if (!isVisible) return null;

  return (
    <Container className={`${styles.toast} ${styles[type]} ${isVisible ? styles.visible : ''}`}>
      <Row className={styles.toastContent}>
        <FontAwesomeIcon 
          icon={type === 'success' ? faCheck : faExclamationTriangle} 
          className={styles.icon}
        />
        <Text size={0.9}>{message}</Text>
      </Row>
    </Container>
  );
}