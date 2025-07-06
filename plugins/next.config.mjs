import { createSecureHeaders } from 'next-secure-headers';
import { UniverPlugin } from '@univerjs/webpack-plugin'

const isProd = process.env.NODE_ENV === 'production';
const basePath = '/plugin';

// Parse frame ancestors from environment variable
const getFrameAncestors = () => {
  const frameAncestorsEnv = process.env.FRAME_ANCESTORS;
  if (frameAncestorsEnv) {
    return frameAncestorsEnv.split(',').map(domain => domain.trim());
  }
  // Default fallback
  return ["'self'"];
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath,
  output: 'standalone',
  plugins: [
   new UniverPlugin()
  ],
  async headers() {
    return [
      {
        // All page routes, not the api ones
        source: '/:path((?!api).*)*',
        headers: [
          ...createSecureHeaders({
            contentSecurityPolicy: {
              defaultSrc: "'self'",
              styleSrc: ["'self'", "'unsafe-inline'"],
              scriptSrc: ["'self'", "'unsafe-eval'", "'unsafe-inline'", 'https://www.clarity.ms'],
              frameSrc: ["'self'", 'https:', 'http:'],
              connectSrc: ["'self'", 'https:'],
              mediaSrc: ["'self'", 'https:', 'http:', 'data:'],
              imgSrc: ["'self'", 'https:', 'http:', 'data:'],
              frameAncestors: getFrameAncestors(),
            } 
          }),
          {
            key: 'Content-Security-Policy',
            value: `frame-ancestors ${getFrameAncestors().join(' ')}`
          },
          { key: 'Cross-Origin-Opener-Policy', value: isProd ? 'same-origin' : 'unsafe-none' },
          { key: 'Cross-Origin-Embedder-Policy', value: isProd ? 'same-origin' : 'unsafe-none' }
        ],
      },
    ];
  },
  async rewrites() {
    const socketProxy = {
      source: '/socket/:path*',
      destination: `http://localhost:3000/socket/:path*`,
      basePath: !basePath,
    };

    const httpProxy = {
      source: '/api/:path*',
      destination: `http://localhost:3000/api/:path*`,
      basePath: !basePath,
    };

    return isProd ? [] : [socketProxy, httpProxy];
  },
};

export default nextConfig;
