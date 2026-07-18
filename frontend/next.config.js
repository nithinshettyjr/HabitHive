/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Note: output: "standalone" is NOT used here — that was for Docker/Render.
  // Vercel handles its own output optimization automatically.
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
