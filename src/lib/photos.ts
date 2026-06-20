export type Category = 'mountains' | 'forests' | 'trails' | 'sunsets' | 'rivers' | 'other';

export type PhotoEntry = {
  id: string;
  slug: string;
  imageUrl: string;
  imageKey: string;
  caption?: string;
  place?: string;
  category?: Category;
  createdAt: string;
};

/** Fetch photos from the live API. Returns empty array on failure. */
export async function fetchPhotos(params?: { category?: Category; limit?: number }): Promise<PhotoEntry[]> {
  try {
    const url = new URL('/api/photos', 'http://localhost');
    if (params?.category) url.searchParams.set('category', params.category);
    if (params?.limit) url.searchParams.set('limit', String(params.limit));

    const res = await fetch(url.pathname + url.search);
    if (!res.ok) return [];
    const data = await res.json() as { photos: PhotoEntry[] };
    return data.photos ?? [];
  } catch {
    return [];
  }
}
