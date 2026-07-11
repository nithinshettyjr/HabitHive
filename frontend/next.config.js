/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Required for Docker/Render deployment
  output: "standalone",
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // Allow images from external domains if needed
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Google profile images
      },
    ],
  },
};

module.exports = nextConfig;
