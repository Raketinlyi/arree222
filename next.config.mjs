/**
 * @type {import('next').NextConfig}
 * Optimized for Vercel deployment
 */

import path from 'path';
import { fileURLToPath } from 'url';

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const __dirname = path.dirname(__filename);

const nextConfig = {
  // Disable ESLint during build to avoid linting errors
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  compiler: {
    removeConsole: {
      exclude: ['error'],
    },
  },
  
  // Disable headers in next.config.mjs - use netlify.toml instead
  // This prevents conflicts between Next.js and Netlify headers
  async headers() {
    return [];
  },
  
  images: {
    // Используем ТОЛЬКО локальные изображения из /public/nft/
    // IPFS не используется - медленный и ненадежный
    domains: [],
    remotePatterns: [], // Пустой - только локальные изображения
    minimumCacheTTL: 600,
    formats: ['image/avif', 'image/webp'],
  },
  
  // Webpack configuration for Netlify compatibility
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
      
      // Use stub for React Native modules
      config.resolve.alias = {
        ...config.resolve.alias,
        '@react-native-async-storage/async-storage': path.resolve(__dirname, 'lib/react-native-async-storage-stub.js'),
      };
      
      // Ignore React Native modules completely
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^@react-native-async-storage\/async-storage$/,
        })
      );
    }
    return config;
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_CHAIN_ID: process.env.NEXT_PUBLIC_CHAIN_ID || process.env.NEXT_PUBLIC_MONAD_CHAIN_ID || '10143',
  },
};

export default nextConfig;

