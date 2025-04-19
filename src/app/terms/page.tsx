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
                    <Image src='/branding/wordmark.png' alt='Recap' width={100} height={40} />
                </Link>
            </Container>

            <Column className={styles.content}>
                <Text as="h1" size={2.5} weight={700} className={styles.title}>
                    Terms and Conditions
                </Text>
                <Text as="p" className={styles.lastUpdated}>
                    Last Updated: {new Date().toLocaleDateString()}
                </Text>

                <Column className={styles.section}>
                    <Text as="h2" size={1.8} weight={600}>1. Acceptance of Terms</Text>
                    <Text as="p">
                        By accessing and using Recap ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                    </Text>
                </Column>

                <Column className={styles.section}>
                    <Text as="h2" size={1.8} weight={600}>2. Description of Service</Text>
                    <Text as="p">
                        Recap is a wedding photo sharing platform that allows users to collect, organize, and share wedding photos. The service includes features for creating galleries, uploading photos, and managing access to these galleries.
                    </Text>
                </Column>

                <Column className={styles.section}>
                    <Text as="h2" size={1.8} weight={600}>3. User Responsibilities</Text>
                    <Text as="p">
                        Users are responsible for maintaining the confidentiality of their account information and for all activities that occur under their account. Users agree to notify Recap immediately of any unauthorized use of their account.
                    </Text>
                </Column>

                <Column className={styles.section}>
                    <Text as="h2" size={1.8} weight={600}>4. Content Ownership</Text>
                    <Text as="p">
                        Users retain all rights to their uploaded content. By uploading content to Recap, users grant Recap a non-exclusive, worldwide, royalty-free license to use, store, display, and distribute the content for the purpose of providing the Service.
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
                    <Text as="h2" size={1.8} weight={600}>6. Limitation of Liability</Text>
                    <Text as="p">
                        Recap shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Service.
                    </Text>
                </Column>

                <Column className={styles.section}>
                    <Text as="h2" size={1.8} weight={600}>7. Changes to Terms</Text>
                    <Text as="p">
                        Recap reserves the right to modify these terms at any time. Users will be notified of any changes, and continued use of the Service constitutes acceptance of the modified terms.
                    </Text>
                </Column>

                <Column className={styles.section}>
                    <Text as="h2" size={1.8} weight={600}>8. Contact Information</Text>
                    <Text as="p">
                        For any questions regarding these Terms and Conditions, please contact us at aaron@ourweddingrecap.com
                    </Text>
                </Column>
            </Column>
        </Container>
    );
};

export default TermsPage; 