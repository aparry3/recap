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
    ]
}
module.exports = withBundleAnalyzer(nextConfig)