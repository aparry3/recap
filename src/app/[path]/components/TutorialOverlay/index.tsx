import React, { FC, useState } from 'react';
import { Column, Container, Text } from 'react-web-layout-components';
import styles from './index.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { albumIcon, shareNodesIcon, userIcon, xIcon } from '@/lib/icons';
import Image from 'next/image';
import SectionContainer from './SectionContainer';

const ASSETS_CLOUDFRONT_URL = process.env.NEXT_PUBLIC_ASSETS_CLOUDFRONT_URL || '';

interface TutorialOverlayProps {
  open: boolean;
  onClose: () => void;
}

const TutorialOverlay: FC<TutorialOverlayProps> = ({ open, onClose }) => {
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  const sections = [
    {
      title: 'Sharing Your Gallery',
      icon: shareNodesIcon,
      subSections: [{steps:[
        {
          items: [
            {
              title: 'Navigate to the share page',
              image: `${ASSETS_CLOUDFRONT_URL}/reference/QR.png`
            },
          ]
        },
        {
          items: [
            {
              title: '(Optional) Choose an album',
              description: 'If an album is chosen, your guests can upload media directly to the chosen album.',
              image: `${ASSETS_CLOUDFRONT_URL}/reference/Album.png`
            }
          ]
        },
        {
          items: [
            {
              title: 'Download your QR Code',
              description: 'Download your QR code as a .png file and add it to your wedding stationary on The Knot, Zola, or anywhere else',
              image: `${ASSETS_CLOUDFRONT_URL}/reference/Download.png`
            },
            {
              title: 'Copy your QR Code',
              description: 'Copy your QR code png file to your clipboard and paste anywhere that you can paste photos.',
              image: `${ASSETS_CLOUDFRONT_URL}/reference/QRExample.png`
            },
            {
              title: 'Copy your Gallery Link',
              description: 'Copy your gallery or album link directly and send it to your guests via email or text.',
              image: `${ASSETS_CLOUDFRONT_URL}/reference/Link.png`
            }
          ]
        }
      ]}]
    },
    {
      title: 'Organizing Media',
      description: 'Recap helps you organize all of your guests photos and videos. View photos by guest, sort by likes, and create unlimited albums.',
      icon: albumIcon,
      subSections: [
        {
          title: 'View Photos By Guest',
          steps: [
            {
              items: [
                {
                  title: 'Navigate to the People Page',
                  image: `${ASSETS_CLOUDFRONT_URL}/reference/PeopleMenu.png`
                },
              ]
            },
            {
              items: [
                {
                  title: 'Select a guest',
                  description: 'View all photos and videos uploaded by a specific guest',
                  image: `${ASSETS_CLOUDFRONT_URL}/reference/People.png`
                }
              ]
            }
          ]
        },
        {
          title: 'Create an Album',
          steps: [
            {
              items: [
                {
                  title: 'Navigate to the Album Page',
                  image: `${ASSETS_CLOUDFRONT_URL}/reference/AlbumMenu.png`
                },
              ]
            },
            {
              items: [
                {
                  title: 'Click Create New Album',
                  image: `${ASSETS_CLOUDFRONT_URL}/reference/CreateNewAlbum.png`
                },
              ]
            },
            {
              items: [
                {
                  title: 'Enter your album name',
                  image: `${ASSETS_CLOUDFRONT_URL}/reference/AlbumName.png`
                }
              ]
            }
          ]
        },
        {
          title: 'Add Media to an Album',
          steps: [
            {
              items: [
                {
                  title: 'Click Select',
                  image: `${ASSETS_CLOUDFRONT_URL}/reference/Selects.png`
                },
              ]
            },
            {
              items: [
                {
                  title: 'Select media to add to album',
                  image: `${ASSETS_CLOUDFRONT_URL}/reference/Selected.png`
                }
              ]
            },
            {
              items: [
                {
                  title: 'Click Add to Album',
                  image: `${ASSETS_CLOUDFRONT_URL}/reference/AddToAlbum.png`
                },
              ]
            },
            {
              items: [
                {
                  title: 'Select or create an album',
                  image: `${ASSETS_CLOUDFRONT_URL}/reference/SelectAlbum.png`
                }
              ]
            }
          ]
        }
      ]
    },
  ];

  if (!open) return null;

  return (
    <Column className={styles.tutorialPage}>
      <Container className={styles.header} padding justify="space-between">
        <Container className={styles.headerIcon} onClick={onClose}>
          <FontAwesomeIcon icon={xIcon} className={styles.icon}/>
        </Container>
        <Image src={`${ASSETS_CLOUDFRONT_URL}/branding/wordmark.png`} alt='wordmark' layout='intrinsic' height={100} width={100}/>
        <Container className={styles.headerIcon} />
      </Container>
      <Column className={styles.heading}>
        <Container>
          <Text size={3.5}>
            Get Started
          </Text>
        </Container>
      </Column>
      <Column className={styles.contentContainer}>
        {sections.map((section, index) => (
          <SectionContainer key={index} section={section} />
        ))}
      </Column>
    </Column>
  );
};

export default TutorialOverlay; 