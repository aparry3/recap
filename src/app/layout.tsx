import './globals.css'
import type { Metadata } from 'next'
import { Cormorant } from 'next/font/google'
import { config } from '@fortawesome/fontawesome-svg-core';
import Head from 'next/head';

config.autoAddCss = false; // Disable automatic CSS addition

// Import the Google font
const cormorant = Cormorant({
  subsets: ['latin'],       
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',           // 'swap' for better performance
  variable: '--font-cormorant',
});

export const metadata: Metadata = {
  title: 'Recap - Collaborative Photo Galleries',
  description: 'The best collaborative photo gallery for your next wedding, birthday, or celebration, offering unlimited uploads and collaborators, and easy organization of all of your media.',
  keywords: 'photo gallery, collaborative gallery, wedding photos, event photos, photo sharing, photo collection, wedding album',
  authors: [{ name: 'Recap' }],
  creator: 'Recap',
  publisher: 'Recap',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-video-preview': -1,
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_BASE_URL || 'https://recap.com',
    title: 'Recap - Collaborative Photo Galleries',
    description: 'Create and share beautiful photo galleries for weddings, birthdays, and celebrations with unlimited uploads.',
    siteName: 'Recap',
    images: [
      {
        url: '/branding/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Recap - Collaborative Photo Galleries',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Recap - Collaborative Photo Galleries',
    description: 'Create and share beautiful photo galleries for weddings, birthdays, and celebrations with unlimited uploads.',
    images: ['/branding/twitter-image.png'],
    creator: '@recapgallery',
  },
  verification: {
    // Add your verification codes if you have them
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_BASE_URL || 'https://recap.com',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cormorant.className}>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <body>
        {children}
        {/* <CookieConsentProvider>
          <UserProvider>
          {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID ? (
              <GoogleAnalytics ga_id= 
              {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID} />
            ) : null}
          </UserProvider>
          <CookieBanner />
        </CookieConsentProvider> */}
      </body>
    </html>
  )
}
