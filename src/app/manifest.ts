import type { MetadataRoute } from 'next'


export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Recap - Wedding Photo Sharing',
    short_name: 'Recap',
    description: 'Collect & share all your wedding photos in one beautiful gallery - no app required. The simplest way to gather every photo from every guest.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    icons: [
      {
        src: "/branding/icon.svg",
        sizes: "192x192",
        type: "image/svg+xml"
      },
      {
        src: "/branding/icon.svg",
        sizes: "512x512",
        type: "image/svg+xml"
      }
    ],
  }
}
  