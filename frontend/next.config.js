/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow importing JSON files
  webpack: (config) => {
    config.module.rules.push({
      test: /\.json$/,
      type: 'json'
    });
    return config;
  },
  // Remove output: 'export' for dynamic routes
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig