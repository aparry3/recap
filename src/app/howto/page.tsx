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
  description: (React.ReactNode | React.ReactNode[])[];
  desktopImage: string;
  mobileImage: string;
  isExpanded: boolean;
  onToggle: () => void;
}

const StepSection: React.FC<StepSectionProps> = ({ icon, title, description, isExpanded, onToggle }) => {
  const renderFormattedText = (text: (React.ReactNode | React.ReactNode[])[]) => {
    return text.map((item, index) => {
      if (Array.isArray(item)) {
        return (
          <Column key={`list-${index}`} className={styles.bulletList}>
            {item}
          </Column>
        );
      }
      return item;
    });
  };

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
          <Column className={styles.stepDescription}>
            {renderFormattedText(description)}
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
      title: "Create Your Wedding Gallery",
      description: [
        <Text key="header" weight={600} className={styles.stepHeader}>Get started in seconds:</Text>,
        [
          <Text key="step1" className={styles.stepItem}>Go to ourweddingrecap.com or click <Text weight={600}className={styles.highlight}>Start Now</Text> above</Text>,
          <Text key="step2" className={styles.stepItem}>Enter your name, email, and wedding gallery name</Text>,
          <Text key="step3" className={styles.stepItem}>(Optional) Add your wedding website—we'll sync your photos and events automatically!</Text>,
        ],
        <Text key="thanks" weight={600}className={styles.stepHeader}>That's it! You'll get an email with your gallery link.</Text>,
        <Text key="protip" className={styles.protip}>🎯 Pro Tip: Already made a gallery? Just enter your email on the login page to get a magic link—no password needed!</Text>
      ],
      desktopImage: "",
      mobileImage: ""
    },
    {
      icon: qrcodeIcon,
      title: "Download & Share Your QR Code",
      description: [
        <Text key="intro" className={styles.paragraph}>Every Recap gallery comes with a unique QR code—so guests can start uploading photos immediately.</Text>,
        <Text key="header" weight={600} className={styles.stepHeader}>📍 Find your QR code:</Text>,
        [
          <Text key="step1" className={styles.stepItem}>Tap the QR icon at the top of your gallery</Text>,
          <Text key="step2" className={styles.stepItem}>Customize the color, choose a specific album, or download the PNG</Text>,
          <Text key="step3" className={styles.stepItem}>Print it or share the link however you like!</Text>
        ],
        <Text key="useHeader" weight={600} className={styles.stepHeader}>💡 Where to Use It:</Text>,
        [
          <Text key="use1" className={styles.checkItem}><Text weight={600} className={styles.highlight}>Save-the-dates & invitations</Text> → Guests can start uploading early!</Text>,
          <Text key="use2" className={styles.checkItem}><Text weight={600} className={styles.highlight}>Wedding signs, table numbers, place cards</Text> → Perfect for easy guest access</Text>,
          <Text key="use3" className={styles.checkItem}><Text weight={600} className={styles.highlight}>Thank-you cards</Text> → A final reminder to upload any last photos</Text>
        ]
      ],
      desktopImage: "",
      mobileImage: ""
    },
    {
      icon: shareNodesIcon,
      title: "Guests Upload Photos & Videos—No App, No Account!",
      description: [
        <Text key="header" weight={600} className={styles.stepHeader}>When guests scan your QR code:</Text>,
        [
          <Text key="step1" className={styles.stepItem}>They instantly access your gallery (or a specific album)</Text>,
          <Text key="step2" className={styles.stepItem}>They enter their name (no account needed!)</Text>,
          <Text key="step3" className={styles.stepItem}>They upload photos/videos straight from their camera roll or take a picture on the spot</Text>
        ],
        <Text key="privacy" className={styles.protip}>🛡 Privacy Options: Guests can choose to upload privately (only visible to you) or share with everyone in the gallery.</Text>
      ],
      desktopImage: "",
      mobileImage: ""
    },
    {
      icon: weddingIcon,
      title: "Guests Get Helpful Reminders",
      description: [
        <Text key="header" weight={600} className={styles.stepHeader}>If guests enter their phone number or email, they'll receive:</Text>,
        [
          <Text key="reminder1" className={styles.emojiItem}>📅 Day-of reminders (Where to go, what time, what to wear)</Text>,
          <Text key="reminder2" className={styles.emojiItem}>📸 Pre-wedding prompts (e.g., "100 days until 'I do!' Upload your favorite photos of us!")</Text>,
          <Text key="reminder3" className={styles.emojiItem}>🎉 Post-wedding nudge ("Thanks for celebrating with us! Upload your wedding pics here!")</Text>
        ]
      ],
      desktopImage: "",
      mobileImage: ""
    },
    {
      icon: photoFilmIcon,
      title: "Manage Your Gallery & Download Everything",
      description: [
        <Text key="header" weight={600} className={styles.stepHeader}>After the wedding, you can:</Text>,
        [
          <Text key="feature1" className={styles.checkItem}>Download all photos & videos</Text>,
          <Text key="feature2" className={styles.checkItem}>Organize them into albums</Text>,
          <Text key="feature3" className={styles.checkItem}>(Coming soon!) Create a wedding recap video</Text>,
          <Text key="feature4" className={styles.checkItem}>(Coming soon!) Tag guests in photos</Text>
        ],
        <Text key="helpHeader" weight={600} className={styles.stepHeader}>💬 Need Help?</Text>,
        <Text key="help" className={styles.paragraph}>Email us at aaron@ourweddingrecap.com—we'll reply within 12 hours!</Text>
      ],
      desktopImage: "",
      mobileImage: ""
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
        <Link href="/create" className={styles.startButton}>
          Start Now
        </Link>
      </Container>

      <Column className={styles.mainContent}>
        <Column className={styles.titleContainer}>
          <Text as="h1" weight={700} size={2.5} className={styles.title}>
            How to Use Recap for Your Wedding
          </Text>
          <Text size={1.25} className={styles.subtitle}>
            The easiest way to collect and share your guests' photos—before, during, and after your wedding! 🎉
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