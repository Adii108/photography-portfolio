interface Env {
  PHOTO_DB: D1Database;
}

interface PhotoRow {
  id: string;
  slug: string;
  image_key: string;
  image_url: string;
  caption: string | null;
  place: string | null;
  category: string | null;
  created_at: string;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const category = url.searchParams.get('category') ?? null;
  const limitParam = url.searchParams.get('limit');
  const limit = limitParam ? Math.min(Math.max(parseInt(limitParam, 10) || 50, 1), 200) : 50;

  try {
    let query = 'SELECT * FROM photos';
    const bindings: (string | number)[] = [];

    if (category && category !== 'all') {
      query += ' WHERE category = ?';
      bindings.push(category);
    }

    query += ' ORDER BY created_at DESC LIMIT ?';
    bindings.push(limit);

    const { results } = await context.env.PHOTO_DB.prepare(query)
      .bind(...bindings)
      .all<PhotoRow>();

    const photos = (results ?? []).map(row => ({
      id: row.id,
      slug: row.slug,
      imageUrl: row.image_url,
      imageKey: row.image_key,
      caption: row.caption ?? undefined,
      place: row.place ?? undefined,
      category: row.category ?? 'other',
      createdAt: row.created_at,
    }));

    return Response.json({ ok: true, photos }, {
      headers: { 'Cache-Control': 'public, max-age=60' },
    });
  } catch (err) {
    console.error('[GET /api/photos]', err);
    return Response.json({ ok: false, photos: [], error: 'Failed to load photos' }, { status: 500 });
  }
};
