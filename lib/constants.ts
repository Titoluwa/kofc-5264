import { CalendarIcon, BookOpenIcon, UsersIcon, MailPlusIcon, ImageIcon, Layers2Icon, CalendarCogIcon, BookmarkPlusIcon } from 'lucide-react';

export const PLACEHOLDER_IMAGE = '/placeholder.svg';

export interface Stats {
  events: number;
  resources: number;
  newsletters: number;
  pages: number;
  gallery: number;
  members: number;
}

export interface ButtonField {
  text: string;
  link: string;
}

export interface PageContent {
  id: number;
  pageId: number;
  name: string;
  image: string | null;
  mainText: string | null;
  subtext1: string | null;
  subtext2: string | null;
  subtext3: string | null;
  lists: string[];
  primaryButton: ButtonField | null;
  secondaryButton: ButtonField | null;
}

export interface Page {
  id: number; slug: string; name: string;
  navbar: boolean; contents: PageContent[];
}

export const DEFAULT_COLOR = 'bg-muted text-muted-foreground border-border'

export const statCards = [
  {
    key: 'events' as keyof Stats,
    label: 'Events & Programs',
    href: '/edit/events',
    icon: CalendarIcon,
    color: 'from-violet-500/20 to-violet-600/5',
    accent: 'text-violet-500',
    border: 'border-violet-500/20',
  },
  {
    key: 'resources' as keyof Stats,
    label: 'Resources',
    href: '/edit/resources',
    icon: BookOpenIcon,
    color: 'from-sky-500/20 to-sky-600/5',
    accent: 'text-sky-500',
    border: 'border-sky-500/20',
  },
  {
    key: 'members' as keyof Stats,
    label: 'Members',
    href: '/edit/members',
    icon: UsersIcon,
    color: 'from-emerald-500/20 to-emerald-600/5',
    accent: 'text-emerald-500',
    border: 'border-emerald-500/20',
  },
  {
    key: 'newsletters' as keyof Stats,
    label: 'Newsletters',
    href: '/edit/newsletters',
    icon: MailPlusIcon,
    color: 'from-amber-500/20 to-amber-600/5',
    accent: 'text-amber-500',
    border: 'border-amber-500/20',
  },
  {
    key: 'gallery' as keyof Stats,
    label: 'Gallery',
    href: '/edit/gallery',
    icon: ImageIcon,
    color: 'from-rose-500/20 to-rose-600/5',
    accent: 'text-rose-500',
    border: 'border-rose-500/20',
  },
  {
    key: 'pages' as keyof Stats,
    label: 'Pages',
    href: '/edit/pages',
    icon: Layers2Icon,
    color: 'from-indigo-500/20 to-indigo-600/5',
    accent: 'text-indigo-500',
    border: 'border-indigo-500/20',
  },
];


export const quickActions = [
  {
    href: '/edit/events',
    icon: CalendarCogIcon,
    label: 'Create an Event',
    description: 'Add a new event or program to the website',
    accent: 'bg-violet-500/10 text-violet-500 group-hover:bg-violet-500/20',
  },
  {
    href: '/edit/resources',
    icon: BookmarkPlusIcon,
    label: 'Add a Resource',
    description: 'Publish new resources or external links',
    accent: 'bg-sky-500/10 text-sky-500 group-hover:bg-sky-500/20',
  },
  {
    href: '/edit/newsletters',
    icon: MailPlusIcon,
    label: 'Send Newsletter',
    description: 'Compose and send a newsletter to members',
    accent: 'bg-amber-500/10 text-amber-500 group-hover:bg-amber-500/20',
  },
  {
    href: '/edit/pages',
    icon: Layers2Icon,
    label: 'Manage Pages',
    description: 'Edit and update static page content',
    accent: 'bg-indigo-500/10 text-indigo-500 group-hover:bg-indigo-500/20',
  },
];

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

export interface Event {
  id: number
  category: string
  name: string
  description: string
  content?: string
  location?: string
  schedule?: string
  images?: string[]
  date: string
  createdAt: string
  updatedAt: string
}

export const CATEGORY_LABELS: Record<string, string> = {
  charitable: 'Charitable',
  faith:      'Faith',
  social:     'Social',
  volunteer:  'Volunteer',
  youth:      'Youth',
  other:      'Other',
}

export const CATEGORY_ACCENT: Record<string, string> = {
  charitable: 'bg-rose-50 text-rose-700 border-rose-200',
  faith:      'bg-sky-50 text-sky-700 border-sky-200',
  social:     'bg-amber-50 text-amber-700 border-amber-200',
  volunteer:  'bg-emerald-50 text-emerald-700 border-emerald-200',
  youth:      'bg-violet-50 text-violet-700 border-violet-200',
  other:      'bg-gray-50 text-gray-600 border-gray-200',
}

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

export interface Resource {
  id: number;
  title: string;
  description: string;
  category: string;
  url?: string;
  content?: string;
  file?: string;
  createdAt: string;
  updatedAt: string;
}

export const NL_LIMIT = 6;
export const SUB_LIMIT = 10;
export const PAGE_SIZE = 6;
export const R_PAGE_SIZE = 6;

export const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  General:       { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200' },
  Events:        { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  Announcements: { bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-200' },
  Programs:      { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  Charity:       { bg: 'bg-rose-50',   text: 'text-rose-700',   border: 'border-rose-200' },
};