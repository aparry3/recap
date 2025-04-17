import React from 'react';
import { Container, Column, Text } from 'react-web-layout-components';
import styles from './page.module.scss';
import Link from 'next/link';
import Image from 'next/image';

const PrivacyPage = () => {
    return (
        <Container className={styles.page}>
            <Container className={styles.header}>
                <Link href="/">
                    <Image src='/branding/wordmark.png' alt='Recap' width={100} height={40} />
                </Link>
            </Container>

            <Column className={styles.content}>
                <Text as="h1" size={2.5} weight={700} className={styles.title}>
                    Privacy Policy
                </Text>
                <Text as="p" className={styles.lastUpdated}>
                    Last Updated: {new Date().toLocaleDateString()}
                </Text>

                <Column className={styles.section}>
                    <Text as="h2" size={1.8} weight={600}>1. Introduction</Text>
                    <Text as="p">
                        At Recap, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our wedding photo sharing platform.
                    </Text>
                </Column>

                <Column className={styles.section}>
                    <Text as="h2" size={1.8} weight={600}>2. Information We Collect</Text>
                    <Text as="p">
                        We collect information that you provide directly to us, including:
                    </Text>
                    <ul>
                        <li>Account information (name, email address)</li>
                        <li>Wedding gallery information</li>
                        <li>Photos and media content</li>
                        <li>Communication preferences</li>
                    </ul>
                </Column>

                <Column className={styles.section}>
                    <Text as="h2" size={1.8} weight={600}>3. How We Use Your Information</Text>
                    <Text as="p">
                        We use the information we collect to:
                    </Text>
                    <ul>
                        <li>Provide and maintain our Service</li>
                        <li>Process your transactions</li>
                        <li>Send you technical notices and support messages</li>
                        <li>Communicate with you about products, services, and events</li>
                        <li>Monitor and analyze trends and usage</li>
                    </ul>
                </Column>

                <Column className={styles.section}>
                    <Text as="h2" size={1.8} weight={600}>4. Information Sharing</Text>
                    <Text as="p">
                        We do not sell or rent your personal information to third parties. We may share your information with:
                    </Text>
                    <ul>
                        <li>Service providers who assist in our operations</li>
                        <li>Law enforcement when required by law</li>
                        <li>Other parties with your consent</li>
                    </ul>
                </Column>

                <Column className={styles.section}>
                    <Text as="h2" size={1.8} weight={600}>5. Data Security</Text>
                    <Text as="p">
                        We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                    </Text>
                </Column>

                <Column className={styles.section}>
                    <Text as="h2" size={1.8} weight={600}>6. Your Rights</Text>
                    <Text as="p">
                        You have the right to:
                    </Text>
                    <ul>
                        <li>Access your personal information</li>
                        <li>Correct inaccurate information</li>
                        <li>Request deletion of your information</li>
                        <li>Object to processing of your information</li>
                        <li>Request data portability</li>
                    </ul>
                </Column>

                <Column className={styles.section}>
                    <Text as="h2" size={1.8} weight={600}>7. Cookies and Tracking</Text>
                    <Text as="p">
                        We use cookies and similar tracking technologies to track activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                    </Text>
                </Column>

                <Column className={styles.section}>
                    <Text as="h2" size={1.8} weight={600}>8. Changes to This Policy</Text>
                    <Text as="p">
                        We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
                    </Text>
                </Column>

                <Column className={styles.section}>
                    <Text as="h2" size={1.8} weight={600}>9. Contact Us</Text>
                    <Text as="p">
                        If you have any questions about this Privacy Policy, please contact us at aaron@ourweddingrecap.com
                    </Text>
                </Column>
            </Column>
        </Container>
    );
};

export default PrivacyPage; 