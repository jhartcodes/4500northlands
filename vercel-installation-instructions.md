# Vercel + Sanity Deployment Guide

This repo is a monorepo with:

- `frontend/`: Next.js site deployed to Vercel
- `studio/`: Sanity Studio

## Audit Summary

Current setup in this repo:

- The Vercel project is linked from `frontend/.vercel/project.json`
- `frontend/vercel.json` is minimal and expects Vercel to treat `frontend/` as the project root
- The frontend already has a Sanity webhook endpoint at `frontend/app/api/revalidate/route.ts`
- The frontend expects `SANITY_REVALIDATE_SECRET` for webhook-triggered revalidation
- Sanity Presentation / preview is configured through `studio/sanity.config.ts`

Practical implication:

- Run raw Vercel CLI commands from `frontend/`
- Or run the helper scripts from the repo root

## Everyday Vercel Commands

### From the repo root

These helper scripts are defined in the root `package.json`:

```shell
npm run vercel:link
npm run vercel:env:pull
npm run vercel:deploy:preview
npm run vercel:deploy:prod
```

What they do:

- `npm run vercel:link`: links `frontend/` to the Vercel project
- `npm run vercel:env:pull`: pulls Vercel env vars into `frontend/.env.local`
- `npm run vercel:deploy:preview`: creates a preview deployment
- `npm run vercel:deploy:prod`: creates a production deployment

### Direct CLI equivalents

If you want the raw commands instead:

```shell
cd frontend
npx vercel link
npx vercel env pull .env.local
npx vercel
npx vercel --prod
```

## Recommended First-Time Setup

### 1. Confirm Vercel project settings

In Vercel, the project should use:

- Root Directory: `frontend`
- Framework Preset: `Next.js`
- Build Command: `npm run build`

The repo already contains `frontend/vercel.json` with:

```json
{
  "framework": "nextjs"
}
```

### 2. Pull frontend env vars locally

```shell
npm run vercel:env:pull
```

### 3. Copy the matching values to Studio

The frontend and studio use different variable names for the same Sanity project, so after pulling Vercel env vars you will usually want to mirror the needed values into `studio/.env.local`.

Minimum variables expected by this repo:

Frontend:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
NEXT_PUBLIC_SANITY_API_VERSION=
NEXT_PUBLIC_SANITY_STUDIO_URL=
SANITY_API_READ_TOKEN=
SANITY_REVALIDATE_SECRET=
```

Studio:

```env
SANITY_STUDIO_PROJECT_ID=
SANITY_STUDIO_DATASET=
SANITY_STUDIO_PREVIEW_URL=
SANITY_STUDIO_STUDIO_HOST=
```

### 4. Deploy the frontend

Preview deploy:

```shell
npm run vercel:deploy:preview
```

Production deploy:

```shell
npm run vercel:deploy:prod
```

### 5. Deploy the Studio

```shell
cd studio
npx sanity deploy
```

After deploying Studio, set the frontend env var:

```env
NEXT_PUBLIC_SANITY_STUDIO_URL=https://your-studio-hostname.sanity.studio
```

And set the Studio preview URL:

```env
SANITY_STUDIO_PREVIEW_URL=https://your-frontend-domain.vercel.app
```

If you use a custom production domain, use that instead of the `vercel.app` domain.

## Recommended Option: Revalidate On Publish

This repo already supports a better workflow than full rebuilds for normal content edits.

When content is published in Sanity, you can call the existing frontend endpoint:

```text
https://your-domain.com/api/revalidate
```

This uses `SANITY_REVALIDATE_SECRET` and avoids rebuilding the whole site for ordinary page/settings content changes.

Use this when:

- editors change page content
- editors change global settings
- you want updates to go live quickly without a full Vercel build

Suggested Sanity webhook settings:

- Name: `Revalidate Next.js`
- URL: `https://your-domain.com/api/revalidate`
- Trigger on: Create, Update, Delete
- Filter: `_type in ["page", "settings"]`
- Projection: `{_type, slug}`
- Secret: same value as `SANITY_REVALIDATE_SECRET`
- HTTP method: `POST`

## Separate Option: Full Vercel Rebuild Via Deploy Hook

If you specifically want a new Vercel deployment every time content is published, use a Vercel Deploy Hook and point a Sanity webhook at it.

Use this when:

- you rely on full static rebuilds
- content changes affect build-time behavior outside the existing revalidation flow
- you explicitly want a new deployment recorded in Vercel for each publish

### Step 1. Create the Deploy Hook in Vercel

In Vercel:

1. Open the project.
2. Go to `Settings -> Git`.
3. Find `Deploy Hooks`.
4. Create a hook for the branch you deploy from, usually `main`.
5. Copy the generated hook URL.

The hook URL will look similar to:

```text
https://api.vercel.com/v1/integrations/deploy/...
```

### Step 2. Create a Sanity webhook that calls the Deploy Hook

In Sanity Manage:

1. Open your project.
2. Go to `API -> Webhooks`.
3. Create a new webhook.

Suggested settings:

- Name: `Vercel Build Hook`
- URL: paste the Vercel Deploy Hook URL
- Trigger on: Publish-related changes you care about
- Filter: `_type in ["page", "settings"]`
- Projection: optional, not required by Vercel
- HTTP method: `POST`

### Step 3. Test it

1. Publish a page or settings change in Sanity.
2. Check the webhook attempts log in Sanity.
3. Check the new deployment in Vercel.

## Which Option To Use

Default recommendation for this repo:

- Use `api/revalidate` for routine content publishing
- Use a Vercel Deploy Hook only if you truly need a full rebuild

Why:

- revalidation is faster
- revalidation avoids unnecessary full site builds
- the code for revalidation is already present in this repo

## Useful References

- Vercel CLI docs: https://vercel.com/docs/cli
- Vercel deploy hook guide: https://vercel.com/guides/set-up-and-use-deploy-hooks-with-vercel-and-headless-cms
- Vercel Git settings: https://vercel.com/docs/project-configuration/git-settings
- Sanity webhooks docs: https://www.sanity.io/docs/content-lake/webhooks
