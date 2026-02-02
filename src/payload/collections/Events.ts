import { CollectionConfig } from 'payload';

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    defaultColumns: ['title', 'startDate', 'location'],
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
      name: 'description',
      type: 'richText',
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerType: 'datetime',
        },
      },
    },
    {
      name: 'endDate',
      type: 'date',
      admin: {
        date: {
          pickerType: 'datetime',
        },
      },
    },
    {
      name: 'location',
      type: 'text',
      required: true,
    },
    {
      name: 'capacity',
      type: 'number',
      admin: {
        step: 1,
      },
    },
    {
      name: 'eventImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Meeting', value: 'meeting' },
        { label: 'Fundraiser', value: 'fundraiser' },
        { label: 'Social', value: 'social' },
        { label: 'Charity', value: 'charity' },
        { label: 'Other', value: 'other' },
      ],
      defaultValue: 'meeting',
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
};
