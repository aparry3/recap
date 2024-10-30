'use client';
import React, { FC, FormEvent, MouseEvent, useMemo, useState } from 'react';
import { Column, Container, Form, Row, Text } from 'react-web-layout-components';
import Image from 'next/image';
import Input from '@/components/Input';
import styles from './Page.module.scss';
import Button from '@/components/Button';

const CreatePage: FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');


  const handleNameChange = (value?: string) => {
    setName(value || '');
  };

  const handleEmailChange = (value?: string) => {
    setEmail(value || '');
  };


  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Perform any necessary actions with the form data
    console.log('Form submitted with title:', name);
  };

  const handleButtonPress = (event: MouseEvent) => {
    // Perform any necessary actions with the form data
  };


  const url = useMemo(() => `https://ourweddingrecap.com/${name.toLowerCase().replaceAll(' ', '-')}`, [name]);
  return (
    <Column as='main'>
      <Container as='header' padding={0.5}>
        <Image src='/branding/wordmark.png' alt='wordmark' layout='intrinsic' height={100} width={100}/>
      </Container>
      <Column as='header' className={styles.header}>
        <Text size={1.4}>Create a</Text>
        <Text size={2.5} weight={500}>New Gallery</Text>
      </Column>


      <Form onSubmit={handleSubmit} className={styles.form}>
        <Column className={styles.inputContainer} padding={0.5}>
          <Container className={styles.galleryNamePrompt}>
            <Text size={1.3}>Choose a name for your gallery. This will also determine the url of your gallery.</Text>
          </Container>
          <Input
            label="Gallery Name"
            type="text"
            name="name"
            value={name}
            onChange={handleNameChange}
          />
          <Row className={styles.url}>
            <Text size={0.9}>{url}</Text>
          </Row>
        </Column>
        <Container className={styles.inputContainer}>
          <Input
              label="Email"
              type="text"
              name="email"
              value={email}
              onChange={handleEmailChange}
            />
        </Container>
        <Container className={styles.buttonContainer}>
          <Button onClick={handleButtonPress} type='submit' disabled={!email || !name}>
            <Text size={1.2} weight={600}>Submit</Text>
          </Button>
        </Container>
      </Form>
    </Column>
  );
};

export default CreatePage;