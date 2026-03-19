/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: ['xlsx-js-style'],
    },
    images: {
        domains: ['localhost'],
    },
}

module.exports = nextConfig
