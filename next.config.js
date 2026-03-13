/** @type {import('next').NextConfig} */
const nextConfig = {
  // pdf-parse uses Node.js APIs — must run server-side only
  serverExternalPackages: ['pdf-parse'],
};

module.exports = nextConfig;
