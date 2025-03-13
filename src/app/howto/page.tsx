"use client";
import React, { useState } from 'react';
import { Column, Container, Row, Text } from 'react-web-layout-components';
import styles from './page.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { albumIcon, qrcodeIcon, shareNodesIcon, weddingIcon, photoFilmIcon, downIcon } from '@/lib/icons';
import Footer from '../components/Footer';

interface StepSectionProps {
  icon: any;
  title: string;
  description: string;
  desktopImage: string;
  mobileImage: string;
  isExpanded: boolean;
  onToggle: () => void;
}

const StepSection: React.FC<StepSectionProps> = ({ icon, title, description, desktopImage, mobileImage, isExpanded, onToggle }) => {
  return (
    <Column className={`${styles.step} ${isExpanded ? styles.expanded : ''}`} onClick={onToggle}>
      <Container className={styles.stepHeader}>
        <Container style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <FontAwesomeIcon icon={icon} className={styles.stepIcon} />
          <Text as="h2" weight={600} size={1.5}>{title}</Text>
        </Container>
        <FontAwesomeIcon 
          icon={downIcon} 
          className={`${styles.chevronIcon} ${isExpanded ? styles.expanded : ''}`} 
        />
      </Container>
      {isExpanded && (
        <Column className={styles.stepContent}>
          <Column className={styles.stepDescription} style={{ gap: '1.5rem' }}>
            <Text size={1.25}>{description}</Text>
            <Image 
              src={desktopImage} 
              alt={title} 
              className={styles.desktopAlbumImage}
              width={800}
              height={533}
            />
            <Image 
              src={mobileImage} 
              alt={title} 
              className={styles.mobileAlbumImage}
              width={400}
              height={533}
            />
          </Column>
        </Column>
      )}
    </Column>
  );
};

const HowToPage = () => {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const steps = [
    {
      icon: albumIcon,
      title: "Step 1: Create Your Albums",
      description: "Start by creating custom albums for different moments of your wedding journey. From engagement photos to the ceremony, organize your memories exactly how you want them.",
      desktopImage: "/product/DesktopAlbums.png",
      mobileImage: "/product/MobileAlbums.png"
    },
    {
      icon: qrcodeIcon,
      title: "Step 2: Generate Your QR Codes",
      description: "Get unique QR codes for each album. These codes can be printed on your wedding stationery, making it easy for guests to upload photos to the right album.",
      desktopImage: "/product/DesktopQR.png",
      mobileImage: "/product/MobileQR.png"
    },
    {
      icon: shareNodesIcon,
      title: "Step 3: Share with Guests",
      description: "Add your QR codes to save-the-dates, invitations, place cards, and more. Guests can scan and upload photos instantly, no app required.",
      desktopImage: "/product/DesktopShare.png",
      mobileImage: "/product/MobileShare.png"
    },
    {
      icon: weddingIcon,
      title: "Step 4: Send Friendly Reminders",
      description: "Keep the photo sharing going with gentle reminders to your guests. Encourage them to share their favorite moments before, during, and after your special day.",
      desktopImage: "/product/DesktopNoti.png",
      mobileImage: "/product/MobileNoti.png"
    },
    {
      icon: photoFilmIcon,
      title: "Step 5: Watch Your Memories Come Alive",
      description: "Watch as your gallery fills with photos from every guest. Download, share, and relive your wedding day through everyone's eyes.",
      desktopImage: "/product/DesktopGallery.png",
      mobileImage: "/product/MobileGallery.png"
    }
  ];

  return (
    <Column className={styles.howtoPage}>
      <Container className={styles.header} justify="space-between">
        <Container className={styles.wordmarkContainer}>
          <Link href="/">
            <Image src="/branding/wordmark.png" alt="Recap" width={100} height={40} />
          </Link>
        </Container>
      </Container>

      <Column className={styles.mainContent}>
        <Column className={styles.titleContainer}>
          <Text as="h1" weight={700} size={2.5} className={styles.title}>
            How It Works
          </Text>
          <Text size={1.25} className={styles.subtitle}>
            Five simple steps to collect every photo from every guest
          </Text>
        </Column>

        <Column className={styles.stepsContainer}>
          {steps.map((step, index) => (
            <StepSection
              key={index}
              {...step}
              isExpanded={expandedStep === index}
              onToggle={() => setExpandedStep(expandedStep === index ? null : index)}
            />
          ))}
        </Column>
      </Column>

      <Footer />
    </Column>
  );
};

export default HowToPage; 