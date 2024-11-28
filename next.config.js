/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
})
const nextConfig = {
    reactStrictMode: false,
    images: {
        domains: ['d3aucbxkwf7gxk.cloudfront.net'],
    },
    
    redirects: async () => [
    ],
    pwa: {
        dest: 'public', // Where the generated service worker file will be stored
        register: true, // Automatically register the service worker
        skipWaiting: true, // Immediately activate new service workers
    }
    
}
module.exports = withBundleAnalyzer(nextConfig)