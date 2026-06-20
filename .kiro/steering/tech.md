# Technical Steering

## Stack

Use Astro with TypeScript and Tailwind CSS.

Deploy to Cloudflare Pages. Use Pages Functions for API routes. Use Cloudflare R2 for uploaded images and Cloudflare D1 for photo metadata.

## Implementation rules

- Keep the codebase small and readable.
- Prefer static Astro pages for marketing/content pages.
- Use client-side JavaScript only where useful: gallery filtering, admin upload preview, small animations.
- Do not add a full authentication product in v1. Use a single admin secret from an environment variable for the upload endpoint.
- Keep API routes under `functions/api/`.
- Keep public pages under `src/pages/`.
- Keep reusable UI under `src/components/`.
- Keep data access utilities under `src/lib/`.
- Use semantic HTML and accessible controls.
- Optimize images before storage when practical, or validate size/type before upload.

## Cloudflare bindings

Use these binding names:

- R2 bucket binding: `PHOTO_BUCKET`
- D1 database binding: `PHOTO_DB`
- admin secret variable: `ADMIN_UPLOAD_SECRET`
- optional public R2 base URL variable: `PUBLIC_R2_BASE_URL`

## Quality bar

- Responsive layout must look excellent on mobile and desktop.
- Lighthouse performance should remain strong for a photo-heavy site.
- Upload errors should be friendly and specific.
- All generated code should pass TypeScript checks and project linting if configured.
