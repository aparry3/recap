'use client';
import React, { FC, FormEvent, useEffect, useMemo, useState } from 'react';
import { Column, Container, Form, Row, Text } from 'react-web-layout-components';
import Image from 'next/image';
import Input from '@/components/Input';
import styles from './Create.module.scss';
import Button from '@/components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { leftIcon } from '@/lib/icons';
import { Gallery } from '@/lib/types/Gallery';
import { faTimes } from '@fortawesome/free-solid-svg-icons';


const EditGallery: FC<{gallery: Gallery, close: () => void, onSubmit: (galleryName: string, owners: string[], theKnot?: string, zola?: string, date?: string) => void}> = ({gallery, close, onSubmit}) => {
  const [galleryName, setGalleryName] = useState(gallery ? gallery.name : '');
  const [theKnot, setTheKnot] = useState(gallery ? (gallery.theknot || '') : '');
  const [zola, setZola] = useState(gallery ? (gallery.zola || '') : '');
  const [date, setDate] = useState(gallery ? (gallery.date ? new Date(gallery.date).toISOString().split('T')[0] : '') : '');
  const [owners, setOwners] = useState(gallery ? (gallery.owners || [gallery.personId]) : []);
  const [ownerInput, setOwnerInput] = useState('');

  useEffect(() => {
    if (gallery) {
       setGalleryName(gallery.name)
       setTheKnot(gallery.theknot || '')
       setZola(gallery.zola || '')
       setDate(gallery.date ? new Date(gallery.date).toISOString().split('T')[0] : '')
       setOwners(gallery.owners || [gallery.personId])
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

  const handleDateChange = (value?: string) => {
    setDate(value || '');
  };

  // const handleOwnerChange = (value?: string) => {
  //   setOwner(value || '');
  // };

  const handleButtonPress = () => {
    // Perform any necessary actions with the form data
    onSubmit(galleryName, owners, theKnot, zola, date);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Perform any necessary actions with the form data
    if (!!galleryName) onSubmit(galleryName, owners, theKnot, zola, date);
};

  const url = useMemo(() => `https://ourweddingrecap.com/${galleryName.toLowerCase().replaceAll(' ', '-')}`, [galleryName]);

  // Owners field handlers
  const handleOwnerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOwnerInput(e.target.value);
  };

  const handleAddOwners = () => {
    if (!ownerInput.trim()) return;
    // Split by comma or semicolon, trim, filter valid emails, and deduplicate
    const emails = ownerInput
      .split(/[;,]/)
      .map(e => e.trim())
      .filter(e => e && !owners.includes(e));
    if (emails.length) {
      setOwners([...owners, ...emails]);
      setOwnerInput('');
    }
  };

  const handleRemoveOwner = (email: string) => {
    setOwners(owners.filter(o => o !== email));
  };

  const handleOwnerInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddOwners();
    }
  };

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
            <Input
              label="Wedding Date"
              type="date"
              name="date"
              autoComplete='off'
              value={date}
              onChange={handleDateChange}
            />
          </Column>
          <Column className={styles.inputContainer}>
            <label style={{ fontWeight: 500, marginBottom: 4 }}>Owners</label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
              <input
                type="text"
                placeholder="Enter email address (or multiple emails separated by commas)"
                value={ownerInput}
                onChange={handleOwnerInputChange}
                onKeyDown={handleOwnerInputKeyDown}
                style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #ccc', fontSize: 16 }}
              />
              <Button type="button" onClick={handleAddOwners} style={{ minWidth: 60 }}>Add</Button>
            </div>
            <div style={{ color: '#888', fontSize: 14, marginBottom: 8 }}>
              You can add multiple emails at once by separating them with commas or semicolons
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
              {owners.map(email => (
                <span key={email} style={{ display: 'flex', alignItems: 'center', background: '#f5f5f7', borderRadius: 999, padding: '6px 14px', fontWeight: 600, fontSize: 16 }}>
                  {email}
                  <FontAwesomeIcon icon={faTimes} style={{ marginLeft: 8, cursor: 'pointer' }} onClick={() => handleRemoveOwner(email)} />
                </span>
              ))}
            </div>
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