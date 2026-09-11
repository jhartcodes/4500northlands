/**
 * The canonical origin for this site, without a trailing slash.
 *
 * Absolute URLs (sitemap, robots, canonical tags, og:image) must never be
 * derived from the request `Host` header: on Vercel that header is whichever
 * deployment alias was hit, so every preview build would advertise its own
 * throwaway hostname — and reading it forces the route to render per-request.
 *
 * Production is pinned by NEXT_PUBLIC_SITE_URL. Preview deployments fall back
 * to their own VERCEL_URL so preview sitemaps stay self-consistent, and local
 * development falls back to localhost.
 */
const fallback =
  process.env.VERCEL_ENV === 'production'
    ? 'https://whistlernorthlands.vercel.app'
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000'

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || fallback).replace(/\/+$/, '')
