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

| Dataset | Purpose |
| --- | --- |
| `production` | Live data used by the deployed site and Studio. Don't experiment here. |
| `dev` | Disposable mirror of production for local testing. Safe to break/refresh. |

> All `.env*` files are **gitignored and local-only**. The deployed Studio and Vercel read their own environment, so pointing local env at `dev` can never affect production.

### 1. Back up production (always do this first)

```shell
cd studio
npx sanity dataset export production ../local-prod-backups/production-backup-$(date +%F).tar.gz
```

Backups land in `local-prod-backups/` (gitignored). Export is **read-only** — it never modifies production.

### 2. Refresh the `dev` mirror from production

`sanity dataset copy` needs a paid plan, so use **export → import**:

```shell
cd studio
npx sanity dataset delete dev --force                 # drop the stale mirror
npx sanity dataset create dev --visibility public      # recreate it (match production ACL)
npx sanity dataset import ../local-prod-backups/production-backup-<DATE>.tar.gz dev
```

Verify the copy matches:

```shell
npx sanity documents query 'count(*[!(_id in path("_.**")) ])' --dataset dev
npx sanity documents query 'count(*[!(_id in path("_.**")) ])' --dataset production
```

(Assets are shared at the project level, so images resolve in `dev` without re-uploading.)

### 3. Point local env at `dev`

Edit the three gitignored env files:

- `studio/.env`: `SANITY_STUDIO_DATASET="dev"` and `SANITY_STUDIO_PREVIEW_URL="http://localhost:3000"`
- `frontend/.env`: `NEXT_PUBLIC_SANITY_DATASET="dev"`
- `.env.local`: `NEXT_PUBLIC_SANITY_DATASET="dev"`

### 4. Run locally

```shell
npm run dev      # frontend → http://localhost:3000 · studio → http://localhost:3333
```

If port `3333` is taken by another Sanity project, run the studio elsewhere: `cd studio && npx sanity dev --port 3334`.

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

1. **Restore env to production** (critical — the Studio is built from `studio/.env`):
   - `studio/.env`: `SANITY_STUDIO_DATASET="production"`, `SANITY_STUDIO_PREVIEW_URL="https://whistlernorthlands.vercel.app"`
   - `frontend/.env` and `.env.local`: `NEXT_PUBLIC_SANITY_DATASET="production"`
2. **Commit and push** to `main`.
3. **Deploy the frontend** — run from the **repo root** (the Vercel project's root directory is already `frontend`):
   ```shell
   npm run vercel:deploy:prod      # → npx vercel --prod
   ```
4. **Deploy the Studio**:
   ```shell
   cd studio && npx sanity deploy
   ```
5. **Run the migration against production** (env now points at production — dry-run first):
   ```shell
   cd studio
   npx sanity exec migrations/<script>.ts --with-user-token -- --dry-run
   npx sanity exec migrations/<script>.ts --with-user-token
   ```
6. **Smoke-test** https://whistlernorthlands.vercel.app and https://whistler-northlands.sanity.studio.

> Deploy the **frontend before running the migration** so new block types render, instead of showing a "block hasn't been created" placeholder.

### Gotchas

- **Never run `npm audit fix --force`.** It force-upgrades `@sanity/cli` to an incompatible major and breaks the Studio (`Error: Cannot find module .../renderDocument.worker.js`). Recover with:
  ```shell
  git checkout HEAD -- package-lock.json studio/package.json
  npm ci
  ```
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
