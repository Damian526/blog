import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === 'production', // Ignore ESLint only in production
  },
};

export default nextConfig;
