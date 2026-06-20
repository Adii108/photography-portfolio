# Tasks - Nature Travel Photography Site

## Implementation plan

Execute these tasks in order. Keep the first release compact and polished. Do not add features outside the requirements unless they directly support the site looking beautiful or deploying correctly.

- [x] 1. Initialize the Astro project foundation
  - Create Astro + TypeScript project files in the current folder.
  - Add Tailwind CSS and global styles.
  - Add base scripts: dev, build, preview, typecheck if available.
  - Verify the project boots locally.
  - Requirements: 1.4, 6.1, 6.4

- [x] 2. Build the visual system and layout shell
  - Create `BaseLayout.astro`, `Nav.astro`, and `TextureLayer.astro`.
  - Add CSS variables for ink, paper, moss, fern, sky, stone, sunset, and mist.
  - Add fonts, grain layer, gradient background, page spacing, and responsive typography.
  - Add reduced-motion support.
  - Requirements: 1.1, 1.3, 1.4

- [x] 3. Create sample photo data and shared types
  - Create `PhotoEntry` type and category constants.
  - Add a small local sample data fallback so the site looks beautiful before uploads exist.
  - Include categories: mountains, forests, trails, sunsets, rivers, other.
  - Requirements: 2.1, 2.3, 3.2

- [x] 4. Implement the home page
  - Build a full-screen cinematic hero.
  - Add featured photo strip, trek journal section, category gateway, and final CTA.
  - Use layered textures, large serif headlines, and editorial asymmetry.
  - Requirements: 1.1, 1.2, 1.3

- [x] 5. Implement photo cards and gallery filtering
  - Create `PhotoCard.astro` and `GalleryGrid.astro`.
  - Build `/gallery` with responsive grid and category filter buttons.
  - Add no-match empty state.
  - Keep filtering lightweight with client-side JavaScript.
  - Requirements: 2.1, 2.2, 2.3, 2.4

- [x] 6. Implement story/photo detail pages
  - Create `/story/[slug].astro`.
  - Render a large editorial layout for one photo.
  - Show metadata when available and a graceful not-found state when missing.
  - Requirements: 3.1, 3.2, 3.3

- [x] 7. Implement About and Contact pages
  - Create `/about` with short photographer/nature/trekking copy.
  - Create `/contact` with Instagram, email, and optional WhatsApp link handling.
  - Avoid fake links when values are not configured.
  - Requirements: 4.1, 4.2, 4.3

- [x] 8. Add Cloudflare D1 migration and bindings config
  - Create `migrations/0001_create_photos.sql` for the `photos` table and indexes.
  - Create `wrangler.toml` with placeholders for `PHOTO_DB`, `PHOTO_BUCKET`, and variables.
  - Document local and production binding setup in README.
  - Requirements: 5.2, 5.4, 6.2, 6.3

- [x] 9. Build public photo API
  - Create `functions/api/photos.ts`.
  - Implement `GET /api/photos` with optional `category` and `limit` query parameters.
  - Return newest photos first from D1.
  - Fall back safely or return an empty list when no rows exist.
  - Requirements: 2.1, 5.4, 6.2

- [x] 10. Build admin upload API
  - Create `functions/api/upload.ts`.
  - Validate admin secret, image presence, MIME type, size, caption, place, and category.
  - Store image in R2 and metadata in D1.
  - Return the created photo as JSON.
  - Requirements: 5.2, 5.3, 5.5, 6.2

- [x] 11. Build admin upload page
  - Create `/admin` with image, caption, place, category, and secret fields.
  - Add image preview, submit state, success state, and friendly errors.
  - Keep the form visually consistent but simpler than public pages.
  - Requirements: 5.1, 5.2, 5.3

- [x] 12. Connect live data to public pages
  - Update gallery/home/story loading so uploaded photos appear from `/api/photos` where appropriate.
  - Preserve sample data as a design fallback only when the API returns no photos in local/dev mode.
  - Ensure story links use generated slugs.
  - Requirements: 2.1, 3.1, 5.4

- [x] 13. Polish responsive design and motion
  - Review mobile, tablet, and desktop layouts.
  - Tune hero height, card sizes, typography, contrast, hover states, and scroll feel.
  - Ensure no horizontal overflow.
  - Requirements: 1.3, 1.4, 2.1

- [x] 14. Final verification and deploy documentation
  - Run build and type checks.
  - Verify upload success and unauthorized upload rejection.
  - Verify gallery filters and story pages.
  - Update README with exact Cloudflare Pages, R2, D1, and environment variable steps.
  - Requirements: 5.3, 5.5, 6.1, 6.2, 6.3, 6.4
