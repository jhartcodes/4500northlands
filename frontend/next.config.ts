import type {NextConfig} from 'next'

const nextConfig: NextConfig = {
  env: {
    SC_DISABLE_SPEEDY: 'false',
  },
  images: {
    // Images are delivered by Sanity's asset CDN, not Vercel's optimizer — see
    // sanity/lib/imageLoader.ts for why. `remotePatterns` is therefore unused at
    // runtime; it stays so that dropping the custom loader is a one-line revert.
    loader: 'custom',
    loaderFile: './sanity/lib/imageLoader.ts',
    // Next's default set plus 2560. The default jumps 2048 → 3840, so a 2560 monitor at
    // 1x (and a 1280 laptop at 2x) lands on the 3840 candidate and downloads roughly twice
    // the bytes it can display. The loader tapers quality above 1920 to keep the wide
    // entries affordable.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 2560, 3840],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
    ],
  },
}

export default nextConfig
