'use client';
import React, { FC, FormEvent, MouseEvent, useEffect, useMemo, useState } from 'react';
import { Column, Container, Form, Row, Text } from 'react-web-layout-components';
import Image from 'next/image';
import Input from '@/components/Input';
import styles from './Create.module.scss';
import Button from '@/components/Button';
import { Person, NewPersonData } from '@/lib/types/Person';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { leftIcon } from '@/lib/icons';
import { useRouter } from 'next/navigation';


const CreatePage: FC<{person?: Person | NewPersonData, login: () => void,onSubmit: (galleryName: string,name: string, email: string, theKnot?: string, zola?: string) => void}> = ({login, person, onSubmit}) => {
    const router = useRouter()
  const [name, setName] = useState(person?.name || '');
  const [galleryName, setGalleryName] = useState('');
  const [email, setEmail] = useState(person?.email || '');

  const [theKnot, setTheKnot] = useState('');
  const [zola, setZola] = useState('');

  useEffect(() => {
   if (person) {
      setName(person.name)
      setEmail(person.email || '')
   } 
  }, [person])

  const back = () => {
    router.back()
  }
  const handleNameChange = (value?: string) => {
    setName(value || '');
  };

  const handleGalleryNameChange = (value?: string) => {
    setGalleryName(value || '');
  };


  const handleEmailChange = (value?: string) => {
    setEmail(value || '');
  };

  const handleTheKnotChange = (value?: string) => {
    setTheKnot(value || '');
  };
  const handleZolaChange = (value?: string) => {
    setZola(value || '');
  };



  const handleButtonPress = () => {
    console.log("handle press")
    // Perform any necessary actions with the form data
    onSubmit(galleryName, name, email, theKnot, zola);
  };

  const emailError = useMemo(() => {
    if (email) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return !emailRegex.test(email);
    }
    return false
  } , [email])


  const submitDisabled = useMemo(() => {
    return !name || !galleryName|| emailError
  }, [emailError, name, galleryName])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Perform any necessary actions with the form data
    if (!submitDisabled) onSubmit(galleryName, name, email, theKnot, zola);
};

  const url = useMemo(() => `https://ourweddingrecap.com/${galleryName.toLowerCase().replaceAll(' ', '-')}`, [galleryName]);
  return (
    <Container as='main' className={styles.page}>
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
          <Text size={1.4}>Create a</Text>
          <Text size={2.5} weight={500}>New Gallery</Text>
        </Column>
        <Container className={styles.buttonContainer} padding={[2, 0]}>
          <Button className={styles.button} onClick={handleButtonPress} disabled={!name || !email}>
            <Text size={1.2} weight={600}>Submit</Text>
          </Button>
        </Container>
        <Column as='header' className={styles.header}>
          <Text size={1.1}>or</Text>
          <Container  padding={1}>
            <Button className={styles.button} onClick={login} >
              <Text size={1.2} weight={600}>Login</Text>
            </Button>
        </Container>
        </Column>
      </Column>

      <Container className={styles.contentContainer}>
        <Form onSubmit={handleSubmit} className={styles.form}>
          <Column className={styles.inputContainer} padding={0.5}>
            <Container className={styles.galleryNamePrompt}>
              <Text size={1.3}>Choose a name for your gallery. This will also determine the url of your gallery.</Text>
            </Container>
            <Input
              label="Gallery Name"
              type="text"
              name="gallery_name"
              autoComplete='off'
              value={galleryName}
              onChange={handleGalleryNameChange}
            />
            <Row className={styles.url}>
              <Text size={0.9}>{url}</Text>
            </Row>
          </Column>
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
                label="Your Email"
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
          <Column className={styles.inputContainer} padding={0.5}>
            <Container className={styles.galleryNamePrompt}>
              <Text size={1.3}>Optional: Add links to your wedding websites.</Text>
            </Container>
            <Input
              label="The Knot"
              type="text"
              name="the_knot"
              autoComplete='off'
              value={theKnot}
              onChange={handleTheKnotChange}
            />
            <Input
              label="Zola"
              type="text"
              name="zola"
              autoComplete='off'
              value={zola}
              onChange={handleZolaChange}
            />
          </Column>
          <Container className={styles.buttonContainer}>
            <Button className={styles.button} onClick={handleButtonPress} disabled={submitDisabled}>
              <Text size={1.2} weight={600}>Submit</Text>
            </Button>
          </Container>
        </Form>
      </Container>
      <Container className={styles.copyright}>
        <Text style={{ opacity: 0.7 }}>Recap is a property of Parry Technology and Media LLC</Text>
      </Container>
    </Container>
  );
};

export default CreatePage;