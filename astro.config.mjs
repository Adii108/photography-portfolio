import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Copies src/data/photos.json → public/photos.json before every build
 * so the static asset is always in sync with the data file.
 */
const syncPhotosJson = {
  name: 'sync-photos-json',
  hooks: {
    'astro:build:start': () => {
      const src  = resolve('src/data/photos.json');
      const dest = resolve('public/photos.json');
      try {
        const data = readFileSync(src, 'utf-8');
        writeFileSync(dest, data, 'utf-8');
      } catch (e) {
        console.warn('[sync-photos-json] Could not copy photos.json:', e);
      }
    },
  },
};

export default defineConfig({
  integrations: [tailwind(), syncPhotosJson],
  output: 'static',
});
