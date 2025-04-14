/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
})

const nextConfig = {
    reactStrictMode: false,
    images: {
        domains: ['d3aucbxkwf7gxk.cloudfront.net', 'd2zcso3rdm6ldw.cloudfront.net'],
    },
    
    redirects: async () => [
    ],
    pwa: {
        dest: 'public', // Where the generated service worker file will be stored
        register: true, // Automatically register the service worker
        skipWaiting: true, // Immediately activate new service workers
    },
    
    // SEO Configuration
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on'
                    },
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=63072000; includeSubDomains; preload'
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN'
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff'
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block'
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'origin-when-cross-origin'
                    }
                ]
            }
        ]
    }
}
module.exports = withBundleAnalyzer(nextConfig)