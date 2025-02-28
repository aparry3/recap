import React from 'react';
import { Column, Container, Text } from 'react-web-layout-components';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Page Not Found - Recap',
  description: 'The page you are looking for does not exist. Explore our photo gallery services.',
};

export default function NotFound() {
  return (
    <Column style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: 'var(--background-light)',
      color: 'var(--text-dark)',
    }}>
      {/* Skip to main content link for keyboard users */}
      <a href="#main-content" style={{
        position: 'absolute',
        left: '-9999px',
        top: 'auto',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
      }} 
      onFocus={(e) => {
        e.currentTarget.style.position = 'fixed';
        e.currentTarget.style.top = '0';
        e.currentTarget.style.left = '0';
        e.currentTarget.style.width = 'auto';
        e.currentTarget.style.height = 'auto';
        e.currentTarget.style.padding = '16px';
        e.currentTarget.style.backgroundColor = 'var(--primary)';
        e.currentTarget.style.color = 'white';
        e.currentTarget.style.zIndex = '9999';
        e.currentTarget.style.fontWeight = 'bold';
        e.currentTarget.style.textDecoration = 'none';
        e.currentTarget.style.borderBottomRightRadius = '8px';
      }}
      onBlur={(e) => {
        e.currentTarget.style.position = 'absolute';
        e.currentTarget.style.left = '-9999px';
        e.currentTarget.style.top = 'auto';
        e.currentTarget.style.width = '1px';
        e.currentTarget.style.height = '1px';
        e.currentTarget.style.overflow = 'hidden';
      }}>
        Skip to main content
      </a>
      
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
        alignItems: 'center',
        justifyContent: 'center',
      }} role="main" id="main-content" tabIndex={-1}>
        <Container style={{
          marginBottom: '2rem',
          textAlign: 'center',
        }}>
          <Text as="h1" weight={700} size={3} style={{ color: 'var(--primary-dark)' }}>
            404 - Page Not Found
          </Text>
        </Container>
        
        <Container style={{
          marginBottom: '2rem',
          textAlign: 'center',
        }}>
          <Text as="p" size={1.2}>
            Oops! The page you're looking for doesn't exist.
          </Text>
        </Container>
        
        <Container style={{
          marginBottom: '3rem',
          textAlign: 'center',
          maxWidth: '600px',
        }}>
          <Text>
            It might have been moved or deleted. Don't worry though - we have plenty of other great content!
          </Text>
        </Container>
        
        <Container style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          alignItems: 'center',
        }}>
          <Text as="h2" weight={600} size={1.5} style={{ marginBottom: '1rem' }}>
            Here are some helpful links:
          </Text>
          
          <Link href="/" style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'var(--primary)',
            color: 'var(--background-light)',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontWeight: 'bold',
          }} aria-label="Return to the Recap Homepage">
            Return to Homepage
          </Link>
          
          <Link href="/create" style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'var(--background-medium)',
            color: 'var(--primary-dark)',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontWeight: 'bold',
          }} aria-label="Create a new photo gallery">
            Create a Gallery
          </Link>
          
          <Link href="/howto" style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'var(--background-medium)',
            color: 'var(--primary-dark)',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontWeight: 'bold',
          }} aria-label="Learn how to use Recap features">
            How to Use Recap
          </Link>
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
            <Link href="/" aria-label="Return to Recap homepage">
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