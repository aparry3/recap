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

const PersonPage: FC<{person?: Person | NewPersonData, onSubmit: (name: string, email?: string, phone?: string, receiveMessages?: boolean) => void}> = ({person, onSubmit}) => {
  const [name, setName] = useState(person?.name || '');
  const [phone, setPhone] = useState(person?.phone || '');
  const [email, setEmail] = useState(person?.email || '');
  const [receiveMessages, setReceiveMessages] = useState(true);

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
    // If phone number is entered, default opt-in to true
    if (numericValue.length > 0) {
      setReceiveMessages(true);
    }
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
    onSubmit(name, email, phone, receiveMessages);
  };

  const emailError = useMemo(() => {
    if (email) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return !emailRegex.test(email);
    }
    return false
  } , [email])


  const submitDisabled = useMemo(() => {
    return !name || emailError
  }, [emailError, name])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Perform any necessary actions with the form data
    if (!submitDisabled) onSubmit(name, email, phone, receiveMessages);
};


  return (
    <Container as='main' className={styles.personPage}>
      <Column className={styles.titleContainer}>
        <Row as='header'padding={1}>
          <Image src='/branding/wordmark.png' alt='wordmark' layout='intrinsic' height={100} width={100}/>
        </Row>
        <Column as='header' className={styles.header}>
          <Text size={1.4}>Tell us</Text>
          <Text size={2.5} weight={500}>Your Name</Text>
        </Column>
        <Container className={styles.buttonContainer} padding={[2, 0]}>
          <Button className={styles.button} onClick={handleButtonPress} type='submit' disabled={!name || !email}>
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
              {false && (
              <Row style={{width: '100%'}}>
                  <Text>Please enter a valid phone number</Text>
              </Row>
              )}
          </Column>
          <Row className={`${styles.inputContainer} ${styles.checkboxRow}`}>
            <Container 
              onClick={() => phone && setReceiveMessages(!receiveMessages)}
              className={`${styles.checkboxContainer} ${!phone ? styles.disabled : ''}`}
            >
              <FontAwesomeIcon 
                icon={receiveMessages ? checkSquareIcon : squareIcon} 
                className={styles.checkboxIcon}
                size="lg"
              />
            </Container>
            <Text>Opt in to text messages</Text>
          </Row>
          <Container className={styles.buttonContainer}>
            <Button className={styles.button} onClick={handleButtonPress} type='submit' disabled={submitDisabled}>
              <Text size={1.2} weight={600}>Submit</Text>
            </Button>
          </Container>
        </Form>
      </Container>
    </Container>
  );
};

export default PersonPage;