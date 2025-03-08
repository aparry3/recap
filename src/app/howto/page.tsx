"use client";
import React from 'react';
import { Column, Container, Row, Text } from 'react-web-layout-components';
import styles from './page.module.scss';
import Image from 'next/image';

const HowToPage: React.FC = () => {
  return (
    <div className={styles.howtoPage}>
      <Container as='header' className={styles.header} justify='space-between'>
        <Container className={styles.wordmarkContainer} padding={0.5}>
          <a href="/">
            <Image src='/branding/wordmark.png' alt='Recap wordmark' layout='intrinsic' height={100} width={100}/>
          </a>
        </Container>
      </Container>

      <Column as='main' className={styles.mainContent}>
        <Column className={styles.titleContainer}>
          <Text as="h1" size={3} weight={700} className={styles.title}>
            How to Share Your Gallery
          </Text>
          <Text as="p" size={1.5} className={styles.subtitle}>
            Follow these simple steps to share your memories with friends and family
          </Text>
        </Column>

        <Column className={styles.stepsContainer}>
          {/* Step 1 */}
          <section className={styles.step}>
            <Row className={styles.stepHeader}>
              <Text as="h2" size={2} weight={600}>Step 1: Create Your Albums</Text>
            </Row>
            <Row className={styles.stepContent}>
              <Column className={styles.stepDescription}>
                <Text as="p">
                  Organize your wedding photos into clearly labeled albums—Ceremony, Reception, After-Party, or Honeymoon!
                </Text>
                <Image 
                  src="/images/howto/albums-example.svg" 
                  alt="Example of organized albums" 
                  width={600} 
                  height={400}
                  className={styles.stepImage}
                />
              </Column>
            </Row>
          </section>

          {/* Step 2 */}
          <section className={styles.step}>
            <Row className={styles.stepHeader}>
              <Text as="h2" size={2} weight={600}>Step 2: Generate Your QR Codes</Text>
            </Row>
            <Row className={styles.stepContent}>
              <Column className={styles.stepDescription}>
                <Text as="p">
                  Easily generate beautiful, customized QR codes for your overall gallery or for individual albums.
                </Text>
                <Image 
                  src="/images/howto/qr-stationery.svg" 
                  alt="QR code on wedding stationery" 
                  width={600} 
                  height={400}
                  className={styles.stepImage}
                />
              </Column>
            </Row>
          </section>

          {/* Step 3 */}
          <section className={styles.step}>
            <Row className={styles.stepHeader}>
              <Text as="h2" size={2} weight={600}>Step 3: Share with Guests</Text>
            </Row>
            <Row className={styles.stepContent}>
              <Column className={styles.stepDescription}>
                <Text as="p">
                  Include QR codes in invitations, signage, or stationery. Guests simply scan to join the fun—no app download or login required.
                </Text>
                <Image 
                  src="/images/howto/venue-display.svg" 
                  alt="QR code display at venue" 
                  width={600} 
                  height={400}
                  className={styles.stepImage}
                />
              </Column>
            </Row>
          </section>

          {/* Step 4 */}
          <section className={styles.step}>
            <Row className={styles.stepHeader}>
              <Text as="h2" size={2} weight={600}>Step 4: Send Friendly Reminders</Text>
            </Row>
            <Row className={styles.stepContent}>
              <Column className={styles.stepDescription}>
                <Text as="p">
                  Automate helpful texts or email reminders, gently prompting your guests to share their photos before and after your big day.
                </Text>
                <Image 
                  src="/images/howto/reminder-message.svg" 
                  alt="Example reminder message" 
                  width={600} 
                  height={400}
                  className={styles.stepImage}
                />
              </Column>
            </Row>
          </section>

          {/* Step 5 */}
          <section className={styles.step}>
            <Row className={styles.stepHeader}>
              <Text as="h2" size={2} weight={600}>Step 5: Watch Your Memories Come Alive</Text>
            </Row>
            <Row className={styles.stepContent}>
              <Column className={styles.stepDescription}>
                <Text as="p">
                  Enjoy real-time updates as guests share their favorite moments directly into your wedding gallery.
                </Text>
                <Image 
                  src="/images/howto/gallery-preview.svg" 
                  alt="Live gallery updates" 
                  width={600} 
                  height={400}
                  className={styles.stepImage}
                />
              </Column>
            </Row>
          </section>
        </Column>
      </Column>

      <Container as='footer' className={styles.footer} padding={2}>
        <Column className={styles.branding}>
          <Row className={styles.brandingRow}>
            <Image src='/branding/wordmarkInverse.png' alt='Recap wordmark' layout='intrinsic' height={100} width={100}/>
          </Row>
          <Row className={styles.brandingRow}>
            <Text>The best collaborative photo gallery for your next wedding, birthday, or celebration, offering unlimited uploads and collaborators, and easy organization of all of your media.</Text>
          </Row>    
        </Column>
      </Container>
    </div>
  );
};

export default HowToPage; 