import React from 'react';
import { Column, Container, Text } from 'react-web-layout-components';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Accessibility Statement - Recap',
  description: 'Our commitment to making Recap accessible to all users, including those with disabilities.',
};

export default function AccessibilityPage() {
  return (
    <Column style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: 'var(--background-light)',
      color: 'var(--text-dark)',
    }}>
      <Container as='header' style={{
        width: '100%',
        padding: '1rem',
        backgroundColor: 'var(--background-light)',
      }} justify='space-between' role="banner">
        <Container style={{ height: '2.5rem', cursor: 'pointer' }} padding={0.5}>
          <Link href="/" aria-label="Return to Recap homepage">
            <Image src='/branding/wordmark.png' alt='Recap logo' layout='intrinsic' height={100} width={100}/>
          </Link>
        </Container>
      </Container>
      
      <Column style={{
        flex: 1,
        padding: '2rem',
        maxWidth: '800px',
        margin: '0 auto',
        width: '100%',
      }} role="main" id="main-content">
        <Container style={{
          marginBottom: '2rem',
        }}>
          <Text as="h1" weight={700} size={3} style={{ color: 'var(--primary-dark)' }}>
            Accessibility Statement
          </Text>
        </Container>
        
        <Container style={{
          marginBottom: '2rem',
        }}>
          <Text as="p" size={1.2}>
            At Recap, we are committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.
          </Text>
        </Container>
        
        <Container style={{ marginBottom: '2rem' }}>
          <Text as="h2" weight={600} size={2} style={{ marginBottom: '1rem', color: 'var(--primary-dark)' }}>
            Conformance Status
          </Text>
          <Text as="p" style={{ marginBottom: '1rem' }}>
            The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA.
          </Text>
          <Text as="p">
            Recap is partially conformant with WCAG 2.1 level AA. Partially conformant means that some parts of the content do not fully conform to the accessibility standard.
          </Text>
        </Container>
        
        <Container style={{ marginBottom: '2rem' }}>
          <Text as="h2" weight={600} size={2} style={{ marginBottom: '1rem', color: 'var(--primary-dark)' }}>
            Accessibility Features
          </Text>
          <Text as="p" style={{ marginBottom: '1rem' }}>
            Recap includes the following accessibility features:
          </Text>
          <ul style={{ listStyleType: 'disc', paddingLeft: '2rem', marginBottom: '1rem' }}>
            <li>Semantic HTML to improve navigation for screen reader users</li>
            <li>Keyboard-navigable components for those who cannot use a mouse</li>
            <li>Alternative text for images</li>
            <li>Sufficient color contrast for better readability</li>
            <li>Resizable text without loss of functionality</li>
            <li>Skip to main content link for keyboard users</li>
          </ul>
        </Container>
        
        <Container style={{ marginBottom: '2rem' }}>
          <Text as="h2" weight={600} size={2} style={{ marginBottom: '1rem', color: 'var(--primary-dark)' }}>
            Feedback
          </Text>
          <Text as="p" style={{ marginBottom: '1rem' }}>
            We welcome your feedback on the accessibility of Recap. Please let us know if you encounter accessibility barriers on our website:
          </Text>
          <ul style={{ listStyleType: 'disc', paddingLeft: '2rem' }}>
            <li>Email: <a href="mailto:accessibility@recap.com" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>accessibility@recap.com</a></li>
            <li>Phone: [Your Phone Number]</li>
            <li>Contact form: [Link to your contact form]</li>
          </ul>
          <Text as="p" style={{ marginTop: '1rem' }}>
            We try to respond to feedback within 3 business days.
          </Text>
        </Container>
        
        <Container style={{ marginBottom: '2rem' }}>
          <Text as="h2" weight={600} size={2} style={{ marginBottom: '1rem', color: 'var(--primary-dark)' }}>
            Assessment Approach
          </Text>
          <Text as="p">
            Recap assesses the accessibility of our website by the following approaches:
          </Text>
          <ul style={{ listStyleType: 'disc', paddingLeft: '2rem' }}>
            <li>Self-evaluation</li>
            <li>External evaluation</li>
            <li>User feedback</li>
          </ul>
        </Container>
      </Column>
      
      <Container as='footer' style={{
        width: '100%',
        padding: '2rem',
        backgroundColor: 'var(--primary-dark)',
        color: 'var(--background-light)',
      }} role="contentinfo">
        <Column style={{
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
          alignItems: 'center',
        }}>
          <Container style={{
            width: '100%',
            marginBottom: '1rem',
            display: 'flex',
            justifyContent: 'center',
          }}>
            <Link href="/">
              <Image src='/branding/wordmarkInverse.png' alt='Recap logo' layout='intrinsic' height={100} width={100}/>
            </Link>
          </Container>
          
          <Container style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
          }}>
            <Link href="/terms" style={{
              color: 'var(--background-light)',
              textDecoration: 'none',
              opacity: 0.8,
            }}>
              Terms and Conditions
            </Link>
            <Link href="/privacy" style={{
              color: 'var(--background-light)',
              textDecoration: 'none',
              opacity: 0.8,
            }}>
              Privacy Policy
            </Link>
            <Link href="/accessibility" style={{
              color: 'var(--background-light)',
              textDecoration: 'none',
              opacity: 0.8,
            }}>
              Accessibility
            </Link>
          </Container>
        </Column>
      </Container>
    </Column>
  );
} 