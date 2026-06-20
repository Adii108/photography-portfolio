# Design - Nature Travel Photography Site

## Overview

The site is a compact Astro project deployed to Cloudflare Pages. Most public pages are static Astro routes styled with Tailwind and custom CSS. Dynamic photo data is served through Cloudflare Pages Functions, with uploaded images stored in R2 and metadata stored in D1.

The visual direction is a maximalist nature-travel magazine: layered grain, earthy gradients, oversized typography, asymmetrical image cards, and slow cinematic motion. The code should stay simple even if the design feels rich.

## Architecture

```txt
Visitor/Admin
   |
   v
Cloudflare Pages static site
   |
   |-- Astro pages and components
   |-- Gallery client filter
   |
   +-- Pages Functions
        |
        |-- GET /api/photos -> D1 metadata
        |-- POST /api/upload -> validate admin secret, store image in R2, write D1 row
        |
        +-- Cloudflare bindings
             |-- PHOTO_BUCKET: R2
             |-- PHOTO_DB: D1
             |-- ADMIN_UPLOAD_SECRET: env var
             |-- PUBLIC_R2_BASE_URL: optional env var
```

## Page design

### Home

Sections:

1. Full-screen hero with dramatic nature background, large serif headline, short intro, CTA buttons.
2. Featured photos strip with oversized cards and floating captions.
3. Trek journal section with magazine-style text blocks and layered image fragments.
4. Category gateway: Mountains, Forests, Trails, Sunsets, Rivers.
5. Final contact/social CTA.

### Gallery

- Responsive masonry-inspired CSS grid.
- Sticky or top filter bar.
- Cards use image, caption, place, and category.
- Hover adds slight lift, image zoom, and caption reveal.
- Mobile uses one-column stacked editorial cards.

### Story page

- Full-bleed image or split editorial layout.
- Metadata block: place, category, optional date.
- Caption appears as a pull quote or journal note.
- Back to gallery link.

### About

- Short, human note.
- One large supporting image or abstract texture block.
- Keep copy minimal.

### Contact

- Instagram, email, optional WhatsApp.
- Use clean link cards, not a large form in v1.

### Admin

- Simple form with image, caption, place, category, admin secret.
- Local image preview before upload.
- Progress and result state.
- Friendly validation messages.

## Visual system

### Colors

Use CSS variables for a controlled earthy palette:

- `--ink`: deep charcoal/forest black
- `--paper`: warm off-white
- `--moss`: dark green
- `--fern`: muted green
- `--sky`: weathered blue
- `--stone`: grey taupe
- `--sunset`: burnt orange
- `--mist`: translucent pale overlay

### Typography

- Serif display font for headlines: use a high-impact Google Font such as Playfair Display or Cormorant Garamond.
- Sans font for UI/body: use Inter, Manrope, or similar.
- Use very large responsive headings with tight line-height.

### Texture and motion

- Add grain using a CSS pseudo-element or small inline SVG noise background.
- Use radial gradients, conic gradients, and translucent overlays for depth.
- Use slow hero image scale animation.
- Use hover transforms and small reveal animations.
- Avoid heavy animation frameworks.

## Data model

Core TypeScript type:

```ts
export type PhotoEntry = {
  id: string;
  slug: string;
  imageUrl: string;
  imageKey: string;
  caption?: string;
  place?: string;
  category?: 'mountains' | 'forests' | 'trails' | 'sunsets' | 'rivers' | 'other';
  createdAt: string;
};
```

D1 table:

```sql
CREATE TABLE IF NOT EXISTS photos (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  image_key TEXT NOT NULL,
  image_url TEXT NOT NULL,
  caption TEXT,
  place TEXT,
  category TEXT DEFAULT 'other',
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_photos_created_at ON photos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_photos_category ON photos(category);
```

## API design

### GET `/api/photos`

Returns all photos ordered newest first.

Optional query:

- `category`
- `limit`

Response:

```json
{
  "photos": [
    {
      "id": "uuid",
      "slug": "mist-over-valley",
      "imageUrl": "https://...",
      "caption": "Mist over the valley",
      "place": "Himachal",
      "category": "mountains",
      "createdAt": "2026-06-20T00:00:00.000Z"
    }
  ]
}
```

### POST `/api/upload`

Accepts multipart form data:

- `image`: required
- `caption`: optional
- `place`: optional
- `category`: optional
- `secret`: required, must match `ADMIN_UPLOAD_SECRET`

Validation:

- allowed image MIME types: jpeg, png, webp, avif
- max image size: use a practical limit, for example 10 MB in v1
- category defaults to `other`
- caption and place are trimmed

## Upload sequence

```txt
Admin selects image and details
Admin submits form
POST /api/upload validates secret and input
Function creates id, slug, and R2 key
Function writes image to PHOTO_BUCKET
Function writes metadata row to PHOTO_DB
Function returns created photo
Admin UI shows success and reset option
Public pages fetch /api/photos and show the new photo
```

## Component plan

- `BaseLayout.astro`: metadata, fonts, global nav, footer, texture layer.
- `Nav.astro`: simple nav links.
- `Hero.astro`: cinematic home hero.
- `TextureLayer.astro`: reusable grain/gradient background layer.
- `PhotoCard.astro`: image card with caption/place/category.
- `GalleryGrid.astro`: grid layout and optional client-side filter script.
- `UploadForm.astro`: admin upload form with client-side preview.

## Error handling

- API returns JSON with `ok`, `error`, and optional `details`.
- Admin form shows field-level or form-level messages.
- Missing data never breaks the public UI.
- Story pages show a not-found state when slug does not exist.

## Performance and accessibility

- Use lazy loading for non-hero images.
- Use meaningful alt text from caption or place.
- Keep contrast high on text overlays.
- Respect `prefers-reduced-motion`.
- Avoid blocking JS for public pages.

## Deployment notes

- Configure Cloudflare Pages build command, for example `npm run build`.
- Configure output directory based on Astro output, commonly `dist`.
- Bind D1 as `PHOTO_DB` and R2 as `PHOTO_BUCKET`.
- Set `ADMIN_UPLOAD_SECRET` in Cloudflare dashboard.
- Set `PUBLIC_R2_BASE_URL` if using public R2 asset URLs.
