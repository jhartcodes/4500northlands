# Clean Next.js + Sanity app

This template includes a [Next.js](https://nextjs.org/) app with a [Sanity Studio](https://www.sanity.io/) – an open-source React application that connects to your Sanity project’s hosted dataset. The Studio is configured locally and can then be deployed for content collaboration.

![Screenshot of Sanity Studio using Presentation Tool to do Visual Editing](/sanity-next-preview.png)

## Features

- **Next.js 16 for Performance:** Leverage the power of Next.js 16 App Router for blazing-fast performance and SEO-friendly static sites.
- **Real-time Visual Editing:** Edit content live with Sanity's [Presentation Tool](https://www.sanity.io/docs/presentation) and see updates in real time.
- **Live Content:** The [Live Content API](https://www.sanity.io/live) allows you to deliver live, dynamic experiences to your users without the complexity and scalability challenges that typically come with building real-time functionality.
- **Customizable Pages with Drag-and-Drop:** Create and manage pages using a page builder with dynamic components and [Drag-and-Drop Visual Editing](https://www.sanity.io/visual-editing-for-structured-content).
- **Powerful Content Management:** Collaborate with team members in real-time, with fine-grained revision history.
- **AI-powered Media Support:** Auto-generate alt text with [Sanity AI Assist](https://www.sanity.io/ai-assist).
- **On-demand Publishing:** No waiting for rebuilds—new content is live instantly with Incremental Static Revalidation.
- **Easy Media Management:** [Integrated Unsplash support](https://www.sanity.io/plugins/sanity-plugin-asset-source-unsplash) for seamless media handling.

## Demo

https://template-nextjs-clean.sanity.dev

---

## 🔒 Working on production safely (local prod mirror)

**Project-specific runbook for Whistler Northlands** — Sanity project `tivw2iwp`.

This site is **linked to production**. Never test schema or content changes directly against the `production` dataset. Instead: back up production → mirror it into the `dev` dataset → test locally → deploy → migrate prod.

| Dataset      | Purpose                                                                   |
| ------------ | ------------------------------------------------------------------------- |
| `production` | Live data used by the deployed site and Studio. Don't experiment here.    |
| `dev`        | Disposable mirror of production for local testing. Safe to break/refresh. |

> All `.env*` files are **gitignored and local-only**. The deployed Studio and Vercel read their own environment, so pointing local env at `dev` can never affect production.

### Commands

| Command                      | What it does                                                                            |
| ---------------------------- | --------------------------------------------------------------------------------------- |
| `npm run db:status`          | Which dataset is local env on? Fails if the env files disagree.                         |
| `npm run db:backup`          | `sanity dataset export production` → dated tarball in `local-prod-backups/`. Read-only. |
| `npm run db:dev`             | Point local frontend + Studio at the `dev` mirror.                                      |
| `npm run db:prod`            | Point them back at `production`.                                                        |
| `npm run dev`                | Frontend :3000 + Studio :3333. Prints the dataset banner first.                         |
| `npm run deploy:studio`      | Deploy the hosted Studio. Blocked unless env is on `production`.                        |
| `npm run vercel:deploy:prod` | Deploy the frontend to Vercel.                                                          |

**Back up before anything that writes to production** — that means before a migration, and
as step 1 of any deploy. `npm run db:backup` is the Sanity CLI export; it never modifies
production and takes about 30 seconds.

### Which dataset am I on?

```shell
npm run db:status
```

This also runs automatically before `npm run dev`, so every dev session opens with a
banner telling you whether you're on live data. It **fails** if the three env files
disagree — a mismatch means the frontend and Studio would target different datasets.

### 1. Back up production (always do this first)

```shell
npm run db:backup
```

Backups land in `local-prod-backups/` (gitignored) as `production-backup-<DATE>.tar.gz`.
Export is **read-only** — it never modifies production.

### 2. Refresh the `dev` mirror from production

`sanity dataset copy` needs a paid plan, so use **export → import**:

```shell
cd studio
npx sanity dataset delete dev --force                 # drop the stale mirror
npx sanity dataset create dev --visibility public      # recreate it (match production ACL)
npx sanity dataset import ../local-prod-backups/production-backup-<DATE>.tar.gz --dataset dev
```

Verify the copy matches:

```shell
npx sanity documents query 'count(*[!(_id in path("_.**"))])' --dataset dev --api-version 2025-08-15
npx sanity documents query 'count(*[!(_id in path("_.**"))])' --dataset production --api-version 2025-08-15
```

### 3. Point local env at `dev`

```shell
npm run db:dev      # ...and `npm run db:prod` to switch back
```

This rewrites the dataset in all three gitignored env files at once — `frontend/.env`,
`studio/.env` (including `SANITY_STUDIO_PREVIEW_URL`) and the root `.env.local`.

> **Don't hand-edit these.** The dataset lives in three files and the root `.env.local`
> is **inert** for `npm run dev` — Next.js reads env from `frontend/`. Editing only that
> file looks like a switch but leaves you writing to production.

### 4. Run locally

```shell
npm run dev      # frontend → http://localhost:3000 · studio → http://localhost:3333
```

If port `3333` is taken by another Sanity project, run the studio elsewhere: `cd studio && npx sanity dev --port 3334`.

> ⚠️ **Assets are project-scoped, not dataset-scoped.** Images are shared between
> `production` and `dev` — that's why they resolve in the mirror without re-uploading.
> It also means deleting an asset in `dev` deletes it in production. Keep experiments
> to document changes only.

### 5. Make and test changes

- **Adding a new page-builder block?** Register it in all five places:
  1. `studio/src/schemaTypes/index.ts` (import + `schemaTypes` array)
  2. `studio/src/schemaTypes/documents/page.ts` (`pageBuilder.of`)
  3. `frontend/sanity/lib/queries.ts` (GROQ projection)
  4. `frontend/app/components/blocks/index.ts` (export)
  5. `frontend/app/components/BlockRenderer.tsx` (import + `Blocks` map)
- Regenerate types after any schema change: `cd frontend && npm run sanity:typegen`
- Type-check both workspaces: `npm run type-check`

### 6. Content migrations (changing existing documents)

Put scripts in `studio/migrations/` and run them with the logged-in user's token. **Always dry-run on `dev` first** (target dataset = `SANITY_STUDIO_DATASET` in `studio/.env`):

```shell
cd studio
npx sanity exec migrations/<script>.ts --with-user-token -- --dry-run   # preview
npx sanity exec migrations/<script>.ts --with-user-token                # apply
```

> ⚠️ **Migrations must patch both the published doc _and_ any draft.** If you only patch the published version, later publishing a stale draft will silently revert your change. See `studio/migrations/replaceCacBlock.ts` for the pattern (it iterates every version of the page).

### 7. Deploy to production

**Nothing here mutates production content except step 6.** Steps 2–5 ship _code_; the
migration is the only step that rewrites live documents — which is why the backup in
step 1 is mandatory and the dry-run in step 6 is not optional.

1. **Take a fresh production backup.** Do this every time, even when you don't think
   you'll run a migration:

   ```shell
   npm run db:backup
   ```

   Wraps `sanity dataset export production` into a dated tarball in
   `local-prod-backups/` (gitignored). Read-only, ~30s, and the only thing standing
   between you and a bad migration. The backup you took before starting work
   (runbook step 1) is likely hours or days stale by now — editors may have
   published in the meantime.

2. **Restore env to production** — critical, the hosted Studio is built from `studio/.env`:

   ```shell
   npm run db:prod && npm run db:status
   ```

3. **Deploy the frontend by pushing to `main`.**

   ```shell
   git push origin main
   ```

   The repo is connected to Vercel, so a push to `main` **is** the production deploy.
   Watch it land with `npx vercel ls --scope pottinger-bird` or in the dashboard.

   The frontend reads its dataset from Vercel's own environment variables, so this is
   unaffected by whatever your local env files say.

4. **Manual CLI deploy — only when you deliberately want one** (hotfix without a commit,
   or redeploying an unchanged tree):

   ```shell
   npm run vercel:deploy:prod      # → npx vercel --prod, run from the repo root
   ```

   > ⚠️ Don't do both for the same change — pushing _and_ running the CLI deploys twice.
   > Prefer the push: a git-triggered deployment records the commit SHA, so you can always
   > tell what code is live. A CLI deploy uploads your working tree, committed or not —
   > which is how the June 2026 production build came to contain changes that weren't
   > committed until the next day.

5. **Deploy the Studio** — use the npm script, not `npx sanity deploy` directly:

   ```shell
   npm run deploy:studio
   ```

   A `predeploy` guard (`studio/scripts/assert-production.mjs`) aborts the deploy if
   `studio/.env` isn't on `production`, because `sanity deploy` bakes the dataset in at
   build time. Deploying while pointed at `dev` would silently repoint
   whistler-northlands.sanity.studio at the mirror — editors would keep publishing and
   nothing would reach the live site.

6. **Run the migration against production** — only if you have one. Dry-run first and
   read the output; it is the last checkpoint before live documents change:

   ```shell
   npm run db:status                                                     # confirm: production
   cd studio
   npx sanity exec migrations/<script>.ts --with-user-token -- --dry-run  # preview
   npx sanity exec migrations/<script>.ts --with-user-token               # apply
   ```

7. **Smoke-test** https://whistlernorthlands.vercel.app and https://whistler-northlands.sanity.studio.

> Deploy the **frontend before running the migration** so new block types render, instead of showing a "block hasn't been created" placeholder.

### Preview deployments (verify before production)

Push any branch other than `main` and Vercel builds a **Preview** deployment with its own
URL — the safest way to confirm a change renders as expected before production moves.

```shell
git checkout -b feat/<name>
git push -u origin feat/<name>      # → preview URL
npx vercel ls --scope pottinger-bird
```

Preview has its own environment variables, set to read the **`dev` mirror**:

| Variable                        | Preview                 | Production      |
| ------------------------------- | ----------------------- | --------------- |
| `NEXT_PUBLIC_SANITY_DATASET`    | `dev`                   | `production`    |
| `NEXT_PUBLIC_SANITY_STUDIO_URL` | `http://localhost:3333` | deployed Studio |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `tivw2iwp`              | `tivw2iwp`      |
| `SANITY_API_READ_TOKEN`         | same                    | same            |
| `SANITY_REVALIDATE_SECRET`      | same                    | same            |

**Why `dev` and not `production`:** you author new blocks' content in the mirror, so a
preview reading `production` would render your new blocks empty. Pointing Preview at `dev`
shows the new schema _with_ the content you actually created.

**Why the Studio URL is localhost:** it drives Presentation-mode edit-intent links. The
deployed Studio runs on `production`, and because `dev` is a mirror the document IDs are
identical — so an edit link from a `dev`-backed preview would open the _production_
document and let you edit live content by accident. Pointing at `localhost:3333` means
edit links only resolve for someone running the Studio locally against `dev`.

> These vars are Preview-scoped. Production's own five are untouched, so nothing here can
> change what the live site reads.

### If a migration goes wrong

The backup from step 1 is a full dataset export. To restore, import it back over production
with `--replace`, which overwrites documents by `_id`:

```shell
cd studio
npx sanity dataset import ../local-prod-backups/production-backup-<DATE>.tar.gz --dataset production --replace
```

> ⚠️ `--replace` overwrites documents present in the tarball. It does **not** delete
> documents created after the backup was taken — those survive. If you need a true
> point-in-time reset, delete and recreate the dataset first (the same delete/create/import
> sequence used for the `dev` mirror in step 2), and accept that you lose everything
> published since the backup.

Sanity also keeps its own document-level revision history, so a small mistake is often
faster to fix by reverting the affected documents in the Studio than by reimporting.

### Gotchas

- **Never run `npm audit fix --force`.** It force-upgrades `@sanity/cli` to an incompatible major and breaks the Studio (`Error: Cannot find module .../renderDocument.worker.js`). Recover with:
  ```shell
  git checkout HEAD -- package-lock.json studio/package.json
  npm ci
  ```
- **Use `npm run deploy:studio`, not `npx sanity deploy`.** Calling the Sanity CLI
  directly bypasses the `predeploy` production guard. If you must, run
  `npm run db:status` first.
- **Assets are project-scoped.** Images live at the project level and are shared between
  `production` and `dev`. Deleting an asset in the mirror deletes it in production too.
- **Deploy from the repo root**, not from `frontend/` — Vercel's root directory is set to `frontend`, so running `vercel` inside `frontend/` looks for `frontend/frontend` and errors.
- Keep the latest backup tarball until you've confirmed production looks correct.

---

## Getting Started

### Installing the template

> **Already deployed with Vercel?** If you've already deployed using the **Sanity + Vercel Integration** or **one-click Vercel button**, please visit our [Vercel deployment instructions](vercel-installation-instructions.md) to set up your local environment and deploy Sanity Studio.

#### 1. Initialize template with Sanity CLI

Run the command in your Terminal to initialize this template on your local computer.

```shell
npm create sanity@latest -- --template sanity-io/sanity-template-nextjs-clean
```

See the documentation if you are [having issues with the CLI](https://www.sanity.io/help/cli-errors).

#### 2. Run Studio and Next.js app locally

Navigate to the template directory using `cd <your app name>`, and start the development servers by running the following command

```shell
npm run dev
```

#### 3. Open the app and sign in to the Studio

Open the Next.js app running locally in your browser on [http://localhost:3000](http://localhost:3000).

Open the Studio running locally in your browser on [http://localhost:3333](http://localhost:3333). You should now see a screen prompting you to log in to the Studio. Use the same service (Google, GitHub, or email) that you used when you logged in to the CLI.

### Adding content with Sanity

#### 1. Publish your first document

The template comes pre-defined with a schema containing `Page`, `Post`, `Person`, and `Settings` document types.

From the Studio, click "+ Create" and select the `Post` document type. Go ahead and create and publish the document.

Your content should now appear in your Next.js app ([http://localhost:3000](http://localhost:3000)) as well as in the Studio on the "Presentation" Tab

#### 2. Import Sample Data (optional)

You may want to start with some sample content and we've got you covered. Run this command from the root of your project to import the provided dataset (sample-data.tar.gz) into your Sanity project. This step is optional but can be helpful for getting started quickly.

```shell
npm run import-sample-data
```

#### 3. Extending the Sanity schema

The schema for the `Post` document type is defined in the `studio/src/schemaTypes/post.ts` file. You can [add more document types](https://www.sanity.io/docs/studio/schema-types) to the schema to suit your needs.

### Deploying your application and inviting editors

#### 1. Deploy Sanity Studio

Your Next.js frontend (`/frontend`) and Sanity Studio (`/studio`) are still only running on your local computer. It's time to deploy and get it into the hands of other content editors.

Back in your Studio directory (`/studio`), run the following command to deploy your Sanity Studio.

```shell
npx sanity deploy
```

#### 2. Deploy Next.js app to Vercel

You have the freedom to deploy your Next.js app to your hosting provider of choice. With Vercel and GitHub being a popular choice, we'll cover the basics of that approach.

1. Create a GitHub repository from this project. [Learn more](https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github).
2. Create a new Vercel project and connect it to your Github repository.
3. Set the `Root Directory` to your Next.js app.
4. Configure your Environment Variables.

For the exact Vercel CLI commands used by this repo, plus separate instructions for Sanity webhook revalidation and a Vercel deploy hook, see [Vercel deployment instructions](vercel-installation-instructions.md).

#### 3. Invite a collaborator

Now that you’ve deployed your Next.js application and Sanity Studio, you can optionally invite a collaborator to your Studio. Open up [Manage](https://www.sanity.io/manage), select your project and click "Invite project members"

They will be able to access the deployed Studio, where you can collaborate together on creating content.

## Resources

- [Sanity documentation](https://www.sanity.io/docs)
- [Next.js documentation](https://nextjs.org/docs)
- [Join the Sanity Community](https://slack.sanity.io)
- [Learn Sanity](https://www.sanity.io/learn)

[vercel-deploy]: https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsanity-io%2Fsanity-template-nextjs-clean&project-name=nextjs-clean-website-sanity-template&repository-name=nextjs-clean-website-sanity-template&demo-title=Clean%20Next.js%20%2B%20Sanity%20app&demo-description=A%20clean%20Next.js%20plus%20Sanity%20starter%20with%20real-time%20visual%20editing%2C%20drag-and-drop%20page%20builder%2C%20AI%20media%20support%2C%20and%20live%20content%20updates.&demo-url=https%3A%2F%2Ftemplate-nextjs-clean.sanity.build%2F&demo-image=https%3A%2F%2Fraw.githubusercontent.com%2Fsanity-io%2Fsanity-template-nextjs-clean%2Frefs%2Fheads%2Fmain%2Fsanity-next-preview.png&products=%5B%7B%22type%22%3A%22integration%22%2C%22integrationSlug%22%3A%22sanity%22%2C%22productSlug%22%3A%22project%22%2C%22protocol%22%3A%22other%22%7D%5D&root-directory=frontend
