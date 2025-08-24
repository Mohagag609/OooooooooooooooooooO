/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  experimental: { optimizePackageImports: ["lucide-react"] },
};
module.exports = nextConfig;