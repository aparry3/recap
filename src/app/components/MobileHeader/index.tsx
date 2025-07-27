"use client";

import React, { FC, useState } from 'react';
import { Column, Container, Text } from 'react-web-layout-components';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { menuIcon, xIcon } from '@/lib/icons';
import styles from './MobileHeader.module.scss';

interface AuthState {
    isAuthenticated: boolean;
    hasGalleries: boolean;
    personId?: string;
}

interface MobileHeaderProps {
    authState?: AuthState;
}

const MobileHeader: FC<MobileHeaderProps> = ({ authState }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <Container className={styles.mobileOnly}>
            <Container className={styles.mobileMenuButton} onClick={toggleMobileMenu}>
                <FontAwesomeIcon icon={menuIcon} />
            </Container>

            {isMobileMenuOpen && (
                <Column className={styles.mobileMenu}>
                    <Container className={styles.mobileMenuHeader}>
                        <Container className={styles.wordmarkContainer} padding={0.5}>
                            <Link href="/">
                                <Image src='/branding/wordmark.png' alt='wordmark' layout='intrinsic' height={100} width={100}/>
                            </Link>
                        </Container>
                        <Container padding={0.5} onClick={toggleMobileMenu} className={styles.closeButton}>
                            <FontAwesomeIcon icon={xIcon} />
                        </Container>
                    </Container>
                    <Column className={styles.mobileMenuContent}>
                        <Link href='/howto' className={styles.link} onClick={toggleMobileMenu}>
                            <Container className={styles.mobileMenuItem}>
                                <Text weight={600} size={1.2}>How It Works</Text>
                            </Container>
                        </Link>
                        <Link 
                            href={authState?.isAuthenticated && authState?.hasGalleries ? '/galleries' : '/create'} 
                            className={styles.link} 
                            onClick={toggleMobileMenu}
                        >
                            <Container className={styles.mobileMenuItem}>
                                <Text weight={700} size={1.2}>
                                    {authState?.isAuthenticated && authState?.hasGalleries ? 'Galleries' : 'Get Started'}
                                </Text>
                            </Container>
                        </Link>
                    </Column>
                </Column>
            )}
        </Container>
    );
};

export default MobileHeader; 