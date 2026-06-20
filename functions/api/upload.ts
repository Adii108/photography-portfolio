interface Env {
  PHOTO_DB: D1Database;
  PHOTO_BUCKET: R2Bucket;
  ADMIN_UPLOAD_SECRET: string;
  PUBLIC_R2_BASE_URL?: string;
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const VALID_CATEGORIES = ['mountains', 'forests', 'trails', 'sunsets', 'rivers', 'other'];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  // ── Auth ──────────────────────────────────────────────────────────────────
  let formData: FormData;
  try {
    formData = await context.request.formData();
  } catch {
    return Response.json({ ok: false, error: 'Invalid multipart form data' }, { status: 400 });
  }

  const secret = formData.get('secret');
  if (!context.env.ADMIN_UPLOAD_SECRET || secret !== context.env.ADMIN_UPLOAD_SECRET) {
    return Response.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  // ── Image validation ──────────────────────────────────────────────────────
  const imageFile = formData.get('image');
  if (!imageFile || !(imageFile instanceof File)) {
    return Response.json({ ok: false, error: 'Image file is required' }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(imageFile.type)) {
    return Response.json({
      ok: false,
      error: `Unsupported file type "${imageFile.type}". Allowed: JPEG, PNG, WebP, AVIF`,
    }, { status: 400 });
  }

  const imageBuffer = await imageFile.arrayBuffer();
  if (imageBuffer.byteLength > MAX_BYTES) {
    return Response.json({ ok: false, error: 'Image must be 10 MB or smaller' }, { status: 400 });
  }

  // ── Field extraction ──────────────────────────────────────────────────────
  const caption  = (formData.get('caption')  as string | null)?.trim() || undefined;
  const place    = (formData.get('place')    as string | null)?.trim() || undefined;
  const rawCat   = (formData.get('category') as string | null)?.trim().toLowerCase() || 'other';
  const category = VALID_CATEGORIES.includes(rawCat) ? rawCat : 'other';

  // ── Build identifiers ─────────────────────────────────────────────────────
  const id        = crypto.randomUUID();
  const base      = slugify(caption ?? place ?? id.slice(0, 8));
  const slug      = `${base}-${id.slice(0, 6)}`;
  const ext       = imageFile.type.split('/')[1].replace('jpeg', 'jpg');
  const imageKey  = `photos/${id}.${ext}`;
  const baseUrl   = context.env.PUBLIC_R2_BASE_URL?.replace(/\/$/, '') ?? '';
  const imageUrl  = baseUrl ? `${baseUrl}/${imageKey}` : imageKey;
  const createdAt = new Date().toISOString();

  // ── Store in R2 ───────────────────────────────────────────────────────────
  try {
    await context.env.PHOTO_BUCKET.put(imageKey, imageBuffer, {
      httpMetadata: { contentType: imageFile.type },
    });
  } catch (err) {
    console.error('[upload] R2 write failed', err);
    return Response.json({ ok: false, error: 'Failed to store image' }, { status: 500 });
  }

  // ── Write metadata to D1 ─────────────────────────────────────────────────
  try {
    await context.env.PHOTO_DB
      .prepare(
        `INSERT INTO photos (id, slug, image_key, image_url, caption, place, category, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(id, slug, imageKey, imageUrl, caption ?? null, place ?? null, category, createdAt)
      .run();
  } catch (err) {
    console.error('[upload] D1 write failed', err);
    // Best-effort: remove the orphaned R2 object
    await context.env.PHOTO_BUCKET.delete(imageKey).catch(() => undefined);
    return Response.json({ ok: false, error: 'Failed to save photo metadata' }, { status: 500 });
  }

  return Response.json({
    ok: true,
    photo: { id, slug, imageUrl, imageKey, caption, place, category, createdAt },
  }, { status: 201 });
};
