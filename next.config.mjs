/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "flagcdn.com",
      },
      {
        // WordPress media library (product photos uploaded in the CMS)
        protocol: "https",
        hostname: "cms.haquanpump.com",
      },
    ],
  },
};

export default nextConfig;
