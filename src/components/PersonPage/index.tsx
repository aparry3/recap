'use client';
import React, { FC, FormEvent, useEffect, useMemo, useState } from 'react';
import { Column, Container, Form, Row, Text } from 'react-web-layout-components';
import Image from 'next/image';
import Input from '@/components/Input';
import styles from './Create.module.scss';
import Button from '@/components/Button';
import { Person, NewPersonData } from '@/lib/types/Person';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { checkSquareIcon, squareIcon } from '@/lib/icons';

const PersonPage: FC<{person?: Person | NewPersonData, galleryName?: string, onSubmit: (name: string, email?: string, phone?: string, emailOptIn?: boolean, smsOptIn?: boolean) => void}> = ({person, galleryName, onSubmit}) => {
  const [name, setName] = useState(person?.name || '');
  const [phone, setPhone] = useState(person?.phone || '');
  const [email, setEmail] = useState(person?.email || '');
  const [emailOptIn, setEmailOptIn] = useState(false);
  const [smsOptIn, setSmsOptIn] = useState(false);

  const formatPhoneNumber = (digitsStr: string) => {
    // Remove any non-digit characters (defensive; our input should already be digits)
    const cleaned = digitsStr.replace(/\D/g, '');
    if (cleaned.length === 0) return '';
    if (cleaned.length < 4) return cleaned;
    if (cleaned.length < 7) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    }
    // Limit to 10 digits for formatting.
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  };

  // Handler for input change
  const handlePhoneChange = (value?: string) => {
    // Remove formatting by stripping non-digits
    const digits = value ? value.replace(/\D/g, '') : '';
    // Convert to number if digits exist; otherwise, set to null.
    const numericValue = digits;
    setPhone(numericValue);
    if (!numericValue.length) setSmsOptIn(false);
  };

  // Derive the display value: if we have a number, convert it back to a string and format.
  const displayPhone = useMemo(() => phone !== null ? formatPhoneNumber(phone.toString()) : '', [phone]);

  useEffect(() => {
   if (person) {
      setName(person.name)
      setEmail(person.email || '')
   } 
  }, [person])

  const handleNameChange = (value?: string) => {
    setName(value || '');
  };

  const handleEmailChange = (value?: string) => {
    setEmail(value || '');
  };


  const handleButtonPress = () => {
    // Perform any necessary actions with the form data
    onSubmit(name, email, phone, emailOptIn, smsOptIn);
  };

  const emailError = useMemo(() => {
    if (email) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return !emailRegex.test(email);
    }
    return false
  } , [email])


  const phoneError = useMemo(() => Boolean(phone) && phone.replace(/\D/g, '').length !== 10, [phone])

  const submitDisabled = useMemo(() => {
    return !name || emailError || phoneError || (emailOptIn && !email) || (smsOptIn && !phone)
  }, [email, emailError, emailOptIn, name, phone, phoneError, smsOptIn])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Perform any necessary actions with the form data
    if (!submitDisabled) onSubmit(name, email, phone, emailOptIn, smsOptIn);
};


  return (
    <Container as='main' className={styles.personPage}>
      <Column className={styles.titleContainer}>
        <Row as='header'padding={1}>
          <Image src='/branding/wordmark.png' alt='wordmark' layout='intrinsic' height={100} width={100}/>
        </Row>
        <Column as='header' className={styles.header}>
          {galleryName ? (
            <>
              <Text size={1.4}>Welcome to</Text>
              <Text weight={500} className={styles.galleryName}>{galleryName}</Text>
              <Text size={1.2} className={styles.subPrompt}>Tell us your name to get started</Text>
            </>
          ) : (
            <>
              <Text size={1.4}>Tell us</Text>
              <Text size={2.5} weight={500}>Your Name</Text>
            </>
          )}
        </Column>
        <Container className={styles.buttonContainer} padding={[2, 0]}>
          <Button className={styles.button} onClick={handleButtonPress} type='submit' disabled={submitDisabled}>
            <Text size={1.2} weight={600}>Submit</Text>
          </Button>
        </Container>
      </Column>

      <Container className={styles.contentContainer}>
        <Form onSubmit={handleSubmit} className={styles.form}>
          <Column className={styles.inputContainer}>
            <Input
                label="Your Name"
                type="text"
                autoComplete='off'
                name="name"
                value={name}
                onChange={handleNameChange}
              />
          </Column>
          <Column className={styles.inputContainer}>
            <Input
                label="Your Email (Optional)"
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
          </Column>
          <Column className={styles.inputContainer}>
            <Input
                label="Your Phone (Optional)"
                type="text"
                autoComplete='off'
                name="phone"
                value={displayPhone}
                onChange={handlePhoneChange}
              />
              {phoneError && (
              <Row style={{width: '100%'}}>
                  <Text>Please enter a valid 10-digit US phone number</Text>
              </Row>
              )}
          </Column>
          <Row className={`${styles.inputContainer} ${styles.checkboxRow}`}>
            <Container 
              onClick={() => email && setEmailOptIn(!emailOptIn)}
              className={`${styles.checkboxContainer} ${!email ? styles.disabled : ''}`}
            >
              <FontAwesomeIcon
                icon={emailOptIn ? checkSquareIcon : squareIcon}
                className={styles.checkboxIcon}
                size="lg"
              />
            </Container>
            <Column className={styles.consentCopy}>
              <Text weight={600}>Email me wedding updates</Text>
              <Text size={0.9}>Receive reminders and gallery updates by email. Unsubscribe at any time.</Text>
            </Column>
          </Row>
          <Row className={`${styles.inputContainer} ${styles.checkboxRow}`}>
            <Container
              onClick={() => phone && !phoneError && setSmsOptIn(!smsOptIn)}
              className={`${styles.checkboxContainer} ${!phone || phoneError ? styles.disabled : ''}`}
            >
              <FontAwesomeIcon
                icon={smsOptIn ? checkSquareIcon : squareIcon}
                className={styles.checkboxIcon}
                size="lg"
              />
            </Container>
            <Column className={styles.consentCopy}>
              <Text weight={600}>Text me wedding updates</Text>
              <Text size={0.85}>
                By checking this box, you agree to receive up to 10 automated texts about this gallery. Message and data rates may apply. Reply STOP to stop or HELP for help. Consent is optional and is not a condition of purchase. See our <a href="/terms" target="_blank">Terms</a> and <a href="/privacy" target="_blank">Privacy Policy</a>.
              </Text>
            </Column>
          </Row>
          <Container className={styles.buttonContainer}>
            <Button className={styles.button} onClick={handleButtonPress} type='submit' disabled={submitDisabled}>
              <Text size={1.2} weight={600}>Submit</Text>
            </Button>
          </Container>
          <Container className={styles.copyright}>
            <Text style={{ opacity: 0.7 }}>Recap is a property of Parry Technology and Media LLC</Text>
          </Container>
        </Form>
      </Container>
    </Container>
  );
};

export default PersonPage;
