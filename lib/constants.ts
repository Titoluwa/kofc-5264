export const PLACEHOLDER_IMAGE = '/placeholder.svg';

export const CATEGORIES = [
    { id: 'all', name: 'All' },
    { id: 'general', name: 'General' },
    { id: 'events', name: 'Events' },
    { id: 'announcements', name: 'Announcements' },
    { id: 'programs', name: 'Programs' },
    { id: 'charitable', name: 'Charitable' },
    { id: 'youth', name: 'Youth' },
    { id: 'faith', name: 'Faith' },
];

export const CATEGORIES_ARRAY = ['events', 'charitable', 'artarama', 'youth', 'faith', 'general'];

export interface GalleryItem {
    id: number
    title: string
    category: string
    year: number
    description?: string
    images?: string[]
    heroImage?: string
    createdAt: string
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface Newsletter {
  id: number;
  title: string;
  subtitle?: string;
  content: string;
  category?: string;
  publishedDate?: string;
  heroImage?: string;
  images?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Subscriber {
  id: number;
  email: string;
  isActive: boolean;
  subscribedAt: string;
  unsubscribedAt?: string;
}

export interface NewsletterFormData {
  title: string;
  subtitle: string;
  content: string;
  category: string;
  publishedDate: string;
}

export const NL_LIMIT = 8;
export const SUB_LIMIT = 10;

export const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  General:       { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200' },
  Events:        { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  Announcements: { bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-200' },
  Programs:      { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  Charity:       { bg: 'bg-rose-50',   text: 'text-rose-700',   border: 'border-rose-200' },
};