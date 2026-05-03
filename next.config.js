/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Allow any HTTPS host — property images can be hosted on any CDN/URL
      { protocol: 'https', hostname: '**' },
      { protocol: 'http',  hostname: '**' },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['@react-pdf/renderer'],
  },
};

module.exports = nextConfig;
