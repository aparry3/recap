import type { MetadataRoute } from 'next'


export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Recap Media',
    short_name: 'Recap',
    description: 'The best collaborative photo gallery for your next wedding, birthday, or celebration, offering unlimited uploads and collaborators, and easy organization of all of your media.',
    start_url: '/galleries',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    icons: [
      {
        src: "/branding/icon.svg",
        sizes: "192x192",
        type: "image/svg"
      },
      {
        src: "/branding/icon.svg",
        sizes: "512x512",
        type: "image/svg"
      }
    ],
  }
}
  