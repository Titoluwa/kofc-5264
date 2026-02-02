import { CollectionConfig } from 'payload';

export const HeroSections: CollectionConfig = {
  slug: 'hero-sections',
  admin: {
    defaultColumns: ['title', 'subtitle'],
  },
  access: {
    read: () => true,
    create: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'editor',
    update: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'editor',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'text',
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'ctaText',
      type: 'text',
      label: 'Call-to-Action Text',
    },
    {
      name: 'ctaLink',
      type: 'text',
      label: 'Call-to-Action Link',
    },
    {
      name: 'overlayColor',
      type: 'text',
      defaultValue: 'rgba(0, 0, 0, 0.3)',
    },
  ],
};
