import type { APIRoute } from 'astro';

export const prerender = false; // Run dynamically on the worker

interface Env {
  ADMIN_UPLOAD_SECRET: string;
  GITHUB_TOKEN: string;
  GITHUB_REPO: string;
  GITHUB_BRANCH?: string;
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

function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

interface GithubFileResponse {
  sha?: string;
  content?: string;
}

async function githubGet(path: string, env: Env): Promise<GithubFileResponse | null> {
  const branch = env.GITHUB_BRANCH ?? 'master';
  const res = await fetch(
    `https://api.github.com/repos/${env.GITHUB_REPO}/contents/${path}?ref=${branch}`,
    {
      headers: {
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'wildframe-upload/1',
      },
    }
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub GET ${path} failed: ${res.status}`);
  return res.json() as Promise<GithubFileResponse>;
}

async function githubPut(
  path: string,
  contentBase64: string,
  message: string,
  sha: string | undefined,
  env: Env
): Promise<void> {
  const branch = env.GITHUB_BRANCH ?? 'master';
  const body: Record<string, unknown> = {
    message,
    content: contentBase64,
    branch,
  };
  if (sha) body.sha = sha;

  const res = await fetch(
    `https://api.github.com/repos/${env.GITHUB_REPO}/contents/${path}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'User-Agent': 'wildframe-upload/1',
      },
      body: JSON.stringify(body),
    }
  );
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`GitHub PUT ${path} failed: ${res.status} — ${detail}`);
  }
}

export const POST: APIRoute = async (context) => {
  // Access Cloudflare env variables from context.locals.runtime.env
  const runtime = context.locals.runtime;
  const env = runtime?.env as Env;

  if (!env) {
    return Response.json({ ok: false, error: 'Server configuration error: environment variables not found.' }, { status: 500 });
  }

  let formData: FormData;
  try {
    formData = await context.request.formData();
  } catch {
    return Response.json({ ok: false, error: 'Invalid form data' }, { status: 400 });
  }

  const secret = formData.get('secret');
  if (!env.ADMIN_UPLOAD_SECRET || secret !== env.ADMIN_UPLOAD_SECRET) {
    return Response.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const imageFile = formData.get('image');
  if (!imageFile || !(imageFile instanceof File)) {
    return Response.json({ ok: false, error: 'Image file is required' }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(imageFile.type)) {
    return Response.json({
      ok: false,
      error: `Unsupported type "${imageFile.type}". Allowed: JPEG, PNG, WebP, AVIF`,
    }, { status: 400 });
  }

  const imageBuffer = await imageFile.arrayBuffer();
  if (imageBuffer.byteLength > MAX_BYTES) {
    return Response.json({ ok: false, error: 'Image must be 10 MB or smaller' }, { status: 400 });
  }

  if (!env.GITHUB_TOKEN || !env.GITHUB_REPO) {
    return Response.json({ ok: false, error: 'Server not configured for uploads' }, { status: 500 });
  }

  const caption  = (formData.get('caption')  as string | null)?.trim() || undefined;
  const place    = (formData.get('place')    as string | null)?.trim() || undefined;
  const rawCat   = (formData.get('category') as string | null)?.trim().toLowerCase() || 'other';
  const category = VALID_CATEGORIES.includes(rawCat) ? rawCat : 'other';

  const id       = crypto.randomUUID();
  const base     = slugify(caption ?? place ?? id.slice(0, 8));
  const slug     = `${base}-${id.slice(0, 6)}`;
  const ext      = imageFile.type.split('/')[1].replace('jpeg', 'jpg');
  const filePath = `public/photos/${id}.${ext}`;
  const imageUrl = `/photos/${id}.${ext}`;
  const createdAt = new Date().toISOString();

  try {
    const imageBase64 = bufferToBase64(imageBuffer);
    await githubPut(
      filePath,
      imageBase64,
      `feat: add photo ${slug}`,
      undefined,
      env
    );

    const jsonPath = 'src/data/photos.json';
    const existing = await githubGet(jsonPath, env);
    const currentJson: unknown[] = existing?.content
      ? JSON.parse(atob(existing.content.replace(/\n/g, '')))
      : [];

    const newEntry = { id, slug, imageUrl, imageKey: filePath, caption, place, category, createdAt };
    const updated = [newEntry, ...currentJson];
    const updatedBase64 = btoa(encodeURIComponent(JSON.stringify(updated, null, 2) + '\n').replace(/%([0-9A-F]{2})/g, (_, p1) => String.fromCharCode(parseInt(p1, 16))));

    await githubPut(
      jsonPath,
      updatedBase64,
      `feat: update photos.json — add ${slug}`,
      existing?.sha,
      env
    );

    return Response.json({ ok: true, photo: newEntry }, { status: 201 });
  } catch (err) {
    console.error('[upload] GitHub API error', err);
    return Response.json({
      ok: false,
      error: 'Failed to save photo — GitHub API error. Check server logs.',
    }, { status: 500 });
  }
};
