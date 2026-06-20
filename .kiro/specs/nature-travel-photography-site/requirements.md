# Requirements - Nature Travel Photography Site

## Introduction

Create a concise but visually exceptional nature photography website for trekking, mountains, forests, rivers, sunsets, and travel diary stories. The site should be hosted on Cloudflare Pages and include a small admin upload flow powered by Pages Functions, R2, and D1.

The site should feel like a wild cinematic nature magazine: bold hero imagery, layered textures, oversized type, dramatic image cards, full-bleed sections, and controlled visual chaos.

## Requirements

### Requirement 1: Cinematic public website

**User story:** As a visitor, I want the site to feel immersive and premium immediately, so that the photography feels emotionally powerful rather than like a plain portfolio.

#### Acceptance criteria

1. WHEN a visitor opens the home page THEN the system SHALL show a full-screen editorial hero with a large headline, short intro, layered texture, and strong call-to-action.
2. WHEN a visitor scrolls the home page THEN the system SHALL show featured photo cards, an editorial intro, and a visual path into the gallery.
3. WHEN the site is viewed on mobile THEN the system SHALL preserve the dramatic visual identity without horizontal overflow or unusable text sizes.
4. WHEN the site loads THEN the system SHALL use optimized assets, lazy loading, and CSS-driven effects where possible.

### Requirement 2: Gallery with filters

**User story:** As a visitor, I want to browse photos by nature category, so that I can quickly explore mountains, forests, trails, sunsets, and rivers.

#### Acceptance criteria

1. WHEN a visitor opens the gallery THEN the system SHALL show a responsive grid of photo cards.
2. WHEN a visitor selects a category filter THEN the system SHALL update the visible photos without a full page reload.
3. WHEN a photo has a caption or place THEN the system SHALL show that detail in the card treatment.
4. WHEN no photos match a filter THEN the system SHALL show a simple empty state.

### Requirement 3: Story/photo detail page

**User story:** As a visitor, I want each selected photo to have an immersive story page, so that a single image can feel like a magazine spread.

#### Acceptance criteria

1. WHEN a visitor opens a story page THEN the system SHALL show the selected image in a large editorial layout.
2. IF caption, place, date, category, or trek name are available THEN the system SHALL display them in a polished metadata treatment.
3. WHEN a story page cannot find a photo THEN the system SHALL show a graceful not-found experience.

### Requirement 4: About and contact sections

**User story:** As a visitor, I want to understand the photographer and find contact/social links, so that I can connect beyond the gallery.

#### Acceptance criteria

1. WHEN a visitor opens About THEN the system SHALL show a short personal note about nature, trekking, and photography.
2. WHEN a visitor opens Contact THEN the system SHALL show Instagram and email links, with optional WhatsApp support if configured.
3. WHEN contact details are not configured THEN the system SHALL avoid broken or fake links.

### Requirement 5: Admin upload flow

**User story:** As the photographer, I want to upload only a picture plus simple details, so that maintaining the site is easy.

#### Acceptance criteria

1. WHEN the admin opens `/admin` THEN the system SHALL show a simple upload form for image, caption, place, and category.
2. WHEN the admin submits a valid image and secret THEN the system SHALL store the image in R2 and photo metadata in D1.
3. WHEN the admin submits invalid input THEN the system SHALL return a clear validation error.
4. WHEN a visitor later opens the site THEN the uploaded photo SHALL be available through the public photo API.
5. WHEN an unauthenticated request attempts upload THEN the system SHALL reject it without storing data.

### Requirement 6: Cloudflare deployment

**User story:** As the site owner, I want the project to deploy cleanly to Cloudflare Pages, so that hosting and the upload pipeline are managed in one place.

#### Acceptance criteria

1. WHEN the project is built THEN the system SHALL produce a Cloudflare Pages compatible output.
2. WHEN Pages Functions run THEN the system SHALL use documented bindings for R2, D1, and environment variables.
3. WHEN the database migration runs THEN the system SHALL create the required `photos` table.
4. WHEN local development starts THEN the system SHALL document how to run Astro and Wrangler workflows.
