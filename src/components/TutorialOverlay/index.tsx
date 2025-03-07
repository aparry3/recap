import React, { FC, useState } from 'react';
import { Column, Container, Row, Text } from 'react-web-layout-components';
import styles from './index.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { xIcon, shareNodesIcon, uploadIcon, albumIcon, qrcodeIcon } from '@/lib/icons';
import Button from '@/components/Button';
import useLocalStorage from '@/helpers/hooks/localStorage';

interface TutorialStep {
  title: string;
  description: string;
  icon: any;
  targetElement?: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    title: "Share Your Gallery",
    description: "Share your gallery with friends and family using the QR code or direct link. Perfect for printing on invitations or displaying at your event!",
    icon: shareNodesIcon,
    targetElement: "share-button"
  },
  {
    title: "Upload Photos",
    description: "Click the upload button to add photos and videos to your gallery. You can upload multiple files at once!",
    icon: uploadIcon,
    targetElement: "upload-button"
  },
  {
    title: "Organize with Albums",
    description: "Create albums to organize your photos by event, date, or theme. Makes it easy for everyone to find specific memories!",
    icon: albumIcon,
    targetElement: "albums-tab"
  },
  {
    title: "Access Anywhere",
    description: "Your QR code gives instant access to your gallery. No app download required - just scan and start sharing!",
    icon: qrcodeIcon,
    targetElement: "qr-code"
  }
];

const TutorialOverlay: FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showTutorial, setShowTutorial] = useLocalStorage<boolean>('showTutorial', true);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowTutorial(false);
    }
  };

  const handleSkip = () => {
    setShowTutorial(false);
  };

  if (!showTutorial) return null;

  const currentTutorial = tutorialSteps[currentStep];

  return (
    <div className={styles.overlay}>
      <div className={styles.backdrop} />
      <div className={styles.tutorialContainer}>
        <Container className={styles.header}>
          <Text size={1.2} weight={600}>{currentTutorial.title}</Text>
          <FontAwesomeIcon icon={xIcon} className={styles.closeIcon} onClick={handleSkip} />
        </Container>
        <Container className={styles.content}>
          <FontAwesomeIcon icon={currentTutorial.icon} className={styles.icon} />
          <Text size={1.1}>{currentTutorial.description}</Text>
        </Container>
        <Container className={styles.footer}>
          <Text size={0.9} className={styles.skipText} onClick={handleSkip}>
            Skip Tutorial
          </Text>
          <Button onClick={handleNext}>
            <Text size={1.1} weight={600}>
              {currentStep === tutorialSteps.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </Button>
        </Container>
      </div>
    </div>
  );
};

export default TutorialOverlay; 