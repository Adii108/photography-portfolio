import type { PhotoEntry } from './photos';

/**
 * Fallback sample data used when the API returns no photos (local dev / empty DB).
 * Uses royalty-free Unsplash source images.
 */
export const SAMPLE_PHOTOS: PhotoEntry[] = [
  {
    id: 'sample-1',
    slug: 'mist-over-valley',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&auto=format&fit=crop',
    imageKey: 'sample-1',
    caption: 'Mist rolling through the valley at dawn',
    place: 'Himachal Pradesh',
    category: 'mountains',
    createdAt: '2026-05-10T05:30:00.000Z',
  },
  {
    id: 'sample-2',
    slug: 'ancient-forest-path',
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&auto=format&fit=crop',
    imageKey: 'sample-2',
    caption: 'Where the canopy swallows all sound',
    place: 'Western Ghats',
    category: 'forests',
    createdAt: '2026-04-18T08:00:00.000Z',
  },
  {
    id: 'sample-3',
    slug: 'golden-trail',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop',
    imageKey: 'sample-3',
    caption: 'The trail that keeps giving',
    place: 'Uttarakhand',
    category: 'trails',
    createdAt: '2026-03-22T06:45:00.000Z',
  },
  {
    id: 'sample-4',
    slug: 'burning-horizon',
    imageUrl: 'https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?w=1200&auto=format&fit=crop',
    imageKey: 'sample-4',
    caption: 'Sky on fire beyond the ridge',
    place: 'Spiti Valley',
    category: 'sunsets',
    createdAt: '2026-02-14T18:00:00.000Z',
  },
  {
    id: 'sample-5',
    slug: 'cold-river-stones',
    imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&auto=format&fit=crop',
    imageKey: 'sample-5',
    caption: 'Clarity you can touch',
    place: 'Sangla Valley',
    category: 'rivers',
    createdAt: '2026-01-09T09:15:00.000Z',
  },
  {
    id: 'sample-6',
    slug: 'snow-peak-solitude',
    imageUrl: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1200&auto=format&fit=crop',
    imageKey: 'sample-6',
    caption: 'Nothing above but silence',
    place: 'Kinnaur',
    category: 'mountains',
    createdAt: '2025-12-01T07:00:00.000Z',
  },
];
