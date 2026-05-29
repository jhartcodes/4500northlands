# Migrating the Frontend Deployment to the `pottinger-bird` Vercel Team

Goal: move the Next.js frontend from your **personal** Vercel scope
(`jhartcodes-projects`) to the **team** you were invited to
(`pottinger-bird`), keeping the **same public URL**
`https://whistlernorthlands.vercel.app`, continuing to **deploy via the Vercel
CLI** for now, with a clear path to switch to **Git auto-deploy** later.

---

## Architecture recap

Monorepo (npm workspaces):

| App         | Stack                                   | Hosted on        | Deploy command                |
| ----------- | --------------------------------------- | ---------------- | ----------------------------- |
| `frontend/` | Next.js 16, React 19, Tailwind 4        | **Vercel**       | `vercel --prod` (from `frontend/`) |
| `studio/`   | Sanity Studio v5                        | **Sanity** hosting | `sanity deploy`             |

- Shared backend: Sanity project **`tivw2iwp`**, dataset **`production`**.
- Integration points that depend on the public URL:
  - **Visual Editing / Presentation** — studio `SANITY_STUDIO_PREVIEW_URL` →
    frontend; frontend `NEXT_PUBLIC_SANITY_STUDIO_URL` → studio. Uses
    `frontend/app/api/draft-mode/{enable,disable}`.
  - **On-publish revalidation** — Sanity webhook → `frontend/app/api/revalidate`
    (guarded by `SANITY_REVALIDATE_SECRET`).
  - **Sanity CORS allow-list** — must include the frontend origin.

Because we are **reusing the same `whistlernorthlands.vercel.app` URL**, almost
none of these integration values change — the main work is (a) freeing the URL on
the old account and (b) recreating env vars on the new project.

### Current Vercel state
- Old project: scope `jhartcodes-projects`, project `whistlernorthlands`
  (`prj_f8Qqj6vV4BBH5wUNy2qsUvHNM5fR`), prod URL `whistlernorthlands.vercel.app`.
- Target team: `pottinger-bird` (visible via `vercel teams ls`).
- **Two stale `.vercel/` link dirs** in the repo (root **and** `frontend/`), both
  pointing at the old project — these must be cleared.

---

## Key constraint

`*.vercel.app` subdomains are **globally unique**. The new project cannot take
`whistlernorthlands.vercel.app` until the old project releases it. So the old URL
must be freed **before** the new production deploy claims that name → brief cutover.

---

## Phase 0 — Prerequisites (one-time)
1. Confirm you can create projects on `pottinger-bird` (Member/Owner role).
2. Confirm access to **Sanity Manage** for project `tivw2iwp` (to update CORS +
   webhook). https://www.sanity.io/manage/project/tivw2iwp
3. Commit the current uncommitted work so deploys reflect it:
   - `frontend/app/refresh-action.ts` (new), `frontend/app/layout.tsx`,
     `frontend/.env.example`, `studio/.env.example`.
4. Have the secret values ready (they are in your local `frontend/.env`):
   `SANITY_API_READ_TOKEN`, `SANITY_REVALIDATE_SECRET`.

## Phase 1 — Free up the URL on the personal account
Do this immediately before Phase 3 to minimize downtime.
- Vercel dashboard → personal `whistlernorthlands` project → **Settings → General →
  Project Name** → rename to `whistlernorthlands-old`.
  Its URL becomes `whistlernorthlands-old.vercel.app`, freeing
  `whistlernorthlands.vercel.app`.
- Keep the renamed project as a rollback until the new one is verified, then
  delete it later.

## Phase 2 — Clean the local Vercel links
```bash
# from repo root
rm -rf .vercel frontend/.vercel
```
Canonical deploy directory stays `frontend/` (matches existing root scripts and
keeps Root Directory = repo-relative `frontend`). Only `frontend/.vercel` should
exist after re-linking.

## Phase 3 — Create & link the new project on the team (CLI)
```bash
cd frontend
npx vercel link --scope pottinger-bird
# Prompts:
#   Set up "frontend"? yes
#   Which scope? pottinger-bird
#   Link to existing project? No -> create new
#   Project name? whistlernorthlands
#   In which directory is your code located? ./   (we are already inside frontend/)
```
Running from inside `frontend/` makes Vercel treat it as the project root, so the
monorepo Root Directory is handled automatically (same as today).

