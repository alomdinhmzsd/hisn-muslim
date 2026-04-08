/** @type {import('next').NextConfig} */
const withSerwist = require('@serwist/next')({
  swSrc: "app/sw.ts",  // Path relative to frontend folder
  swDest: "public/sw.js",
});

const nextConfig = {
  // Allow importing JSON files
  webpack: (config) => {
    config.module.rules.push({
      test: /\.json$/,
      type: 'json'
    });
    return config;
  },
  images: {
    unoptimized: true,
  },
};

module.exports = withSerwist(nextConfig);