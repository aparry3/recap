'use client';
import React, { FC, FormEvent, useCallback, useEffect, useState } from 'react';
import { Column, Container, Form, Row, Text } from 'react-web-layout-components';
import Image from 'next/image';
import Input from '@/components/Input';
import styles from './CreateAlbum.module.scss';
import Button from '@/components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { checkSquareIcon, squareIcon, trashIcon, xIcon } from '@/lib/icons';
import { AlbumMediaData, AlbumUpdate } from '@/lib/types/Album';

const EditAlbum: FC<{album: AlbumMediaData, onSubmit: (album: AlbumUpdate) => void, onDelete: () => void,onClose: () => void}> = ({onSubmit, onDelete, album,onClose}) => {
  const [name, setName] = useState<string>(album.name || '');
  const [isPrivate, setIsPrivate] = useState<boolean>(!album.isPrivate)

  const handleNameChange = (value?: string) => {
    setName(value || '');
  };

  const handleButtonPress = useCallback(() => {
    // Perform any necessary actions with the form data
    console.log(name)
    onSubmit({name, isPrivate});
  }, [name, isPrivate]);

  const handleSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("handle submit")
    // Perform any necessary actions with the form data
    onSubmit({name, isPrivate});
  }, [name, isPrivate]);

  useEffect(() => {
    setName(album.name || '')
    setIsPrivate(!album.isPrivate)
  }, [album])

  return (
    <Column as='main' className={styles.page}>
        <Row className={styles.header} justify='space-between'>
            <Container className={styles.closeButton} onClick={onClose}>
                <FontAwesomeIcon icon={xIcon} className={styles.icon} />
            </Container>
            <Container className={styles.closeButton} onClick={onDelete}>
                <FontAwesomeIcon icon={trashIcon} className={styles.icon} />
            </Container>
        </Row>
      <Column className={styles.titleContainer}>
        <Row as='header'padding={1}>
          <Image src='/branding/wordmark.png' alt='wordmark' layout='intrinsic' height={100} width={100}/>
        </Row>
        <Column as='header' className={styles.title}>
          <Text size={1.4}>Edit album</Text>
          <Text size={2.5} weight={500}>{album.name}</Text>
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
          <Container className={styles.checkboxContainer} onClick={() => setIsPrivate(!isPrivate)}>
            <Container className={styles.checkbox}>
              <FontAwesomeIcon icon={isPrivate ? checkSquareIcon : squareIcon} className={styles.icon} />
            </Container>
            <Container className={styles.textContainer}>
              <Text size={1.2}>Private</Text>
            </Container>
          </Container>
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

export default EditAlbum;