## Phase 4 — Set environment variables on the new project
Set each for **Production**, **Preview**, and **Development** as appropriate.
Dashboard (Settings → Environment Variables) or CLI:
```bash
cd frontend
echo -n 'tivw2iwp'      | npx vercel env add NEXT_PUBLIC_SANITY_PROJECT_ID production
echo -n 'production'    | npx vercel env add NEXT_PUBLIC_SANITY_DATASET production
echo -n '2025-09-25'    | npx vercel env add NEXT_PUBLIC_SANITY_API_VERSION production
echo -n '<studio url>'  | npx vercel env add NEXT_PUBLIC_SANITY_STUDIO_URL production
echo -n '<read token>'  | npx vercel env add SANITY_API_READ_TOKEN production
echo -n '<revalidate secret>' | npx vercel env add SANITY_REVALIDATE_SECRET production
# repeat for `preview` (and `development` if you use `vercel dev`)
```
Values:
| Var | Value |
| --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `tivw2iwp` |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | `2025-09-25` |
| `NEXT_PUBLIC_SANITY_STUDIO_URL` | deployed studio URL (e.g. `https://<host>.sanity.studio`) |
| `SANITY_API_READ_TOKEN` | reuse existing (from `frontend/.env`) |
| `SANITY_REVALIDATE_SECRET` | reuse existing (must match the Sanity webhook secret) |

Then refresh local: `npx vercel env pull .env.local`.

## Phase 5 — First deploy to the new project
```bash
cd frontend
npx vercel               # preview build — smoke-test it
npx vercel --prod        # production — claims whistlernorthlands.vercel.app
```
Update the root helper scripts if you want them to target the team by default
(they already `cd frontend`; add `--scope pottinger-bird` if your CLI default
scope isn't the team).

## Phase 6 — Re-point integrations (mostly verification, since URL is unchanged)
1. **Sanity CORS** (Manage → API → CORS origins): ensure these exist with
   credentials allowed:
   - `https://whistlernorthlands.vercel.app`
   - `http://localhost:3000`
2. **Revalidate webhook** (Manage → API → Webhooks): URL
   `https://whistlernorthlands.vercel.app/api/revalidate`, method `POST`,
   filter `_type in ["page","settings"]`, secret = `SANITY_REVALIDATE_SECRET`
   (must equal the value set in Phase 4).
3. **Studio preview URL**: `studio/.env` `SANITY_STUDIO_PREVIEW_URL` already
   `https://whistlernorthlands.vercel.app`. If the studio host changed, redeploy:
   `cd studio && npx sanity deploy`.

## Phase 7 — Verify
- Production site loads at `https://whistlernorthlands.vercel.app`.
- Visual Editing: open Presentation in Studio, confirm the iframe loads and edits
  reflect live (draft mode routes work).
- Publish a content change → confirm the revalidate webhook returns 200 and the
  page updates.
- Speed Insights / deployments now appear under the `pottinger-bird` team.

## Phase 8 — Decommission old
After a few days of stable operation, delete the renamed
`whistlernorthlands-old` personal project (Settings → Advanced → Delete).

---

## Later: switch to Git auto-deploy (short plan)
1. Commit/push all work to `jhartcodes/4500northlands`.
2. Team project → **Settings → Git → Connect** the GitHub repo.
   - The Vercel GitHub App must be granted access to `jhartcodes/4500northlands`
     for the `pottinger-bird` team. Since the repo is under your personal GitHub
     account, either grant the app access to that repo, or transfer the repo to a
     shared GitHub org.
3. **Settings → Build & Development → Root Directory = `frontend`** (required for
   the monorepo when Vercel builds from the repo root rather than the CLI's
   `frontend/` cwd).
4. Set **Production Branch = `main`**. Env vars from Phase 4 already apply.
5. Push to `main` → auto production deploy; PRs → preview URLs. CLI deploys remain
   available as a fallback.

## Reference
- Vercel CLI link/scope: `vercel link`, `--scope <team>`
- Env vars: `vercel env add|ls|pull`
- Project transfer (not used here, FYI): dashboard Settings → move project
- Monorepo Root Directory: Project Settings → Build & Development Settings
