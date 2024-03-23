/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  trailingSlash: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;
