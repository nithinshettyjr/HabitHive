/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // NOTE: Remove 'standalone' when deploying to Vercel.
  // Only use output: 'standalone' for Docker/Render deployments.
  // output: "standalone",
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
