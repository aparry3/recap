'use client';
import React, { FC, FormEvent, useCallback, useMemo } from 'react';
import { Column, Container, Form, Row, Text } from 'react-web-layout-components';
import Image from 'next/image';
import styles from './Login.module.scss';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { leftIcon } from '@/lib/icons';


const Login: FC<{onSubmit: (email: string) => void, loginError: string, back: () => void}> = ({onSubmit, loginError, back}) => {
    const [email, setEmail] = React.useState('');

    const handleEmailChange = (value?: string) => {
        setEmail(value || '');
    };

      const handleButtonPress = useCallback(() => {
        console.log("handle press")
        // Perform any necessary actions with the form data
        onSubmit( email);
      }, [email]);
    
      const emailError = useMemo(() => {
        if (email) {
          const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          return !emailRegex.test(email);
        }
        return false
      } , [email])
    
    
    
      const handleSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Perform any necessary actions with the form data
        if (!emailError) onSubmit(email);
    }, [email]);
    
  return (
    <Column as='main' className={styles.page}>
    <Row className={styles.actionHeader}>
        <Container className={styles.backButton} onClick={back}>
          <Container>
            <FontAwesomeIcon icon={leftIcon} className={styles.icon} />
          </Container>
          <Container>
            <Text className={styles.icon}>Back</Text>
          </Container>
        </Container>
      </Row>
      <Column className={styles.titleContainer}>
        <Row as='header'padding={1}>
          <Image src='/branding/wordmark.png' alt='wordmark' layout='intrinsic' height={100} width={100}/>
        </Row>
        <Column as='header' className={styles.header}>
          <Text size={1.4}>Enter your </Text>
          <Text size={2.5} weight={500}>Email</Text>
        </Column>
      </Column>
      <Container className={styles.contentContainer}>
        <Form className={styles.content} onSubmit={handleSubmit}>
        <Column className={styles.inputContainer}>
            <Input
                label="Email Address"
                type="text"
                autoComplete='off'
                name="email"
                value={email}
                onChange={handleEmailChange}
              />
              {emailError && (
              <Row style={{width: '100%'}}>
                  <Text>Please enter a valid email address</Text>
              </Row>
              )}
              {loginError && (
              <Row style={{width: '100%'}}>
                  <Text>{loginError}</Text>
              </Row>
              )}
          </Column>
          <Container className={styles.butonContainer} padding={[2, 0]}>
            <Button onClick={handleButtonPress} type='submit' disabled={emailError}>
                <Text size={1.2} weight={600}>Login</Text>
            </Button>
        </Container>
        </Form>
      </Container>
    </Column>
  );
};

export default Login;