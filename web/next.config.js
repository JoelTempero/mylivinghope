/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
    // For static export
    unoptimized: true,
  },
  // Static export for simple Firebase hosting
  output: 'export',
  trailingSlash: true,
};

module.exports = nextConfig;
