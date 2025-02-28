import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://recap.com'
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/_next/',
        '/static/',
        '/galleries/' // Protect user-specific galleries from indexing
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
} 