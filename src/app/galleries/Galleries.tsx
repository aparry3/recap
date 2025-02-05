'use client';
import React, { FC, useCallback } from 'react';
import { Column, Container, Row, Text } from 'react-web-layout-components';
import Image from 'next/image';
import styles from './Galleries.module.scss';
import { useRouter } from 'next/navigation';
import { Gallery } from '@/lib/types/Gallery';
import { Person } from '@/lib/types/Person';
import Link from 'next/link';
import Button from '@/components/Button';
import useLocalStorage, { deleteCookie } from '@/helpers/hooks/localStorage';

const Welcome: FC<{galleries: Gallery[], person?: Person}> = ({galleries, person}) => {
  const router = useRouter()
  const [_, setPersonId, personLoading] = useLocalStorage<string>('personId', '');

  const logout = useCallback(() => {
    if (!personLoading) {
      deleteCookie('personId')
      setPersonId('')
      router.push('/')
    }
  }, [personLoading])
  return (
    <Container as='main' className={styles.page}>
      <Column className={styles.titleContainer}>
        <Row as='header'padding={1}>
          <Image src='/branding/wordmark.png' alt='wordmark' layout='intrinsic' height={100} width={100}/>
        </Row>
        <Column as='header' className={styles.header}>
          <Text size={1.4}>Welcome</Text>
          <Text size={2.5} weight={500}>{person?.name}</Text>
        </Column>
        <Container className={styles.logoutButtonContainer}>
            <Button className={styles.logoutButton} onClick={logout}>
              <Text className={styles.logoutText}>
                Log out
              </Text>
            </Button>
          </Container>
      </Column>
      <Column className={styles.content}>
        <Row className={styles.contentTitle}>
          <Text size={1.4}>
            Galleries
          </Text>
        </Row>
        <Column className={styles.galleriesContainer}>
          {galleries.map((gallery, i) => (
            <>
            <Container className={styles.galleryContainer} key={i} padding={[0, 1]} onClick={() => router.push(`/${gallery.path}?password=${gallery.password}`)}>
                <Row className={styles.gallery}> 
                    <Container className={styles.galleryImage}>
                        <Text>Image</Text>
                    </Container>
                    <Column className={styles.galleryDetails}>
                        <Row className={styles.galleryName}>
                            <Text>{gallery.name}</Text>
                        </Row>
                        <Row className={styles.galleryDate}>
                            <Text>{new Date(gallery.date ||gallery.created).toDateString()}</Text>
                        </Row>
                    </Column>
                </Row>
            </Container>
            <Container className={styles.separator}/>
            </>
          ))}
          <Container className={styles.addGalleryContainer}>
            <Link href='/create' className={styles.addGallery}>
              <Text className={styles.addGalleryText}>
                + Create a new gallery
              </Text>
            </Link>
          </Container>
        </Column>
      </Column>
    </Container>
  );
};

export default Welcome;