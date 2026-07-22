import React from 'react';
import { Container, Column, Text } from 'react-web-layout-components';
import styles from './page.module.scss';
import Link from 'next/link';
import Image from 'next/image';

const TermsPage = () => {
    return (
        <Container className={styles.page}>
            <Container className={styles.header}>
                <Link href="/">
                    <Image src='/branding/wordmark.png' alt='Our Wedding Recap' width={100} height={40} />
                </Link>
            </Container>

            <Column className={styles.content}>
                <Text as="h1" size={2.5} weight={700} className={styles.title}>
                    Terms and Conditions
                </Text>
                <Text as="p" className={styles.lastUpdated}>
                    Last Updated: July 21, 2026
                </Text>

                <Column className={styles.section}>
                    <Text as="h2" size={1.8} weight={600}>1. Acceptance of Terms</Text>
                    <Text as="p">
                        These Terms form an agreement between you and Parry Technology and Media, LLC, the owner and operator of Our Wedding Recap (“Our Wedding Recap,” “we,” “us,” or “our”). By accessing or using Our Wedding Recap (“the Service”), you agree to be bound by these Terms. If you do not agree, please do not use the Service.
                    </Text>
                </Column>

                <Column className={styles.section}>
                    <Text as="h2" size={1.8} weight={600}>2. Description of Service</Text>
                    <Text as="p">
                        Our Wedding Recap is a wedding photo sharing platform that allows users to collect, organize, and share wedding photos. The Service includes features for creating galleries, uploading photos, and managing access to these galleries.
                    </Text>
                </Column>

                <Column className={styles.section}>
                    <Text as="h2" size={1.8} weight={600}>3. User Responsibilities</Text>
                    <Text as="p">
                        Users are responsible for maintaining the confidentiality of their account information and for all activities that occur under their account. Users agree to notify Our Wedding Recap immediately of any unauthorized use of their account.
                    </Text>
                </Column>

                <Column className={styles.section}>
                    <Text as="h2" size={1.8} weight={600}>4. Content Ownership</Text>
                    <Text as="p">
                        Users retain all rights to their uploaded content. By uploading content to Our Wedding Recap, users grant Parry Technology and Media, LLC a non-exclusive, worldwide, royalty-free license to use, store, display, and distribute the content for the purpose of providing the Service.
                    </Text>
                </Column>

                <Column className={styles.section}>
                    <Text as="h2" size={1.8} weight={600}>5. Prohibited Activities</Text>
                    <Text as="p">
                        Users agree not to use the Service to:
                    </Text>
                    <ul>
                        <li>Upload or share content that violates any laws or regulations</li>
                        <li>Upload or share content that infringes on intellectual property rights</li>
                        <li>Upload or share content that is harmful, threatening, or offensive</li>
                        <li>Attempt to gain unauthorized access to any portion of the Service</li>
                    </ul>
                </Column>

                <Column className={styles.section}>
                    <Text as="h2" size={1.8} weight={600}>6. Optional Email and SMS Updates</Text>
                    <Text as="p">
                        Guests may separately opt in to email and SMS wedding updates. SMS consent is optional and is not a condition of purchasing or using Our Wedding Recap. Our Wedding Recap may send no more than 10 business-initiated automated wedding update texts per gallery to an opted-in guest, including the enrollment confirmation. If a guest messages Our Wedding Recap, we may send additional service responses to that request. Message frequency varies, and message and data rates may apply. Reply STOP to stop and HELP for help, or use the linked communication-preferences page.
                    </Text>
                </Column>

                <Column className={styles.section}>
                    <Text as="h2" size={1.8} weight={600}>7. Limitation of Liability</Text>
                    <Text as="p">
                        To the fullest extent permitted by law, Parry Technology and Media, LLC, as the owner and operator of Our Wedding Recap, shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Service.
                    </Text>
                </Column>

                <Column className={styles.section}>
                    <Text as="h2" size={1.8} weight={600}>8. Changes to Terms</Text>
                    <Text as="p">
                        We reserve the right to modify these Terms at any time. Users will be notified of any changes, and continued use of the Service constitutes acceptance of the modified Terms.
                    </Text>
                </Column>

                <Column className={styles.section}>
                    <Text as="h2" size={1.8} weight={600}>9. Contact Information</Text>
                    <Text as="p">
                        For questions regarding these Terms, contact Parry Technology and Media, LLC, the owner and operator of Our Wedding Recap, at aaron@ourweddingrecap.com.
                    </Text>
                </Column>
            </Column>
        </Container>
    );
};

export default TermsPage;
