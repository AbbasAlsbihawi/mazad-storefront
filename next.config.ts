import type { NextConfig } from 'next';

const assetBaseUrl = process.env.NEXT_PUBLIC_ASSET_BASE_URL ?? 'http://localhost:3001/assets';

const assetUrl = (() => {
  try {
    return new URL(assetBaseUrl);
  } catch {
    return new URL('http://localhost:3001/assets');
  }
})();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // A stray ~/yarn.lock outside this workspace makes Turbopack guess the wrong project root —
  // pin it explicitly since frontend/ (this package.json) is always the real root.
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      // mazad-api serves uploaded product photos from PUBLIC_ASSETS_BASE_URL (see
      // shared/lib/asset.ts for why the frontend has to resolve these itself).
      {
        protocol: assetUrl.protocol.replace(':', '') as 'http' | 'https',
        hostname: assetUrl.hostname,
        port: assetUrl.port,
        pathname: '/assets/**',
      },
      // mazad-api's Prisma seed data (prisma/seed.ts) fills demo auctions with Unsplash stock
      // photos instead of real uploads.
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
