# WildFrame — Nature Travel Photography Site

A cinematic nature photography journal built with Astro, Tailwind CSS, and Cloudflare Pages.

## Stack

- **Astro** (static output) + **TypeScript**
- **Tailwind CSS** + custom CSS variables
- **Cloudflare Pages** (hosting + Functions)
- **Cloudflare R2** (image storage)
- **Cloudflare D1** (photo metadata)

---

## Local development

```bash
npm install
npm run dev        # Astro dev server at http://localhost:4321
```

To test Pages Functions locally (requires Wrangler):

```bash
npx wrangler pages dev dist --d1=PHOTO_DB=<your-db-id> --r2=PHOTO_BUCKET=<bucket>
# or use the built-in wrangler dev after building:
npm run build && npx wrangler pages dev dist
```

---

## Cloudflare setup

### 1. Create D1 database

```bash
npx wrangler d1 create nature-photos-db
# Copy the returned database_id into wrangler.toml
```

Run the migration:

```bash
npx wrangler d1 execute nature-photos-db --file=migrations/0001_create_photos.sql
# For production:
npx wrangler d1 execute nature-photos-db --remote --file=migrations/0001_create_photos.sql
```

### 2. Create R2 bucket

```bash
npx wrangler r2 bucket create nature-photos
```

If you want public access to images, enable the public URL on the bucket in the Cloudflare dashboard and set `PUBLIC_R2_BASE_URL` to the provided base URL (e.g. `https://pub-xxxx.r2.dev`).

### 3. Environment variables

Set these in the **Cloudflare Pages dashboard → Settings → Environment variables**:

| Variable | Required | Description |
|---|---|---|
| `ADMIN_UPLOAD_SECRET` | ✅ | Secret used to authenticate the `/api/upload` endpoint |
| `PUBLIC_R2_BASE_URL` | optional | Public base URL for R2 assets |
| `PUBLIC_INSTAGRAM_HANDLE` | optional | e.g. `@wildframe` |
| `PUBLIC_CONTACT_EMAIL` | optional | Contact email shown on /contact |
| `PUBLIC_WHATSAPP_NUMBER` | optional | Phone number (digits only) |

Set the admin secret as a **secret** (not a plain variable):

```bash
npx wrangler pages secret put ADMIN_UPLOAD_SECRET
```

### 4. Deploy

```bash
npm run build
npx wrangler pages deploy dist --project-name=nature-travel-photography-site
```

Or connect the repository to Cloudflare Pages (recommended):

- Build command: `npm run build`
- Output directory: `dist`
- Bind `PHOTO_DB` (D1) and `PHOTO_BUCKET` (R2) under **Functions → Bindings**

---

## Upload photos

1. Open `/admin` on the deployed site.
2. Select an image (JPEG, PNG, WebP, or AVIF, max 10 MB).
3. Fill in caption, place, and category (all optional).
4. Enter your `ADMIN_UPLOAD_SECRET`.
5. Submit — the photo appears in the gallery immediately.

---

## Project structure

```
functions/api/      Cloudflare Pages Functions (photos API, upload)
migrations/         D1 SQL migrations
src/
  components/       Astro UI components
  layouts/          BaseLayout
  lib/              Types, sample data, category constants
  pages/            All public routes
  styles/           Global CSS + design tokens
wrangler.toml       Cloudflare bindings config
```
