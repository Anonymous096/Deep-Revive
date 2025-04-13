/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost", "deepimg-794052010786.europe-west4.run.app"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/api/**",
      },
    ],
  },
};

module.exports = nextConfig;
