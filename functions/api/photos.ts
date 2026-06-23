/**
 * GET /api/photos
 *
 * Reads photo metadata from the static /photos.json asset that Astro
 * generates from src/data/photos.json at build time.
 *
 * Optional query params:
 *   category  - filter by category
 *   limit     - max results (default 50)
 */

interface PhotoEntry {
  id: string;
  slug: string;
  imageUrl: string;
  imageKey: string;
  caption?: string;
  place?: string;
  category?: string;
  createdAt: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type EmptyEnv = Record<string, never>;

export const onRequestGet: PagesFunction<EmptyEnv> = async (context) => {
  const url = new URL(context.request.url);
  const category = url.searchParams.get('category') ?? null;
  const limitParam = url.searchParams.get('limit');
  const limit = limitParam ? Math.min(Math.max(parseInt(limitParam, 10) || 50, 1), 200) : 50;

  try {
    // Fetch the static photos.json served from the same Pages deployment
    const origin = new URL(context.request.url).origin;
    const res = await fetch(`${origin}/photos.json`);
    if (!res.ok) {
      return Response.json({ ok: true, photos: [] }, {
        headers: { 'Cache-Control': 'public, max-age=30' },
      });
    }

    let photos: PhotoEntry[] = await res.json() as PhotoEntry[];

    if (category && category !== 'all') {
      photos = photos.filter(p => p.category === category);
    }

    photos = photos.slice(0, limit);

    return Response.json({ ok: true, photos }, {
      headers: { 'Cache-Control': 'public, max-age=30' },
    });
  } catch (err) {
    console.error('[GET /api/photos]', err);
    return Response.json({ ok: true, photos: [] }, { status: 200 });
  }
};
