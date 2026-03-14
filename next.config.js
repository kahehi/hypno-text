/** @type {import('next').NextConfig} */
const nextConfig = {
  // pdf-parse uses Node.js APIs — must run server-side only
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse'],
  },
};

module.exports = nextConfig;
