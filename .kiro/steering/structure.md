# Structure Steering

## Target project structure

Create a compact project structure similar to this:

```txt
.
├── .kiro/
│   ├── steering/
│   └── specs/nature-travel-photography-site/
├── functions/
│   └── api/
│       ├── photos.ts
│       └── upload.ts
├── src/
│   ├── components/
│   │   ├── Hero.astro
│   │   ├── PhotoCard.astro
│   │   ├── GalleryGrid.astro
│   │   ├── TextureLayer.astro
│   │   └── Nav.astro
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── lib/
│   │   ├── photos.ts
│   │   └── categories.ts
│   ├── pages/
│   │   ├── index.astro
│   │   ├── gallery.astro
│   │   ├── about.astro
│   │   ├── contact.astro
│   │   ├── admin.astro
│   │   └── story/[slug].astro
│   └── styles/
│       └── global.css
├── migrations/
│   └── 0001_create_photos.sql
├── package.json
├── astro.config.mjs
├── tailwind.config.mjs
└── wrangler.toml
```

## Naming rules

- Use clear names over clever names.
- Use `PhotoEntry` as the core TypeScript type.
- Use kebab-case for slugs.
- Use small components; avoid deep nesting.

## Design implementation rules

- Build texture and depth through CSS layers, gradients, masks, blend modes, and spacing.
- Avoid heavy animation libraries unless absolutely needed.
- Use subtle scroll reveal and hover movement with CSS and small browser APIs.
