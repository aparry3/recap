import './globals.css'
import type { Metadata } from 'next'
import { Cormorant } from 'next/font/google'
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false; // Disable automatic CSS addition

// Import the Google font

const cormorant = Cormorant({
  subsets: ['latin'],       // Specify subsets as needed
  weight: ['300', '400', '500', '600','700'],    // Specify the weights you want to load
  style: ['normal', 'italic'], // Specify styles
  display: 'swap',           // Optional: 'swap' for better performance
});

export const metadata: Metadata = {
  title: 'Video Greeting Cards - Better Letter Card Co.',
  description: 'Send a video with your next greeting card. Upload your own photo and video, and Better Letter will automatically mail a physcial card that your loved ones can scan to watch your video.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300..700;1,300..700&display=swap" rel="stylesheet" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" id="viewportMeta" />
      </head>
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