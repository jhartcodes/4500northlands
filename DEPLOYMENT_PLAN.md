# Whistler Northlands - Deployment & Optimization Plan

## Table of Contents
- [Current State Summary](#current-state-summary)
- [Part 1: Deployment & Build Triggers](#part-1-deployment--build-triggers)
- [Part 2: Presentation Tool for Production](#part-2-presentation-tool-for-production)
- [Part 3: Hosting Provider Recommendation](#part-3-hosting-provider-recommendation)
- [Part 4: Image Integration Audit](#part-4-image-integration-audit)
- [Part 5: Caching Strategy for Low-Traffic Static Site](#part-5-caching-strategy-for-low-traffic-static-site)
- [Part 6: Vercel Cost Analysis](#part-6-vercel-cost-analysis)
- [Action Items](#action-items)

---

## Current State Summary

| Item | Value |
|------|-------|
| Architecture | Monorepo: `/frontend` (Next.js 16 App Router) + `/studio` (Sanity Studio) |
| Project ID | `tivw2iwp` |
| Dataset | `production` |
| Visual Editing | Configured but missing production deployment triggers |
| Caching | Using Live Content API (real-time) - **needs optimization for static site** |

---

## Part 1: Deployment & Build Triggers

### What's Currently Missing

1. **No webhook for on-publish rebuilds** — When content is published in Sanity, there's no automatic frontend rebuild
2. **No `SANITY_REVALIDATE_SECRET`** environment variable configured
3. **No revalidation API route** in the frontend

### What You Need to Add

#### 1. Create a Revalidation API Route

Create `/frontend/app/api/revalidate/route.ts`:

```typescript
import { revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

type WebhookPayload = {
  _type: string
  slug?: { current?: string }
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.SANITY_REVALIDATE_SECRET) {
      return new Response('Missing SANITY_REVALIDATE_SECRET', { status: 500 })
    }

    const { isValidSignature, body } = await parseBody<WebhookPayload>(
      req,
      process.env.SANITY_REVALIDATE_SECRET,
      true // Wait for CDN propagation
    )

    if (!isValidSignature) {
      return new Response('Invalid signature', { status: 401 })
    }

    if (!body?._type) {
      return new Response('Bad Request', { status: 400 })
    }

    const revalidated: string[] = []

    // For settings, revalidate all pages (they all use settings data)
    if (body._type === 'settings') {
      revalidateTag('settings')
      revalidateTag('page') // All pages likely use settings
      revalidated.push('settings', 'page')
    }

    // For pages, revalidate by type and specific slug
    if (body._type === 'page') {
      revalidateTag('page')
      if (body.slug?.current) {
        revalidateTag(body.slug.current)
        revalidated.push(body.slug.current)
      }
      revalidated.push('page')
    }

    return NextResponse.json({
      success: true,
      revalidated,
      message: `Revalidated tags: ${revalidated.join(', ')}`
    })
  } catch (err) {
    console.error('Revalidation error:', err)
    return new Response((err as Error).message, { status: 500 })
  }
}
```

#### 2. Add Environment Variable

Add to `.env.local` and your hosting provider:
```env
SANITY_REVALIDATE_SECRET=<generate-a-random-32-char-string>
```

#### 3. Create Sanity Webhook

In [sanity.io/manage](https://sanity.io/manage) → Project → API → Webhooks:

| Field | Value |
|-------|-------|
| Name | Revalidate Next.js |
| URL | `https://your-domain.com/api/revalidate` |
| Trigger on | Create, Update, Delete |
| Filter | `_type in ["page", "settings"]` |
| Projection | `{_type, slug}` |
| Secret | Same as `SANITY_REVALIDATE_SECRET` |
| HTTP method | POST |

---

## Part 2: Presentation Tool for Production

### Current Setup Analysis

Your presentation tool is correctly configured in `studio/sanity.config.ts`:
- Draft mode endpoint: `/api/draft-mode/enable` ✅
- Main documents resolver ✅
- Locations resolver ✅

### Missing for Production

Update `SANITY_STUDIO_PREVIEW_URL` for production:

```env
# In studio/.env (production)
SANITY_STUDIO_PREVIEW_URL=https://your-production-domain.com
```

### For Vercel Deployment Protection

If using Vercel's deployment protection, you need bypass headers. Add to `studio/sanity.config.ts`:

```typescript
presentationTool({
  previewUrl: {
    origin: SANITY_STUDIO_PREVIEW_URL,
    previewMode: {
      enable: '/api/draft-mode/enable',
    },
    // Add if using Vercel protection
    preview: '/',
  },
  // ...
})
```

And configure `VERCEL_AUTOMATION_BYPASS_SECRET` in both Vercel and Sanity Studio environments.

---

## Part 3: Hosting Provider Recommendation

### Comparison Matrix

| Feature | Vercel | Netlify | Railway |
|---------|--------|---------|---------|
| **Next.js Support** | Native (best) | Good | Good |
| **Sanity Integration** | Official plugin | Manual webhooks | Manual webhooks |
| **Visual Editing Preview** | Excellent | Good | Manual setup |
| **ISR/On-demand Revalidation** | Native | Limited | Manual |
| **Edge Functions** | Yes | Yes | Yes |
| **Monorepo Support** | Excellent | Good | Good |
| **Deploy Previews** | Automatic | Automatic | Manual |
| **Static Export** | Yes | Yes | Yes |
| **Price (Hobby)** | Free tier | Free tier | $5/mo |

### Recommendation: **Vercel** (Best Choice)

**Why Vercel wins for this project:**

1. **Native Next.js integration** — Built by the same team, optimal performance
2. **Official Sanity integration** — One-click setup with automatic environment variables
3. **On-demand ISR** — Works seamlessly with `revalidatePath()` and webhooks
4. **Protection bypass for Visual Editing** — Built-in support for Sanity Presentation Tool
5. **Deploy preview URLs** — Automatic preview deployments for PRs
6. **Monorepo support** — Can deploy both frontend and studio from same repo
7. **Generous free tier** — Perfect for low-traffic static sites

### Vercel Setup Steps

1. **Connect Repository**
   ```bash
   vercel link
   ```

2. **Configure Build Settings**
   - Root directory: `frontend`
   - Build command: `npm run build`
   - Output directory: `.next`

3. **Add Environment Variables**
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=tivw2iwp
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_READ_TOKEN=<your-token>
   SANITY_REVALIDATE_SECRET=<random-secret>
   ```

4. **Install Sanity Integration** (optional but recommended)
   - Go to Vercel dashboard → Integrations → Sanity
   - This auto-syncs environment variables

5. **Configure Studio Deployment**
   Either:
   - Deploy studio to Sanity-hosted URL: `sanity deploy` (simplest, free)
   - Or deploy as separate Vercel project with root: `studio`

---

## Part 4: Image Integration Audit

### Current Implementation Review

| Aspect | Current State | Best Practice | Status |
|--------|--------------|---------------|--------|
| **Schema hotspot** | `options: {hotspot: true}` | Required | ✅ Good |
| **URL builder** | Using `@sanity/image-url` | Recommended | ✅ Good |
| **next.config.ts** | `cdn.sanity.io` configured | Required | ✅ Good |
| **Alt text fields** | Not consistently defined | Required for SEO | ⚠️ Missing |
| **LQIP (blur placeholder)** | Not queried | Recommended | ❌ Missing |
| **Image dimensions** | Not queried | Recommended | ❌ Missing |
| **SanityImage component** | Uses `sanity-image` library | Acceptable | ⚠️ Could improve |

### Issues Found

#### 1. Missing Alt Text in Schema

Your schemas have `hotspot: true` but no dedicated `alt` field.

**Fix:** Add alt text field to image schemas:
```typescript
defineField({
  name: 'backgroundImage',
  title: 'Background Image',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'alt',
      type: 'string',
      title: 'Alt Text',
      description: 'Important for accessibility and SEO',
      validation: (Rule) => Rule.required().warning('Alt text improves SEO')
    })
  ]
})
```

#### 2. Missing LQIP (Low Quality Image Placeholder)

Your GROQ queries fetch `asset->` but don't include metadata for blur placeholders.

**Fix:** Update queries to include LQIP:
```groq
backgroundImage {
  ...,
  asset->{
    _id,
    url,
    metadata {
      lqip,
      dimensions { width, height }
    }
  },
  alt
}
```

#### 3. Component Not Using Blur Placeholder

Your `HeroBlock.tsx` doesn't use the blur placeholder.

**Fix:** Update component:
```typescript
<Image
  src={imageUrl}
  alt={backgroundImage?.alt || title || 'Hero background'}
  fill
  className="object-cover"
  priority
  sizes="100vw"
  placeholder={backgroundImage?.asset?.metadata?.lqip ? 'blur' : 'empty'}
  blurDataURL={backgroundImage?.asset?.metadata?.lqip}
/>
```

#### 4. Create Standardized SanityImage Component

```typescript
// frontend/app/components/SanityImage.tsx
import Image, { ImageProps } from 'next/image'
import { urlForImage } from '@/sanity/lib/utils'

interface SanityImageProps extends Omit<ImageProps, 'src' | 'alt'> {
  image: {
    asset?: { metadata?: { lqip?: string; dimensions?: { width: number; height: number } } }
    alt?: string
    hotspot?: { x: number; y: number }
    crop?: { top: number; bottom: number; left: number; right: number }
  }
  alt?: string
  width?: number
  height?: number
}

export function SanityImage({ image, alt, width = 800, height, ...props }: SanityImageProps) {
  if (!image?.asset) return null

  const imageUrl = urlForImage(image)
    .width(width)
    .height(height || Math.round(width / 1.5))
    .fit('crop')
    .url()

  return (
    <Image
      src={imageUrl}
      alt={alt || image.alt || ''}
      width={width}
      height={height || Math.round(width / 1.5)}
      placeholder={image.asset?.metadata?.lqip ? 'blur' : 'empty'}
      blurDataURL={image.asset?.metadata?.lqip}
      {...props}
    />
  )
}
```

---

## Part 5: Caching Strategy for Low-Traffic Static Site

### Current Implementation Analysis

Your site currently uses:

```typescript
// frontend/sanity/lib/live.ts
export const {sanityFetch, SanityLive} = defineLive({
  client,
  serverToken: token,
  browserToken: token,
})

// frontend/sanity/lib/client.ts
export const client = createClient({
  // ...
  useCdn: true,  // ✅ Good - uses Sanity CDN
})

// frontend/app/[slug]/page.tsx
export async function generateStaticParams() {
  // ✅ Good - pre-renders pages at build time
}
```

**What's working well:**
- `useCdn: true` — Uses Sanity's CDN for cached responses
- `generateStaticParams()` — Pre-renders pages at build time (SSG)
- `stega: false` for metadata — Correct for SEO

**The Problem:**

`defineLive()` from `next-sanity` enables **real-time content updates** via the Live Content API. This means:
- Pages are statically generated at build time ✅
- BUT on each request, Next.js checks if content has changed
- In draft mode, real-time subscriptions are established
- This is **overkill** for a static site that rarely changes

**Current behavior per request:**
1. User visits page → Vercel serves cached static page (fast, free)
2. In background, Next.js may revalidate with Sanity API
3. If in draft mode, real-time listener is established (function invocation)

### Recommended Strategy: Static Generation + On-Demand Revalidation

For a site that "won't really change once live," you should:

1. **Pre-render all pages at build time** (Static Site Generation) ✅ Already doing this
2. **Cache aggressively** with long TTLs ❌ Not configured
3. **Only revalidate when content actually changes** via webhook ❌ Not configured

### Implementation Changes

#### Option A: Keep `defineLive` but Add Explicit Caching (Recommended - Minimal Changes)

The `sanityFetch` from `defineLive` accepts Next.js cache options. Update your pages:

**frontend/app/page.tsx:**
```typescript
export async function generateMetadata(): Promise<Metadata> {
  const {data: page} = await sanityFetch({
    query: getPageQuery,
    params: {slug: 'home'},
    stega: false,
    // Add these for aggressive caching:
    revalidate: false, // Never auto-revalidate (use webhook instead)
    tags: ['page', 'home'], // For targeted revalidation
  })
  // ...
}

export default async function HomePage() {
  const {data: page} = await sanityFetch({
    query: getPageQuery,
    params: {slug: 'home'},
    revalidate: false, // Cache indefinitely
    tags: ['page', 'home'],
  })
  // ...
}
```

**frontend/app/[slug]/page.tsx:**
```typescript
export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const {data: page} = await sanityFetch({
    query: getPageQuery,
    params,
    stega: false,
    revalidate: false,
    tags: ['page', params.slug],
  })
  // ...
}

export default async function Page(props: Props) {
  const params = await props.params
  const {data: page} = await sanityFetch({
    query: getPageQuery,
    params,
    revalidate: false,
    tags: ['page', params.slug],
  })
  // ...
}
```

**Why `revalidate: false`?**
- Pages are pre-rendered at build time via `generateStaticParams`
- Cached indefinitely until webhook triggers `revalidateTag('page')`
- Zero Sanity API calls for normal visitors
- Visual editing still works (draft mode bypasses cache)

#### Option B: Use Manual `sanityFetch` Helper (More Control)

Create a custom fetch helper optimized for static sites:

```typescript
// frontend/sanity/lib/fetch.ts
import { client } from './client'
import type { QueryParams } from 'next-sanity'

export async function sanityFetch<T>({
  query,
  params = {},
  tags = [],
}: {
  query: string
  params?: QueryParams
  tags?: string[]
}): Promise<T> {
  return client.fetch<T>(query, params, {
    // Use CDN for maximum cache efficiency
    useCdn: true,
    // Cache for 1 year (revalidate only via webhook)
    next: {
      revalidate: 31536000,
      tags,
    },
  })
}
```

#### Option C: Full Static Export (Maximum Savings)

If you don't need any server-side features:

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  output: 'export', // Fully static HTML export
  images: {
    unoptimized: true, // Required for static export
    // OR use Sanity's image CDN directly (recommended)
  },
}
```

**Pros:** Zero Vercel function invocations, can host anywhere (even S3/Cloudflare Pages)
**Cons:** No ISR, no on-demand revalidation, must rebuild entire site for changes

### Recommended Approach for Your Site

**Use Option A or B** with:
- `revalidate: 31536000` (1 year cache)
- `useCdn: true` (use Sanity's CDN)
- Webhook-triggered revalidation when content changes
- Keep `SanityLive` component but it will only activate in draft mode

### Cache Headers Configuration

Add to `next.config.ts` for static assets:

```typescript
const nextConfig: NextConfig = {
  // ... existing config
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, stale-while-revalidate=86400',
          },
        ],
      },
    ]
  },
}
```

---

## Part 6: Vercel Cost Analysis

### Vercel Pricing Tiers

| Tier | Price | Function Invocations | Bandwidth | Edge Requests |
|------|-------|---------------------|-----------|---------------|
| **Hobby** | Free | 100K/month | 100GB/month | Unlimited |
| **Pro** | $20/mo | 1M/month | 1TB/month | Unlimited |
| **Enterprise** | Custom | Custom | Custom | Custom |

### Your Site's Expected Usage

Based on a **low-traffic static marketing site** with ~5-10 pages:

#### Traffic Assumptions (Conservative)
| Metric | Monthly Estimate |
|--------|-----------------|
| Page views | 1,000 - 5,000 |
| Unique visitors | 500 - 2,000 |
| Content updates | 1-5 per month |
| Webhook triggers | 1-5 per month |

#### With Proper Caching (Recommended Setup)

| Resource | Usage | Free Tier Limit | Status |
|----------|-------|-----------------|--------|
| **Function Invocations** | ~50-100/month | 100,000 | ✅ ~0.1% |
| **Bandwidth** | ~1-5GB/month | 100GB | ✅ ~1-5% |
| **Build Minutes** | ~10-20/month | 6,000 | ✅ ~0.3% |
| **Edge Requests** | ~5,000/month | Unlimited | ✅ Free |

**Expected Monthly Cost: $0 (Hobby tier)**

#### Without Proper Caching (Current Setup Risk)

If every page view triggers a Sanity API call:

| Resource | Usage | Free Tier Limit | Status |
|----------|-------|-----------------|--------|
| **Function Invocations** | ~5,000-25,000/month | 100,000 | ⚠️ 5-25% |
| **Sanity API Requests** | ~5,000-25,000/month | 500K (free) | ✅ OK |

Still within free tier but **wasteful** and could become costly if traffic increases.

### Cost Scenarios

| Scenario | Monthly Visitors | With Caching | Without Caching |
|----------|-----------------|--------------|-----------------|
| Low traffic | 1,000 | $0 | $0 |
| Medium traffic | 10,000 | $0 | $0 |
| High traffic | 100,000 | $0 | $0-20* |
| Viral spike | 1,000,000 | $0-20 | $100-500 |

*Function invocations would exceed free tier

### Sanity Costs

| Tier | Price | API Requests | Assets |
|------|-------|--------------|--------|
| **Free** | $0 | 500K/month | 10GB |
| **Growth** | $15/user/mo | 2.5M/month | 500GB |

**Your expected Sanity usage:** Well within free tier

### Total Expected Monthly Cost

| Service | Cost |
|---------|------|
| Vercel Hosting | $0 |
| Sanity CMS | $0 |
| Domain (annual) | ~$12/year (~$1/mo) |
| **Total** | **~$1/month** |

### Caching Impact on Costs

| Strategy | Monthly Function Invocations | Monthly Sanity API | Est. Cost |
|----------|------------------------------|-------------------|-----------|
| **Current (defineLive, no cache config)** | ~1,000-5,000 | ~1,000-5,000 | $0 |
| **With `revalidate: false` + webhooks** | ~5-50 | ~5-50 | $0 |
| **Full static export** | 0 | 0 (build only) | $0 |

The key insight: With proper caching, your **monthly function invocations drop by 99%**.

### Why This Matters for Scale

If your site ever gets significant traffic:

| Monthly Visitors | Without Caching | With Caching |
|-----------------|-----------------|--------------|
| 1,000 | $0 | $0 |
| 10,000 | $0 | $0 |
| 100,000 | $0-20 | $0 |
| 1,000,000 | $50-200 | $0 |

### Cost Optimization Tips

1. **Use Sanity's CDN for images** — Already configured, free bandwidth
2. **Cache aggressively** — `revalidate: false` with tag-based invalidation
3. **Deploy Studio to Sanity** — `sanity deploy` is free, saves Vercel functions
4. **Use webhook revalidation** — Only regenerate when content changes
5. **Consider Cloudflare** — Free CDN in front of Vercel for even better caching
6. **Keep `SanityLive` for draft mode only** — It only activates when editing

---

## Action Items

### High Priority (Deployment)

- [ ] Create `/frontend/app/api/revalidate/route.ts` with path-based revalidation
- [ ] Add `SANITY_REVALIDATE_SECRET` to environment variables
- [ ] Create webhook in Sanity dashboard
- [ ] Deploy to Vercel with proper environment configuration
- [ ] Update `SANITY_STUDIO_PREVIEW_URL` to production URL
- [ ] **Implement aggressive caching strategy** (revalidate: 31536000)

### Medium Priority (Images)

- [ ] Add `alt` field to all image schemas
- [ ] Update GROQ queries to include `metadata { lqip, dimensions }`
- [ ] Create standardized `SanityImage` component with blur placeholder support
- [ ] Update existing components to use blur placeholders

### Low Priority (Optimization)

- [ ] Consider Vercel's Sanity integration for auto-env sync
- [ ] Add Vercel protection bypass if using deployment protection
- [ ] Add cache headers in `next.config.ts`
- [ ] Deploy Studio to Sanity hosting (`sanity deploy`)

---

## Quick Start Checklist

```bash
# 1. Generate revalidation secret
openssl rand -base64 32

# 2. Add to frontend/.env.local
echo "SANITY_REVALIDATE_SECRET=<your-secret>" >> frontend/.env.local

# 3. Deploy to Vercel
cd frontend && vercel

# 4. Add env vars in Vercel dashboard
# SANITY_REVALIDATE_SECRET=<your-secret>

# 5. Create webhook in Sanity dashboard
# URL: https://your-domain.vercel.app/api/revalidate
# Secret: <your-secret>

# 6. Deploy Studio
cd studio && sanity deploy
```

---

## Appendix: Specific Code Changes for Optimal Caching

Here are the exact files that need modification:

### 1. frontend/app/page.tsx (update sanityFetch calls)

Add `revalidate: false` and `tags` to both fetch calls.

### 2. frontend/app/[slug]/page.tsx (update sanityFetch calls)

Add `revalidate: false` and `tags` to both fetch calls.

### 3. frontend/app/api/revalidate/route.ts (create new file)

Create the webhook handler as shown in Part 1.

### 4. Environment variables

```env
# Add to frontend/.env.local and Vercel
SANITY_REVALIDATE_SECRET=<generate-with-openssl-rand-base64-32>
```

### 5. Sanity webhook (create in dashboard)

- URL: `https://your-domain.com/api/revalidate`
- Filter: `_type in ["page", "settings"]`
- Projection: `{_type, slug}`
- Secret: Same as env var

### 6. studio/.env (update for production)

```env
SANITY_STUDIO_PREVIEW_URL=https://your-production-domain.com
```

---

## TL;DR - Expected Monthly Costs

| Service | Free Tier | Your Usage | Cost |
|---------|-----------|------------|------|
| **Vercel** | 100K invocations, 100GB bandwidth | <1K invocations, <5GB | **$0** |
| **Sanity** | 500K API requests, 10GB assets | <1K requests, <1GB | **$0** |
| **Domain** | N/A | 1 domain | **~$1** |
| **Total** | | | **~$1/month** |

With proper caching, this site will cost essentially nothing to host on Vercel's free tier, even with moderate traffic growth.

---

*Last updated: March 2026*
