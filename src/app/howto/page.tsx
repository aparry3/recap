"use client";
import React from 'react';
import { Column, Container, Row, Text } from 'react-web-layout-components';
import styles from './page.module.scss';
import Image from 'next/image';
import { shareNodesIcon, uploadIcon, albumIcon } from '@/lib/icons';
import Accordion from './components/Accordion';

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
            How to use Recap
          </Text>
          <Text as="p" size={1.5} className={styles.subtitle}>
            Learn how to make the most of your Recap galleries
          </Text>
        </Column>

        <Column className={styles.accordionContainer}>
          <Accordion 
            title="Sharing your gallery with friends and family" 
            icon={shareNodesIcon}
            content={
              <Column className={styles.accordionContent}>
                <Text as="p">Sharing your Recap gallery with others is easy. Here's how:</Text>
                <ol className={styles.stepsList}>
                  <li>
                    <Text as="p"><strong>Copy your gallery link</strong> - Open your gallery and click the "Share" button in the top menu</Text>
                  </li>
                  <li>
                    <Text as="p"><strong>Share via QR code</strong> - A QR code is automatically generated for your gallery. Others can scan this code to instantly access your gallery</Text>
                  </li>
                  <li>
                    <Text as="p"><strong>Share directly</strong> - Use the share buttons to directly send your gallery via messaging apps, email, or social media</Text>
                  </li>
                  <li>
                    <Text as="p"><strong>Set permissions</strong> - You can choose whether viewers can only view or also upload their own photos</Text>
                  </li>
                </ol>
                <Text as="p" className={styles.tip}>
                  <strong>Tip:</strong> For events like weddings, consider printing the QR code on invitations or displaying it at the venue!
                </Text>
              </Column>
            }
          />

          <Accordion 
            title="Uploading images and videos to your gallery" 
            icon={uploadIcon}
            content={
              <Column className={styles.accordionContent}>
                <Text as="p">Adding media to your Recap gallery is simple:</Text>
                <ol className={styles.stepsList}>
                  <li>
                    <Text as="p"><strong>Open your gallery</strong> - Navigate to your gallery by entering the URL or scanning the QR code</Text>
                  </li>
                  <li>
                    <Text as="p"><strong>Click 'Upload'</strong> - Look for the upload button in the gallery interface</Text>
                  </li>
                  <li>
                    <Text as="p"><strong>Select files</strong> - Choose photos and videos from your device to upload</Text>
                  </li>
                  <li>
                    <Text as="p"><strong>Confirm upload</strong> - Review your selections and confirm to start uploading</Text>
                  </li>
                  <li>
                    <Text as="p"><strong>Wait for completion</strong> - Your media will be processed and added to the gallery</Text>
                  </li>
                </ol>
                <Text as="p" className={styles.tip}>
                  <strong>Note:</strong> Recap supports most common image formats (JPG, PNG, HEIC) and video formats (MP4, MOV).
                </Text>
              </Column>
            }
          />

          <Accordion 
            title="Creating and managing albums" 
            icon={albumIcon}
            content={
              <Column className={styles.accordionContent}>
                <Text as="p">Organize your media into albums to keep everything tidy:</Text>
                <ol className={styles.stepsList}>
                  <li>
                    <Text as="p"><strong>Go to Albums tab</strong> - In your gallery, navigate to the Albums section</Text>
                  </li>
                  <li>
                    <Text as="p"><strong>Create a new album</strong> - Click the "Create Album" button</Text>
                  </li>
                  <li>
                    <Text as="p"><strong>Name your album</strong> - Give your album a descriptive name (e.g., "Ceremony", "Reception")</Text>
                  </li>
                  <li>
                    <Text as="p"><strong>Add photos</strong> - Select photos from your gallery to add to the album</Text>
                  </li>
                  <li>
                    <Text as="p"><strong>Manage albums</strong> - You can edit albums later to add/remove photos or rename them</Text>
                  </li>
                </ol>
                <Text as="p" className={styles.tip}>
                  <strong>Tip:</strong> Creating themed albums (like "Family Photos" or "Dance Floor") makes it easier for everyone to find specific memories!
                </Text>
              </Column>
            }
          />

          <Accordion 
            title="Downloading media from your gallery" 
            icon={albumIcon}
            content={
              <Column className={styles.accordionContent}>
                <Text as="p">Save photos and videos from your Recap gallery:</Text>
                <ol className={styles.stepsList}>
                  <li>
                    <Text as="p"><strong>Individual media</strong> - Open the photo or video you want to save and click the download button</Text>
                  </li>
                  <li>
                    <Text as="p"><strong>Multiple items</strong> - Select multiple photos/videos by clicking the select option, then use the download button</Text>
                  </li>
                  <li>
                    <Text as="p"><strong>Entire gallery</strong> - Gallery owners can download all media as a zip file from the gallery options</Text>
                  </li>
                </ol>
                <Text as="p" className={styles.tip}>
                  <strong>Note:</strong> Downloaded media will be in the original resolution that was uploaded.
                </Text>
              </Column>
            }
          />
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