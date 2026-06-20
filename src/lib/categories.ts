import type { Category } from './photos';

export const CATEGORIES: { value: Category; label: string; emoji: string }[] = [
  { value: 'mountains', label: 'Mountains', emoji: '⛰' },
  { value: 'forests',   label: 'Forests',   emoji: '🌲' },
  { value: 'trails',    label: 'Trails',    emoji: '🥾' },
  { value: 'sunsets',   label: 'Sunsets',   emoji: '🌅' },
  { value: 'rivers',    label: 'Rivers',    emoji: '🏞' },
  { value: 'other',     label: 'Other',     emoji: '📷' },
];

export const ALL_CATEGORIES = ['mountains', 'forests', 'trails', 'sunsets', 'rivers', 'other'] as const;
