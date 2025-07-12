'use client';
import React, { FC, FormEvent, MouseEvent, useEffect, useMemo, useState } from 'react';
import { Column, Container, Form, Row, Text } from 'react-web-layout-components';
import Image from 'next/image';
import Input from '@/components/Input';
import styles from './Create.module.scss';
import Button from '@/components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { leftIcon } from '@/lib/icons';
import { Gallery } from '@/lib/types/Gallery';


const EditGallery: FC<{gallery: Gallery, close: () => void, onSubmit: (galleryName: string, theKnot?: string, zola?: string) => void}> = ({gallery, close, onSubmit}) => {
  const [galleryName, setGalleryName] = useState(gallery ? gallery.name : '');

  const [theKnot, setTheKnot] = useState(gallery ? (gallery.theknot || '') : '');
  const [zola, setZola] = useState(gallery ? (gallery.zola || '') : '');

  useEffect(() => {
    if (gallery) {
       setGalleryName(gallery.name)
       setTheKnot(gallery.theknot || '')
       setZola(gallery.zola || '')
    } 
   }, [gallery])
 
  const handleGalleryNameChange = (value?: string) => {
    setGalleryName(value || '');
  };

  const handleTheKnotChange = (value?: string) => {
    setTheKnot(value || '');
  };
  const handleZolaChange = (value?: string) => {
    setZola(value || '');
  };

  const handleButtonPress = () => {
    // Perform any necessary actions with the form data
    onSubmit(galleryName, theKnot, zola);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Perform any necessary actions with the form data
    if (!!galleryName) onSubmit(galleryName, theKnot, zola);
};

  const url = useMemo(() => `https://ourweddingrecap.com/${galleryName.toLowerCase().replaceAll(' ', '-')}`, [galleryName]);
  return (
    <Container as='main' className={styles.editPage}>
      <Row className={styles.actionHeader}>
        <Container className={styles.backButton} onClick={close}>
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
          <Text size={1.4}>Edit</Text>
          <Text size={2.5} weight={500}>{gallery.name}</Text>
        </Column>
        <Container className={styles.buttonContainer} padding={[2, 0]}>
          <Button className={styles.button} onClick={handleButtonPress} type='submit' disabled={!galleryName}>
            <Text size={1.2} weight={600}>Submit</Text>
          </Button>
        </Container>
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
            <Button className={styles.button} onClick={handleButtonPress} type='submit' disabled={!galleryName}>
              <Text size={1.2} weight={600}>Submit</Text>
            </Button>
          </Container>
        </Form>
      </Container>
    </Container>
  );
};

export default EditGallery;