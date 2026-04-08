/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static exports if needed, or leave as default
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

// Try to load Serwist only if available
let withSerwist = (config) => config
try {
  const serwist = require('@serwist/next')
  withSerwist = serwist.default({
    swSrc: 'app/sw.ts',
    swDest: 'public/sw.js',
  })
} catch (e) {
  console.log('Serwist not available, continuing without PWA support')
}

module.exports = withSerwist(nextConfig)