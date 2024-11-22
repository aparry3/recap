'use client';
import React, { FC, use, useCallback, useEffect, useRef, useState } from 'react';
import { Column, Container, Row, Text } from 'react-web-layout-components';
import Image from 'next/image';
import styles from './Password.module.scss';
import Header from '../Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { arrowLeftIcon } from '@/lib/icons';
import { useRouter } from 'next/navigation';

const Welcome: FC<{name: string, password: string, setPassword: (password: string) => void}> = ({name, password, setPassword}) => {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.length <= 4 ? (e.target.value || '').toUpperCase() : password;
    setPassword(value);
  }, [password])

  const focus = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef.current]);

  const goBack = useCallback(() => {
    router.push('/')
  }, [router])

  useEffect(() => {
    focus()
  }, [focus])
  return (
    <Column as='main' className={styles.page} justify='center'>
      <Row className={styles.header}>
        <Container className={styles.back} onClick={goBack}>
          <FontAwesomeIcon icon={arrowLeftIcon} />
        </Container>
      </Row>
      <Column className={styles.titleContainer}>
        <Row as='header'padding={1}>
          <Image src='/branding/wordmark.png' alt='wordmark' layout='intrinsic' height={100} width={100}/>
        </Row>
        <Column as='header' className={styles.heading}>
          <Text size={1.4}>Enter the Password for</Text>
          <Text size={2.5} weight={500}>{name}</Text>
        </Column>
        <input ref={inputRef} className={styles.input} onChange={handleChange} value={password}/>
      </Column>
      <Container className={styles.contentContainer}>
        <Container className={styles.content}>
          <Container className={styles.letterContainer}>
            <Container className={styles.letter} onClick={focus}>
              {password.length === 0 ? <FlashingBar/> : <Text className={styles.letterText}>{password.charAt(0)}</Text>}
            </Container>
           </Container>
          <Container className={styles.letterContainer}>
            <Container className={styles.letter}>
              {password.length === 1 ? <FlashingBar/> : <Text className={styles.letterText}>{password.charAt(1)}</Text>}
            </Container>
          </Container>
          <Container className={styles.letterContainer}>
            <Container className={styles.letter}>
              {password.length === 2 ? <FlashingBar/> : <Text className={styles.letterText}>{password.charAt(2)}</Text>}
            </Container>
          </Container>
          <Container className={styles.letterContainer}>
            <Container className={styles.letter}>
              {password.length === 3 ? <FlashingBar/> : <Text className={styles.letterText}>{password.charAt(3)}</Text>}
            </Container>
          </Container>
        </Container>
      </Container>
    </Column>
  );
};

const FlashingBar = () => {
  return (
    <Container className={styles.flashingBar} />
  )
}

export default Welcome;