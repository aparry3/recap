'use client';
import React, { FC, FormEvent, useState } from 'react';
import { Column, Container, Form, Row, Text } from 'react-web-layout-components';
import Image from 'next/image';
import Input from '@/components/Input';
import styles from './CreateAlbum.module.scss';
import Button from '@/components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { xIcon } from '@/lib/icons';


const CreateAlbum: FC<{onSubmit: (name: string) => void, onClose: () => void}> = ({onSubmit, onClose}) => {
  const [name, setName] = useState('');

  const handleNameChange = (value?: string) => {
    setName(value || '');
  };

  const handleButtonPress = () => {
    // Perform any necessary actions with the form data
    onSubmit(name);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Perform any necessary actions with the form data
    if (name) onSubmit(name);
};

  return (
    <Column as='main' className={styles.page}>
        <Row className={styles.header} onClick={onClose}>
            <Container className={styles.closeButton}>
                <FontAwesomeIcon icon={xIcon} className={styles.icon} />
            </Container>
        </Row>
      <Column className={styles.titleContainer}>
        <Row as='header'padding={1}>
          <Image src='/branding/wordmark.png' alt='wordmark' layout='intrinsic' height={100} width={100}/>
        </Row>
        <Column as='header' className={styles.title}>
          <Text size={1.4}>Create a</Text>
          <Text size={2.5} weight={500}>New Album</Text>
        </Column>
      </Column>
      <Container className={styles.contentContainer}>
        <Form onSubmit={handleSubmit} className={styles.form}>
          <Column className={styles.inputContainer}>
            <Input
                label="Album Name"
                type="text"
                autoComplete='off'
                name="name"
                value={name}
                onChange={handleNameChange}
              />
          </Column>
          <Container className={styles.buttonContainer}>
            <Button className={styles.button} onClick={handleButtonPress} disabled={!name}>
              <Text size={1.2} weight={600}>Submit</Text>
            </Button>
          </Container>
        </Form>
      </Container>
    </Column>
  );
};

export default CreateAlbum;