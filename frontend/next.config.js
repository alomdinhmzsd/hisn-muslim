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
  // Add static export for Netlify
  output: 'export',
  images: {
    unoptimized: true, // Required for static export
  },
  trailingSlash: true, // Helps with routing
}

module.exports = nextConfig