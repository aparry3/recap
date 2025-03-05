import './globals.css'
import type { Metadata } from 'next'
import { Cormorant } from 'next/font/google'
import { config } from '@fortawesome/fontawesome-svg-core';
import Head from 'next/head';

config.autoAddCss = false; // Disable automatic CSS addition

// Import the Google font

const cormorant = Cormorant({
  subsets: ['latin'],       // Specify subsets as needed
  weight: ['300', '400', '500', '600','700'],    // Specify the weights you want to load
  style: ['normal', 'italic'], // Specify styles
  display: 'swap',           // Optional: 'swap' for better performance
});

export const metadata: Metadata = {
  title: 'Recap - The Ultimate Wedding Photo Sharing Platform',
  description: 'Recap helps couples collect, organize and share wedding photos from all their guests in one beautiful gallery - no app required. Create your free wedding photo gallery today.',
  keywords: 'wedding photo sharing, wedding photo gallery, guest photos, QR code photo sharing, wedding memories, collaborative photo album',
  openGraph: {
    title: 'Recap - The Ultimate Wedding Photo Sharing Platform',
    description: 'Collect & share all your wedding photos in one beautiful gallery - no app required.',
    images: [
      {
        url: '/product/screenshots.png',
        width: 1369,
        height: 718,
        alt: 'Recap Wedding Photo Gallery',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Recap - The Ultimate Wedding Photo Sharing Platform',
    description: 'Collect & share all your wedding photos in one beautiful gallery - no app required.',
    images: ['/product/screenshots.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300..700;1,300..700&display=swap" rel="stylesheet" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" id="viewportMeta" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        
        {/* Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Recap - Wedding Photo Sharing Platform",
              "applicationCategory": "Photography",
              "operatingSystem": "All",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "description": "Recap helps couples collect, organize and share wedding photos from all their guests in one beautiful gallery - no app required.",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "ratingCount": "120"
              },
              "featureList": "QR code photo sharing, unlimited uploads, custom albums, notifications, wedding website integration"
            })
          }}
        />
      </Head>
      <body className={cormorant.className}>
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
