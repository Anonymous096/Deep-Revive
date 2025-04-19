/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost", "deepimgref-794052010786.europe-west4.run.app"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "deepimgref-794052010786.europe-west4.run.app",
        pathname: "/api/**",
      },
    ],
  },
};

module.exports = nextConfig;
