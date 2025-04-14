/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost", "deepimgre-794052010786.europe-west4.run.app"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "deepimgre-794052010786.europe-west4.run.app",
        pathname: "/api/**",
      },
    ],
  },
};

module.exports = nextConfig;
