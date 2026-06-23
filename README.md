# WildFrame — Nature Travel Photography Site

A cinematic nature photography journal built with Astro, Tailwind CSS, hosted on Cloudflare Pages. All photos and metadata are stored directly in this GitHub repository — no paid database or storage services needed.

## Stack

- **Astro** (static output) + **TypeScript**
- **Tailwind CSS** + custom CSS variables
- **Cloudflare Pages** (free hosting + API functions)
- **GitHub repo** (image files in `public/photos/`, metadata in `src/data/photos.json`)

## How uploads work

When you submit a photo via `/admin`:

1. The Cloudflare Pages Function calls the GitHub API to commit the image into `public/photos/`
2. It then updates `src/data/photos.json` with the new photo entry
3. The commit triggers a Cloudflare Pages rebuild automatically
4. The new photo appears on the live site within ~30 seconds

---

## Local development

```bash
npm install
npm run dev        # Astro dev server at http://localhost:4321
```

---

## Deploy to Cloudflare Pages (free)

### 1. Create the Pages project

- Go to [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages**
- Click **Connect to Git** → authorize GitHub → select `photography-portfolio`
- Build settings — set these **exactly**:
  - Build command: `npm run build`
  - Output directory: `dist`
  - **Deploy command: leave this completely blank** ← critical, do not set this
- Click **Save and Deploy**

### 2. Create a GitHub Personal Access Token

- Go to [github.com/settings/tokens](https://github.com/settings/tokens) → **Fine-grained tokens** → **Generate new token**
- Set repository access to `photography-portfolio` only
- Under **Repository permissions** → set **Contents** to **Read and Write**
- Copy the generated token

### 3. Set environment variables

In Cloudflare Pages → your project → **Settings** → **Environment variables** → **Production**:

| Variable | Type | Value |
|---|---|---|
| `ADMIN_UPLOAD_SECRET` | Secret | Any password you choose for the upload form |
| `GITHUB_TOKEN` | Secret | The fine-grained token you just created |
| `GITHUB_REPO` | Plain | `Adii108/photography-portfolio` |
| `GITHUB_BRANCH` | Plain | `master` |
| `PUBLIC_INSTAGRAM_HANDLE` | Plain | e.g. `@yourname` (optional) |
| `PUBLIC_CONTACT_EMAIL` | Plain | Your email (optional) |
| `PUBLIC_WHATSAPP_NUMBER` | Plain | Digits only e.g. `919876543210` (optional) |

### 4. Redeploy

After adding variables, go to **Deployments** → click **Retry deployment** once. After that, every push to `master` redeploys automatically.

---

## Uploading photos

1. Open `/admin` on your live site
2. Select an image (JPEG, PNG, WebP, or AVIF — max 10 MB)
3. Fill in caption, place, and category (all optional)
4. Enter your `ADMIN_UPLOAD_SECRET`
5. Submit — the photo is committed to GitHub and the site rebuilds

---

## Project structure

```
functions/api/      Cloudflare Pages Functions (photos API, upload via GitHub API)
public/photos/      Uploaded images (committed to this repo)
src/
  components/       Astro UI components
  data/             photos.json — photo metadata (committed to this repo)
  layouts/          BaseLayout
  lib/              Types, sample data, category constants
  pages/            All public routes
  styles/           Global CSS + design tokens
wrangler.toml       Cloudflare Pages config
```
